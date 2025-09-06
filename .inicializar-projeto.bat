@echo off
chcp 65001 > nul
setlocal

:: =============================================================================
:: CONFIGURACOES
:: =============================================================================
set "API_HEALTH_URL=http://localhost:5000/health"
set "API_SEED_URL=http://localhost:3000/api/dashboard/seed"
set "API_CATEGORIES_URL=http://localhost:3000/api/categories"
set "KEYCLOAK_HEALTH_URL=http://localhost:8080/realms/hypesoft"
set "MAX_ATTEMPTS=60"
set "RETRY_DELAY_SECONDS=5"

:: =============================================================================
:: INICIALIZACAO
:: =============================================================================
cls
echo ====================================================
echo      INICIALIZADOR HYPESOFT SHOPSENSE (Final)
echo ====================================================
echo.

echo [INFO] Verificando se o Docker Desktop esta rodando...
docker info > nul 2>&1
if %errorlevel% neq 0 (
    echo [ERRO] Docker Desktop nao esta rodando ou nao foi encontrado.
    echo Por favor, inicie o Docker Desktop e tente novamente.
    goto:FAILURE
)
echo [OK] Docker Desktop esta respondendo.
echo.

echo [INFO] Parando e removendo containers existentes para garantir um inicio limpo...
docker-compose down --volumes
if %errorlevel% neq 0 (
    echo [ERRO] Falha ao parar os containers. Verifique a saida do Docker.
    goto:FAILURE
)
echo [OK] Ambiente limpo.
echo.

echo [INFO] Iniciando todos os containers...
echo A primeira execucao pode demorar alguns minutos.
docker-compose up -d --build
if %errorlevel% neq 0 (
    echo [ERRO] Falha ao iniciar os containers. Verifique os logs.
    docker-compose logs --tail=50
    goto:FAILURE
)
echo [OK] Containers iniciados.
echo.

:: =============================================================================
:: AGUARDAR SERVICOS FICAREM PRONTOS
:: =============================================================================
echo [INFO] Aguardando os servicos ficarem prontos...
timeout /t 2 /nobreak > nul

REM --- Aguarda o MongoDB ---
echo [INFO] Aguardando MongoDB...
timeout /t 20 /nobreak > nul
echo [OK] MongoDB esta pronto.
echo.

REM --- Aguarda o Keycloak ---
echo [INFO] Aguardando Keycloak...
set ATTEMPT=0
:WAIT_KEYCLOAK
set /a ATTEMPT+=1
if %ATTEMPT% gtr %MAX_ATTEMPTS% (
    echo [ERRO] Keycloak nao respondeu a tempo.
    goto:FAILURE
)
powershell -Command "try { $response = Invoke-WebRequest -Uri '%KEYCLOAK_HEALTH_URL%' -UseBasicParsing -TimeoutSec 5; if ($response.StatusCode -eq 200) { exit 0 } else { exit 1 } } catch { exit 1 }"
if %errorlevel% equ 0 (
    echo [OK] Keycloak esta pronto.
    goto KEYCLOAK_IS_READY
) else (
    echo Aguardando Keycloak... (tentativa %ATTEMPT% de %MAX_ATTEMPTS%)
    timeout /t 25 /nobreak > nul
    goto:WAIT_KEYCLOAK
)
:KEYCLOAK_IS_READY
timeout /t 2 /nobreak > nul
echo.

REM --- Aguarda a API Backend ---
echo [INFO] Aguardando a API ficar pronta...
set ATTEMPT=0
:WAIT_API
set /a ATTEMPT+=1
if %ATTEMPT% gtr %MAX_ATTEMPTS% (
    echo [ERRO] A API nao respondeu a tempo.
    goto:FAILURE
)
powershell -Command "try { $response = Invoke-WebRequest -Uri '%API_HEALTH_URL%' -UseBasicParsing -TimeoutSec 5; if ($response.StatusCode -eq 200) { exit 0 } else { exit 1 } } catch { exit 1 }"
if %errorlevel% equ 0 (
    echo [OK] API esta pronta.
    goto API_IS_READY
) else (
    echo Aguardando API... (tentativa %ATTEMPT% de %MAX_ATTEMPTS%)
    timeout /t %RETRY_DELAY_SECONDS% /nobreak > nul
    goto:WAIT_API
)
:API_IS_READY
timeout /t 2 /nobreak > nul
echo.

:: =============================================================================
:: POPULAR O BANCO DE DADOS (SEED)
:: =============================================================================
:SEED_DATABASE
echo [INFO] Verificando se o banco ja possui dados...
powershell -Command "try { $response = Invoke-WebRequest -Uri '%API_CATEGORIES_URL%' -UseBasicParsing; $data = $response.Content | ConvertFrom-Json; if ($data -and $data.data.Count -gt 0) { exit 0 } else { exit 1 } } catch { exit 1 }"
if %errorlevel% equ 0 (
    echo [INFO] Dados ja existem no banco de dados. Nenhuma acao necessaria.
    goto END_SCRIPT
)

echo [INFO] Populando banco de dados com dados de exemplo...
powershell -Command "try { Invoke-WebRequest -Uri '%API_SEED_URL%' -Method POST -TimeoutSec 60 -UseBasicParsing | Out-Null; exit 0 } catch { exit 1 }"
if %errorlevel% equ 0 (
    echo [OK] Banco de dados populado com sucesso!
) else (
    echo [AVISO] Falha ao popular o banco de dados. Tentando novamente em 10 segundos...
    timeout /t 10 /nobreak > nul
    powershell -Command "try { Invoke-WebRequest -Uri '%API_SEED_URL%' -Method POST -TimeoutSec 60 -UseBasicParsing | Out-Null; exit 0 } catch { exit 1 }"
    if %errorlevel% equ 0 (
        echo [OK] Banco de dados populado na segunda tentativa!
    ) else (
        echo [ERRO] Falha definitiva ao popular o banco de dados.
        echo [INFO] Verifique os logs da API para mais detalhes.
        docker-compose logs --tail=30 backend
    )
)

:: =============================================================================
:: FINALIZACAO
:: =============================================================================
:END_SCRIPT
echo.
echo ====================================================
echo           INICIALIZACAO CONCLUIDA!
echo ====================================================
echo.
echo A aplicacao esta pronta para uso.
echo.

echo [INFO] Status final dos containers:
docker-compose ps
echo.

echo ------- URLs de Acesso -------
echo - Frontend:         http://localhost:3000
echo - API (Backend):    http://localhost:5000
echo - Swagger UI:       http://localhost:5000/swagger
echo - MongoDB Express:  http://localhost:8081
echo - Keycloak Admin:   http://localhost:8080
echo.
echo ------- Credenciais Padrao -------
echo - Keycloak:         admin / admin123
echo - MongoDB Express:  admin / admin123
echo.
echo Pressione qualquer tecla para abrir o frontend no navegador...
pause > nul
start "" "http://localhost:3000"
goto:EOF

:FAILURE
echo.
echo ====================================================
echo      OCORREU UM ERRO DURANTE A INICIALIZACAO
echo ====================================================
echo.
echo [INFO] Verifique as mensagens de erro acima para diagnosticar o problema.
echo [INFO] Status dos containers:
docker-compose ps
echo.
pause
exit /b 1

:EOF
endlocal

