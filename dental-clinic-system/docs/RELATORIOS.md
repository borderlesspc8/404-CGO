# Relatórios de Oportunidades de Venda

## Visão Geral

A página de **Relatórios** foi desenvolvida para fornecer uma análise completa e detalhada das oportunidades de venda de serviços odontológicos na clínica. O sistema oferece funcionalidades avançadas para filtros, visualização de dados, análises e exportação de relatórios.

## Funcionalidades Principais

### 1. **Dashboard de Resumo**
- **Valor Total**: Soma de todas as oportunidades de venda
- **Valor Potencial**: Valor total com probabilidade de fechamento ponderada
- **Oportunidades Abertas**: Quantidade de oportunidades não finalizadas
- **Faturado**: Soma das oportunidades com status "Fechada"

### 2. **Filtros Avançados**
O sistema oferece diversos filtros para buscar oportunidades específicas:

- **Buscar**: Por nome do paciente, email ou descrição
- **Tipo de Oportunidade**: Tratamento, Limpeza, Implante, Clareamento, Ortodontia, Periodontia
- **Status**: Aberta, Em Andamento, Fechada, Perdida
- **Período**: Data inicial e final
- **Valor**: Intervalo mínimo e máximo
- **Botão Limpar Filtros**: Reseta todos os filtros

### 3. **Gráficos e Análises**
Dois gráficos principais fornecem insights visuais:

#### Oportunidades por Tipo de Serviço
- Mostra a distribuição de oportunidades por cada tipo de serviço
- Exibe o valor potencial de cada categoria
- Barras proporcionais facilitam comparações

#### Distribuição por Status
- Visualiza a quantidade e valor potencial por status
- Cores distintas para cada status (azul, amarelo, verde, vermelho)
- Ajuda a identificar gargalos no pipeline de vendas

### 4. **Tabela Detalhada**
A tabela principal exibe:

- **Data**: Data do registro da oportunidade
- **Paciente**: Nome e email do paciente
- **Tipo**: Tipo de serviço odontológico
- **Descrição**: Detalhes da oportunidade
- **Valor**: Valor estimado do serviço
- **Probabilidade**: Barra visual com percentual de conversão
- **Status**: Badge colorido com status atual
- **Próxima Ação**: Ação planejada e data

#### Ações na Tabela
- **Visualizar (👁️)**: Abre um modal com detalhes completos
- **Editar (✏️)**: Para editar a oportunidade (funcionalidade em desenvolvimento)
- **Deletar (🗑️)**: Remove a oportunidade

### 5. **Detalhes da Oportunidade**
Ao clicar em "Visualizar", um modal exibe:

- **Informações do Paciente**: Nome, email, telefone, data de cadastro
- **Informações da Oportunidade**: Tipo, status, valor, probabilidade
- **Descrição**: Detalhes completos do serviço
- **Próxima Ação**: Ação planejada com data
- **Valor Esperado**: Cálculo de valor potencial (valor × probabilidade)

### 6. **Exportação e Impressão**

#### Imprimir
- Botão "Imprimir" abre a caixa de diálogo de impressão do navegador
- Formatação otimizada para impressão em papel
- Remove elementos desnecessários (botões, headers)

#### Exportar
Três opções de exportação estão disponíveis:

##### PDF
- Gera um arquivo PDF profissional
- Inclui título, data do relatório e total de registros
- Preserva formatação e cores
- Paginação automática para documentos grandes

##### CSV
- Exporta em formato de planilha
- Compatível com Excel, Google Sheets
- Inclui todas as colunas da tabela
- Separador: ponto-e-vírgula (;)

##### JSON
- Formato estruturado para integração com sistemas
- Inclui metadados do relatório
- Filtros aplicados são preservados
- Ideal para processamento automatizado

### 7. **Adicionar Nova Oportunidade**
Clique em "+ Nova Oportunidade" para criar um novo registro:

**Campos obrigatórios** (marcados com *):
- Paciente
- Email
- Valor

**Campos opcionais**:
- Telefone
- Tipo de Serviço (padrão: Tratamento)
- Descrição
- Probabilidade (padrão: 50%)
- Próxima Ação
- Data da Próxima Ação

## Cálculos e Métricas

### Valor Potencial
Fórmula: **Valor × (Probabilidade / 100)**

Exemplo: Uma oportunidade de R$ 1.000 com 75% de probabilidade = R$ 750 de valor potencial

### Distribuição
Os gráficos usam valores potenciais para melhor representar o impacto real de cada oportunidade no faturamento esperado.

## Status das Oportunidades

| Status | Cor | Descrição |
|--------|-----|-----------|
| **Aberta** | 🔵 Azul | Oportunidade identificada, aguardando ação |
| **Em Andamento** | 🟡 Amarelo | Conversas iniciadas, proposta em progresso |
| **Fechada** | 🟢 Verde | Venda concluída, serviço contratado |
| **Perdida** | 🔴 Vermelho | Oportunidade descartada ou cliente recusou |

## Tipos de Serviços

- Tratamento
- Limpeza
- Implante
- Clareamento
- Ortodontia
- Periodontia

## Dicas de Uso

1. **Acompanhamento**: Use a coluna "Próxima Ação" para não perder oportunidades
2. **Probabilidade**: Atualize a probabilidade conforme a oportunidade avança
3. **Status**: Mude o status para acompanhar o progresso
4. **Filtros**: Use filtros para focar em oportunidades específicas
5. **Exportação**: Exporte relatórios para compartilhar com a equipe
6. **Período**: Analise tendências usando filtros de data
7. **Valor**: Use filtros de valor para identificar oportunidades de alto impacto

## Requisitos de Impressão

Para melhor experiência ao imprimir:
- Use navegadores modernos (Chrome, Firefox, Safari, Edge)
- Ative a opção "Gráficos de fundo" nas configurações de impressão
- Use papel tamanho A4
- Configure margens em 2cm

## Funcionalidades Futuras

- [ ] Edição de oportunidades
- [ ] Histórico de alterações
- [ ] Previsão de faturamento
- [ ] Integração com calendário
- [ ] Notificações de próximas ações
- [ ] Relatórios agendados por email
- [ ] Análise de taxa de conversão
- [ ] Gráficos de tendência temporal
