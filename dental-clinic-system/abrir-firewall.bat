@echo off
REM Script para abrir porta 3000 no Firewall do Windows
REM Executa como Admin automaticamente

if "%1"=="admin" (
    netsh advfirewall firewall add rule name="Allow Next.js 3000" dir=in action=allow protocol=tcp localport=3000
    netsh advfirewall firewall add rule name="Allow Expo 8082" dir=in action=allow protocol=tcp localport=8082
    netsh advfirewall firewall add rule name="Allow Expo 8081" dir=in action=allow protocol=tcp localport=8081
    echo Portas 3000, 8081 e 8082 abertas com sucesso!
    pause
) else (
    powershell -Command "Start-Process '%0' -Verb runAs -ArgumentList 'admin'"
)
