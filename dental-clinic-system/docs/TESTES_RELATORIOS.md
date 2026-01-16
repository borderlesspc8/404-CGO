# Guia de Testes - Relatórios de Oportunidades

## Testes Funcionais

### 1. Acesso à Página
- [ ] Navegar para `/relatorios` no menu lateral
- [ ] Página carrega sem erros
- [ ] Dashboard de resumo exibe corretamente

### 2. Dashboard de Resumo
- [ ] Valor Total é calculado corretamente
- [ ] Valor Potencial leva em conta a probabilidade
- [ ] Oportunidades Abertas conta apenas status "aberta"
- [ ] Faturado soma apenas oportunidades com status "fechada"
- [ ] Valores são formatados em moeda BRL

### 3. Filtros
#### Busca por Termo
- [ ] Digitar nome do paciente filtra resultados
- [ ] Digitar email filtra resultados
- [ ] Digitar descrição filtra resultados
- [ ] Filtro funciona em tempo real

#### Filtro por Tipo
- [ ] Selecionar "Tratamento" filtra apenas esse tipo
- [ ] Selecionar "Implante" filtra apenas esse tipo
- [ ] Selecionar "Todos os tipos" remove filtro
- [ ] Todas as opções estão disponíveis

#### Filtro por Status
- [ ] Cada status filtra corretamente
- [ ] "Todos os status" remove filtro
- [ ] Status são exibidos com cores corretas

#### Filtro por Data
- [ ] Data inicial filtra oportunidades após a data
- [ ] Data final filtra oportunidades antes da data
- [ ] Intervalo de datas funciona corretamente

#### Filtro por Valor
- [ ] Valor mínimo filtra oportunidades acima do valor
- [ ] Valor máximo filtra oportunidades abaixo do valor
- [ ] Intervalo de valores funciona corretamente

#### Botão Limpar
- [ ] Botão "Limpar Filtros" reseta todos os filtros
- [ ] Exibe novamente todas as oportunidades

### 4. Gráficos
#### Gráficos por Tipo de Serviço
- [ ] Todos os tipos são exibidos
- [ ] Barras são proporcionais aos valores
- [ ] Contagem de oportunidades está correta
- [ ] Valores potenciais são calculados corretamente

#### Gráficos por Status
- [ ] Todos os status são exibidos
- [ ] Cores são distintas para cada status
- [ ] Proporcionalidade está correta
- [ ] Valores potenciais fazem sentido

### 5. Tabela de Oportunidades
- [ ] Todas as colunas são exibidas
- [ ] Dados são formatados corretamente
- [ ] Moeda BRL em valores
- [ ] Datas no formato PT-BR (DD/MM/YYYY)
- [ ] Barra de probabilidade funciona
- [ ] Badges de status têm cores corretas
- [ ] Tabela responde a filtros

### 6. Ações na Tabela
#### Visualizar
- [ ] Botão de visualizar abre modal
- [ ] Modal exibe todas as informações
- [ ] Cálculo de valor potencial está correto
- [ ] Modal pode ser fechado

#### Editar
- [ ] Botão de editar está visível
- [ ] (Funcionalidade planejada)

#### Deletar
- [ ] Botão de deletar está visível
- [ ] Clicando remove a oportunidade
- [ ] Dashboard atualiza após deleção

### 7. Modal de Detalhes
- [ ] Modal abre ao clicar "Visualizar"
- [ ] Informações do paciente são corretas
- [ ] Informações da oportunidade são completas
- [ ] Descrição é exibida corretamente
- [ ] Próxima ação e data são mostradas
- [ ] Valor potencial é calculado corretamente
- [ ] Modal pode ser fechado com botão ou X

### 8. Impressão
#### Função Imprimir
- [ ] Botão "Imprimir" abre diálogo
- [ ] Elementos desnecessários estão ocultos
- [ ] Tabela é exibida corretamente
- [ ] Cores são preservadas
- [ ] Quebras de página ocorrem nos lugares certos

### 9. Exportação
#### PDF
- [ ] Botão "Exportar como PDF" funciona
- [ ] Arquivo PDF é gerado
- [ ] PDF contém título e data
- [ ] Dados são precisos no PDF
- [ ] Formatação é mantida
- [ ] Nome do arquivo inclui data

#### CSV
- [ ] Botão "Exportar como CSV" funciona
- [ ] Arquivo CSV é gerado
- [ ] Headers estão corretos
- [ ] Dados são separados por ponto-e-vírgula
- [ ] Compatível com Excel
- [ ] Valores monetários estão formatados

#### JSON
- [ ] Botão "Exportar como JSON" funciona
- [ ] Arquivo JSON é válido
- [ ] Metadados do relatório são inclusos
- [ ] Filtros aplicados estão no JSON
- [ ] Estrutura é clara e legível

### 10. Nova Oportunidade
#### Dialog de Criação
- [ ] Botão "+ Nova Oportunidade" abre dialog
- [ ] Todos os campos estão presentes
- [ ] Campos obrigatórios são identificáveis

#### Validação
- [ ] Não permite salvar sem paciente
- [ ] Não permite salvar sem email
- [ ] Não permite salvar sem valor
- [ ] Mensagem de erro é exibida

#### Criação
- [ ] Preencher todos os campos funciona
- [ ] Nova oportunidade aparece na tabela
- [ ] Status padrão é "aberta"
- [ ] Data é registrada corretamente
- [ ] Formulário é limpo após envio
- [ ] Dialog fecha após envio

### 11. Responsividade
- [ ] Página funciona em desktop
- [ ] Página funciona em tablet
- [ ] Página funciona em mobile
- [ ] Tabela é scrollável em telas pequenas
- [ ] Filtros se reorganizam em telas pequenas
- [ ] Gráficos se adaptam ao tamanho

### 12. Performance
- [ ] Página carrega rapidamente
- [ ] Filtros respondem sem atraso
- [ ] Gráficos são renderizados suavemente
- [ ] Exportação não trava a interface

## Testes de Dados

### Validação de Cálculos
```
Teste 1: Valor Potencial
- Oportunidade: R$ 1.000
- Probabilidade: 75%
- Esperado: R$ 750
- [ ] Correto

Teste 2: Total de Múltiplas Oportunidades
- Oportunidade 1: R$ 1.000
- Oportunidade 2: R$ 500
- Esperado Total: R$ 1.500
- [ ] Correto

Teste 3: Valor Potencial com Múltiplas Probabilidades
- Oportunidade 1: R$ 1.000 × 75% = R$ 750
- Oportunidade 2: R$ 500 × 50% = R$ 250
- Esperado Total: R$ 1.000
- [ ] Correto
```

## Testes de Integração

- [ ] Sidebar mostra corretamente o link "Relatórios"
- [ ] Link de navegação funciona
- [ ] Autenticação é requerida
- [ ] Dados persistem entre navegações
- [ ] Header e Footer são exibidos

## Testes de Segurança

- [ ] Apenas usuários autenticados acessam
- [ ] Dados não são expostos no console
- [ ] Senhas não são armazenadas localmente
- [ ] URLs não contêm dados sensíveis

## Relatório de Testes

Data: _______________
Testador: _______________
Ambiente: _______________

### Resumo
- Testes Aprovados: ___
- Testes Falhados: ___
- Testes Pendentes: ___

### Observações
_______________________________________________________________________
_______________________________________________________________________
_______________________________________________________________________

### Assinatura
_______________________________________________________________________
