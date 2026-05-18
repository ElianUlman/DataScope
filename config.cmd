@echo off
echo Configurando variable de entorno...

 setx crea la variable de forma permanente en el sistema (nivel de usuario)
setx NODE_TLS_REJECT_UNAUTHORIZED "0" /M

echo.
echo ============================================================
echo VARIABLE CONFIGURADA NODE_TLS_REJECT_UNAUTHORIZED = 0
echo ============================================================
echo.
echo IMPORTANTE
echo 1. Los cambios son permanentes.
echo 2. Debes REINICIAR tu terminal (CMD, PowerShell o VS Code) 
echo    para que los cambios surtan efecto.
echo.
pause