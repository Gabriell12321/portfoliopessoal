#!/usr/bin/env python3
"""
Script para inicializar o portfólio
Executa migrações e inicia o servidor
"""

import os
import sys
import subprocess

def run_command(command, description):
    """Executa comando e mostra resultado"""
    print(f"🔄 {description}...")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {description} concluído")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Erro em {description}: {e.stderr}")
        return False

def main():
    print("🚀 Iniciando portfólio...")
    
    # Verificar se estamos no diretório correto
    if not os.path.exists("index.html"):
        print("❌ Execute este script na raiz do projeto")
        sys.exit(1)
    
    # Instalar dependências Python
    if not run_command("pip install -r requirements.txt", "Instalando dependências"):
        sys.exit(1)
    
    # Inicializar banco de dados
    print("🔄 Inicializando banco de dados...")
    try:
        from backend.api.database import Database
        db = Database()
        print("✅ Banco de dados inicializado")
    except Exception as e:
        print(f"❌ Erro ao inicializar banco: {e}")
        sys.exit(1)
    
    print("\n🎉 Portfólio pronto!")
    print("📁 Frontend: Abra index.html no navegador")
    print("🔧 Backend: python backend/api/main.py")
    print("🌐 API: http://localhost:8000")

if __name__ == "__main__":
    main()
