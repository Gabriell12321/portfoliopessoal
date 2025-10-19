import sqlite3
import os
from typing import List, Dict, Optional

class Database:
    def __init__(self, db_path: str = "database/app.db"):
        self.db_path = db_path
        self.init_database()
    
    def init_database(self):
        """Inicializa o banco de dados com as migrações"""
        os.makedirs(os.path.dirname(self.db_path), exist_ok=True)
        
        # Executar migração
        with open("database/migrate.sql", "r", encoding="utf-8") as f:
            migration_sql = f.read()
        
        with sqlite3.connect(self.db_path) as conn:
            conn.executescript(migration_sql)
        
        # Executar seed se necessário
        with open("database/seed.sql", "r", encoding="utf-8") as f:
            seed_sql = f.read()
        
        with sqlite3.connect(self.db_path) as conn:
            conn.executescript(seed_sql)
    
    def get_connection(self):
        """Retorna conexão com o banco"""
        return sqlite3.connect(self.db_path)
    
    def get_projects(self) -> List[Dict]:
        """Busca todos os projetos"""
        with self.get_connection() as conn:
            conn.row_factory = sqlite3.Row
            cursor = conn.execute("""
                SELECT * FROM projects 
                ORDER BY created_at DESC
            """)
            return [dict(row) for row in cursor.fetchall()]
    
    def get_skills(self) -> List[Dict]:
        """Busca todas as skills"""
        with self.get_connection() as conn:
            conn.row_factory = sqlite3.Row
            cursor = conn.execute("""
                SELECT * FROM skills 
                ORDER BY category, level DESC
            """)
            return [dict(row) for row in cursor.fetchall()]
    
    def add_contact_message(self, name: str, email: str, message: str) -> int:
        """Adiciona nova mensagem de contato"""
        with self.get_connection() as conn:
            cursor = conn.execute("""
                INSERT INTO contact_messages (name, email, message)
                VALUES (?, ?, ?)
            """, (name, email, message))
            return cursor.lastrowid
