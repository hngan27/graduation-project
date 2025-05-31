import os
import mysql.connector

def save_recommendation(user_id, course_id, score):
    conn = mysql.connector.connect(
        host=os.getenv('DB_HOST') and os.getenv('DB_HOST')!='.' and os.getenv('DB_HOST') or '127.0.0.1',
        port=int(os.getenv('DB_PORT', 3306)),
        user=os.getenv('DB_USER'),
        password=os.getenv('DB_PASSWORD'),
        database=os.getenv('DB_NAME')
    )
    with conn.cursor() as cur:
        cur.execute(
            "INSERT INTO recommendations (user_id, course_id, score) VALUES (%s,%s,%s)",
            (user_id, course_id, score)
        )
    conn.commit()
    conn.close()