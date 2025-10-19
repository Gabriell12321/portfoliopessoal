#!/bin/bash

echo "🚀 Iniciando Portfolio Backend Java..."

# Navegar para o diretório Java
cd "$(dirname "$0")/../backend/java"

# Verificar se Java está instalado
if ! command -v java &> /dev/null; then
    echo "❌ Java não encontrado. Instale Java 17 ou superior."
    echo "📥 Download: https://adoptium.net/"
    exit 1
fi

# Verificar se Maven está instalado
if ! command -v mvn &> /dev/null; then
    echo "❌ Maven não encontrado. Instale Maven."
    echo "📥 Download: https://maven.apache.org/download.cgi"
    exit 1
fi

echo "✅ Java e Maven encontrados!"

# Compilar o projeto
echo "📦 Compilando projeto..."
mvn clean compile

if [ $? -ne 0 ]; then
    echo "❌ Erro na compilação"
    exit 1
fi

echo "✅ Compilação concluída!"

# Executar o projeto
echo "🏃 Executando aplicação..."
echo "🌐 Backend Java será executado em: http://localhost:8080/api"
echo "📊 Health Check: http://localhost:8080/api/actuator/health"
echo "📋 Documentação: http://localhost:8080/api/actuator/info"
echo ""
echo "⚠️  Para parar o servidor, pressione Ctrl+C"
echo ""

mvn spring-boot:run

echo ""
echo "✅ Backend Java finalizado"
