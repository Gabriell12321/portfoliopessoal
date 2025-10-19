#!/bin/bash

# Script para iniciar o backend Java
echo "🚀 Iniciando Portfolio Backend Java..."

# Verificar se Java está instalado
if ! command -v java &> /dev/null; then
    echo "❌ Java não encontrado. Instale Java 17 ou superior."
    exit 1
fi

# Verificar se Maven está instalado
if ! command -v mvn &> /dev/null; then
    echo "❌ Maven não encontrado. Instale Maven."
    exit 1
fi

# Navegar para o diretório Java
cd "$(dirname "$0")"

# Compilar o projeto
echo "📦 Compilando projeto..."
mvn clean compile

if [ $? -ne 0 ]; then
    echo "❌ Erro na compilação"
    exit 1
fi

# Executar o projeto
echo "🏃 Executando aplicação..."
mvn spring-boot:run

echo "✅ Backend Java iniciado na porta 8080"
