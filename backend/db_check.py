import sqlite3

def check():
    conn = sqlite3.connect('dsa_platform.db')
    cur = conn.cursor()
    try:
        print('Tables:', cur.execute("SELECT name FROM sqlite_master WHERE type='table';").fetchall())
        print('Count:', cur.execute("SELECT COUNT(*) FROM algorithms;").fetchall())
        print('Rows:', cur.execute("SELECT slug, name, category FROM algorithms;").fetchall())
    except Exception as e:
        print('Error:', e)
    finally:
        conn.close()

if __name__ == '__main__':
    check()
