# 📊 Relatórios de Oportunidades de Venda - Guia Rápido

## 🎯 O Que Foi Desenvolvido

Um **sistema completo de relatórios de oportunidades de venda** para a clínica odontológica com funcionalidades profissionais de análise, filtros, visualizações e exportação.

## 🚀 Acesso

**URL**: `http://localhost:3000/relatorios`

**Menu**: Sidebar → Relatórios (ícone de gráfico)

## 📊 O Que Você Encontra

### 1️⃣ **Dashboard de Resumo**
Visão geral com 4 métricas principais:
- Valor Total de Oportunidades
- Valor Potencial (com probabilidade)
- Quantidade de Oportunidades Abertas
- Total Faturado (oportunidades fechadas)

### 2️⃣ **Análises de Vendas**
Métricas adicionais para insights:
- Taxa de Conversão (%)
- Valor Médio por Oportunidade
- Probabilidade Média
- Oportunidades em Risco

### 3️⃣ **Filtros Avançados**
Busque oportunidades específicas por:
- **Nome/Email/Descrição**: Campo de texto simples
- **Tipo de Serviço**: Tratamento, Implante, Clareamento, etc.
- **Status**: Aberta, Em Andamento, Fechada, Perdida
- **Data**: Período inicial e final
- **Valor**: Intervalo mínimo e máximo
- Botão **Limpar Filtros** para resetar tudo

### 4️⃣ **Visualizações Gráficas**
Dois gráficos analíticos:
- **Por Tipo de Serviço**: Qual tipo gera mais valor potencial
- **Por Status**: Como está distribuído o pipeline

### 5️⃣ **Tabela Detalhada**
Visualização completa de todas as oportunidades com:
- Data, Paciente (nome + email), Tipo, Descrição
- Valor em BRL, Probabilidade (barra visual)
- Status (com cores), Próxima Ação, Data Agendada
- **Ações**: Visualizar, Editar, Deletar

### 6️⃣ **Modal de Detalhes**
Clique no ícone 👁️ para ver informações completas:
- Dados do paciente
- Detalhes da oportunidade
- Descrição e próxima ação agendada
- **Cálculo de Valor Potencial** destacado

### 7️⃣ **Impressão**
- Botão **Imprimir** → abre print dialog do navegador
- Formatação otimizada para papel
- Remove elementos desnecessários

### 8️⃣ **Exportação** (3 Formatos)

**PDF**
- Relatório profissional com título e data
- Download automático: `relatorio-oportunidades-[DATA].pdf`

**CSV**
- Abrir no Excel, Google Sheets, etc.
- Dados estruturados com separador `;`
- Download automático: `relatorio-oportunidades-[DATA].csv`

**JSON**
- Para integração com sistemas
- Inclui metadados e filtros aplicados
- Download automático: `relatorio-oportunidades-[DATA].json`

### 9️⃣ **Nova Oportunidade**
Clique em **+ Nova Oportunidade** para criar:

**Obrigatório:**
- Paciente (nome)
- Email
- Valor

**Opcional:**
- Telefone
- Tipo de Serviço
- Descrição
- Probabilidade (padrão: 50%)
- Próxima Ação
- Data da Próxima Ação

## 💡 Exemplos de Uso

### Exemplo 1: Encontrar Implantes Fechados
1. Filtro "Tipo de Serviço" → **Implante**
2. Filtro "Status" → **Fechada**
3. Veja valor total faturado com implantes
4. Exporte para PDF como evidência

### Exemplo 2: Análise de Pipeline
1. Veja "Oportunidades por Tipo" no gráfico
2. Identifique qual tipo tem maior potencial
3. Use filtro "Probabilidade" para focar em altas conversões
4. Exporte como CSV para análise em Excel

### Exemplo 3: Acompanhamento de Próximas Ações
1. Use filtro "Data" com data de hoje em diante
2. Veja "Próxima Ação" e "Data Agendada"
3. Clique em 👁️ para detalhes de quem contatar
4. Imprima como checklist

### Exemplo 4: Relatório Executivo
1. Selecione filtros desejados
2. Clique em "Exportar como PDF"
3. Compartilhe com sócios/gerentes
4. PDF inclui todas as análises

## 🎨 Cores e Símbolos

### Status das Oportunidades
- 🔵 **Azul** (Aberta): Novo potencial, aguardando ação
- 🟡 **Amarelo** (Em Andamento): Conversação iniciada
- 🟢 **Verde** (Fechada): Venda concluída ✅
- 🔴 **Vermelho** (Perdida): Descartada ou recusada ❌

## 📱 Funciona em...
- 🖥️ Computador (desktop)
- 💻 Laptop
- 📱 Tablet
- 📵 Mobile (responsivo)

## 🔒 Segurança
- Apenas usuários autenticados acessam
- Dados não são salvos localmente
- Sem exposição de informações sensíveis

## ⚙️ Configurações de Impressão

Para melhor resultado ao imprimir:
1. Abra Print Dialog (Ctrl+P ou Cmd+P)
2. Ative "Gráficos de fundo"
3. Escolha papel A4
4. Margens: 2cm
5. Clique em Imprimir

## 📊 Tipos de Serviços Disponíveis

- Tratamento (canal, restauração, etc.)
- Limpeza (profilaxia)
- Implante
- Clareamento
- Ortodontia (aparelhos, alinhadores)
- Periodontia (gengiva, raspagem)

## 💰 Cálculos Automáticos

Tudo é calculado automaticamente:
- **Valor Total**: Soma de todas as oportunidades
- **Valor Potencial**: Valor × Probabilidade
- **Taxa de Conversão**: % de oportunidades fechadas
- **Valor Médio**: Total ÷ Quantidade de oportunidades

## 🆘 Precisa de Ajuda?

1. **Documentação Completa**: Leia `docs/RELATORIOS.md`
2. **Guia de Testes**: Veja `docs/TESTES_RELATORIOS.md`
3. **Funcionalidades Detalhadas**: Consulte `docs/FUNCIONALIDADES.md`

## 🎓 Dicas Profissionais

✅ **Atualize probabilidades** conforme a oportunidade avança
✅ **Registre próximas ações** para não perder leads
✅ **Use filtros** para focar no que importa
✅ **Exporte relatórios** para compartilhar com time
✅ **Verifique taxa de conversão** regularmente
✅ **Identifique oportunidades em risco** (status "Perdida")
✅ **Analise por tipo de serviço** para alocar recursos

## 📈 KPIs Monitorados

- 📊 **Taxa de Conversão**: Quantas % das oportunidades fecham?
- 💵 **Valor Médio**: Qual o ticket médio?
- 🎯 **Probabilidade Média**: Qual a confiança geral?
- ⚠️ **Taxa de Risco**: Quantas estão sendo perdidas?

## 🚀 Próximos Passos

1. ✅ Explorar os dados de exemplo
2. ✅ Criar primeira oportunidade real
3. ✅ Testar filtros e exportações
4. ✅ Gerar primeiro relatório em PDF
5. ✅ Compartilhar com equipe

---

**Desenvolvido com**: React + Next.js + TypeScript + Tailwind CSS
**Versão**: 1.0.0
**Status**: ✅ Pronto para Usar
