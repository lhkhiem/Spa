#!/usr/bin/env python3
"""
Script to reset pgAdmin4 layout settings without affecting user accounts
"""
import sqlite3
import sys
import os

DB_PATH = '/var/lib/pgadmin/pgadmin4.db'

def reset_layout_settings():
    """Delete only layout settings, keep user accounts"""
    if not os.path.exists(DB_PATH):
        print(f"Error: Database not found at {DB_PATH}")
        return False
    
    if not os.access(DB_PATH, os.W_OK):
        print(f"Error: No write permission to {DB_PATH}")
        print("Please run with sudo: sudo python3 reset_pgadmin_layout.py")
        return False
    
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        # Check current layout settings
        cursor.execute("SELECT COUNT(*) FROM setting WHERE setting LIKE '%Layout%'")
        count_before = cursor.fetchone()[0]
        print(f"Found {count_before} layout settings")
        
        if count_before == 0:
            print("No layout settings found. Nothing to delete.")
            conn.close()
            return True
        
        # Delete layout settings
        cursor.execute("""
            DELETE FROM setting 
            WHERE setting IN ('Browser/Layout', 'SQLEditor/Layout', 'Debugger/Layout')
        """)
        
        deleted = cursor.rowcount
        conn.commit()
        conn.close()
        
        print(f"Successfully deleted {deleted} layout settings")
        print("Layout has been reset. Please restart pgAdmin4:")
        print("  sudo systemctl restart pgadmin4.service")
        return True
        
    except sqlite3.Error as e:
        print(f"Database error: {e}")
        return False
    except Exception as e:
        print(f"Error: {e}")
        return False

if __name__ == '__main__':
    print("pgAdmin4 Layout Reset Script")
    print("=" * 40)
    success = reset_layout_settings()
    sys.exit(0 if success else 1)

