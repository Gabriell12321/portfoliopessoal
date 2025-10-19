@echo off
echo 🚀 Iniciando Portfolio Backend Java...

REM Navegar para o diretório Java
cd /d "%~dp0\..\backend\java"

REM Verificar se Java está instalado
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Java não encontrado. Instale Java 17 ou superior.
    echo 📥 Download: https://adoptium.net/
    pause
    exit /b 1
)

REM Verificar se Maven está instalado
mvn -version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Maven não encontrado. Instale Maven.
    echo 📥 Download: https://maven.apache.org/download.cgi
    pause
    exit /b 1
)

echo ✅ Java e Maven encontrados!

REM Compilar o projeto
echo 📦 Compilando projeto...
mvn clean compile

if %errorlevel% neq 0 (
    echo ❌ Erro na compilação
    pause
    exit /b 1
)

echo ✅ Compilação concluída!

REM Executar o projeto
echo 🏃 Executando aplicação...
echo 🌐 Backend Java será executado em: http://localhost:8080/api
echo 📊 Health Check: http://localhost:8080/api/actuator/health
echo 📋 Documentação: http://localhost:8080/api/actuator/info
echo.
echo ⚠️  Para parar o servidor, pressione Ctrl+C
echo.

mvn spring-boot:run

echo.
echo ✅ Backend Java finalizado
pause
