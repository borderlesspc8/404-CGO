# Script para testar o PWA localmente

Write-Host "=== Testando PWA - Clínica Odontológica ===" -ForegroundColor Cyan
Write-Host ""

# 1. Build do projeto
Write-Host "1. Construindo o projeto..." -ForegroundColor Yellow
pnpm build

if ($LASTEXITCODE -ne 0) {
    Write-Host "Erro no build. Tentando limpar cache..." -ForegroundColor Red
    Remove-Item -Path ".next" -Recurse -Force -ErrorAction SilentlyContinue
    pnpm build
}

Write-Host ""
Write-Host "2. Iniciando servidor de produção..." -ForegroundColor Yellow
Write-Host ""
Write-Host "=== INSTRUÇÕES PARA TESTAR ===" -ForegroundColor Green
Write-Host ""
Write-Host "ANDROID (Chrome):" -ForegroundColor Cyan
Write-Host "  1. Abra http://localhost:3000 no Chrome do celular" 
Write-Host "  2. Menu (tres pontos) > 'Instalar app' ou 'Adicionar a tela inicial'"
Write-Host "  3. Aceite a instalacao"
Write-Host "  4. Abra o app da tela inicial"
Write-Host ""
Write-Host "iOS (Safari - iOS 16.4+):" -ForegroundColor Cyan
Write-Host "  1. Abra http://[SEU-IP]:3000 no Safari"
Write-Host "  2. Toque em Compartilhar (seta para cima)"
Write-Host "  3. 'Adicionar a Tela Inicial'"
Write-Host "  4. Abra o app"
Write-Host ""
Write-Host "DESKTOP (Chrome/Edge):" -ForegroundColor Cyan
Write-Host "  1. Abra http://localhost:3000"
Write-Host "  2. Clique no icone de instalacao na barra de endereco"
Write-Host "  3. Clique em 'Instalar'"
Write-Host ""
Write-Host "TESTAR OFFLINE:" -ForegroundColor Cyan
Write-Host "  1. Após carregar o site uma vez"
Write-Host "  2. Abra DevTools (F12) > Network"
Write-Host "  3. Selecione 'Offline' no menu suspenso"
Write-Host "  4. Recarregue - deve mostrar a página offline"
Write-Host ""
Write-Host "Para obter seu IP local, execute:" -ForegroundColor Yellow
Write-Host "  ipconfig | findstr IPv4" -ForegroundColor Gray
Write-Host ""
Write-Host "==================================" -ForegroundColor Green
Write-Host ""

# Iniciar servidor
pnpm start
