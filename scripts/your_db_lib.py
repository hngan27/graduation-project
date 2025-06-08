import os
import mysql.connector

def save_recommendation(user_id, course_id, score):
    # Debug: print DB connection parameters
    host = os.getenv('DB_HOST') and os.getenv('DB_HOST')!='.' and os.getenv('DB_HOST') or '127.0.0.1'
    port = int(os.getenv('DB_PORT', 3306))
    user_env = os.getenv('DB_USER')
    password = os.getenv('DB_PASSWORD')
    database = os.getenv('DB_NAME')
    print(f"[save_recommendation] DB params -> host={host}, port={port}, user={user_env}, database={database}", flush=True)
    # Attempt connection
    try:
        conn = mysql.connector.connect(
            host=host,
            port=port,
            user=user_env,
            password=password,
            database=database,
            connect_timeout=5,
            use_pure=True,
            auth_plugin='mysql_native_password'
        )
        print("[save_recommendation] Connection established", flush=True)
    except Exception as e:
        print(f"[save_recommendation] Connection error: {e}", flush=True)
        raise
    # Execute insert
    try:
        with conn.cursor() as cur:
            print("[save_recommendation] Executing INSERT", flush=True)
            cur.execute(
                "INSERT INTO recommendations (userId, courseId, score) VALUES (%s,%s,%s)",
                (user_id, course_id, score)
            )
            print("[save_recommendation] Execute completed", flush=True)
        conn.commit()
        print("[save_recommendation] Committed", flush=True)
    except Exception as e:
        print(f"[save_recommendation] Query error: {e}", flush=True)
        conn.rollback()
        raise
    finally:
        conn.close()
        print("[save_recommendation] Connection closed", flush=True)