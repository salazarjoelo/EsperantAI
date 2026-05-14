@echo off
title Instalador de EsperantAI v2.0
chcp 65001 >nul
color 0B

echo ============================================================
echo       Instalador de EsperantAI v2.0
echo       "Los gestos honestos" - by EdugameDigital
echo       Joel Salazar Ramirez
echo ============================================================
echo.
echo Preparando instalacion en Windows...
echo.

:: Carpeta destino: %LOCALAPPDATA%\EdugameDigital\EsperantAI\
set "DEST_DIR=%LOCALAPPDATA%\EdugameDigital\EsperantAI"
if not exist "%DEST_DIR%" mkdir "%DEST_DIR%"
if not exist "%DEST_DIR%\libs" mkdir "%DEST_DIR%\libs"
if not exist "%DEST_DIR%\core" mkdir "%DEST_DIR%\core"
if not exist "%DEST_DIR%\adapters" mkdir "%DEST_DIR%\adapters"
if not exist "%DEST_DIR%\platforms" mkdir "%DEST_DIR%\platforms"
if not exist "%DEST_DIR%\locales" mkdir "%DEST_DIR%\locales"
if not exist "%DEST_DIR%\assets" mkdir "%DEST_DIR%\assets"
if not exist "%DEST_DIR%\assets\branding" mkdir "%DEST_DIR%\assets\branding"

echo [1/4] Copiando archivos del nucleo...
copy /Y "%~dp0index.html" "%DEST_DIR%\index.html" >nul
copy /Y "%~dp0app.js" "%DEST_DIR%\app.js" >nul
copy /Y "%~dp0oauth-callback.html" "%DEST_DIR%\oauth-callback.html" >nul
copy /Y "%~dp0README.md" "%DEST_DIR%\README.md" >nul
copy /Y "%~dp0Lanzar_EsperantAI.bat" "%DEST_DIR%\Lanzar_EsperantAI.bat" >nul

echo [2/4] Copiando libs (Human.js + obs-websocket)...
copy /Y "%~dp0libs\human.js" "%DEST_DIR%\libs\human.js" >nul
copy /Y "%~dp0libs\obs-ws.min.js" "%DEST_DIR%\libs\obs-ws.min.js" >nul

echo [3/4] Copiando modulos core/adapters/platforms/locales/assets...
xcopy /Y /E /Q "%~dp0core\*" "%DEST_DIR%\core\" >nul
xcopy /Y /E /Q "%~dp0adapters\*" "%DEST_DIR%\adapters\" >nul
xcopy /Y /E /Q "%~dp0platforms\*" "%DEST_DIR%\platforms\" >nul
xcopy /Y /E /Q "%~dp0locales\*" "%DEST_DIR%\locales\" >nul
xcopy /Y /E /Q "%~dp0assets\*" "%DEST_DIR%\assets\" >nul

echo [4/4] Creando accesos directos de Windows...
set "WSCRIPT_FILE=%TEMP%\CreateShortcutEsperantAI.vbs"
echo Set oWS = WScript.CreateObject("WScript.Shell") > "%WSCRIPT_FILE%"

:: Escritorio
echo sLinkFile = "%USERPROFILE%\Desktop\EsperantAI.lnk" >> "%WSCRIPT_FILE%"
echo Set oLink = oWS.CreateShortcut(sLinkFile) >> "%WSCRIPT_FILE%"
echo oLink.TargetPath = "%DEST_DIR%\Lanzar_EsperantAI.bat" >> "%WSCRIPT_FILE%"
echo oLink.WorkingDirectory = "%DEST_DIR%" >> "%WSCRIPT_FILE%"
echo oLink.Description = "EsperantAI - Honest gestures, universal streaming" >> "%WSCRIPT_FILE%"
echo oLink.Save >> "%WSCRIPT_FILE%"

:: Menu Inicio
set "START_MENU_DIR=%APPDATA%\Microsoft\Windows\Start Menu\Programs\EdugameDigital"
if not exist "%START_MENU_DIR%" mkdir "%START_MENU_DIR%"
echo sLinkFile2 = "%START_MENU_DIR%\EsperantAI.lnk" >> "%WSCRIPT_FILE%"
echo Set oLink2 = oWS.CreateShortcut(sLinkFile2) >> "%WSCRIPT_FILE%"
echo oLink2.TargetPath = "%DEST_DIR%\Lanzar_EsperantAI.bat" >> "%WSCRIPT_FILE%"
echo oLink2.WorkingDirectory = "%DEST_DIR%" >> "%WSCRIPT_FILE%"
echo oLink2.Description = "EsperantAI - Honest gestures, universal streaming" >> "%WSCRIPT_FILE%"
echo oLink2.Save >> "%WSCRIPT_FILE%"

cscript //nologo "%WSCRIPT_FILE%"
del "%WSCRIPT_FILE%"

echo.
echo ============================================================
echo     INSTALACION COMPLETADA
echo ============================================================
echo.
echo Busca "EsperantAI" en el Escritorio o en el Menu Inicio.
echo.
pause
