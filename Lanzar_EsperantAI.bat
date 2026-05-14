@echo off
title EsperantAI - Honest gestures, universal streaming
chcp 65001 >nul

echo ============================================================
echo       EsperantAI v2.0
echo       "Los gestos honestos" - by EdugameDigital
echo ============================================================
echo.

:: Intentar arrancar servidor local con Python (cámaras funcionan mejor en localhost que en file://)
where python >nul 2>&1
if %errorlevel%==0 (
    echo [OK] Python detectado. Arrancando servidor local en http://127.0.0.1:8765
    echo.
    echo IMPORTANTE: Deja esta ventana abierta mientras uses EsperantAI.
    echo Cierra esta ventana o presiona Ctrl+C para detener.
    echo.
    timeout /t 2 >nul
    start "" "http://127.0.0.1:8765/index.html"
    cd /d "%~dp0"
    python -m http.server 8765
    exit
)

:: Fallback sin Python: abrir como archivo local
echo [!] Python no detectado. Abriendo en modo archivo (file://).
echo.
echo NOTA: Si tu navegador no encuentra la camara o la lista esta vacia,
echo       instala Python desde https://www.python.org/downloads/
echo       (marca "Add Python to PATH" durante la instalacion).
echo.
timeout /t 3 >nul
start "" "%~dp0index.html"
exit
