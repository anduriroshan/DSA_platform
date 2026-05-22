"""Debug script to test the database query directly."""
import sys
sys.path.insert(0, '.')

from database import SessionLocal
from models.database_models import Algorithm

db = SessionLocal()
try:
    algos = db.query(Algorithm).all()
    print(f"Found {len(algos)} algorithms")
    for a in algos[:3]:
        print(f"  - {a.slug}: {a.name}")
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
finally:
    db.close()
