# scripts/generate_recs.py
import pandas as pd, pickle, os
from scipy.sparse import coo_matrix
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
from your_db_lib import save_recommendation  # implement in Node or Python
from dotenv import load_dotenv  # load environment variables from .env

load_dotenv()

def main():
    # load data & models
    fb = pd.read_csv('data/feedback.csv')
    print(f"Loaded feedback.csv with {len(fb)} rows")
    cf_data = pickle.load(open('models/cf_model.pkl','rb'))
    u2i, c2i = cf_data['u2i'], cf_data['c2i']
    print(f"Loaded CF model with {len(u2i)} users and {len(c2i)} courses")
    cb_data = pickle.load(open('models/tfidf_vectorizer.pkl','rb'))

    model     = cf_data['model']
    course_ids_cb = cb_data['course_ids']
    tfidf_mat = cb_data['tfidf_matrix']

    # create mapping from model index back to courseId
    i2c = {v: k for k, v in c2i.items()}

    # build user–item interaction CSR matrix for CF (shape: n_users x n_items)
    rows = fb['user'].map(u2i)
    cols = fb['course'].map(c2i)
    data = fb['score'].astype(float)
    user_items = coo_matrix(
        (data, (rows, cols)),
        shape=(len(u2i), len(c2i))
    ).tocsr()
    print(f"Built user_items matrix of shape {user_items.shape}")

    # Debug: start recommendation loop
    print("Starting recommendations loop", flush=True)
    print(f"Users to process: {list(u2i.keys())}", flush=True)

    # avoid requesting more recs than items
    num_items = user_items.shape[1]

    α, β, N = 0.5, 0.5, 10

    for user, uid in u2i.items():
        # Debug: processing each user
        print(f"Processing user {user} (uid={uid})", flush=True)
        # CF scores
        recs_N = N if N <= num_items else num_items
        ids, scores = model.recommend(uid, user_items, N=recs_N, filter_already_liked_items=False)
        cf_scores = { i2c[idx]: score for idx, score in zip(ids, scores) }

        # CB profile
        user_hist = fb[fb['user']==user]
        viewed = user_hist['course'].tolist()
        if viewed:
            idxs = [course_ids_cb.index(c) for c in viewed if c in course_ids_cb]
            profile = tfidf_mat[idxs].mean(axis=0)
            # convert numpy.matrix to ndarray
            profile = np.asarray(profile)
            sims = cosine_similarity(profile, tfidf_mat).flatten()
            cb_scores = {cid: sims[i] for i,cid in enumerate(course_ids_cb)}
        else:
            cb_scores = {cid:0 for cid in course_ids_cb}

        # hybrid & save
        hyb = {cid: α*cf_scores.get(cid,0)+β*cb_scores.get(cid,0)
               for cid in set(cf_scores)|set(cb_scores)}
        top = sorted(hyb.items(), key=lambda x: x[1], reverse=True)[:N]
        for cid, score in top:
            print(f"Saving recommendation for {user}->{cid} score={score}", flush=True)
            try:
                save_recommendation(user, cid, float(score))
                print(f"Saved recommendation for {user}->{cid} score={score}", flush=True)
            except Exception as e:
                print(f"Error saving recommendation for {user}->{cid}: {e}", flush=True)

    print("Hybrid recommendations generated.")

if __name__=='__main__':
    main()