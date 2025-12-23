import pymysql
import os
import time

# Connect to mysql service inside docker network
# User: root, Password: rootpassword (from docker-compose)
def migrate():
    print("Waiting for database to be ready...")
    time.sleep(5) 
    try:
        connection = pymysql.connect(
            host='mysql',
            port=3306,
            user='root',
            password='rootpassword',
            database='todo_db',
            charset='utf8mb4',
            cursorclass=pymysql.cursors.DictCursor
        )

        with connection:
            with connection.cursor() as cursor:
                # Check if column exists
                print("Checking if phone_number column exists...")
                cursor.execute("SELECT count(*) as count FROM information_schema.COLUMNS WHERE TABLE_SCHEMA='todo_db' AND TABLE_NAME='users' AND COLUMN_NAME='phone_number'")
                result = cursor.fetchone()
                
                if result['count'] == 0:
                    print("Adding phone_number column...")
                    sql = "ALTER TABLE users ADD COLUMN phone_number VARCHAR(20) UNIQUE DEFAULT NULL"
                    cursor.execute(sql)
                    print("Column added successfully.")
                else:
                    print("Column already exists.")
            
            connection.commit()

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    migrate()

