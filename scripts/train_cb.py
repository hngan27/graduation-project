# scripts/train_cb.py
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
import pickle, os

def main():
    df = pd.read_csv('data/courses.csv')
    vectorizer = TfidfVectorizer(max_features=1000, stop_words='english')
    tfidf_mat = vectorizer.fit_transform(df['text'])

    os.makedirs('models', exist_ok=True)
    with open('models/tfidf_vectorizer.pkl','wb') as f:
        pickle.dump({
            'vectorizer': vectorizer,
            'course_ids': df['course_id'].tolist(),
            'tfidf_matrix': tfidf_mat
        }, f)
    print("CB model saved to models/tfidf_vectorizer.pkl")

if __name__=='__main__':
    main()