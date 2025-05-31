# scripts/train_cf.py
import pandas as pd
from scipy.sparse import coo_matrix
from implicit.als import AlternatingLeastSquares
import pickle, os

def main():
    df = pd.read_csv('data/feedback.csv')
    users   = df['user'].unique()
    courses = df['course'].unique()
    u2i     = {u:i for i,u in enumerate(users)}
    c2i     = {c:i for i,c in enumerate(courses)}

    rows = df['user'].map(u2i)
    cols = df['course'].map(c2i)
    data = df['score'].astype(float)
    mat  = coo_matrix((data, (rows, cols)), shape=(len(users), len(courses)))

    model = AlternatingLeastSquares(factors=50, regularization=0.01, iterations=20)
    model.fit(mat.T)

    os.makedirs('models', exist_ok=True)
    with open('models/cf_model.pkl','wb') as f:
        pickle.dump({'model':model,'u2i':u2i,'c2i':c2i}, f)
    print("CF model saved to models/cf_model.pkl")

if __name__=='__main__':
    main()