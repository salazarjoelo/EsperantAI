@echo off
setlocal EnableDelayedExpansion
chcp 65001 > nul
title EsperantAI - Controlador de gestos para streaming

REM ============================================================================
REM  EsperantAI.bat  -  Launcher para Windows
REM  Doble click en este archivo para abrir EsperantAI en tu navegador.
REM
REM  Lo que hace:
REM    1) Verifica que tengas Python 3 instalado.
REM    2) Arranca un servidor web local en tu computadora (puerto 8765).
REM    3) Abre tu navegador en la pagina de bienvenida de EsperantAI.
REM
REM  IMPORTANTE: deja esta ventana negra abierta mientras uses EsperantAI.
REM  Para cerrar: presiona Ctrl+C aqui o cierra esta ventana.
REM
REM  Soporte: soporte@edugame.digital
REM ============================================================================

color 0B
cls
echo.
echo  =========================================================================
echo                   E S P E R A N T A I  -  v1.0.0
echo          Controlador de gestos para streaming en vivo
echo                       (c) EdugameDigital 2026
echo  =========================================================================
echo.

REM ─── Paso 1: detectar Python ───────────────────────────────────────────────
echo  [1/3] Verificando Python...
where python > nul 2>&1
if errorlevel 1 (
    color 0E
    echo.
    echo  ===========================================================================
    echo  ATENCION: Python no esta instalado en tu computadora.
    echo  ===========================================================================
    echo.
    echo  EsperantAI necesita Python 3 para arrancar el servidor local.
    echo  Es gratis, seguro y se instala en 2 minutos.
    echo.
    echo  Pasos:
    echo     1. Voy a abrir python.org en tu navegador.
    echo     2. Descarga el instalador "Python 3.x.x Windows installer 64-bit".
    echo     3. IMPORTANTE: al instalar, marca la casilla "Add Python to PATH".
    echo     4. Una vez instalado, vuelve a hacer doble click en EsperantAI.bat.
    echo.
    echo  Presiona cualquier tecla para abrir la pagina de descarga...
    pause > nul
    start "" https://www.python.org/downloads/windows/
    echo.
    echo  Cierra esta ventana, instala Python, y vuelve a hacer doble click en
    echo  EsperantAI.bat cuando termines.
    echo.
    pause
    exit /b 1
)

for /f "tokens=2" %%v in ('python --version 2^>^&1') do set PYVER=%%v
echo        Python !PYVER! detectado. OK.
echo.

REM ─── Paso 2: verificar puerto 8765 libre ───────────────────────────────────
echo  [2/3] Verificando puerto 8765...
netstat -an | findstr ":8765 " | findstr "LISTENING" > nul
if not errorlevel 1 (
    color 0C
    echo.
    echo  ATENCION: el puerto 8765 ya esta en uso por otro programa.
    echo  Esto puede pasar si ya tienes otra ventana de EsperantAI abierta.
    echo  Cierra la otra ventana y vuelve a intentar.
    echo.
    pause
    exit /b 2
)
echo        Puerto 8765 libre. OK.
echo.

REM ─── Paso 3: arrancar servidor + abrir navegador ───────────────────────────
echo  [3/3] Arrancando servidor local y abriendo navegador...
echo.
cd /d "%~dp0"

REM Abrir browser en 3 segundos (despues de que el server arranque)
start "" /b cmd /c "timeout /t 3 /nobreak >nul && start http://127.0.0.1:8765/landing.html"

echo  =========================================================================
echo   Servidor EsperantAI corriendo en:
echo.
echo     http://127.0.0.1:8765/landing.html    (pagina de compra/info)
echo     http://127.0.0.1:8765/index.html      (la app, requiere licencia)
echo     http://127.0.0.1:8765/docs/manual.html (manual de usuario)
echo.
echo   NO cierres esta ventana mientras uses EsperantAI.
echo   Para detener el servidor: presiona Ctrl+C aqui.
echo  =========================================================================
echo.

REM Arrancar servidor (bloquea hasta que se cierre)
python -m http.server 8765

REM Si llegamos aqui es que Python fallo o se cerro el server
color 0F
echo.
echo  Servidor detenido.
echo  Si fue un cierre normal (Ctrl+C), puedes cerrar esta ventana.
pause
