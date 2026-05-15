@echo off
REM ============================================================================
REM RUN_LOCAL.bat - Probar EsperantAI en Windows como un cliente real
REM
REM Doble click en este archivo. Hace 2 cosas:
REM   1. Arranca un servidor HTTP local en el puerto 8765 sirviendo este dir
REM   2. Abre tu navegador en la landing page de EsperantAI
REM
REM Esto es exactamente lo que un cliente verá cuando EsperantAI este publicado.
REM (Mismos archivos, misma logica, mismos bugs si los hay - cero diferencia.)
REM
REM Cierra el server con Ctrl+C en esta ventana negra cuando termines.
REM ============================================================================
echo.
echo ===========================================================================
echo  EsperantAI - Servidor Local
echo ===========================================================================
echo.
echo  Directorio:   %~dp0
echo  URL Landing:  http://127.0.0.1:8765/landing.html
echo  URL App:      http://127.0.0.1:8765/index.html
echo  URL Manual:   http://127.0.0.1:8765/docs/manual.html
echo.
echo  Esto se va a abrir en tu navegador en 3 segundos...
echo  Para detener el servidor: Ctrl+C aqui o cerrar esta ventana.
echo ===========================================================================
echo.

cd /d "%~dp0"

REM Abrir browser en 3 segundos (despues de que el server arranque)
start "" /b cmd /c "timeout /t 3 /nobreak >nul && start http://127.0.0.1:8765/landing.html"

REM Arrancar servidor (bloquea hasta que se cierre)
python -m http.server 8765

REM Si llegamos aqui es que Python fallo o se cerro el server
echo.
echo Servidor detenido.
pause
