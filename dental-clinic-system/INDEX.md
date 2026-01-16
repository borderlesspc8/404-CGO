# 📑 ÍNDICE - Relatórios de Oportunidades de Venda

## 🎯 Comece Aqui

**Novo usuário?** → Leia [RELATORIOS_GUIA_RAPIDO.md](RELATORIOS_GUIA_RAPIDO.md) (5 min)

**Gerente?** → Leia [SUMARIO_EXECUTIVO.md](SUMARIO_EXECUTIVO.md) (10 min)

**Desenvolvedor?** → Leia [ESTRUTURA_VISUAL.md](ESTRUTURA_VISUAL.md) + [docs/FUNCIONALIDADES.md](docs/FUNCIONALIDADES.md) (15 min)

---

## 📚 Documentação por Tipo

### 👥 **Para Usuários Finais**
| Documento | O Quê | Quando Ler |
|-----------|-------|-----------|
| [RELATORIOS_GUIA_RAPIDO.md](RELATORIOS_GUIA_RAPIDO.md) | Guia rápido de uso | Primeiro acesso |
| [docs/RELATORIOS.md](docs/RELATORIOS.md) | Guia completo com exemplos | Dúvidas ou exploração |
| [ESTRUTURA_VISUAL.md](ESTRUTURA_VISUAL.md) | Layout visual da página | Entender a interface |

### 👔 **Para Gerentes**
| Documento | O Quê | Quando Ler |
|-----------|-------|-----------|
| [SUMARIO_EXECUTIVO.md](SUMARIO_EXECUTIVO.md) | Visão geral do sistema | Status geral |
| [docs/FUNCIONALIDADES.md](docs/FUNCIONALIDADES.md) | Lista de features | Apresentação |
| [CHECKLIST_IMPLANTACAO.md](CHECKLIST_IMPLANTACAO.md) | Status de implantação | Validação |

### 👨‍💻 **Para Desenvolvedores**
| Documento | O Quê | Quando Ler |
|-----------|-------|-----------|
| [ESTRUTURA_VISUAL.md](ESTRUTURA_VISUAL.md) | Estrutura de código | Entender arquitetura |
| [docs/FUNCIONALIDADES.md](docs/FUNCIONALIDADES.md) | Detalhes técnicos | Desenvolvimento |
| [docs/TESTES_RELATORIOS.md](docs/TESTES_RELATORIOS.md) | Casos de teste | Validação |
| [CHECKLIST_IMPLANTACAO.md](CHECKLIST_IMPLANTACAO.md) | Lista de verificação | Deploy |

### 🧪 **Para QA/Testes**
| Documento | O Quê | Quando Ler |
|-----------|-------|-----------|
| [docs/TESTES_RELATORIOS.md](docs/TESTES_RELATORIOS.md) | Plano de testes detalhado | Validação completa |
| [ESTRUTURA_VISUAL.md](ESTRUTURA_VISUAL.md) | Layout esperado | Validar UI |

### 🔧 **Para Implementação/DevOps**
| Documento | O Quê | Quando Ler |
|-----------|-------|-----------|
| [CHECKLIST_IMPLANTACAO.md](CHECKLIST_IMPLANTACAO.md) | Passos de deploy | Setup inicial |
| [docs/FUNCIONALIDADES.md](docs/FUNCIONALIDADES.md) | Dependências e setup | Instalação |

---

## 🗂️ Estrutura de Arquivos

```
📁 Projeto Root
├── 📄 RELATORIOS_GUIA_RAPIDO.md      ← COMECE AQUI (usuários)
├── 📄 SUMARIO_EXECUTIVO.md           ← COMECE AQUI (gerentes)
├── 📄 ESTRUTURA_VISUAL.md            ← COMECE AQUI (dev)
├── 📄 CHECKLIST_IMPLANTACAO.md       ← COMECE AQUI (DevOps)
├── 📄 INDEX.md                       ← VOCÊ ESTÁ AQUI
│
├── 📁 docs/
│   ├── 📄 RELATORIOS.md              (Guia completo 200+ linhas)
│   ├── 📄 TESTES_RELATORIOS.md       (Plano de testes)
│   └── 📄 FUNCIONALIDADES.md         (Lista técnica)
│
├── 📁 app/relatorios/
│   └── 📄 page.tsx                   (Página principal 627 linhas)
│
├── 📁 components/
│   ├── 📄 reports-filter.tsx         (Filtros)
│   ├── 📄 reports-table.tsx          (Tabela)
│   ├── 📄 reports-actions.tsx        (Ações)
│   ├── 📄 opportunity-details.tsx    (Modal)
│   ├── 📄 report-charts.tsx          (Gráficos)
│   └── 📄 sales-analytics.tsx        (Análises)
│
└── 📁 styles/
    └── 📄 print.css                  (Estilos impressão)
```

---

## 🚀 Acesso Rápido

### URL Aplicação
```
http://localhost:3000/relatorios
```

### Comandos Úteis
```bash
# Iniciar servidor
npm run dev

# Build para produção
npm run build

# Iniciar build produção
npm start

# Linting
npm run lint
```

---

## 🎓 Roteiros de Aprendizado

### Para Usuário Novo (30 min)
1. Ler [RELATORIOS_GUIA_RAPIDO.md](RELATORIOS_GUIA_RAPIDO.md) (5 min)
2. Acessar http://localhost:3000/relatorios (1 min)
3. Explorar dados de exemplo (10 min)
4. Testar filtros (5 min)
5. Gerar PDF/CSV (5 min)
6. Criar nova oportunidade (5 min)

### Para Gerente (20 min)
1. Ler [SUMARIO_EXECUTIVO.md](SUMARIO_EXECUTIVO.md) (10 min)
2. Ver página funcionando (5 min)
3. Testar relatórios em PDF (5 min)

### Para Desenvolvedor (45 min)
1. Ler [ESTRUTURA_VISUAL.md](ESTRUTURA_VISUAL.md) (10 min)
2. Explorar código em `components/` (15 min)
3. Entender `app/relatorios/page.tsx` (15 min)
4. Revisar [docs/FUNCIONALIDADES.md](docs/FUNCIONALIDADES.md) (5 min)

### Para QA (60 min)
1. Ler [docs/TESTES_RELATORIOS.md](docs/TESTES_RELATORIOS.md) (20 min)
2. Explorar [ESTRUTURA_VISUAL.md](ESTRUTURA_VISUAL.md) (10 min)
3. Executar testes manuais (30 min)

---

## 🔑 Conceitos Principais

### Dashboard (8 Métricas)
- 4 Cards de Resumo (Valor, Potencial, Abertas, Faturado)
- 4 Cards de Análises (Taxa, Médio, Probabilidade, Risco)

### Filtros (7 Campos)
- Busca, Tipo, Status, Data Inicial, Data Final, Valor Min, Valor Max

### Gráficos (2 Visualizações)
- Por Tipo de Serviço
- Por Status

### Tabela (9 Colunas)
- Data, Paciente, Tipo, Descrição, Valor, Probabilidade, Status, Próxima Ação, Ações

### Exportação (3 Formatos)
- PDF (profissional)
- CSV (Excel)
- JSON (integração)

---

## 📊 Dados de Exemplo

**Total**: 10 oportunidades pré-carregadas
**Valor Total**: R$ 20.850
**Valor Potencial**: R$ 16.720
**Taxa Conversão**: 30%

Exemplos: Ana Paula (Implante), Carlos (Clareamento), Maria (Tratamento), etc.

---

## ✅ Status

| Item | Status |
|------|--------|
| Implementação | ✅ Completa |
| Testes | ✅ Pronto |
| Documentação | ✅ Extensiva |
| Deploy | ✅ Pronto |

---

## 🎯 Próximas Etapas

1. **Novo Usuário**: [RELATORIOS_GUIA_RAPIDO.md](RELATORIOS_GUIA_RAPIDO.md)
2. **Validação**: [docs/TESTES_RELATORIOS.md](docs/TESTES_RELATORIOS.md)
3. **Deploy**: [CHECKLIST_IMPLANTACAO.md](CHECKLIST_IMPLANTACAO.md)

---

## 🆘 Precisa de Ajuda?

**"Como usar?"** → [RELATORIOS_GUIA_RAPIDO.md](RELATORIOS_GUIA_RAPIDO.md)

**"Quais são as features?"** → [docs/FUNCIONALIDADES.md](docs/FUNCIONALIDADES.md)

**"Como testar?"** → [docs/TESTES_RELATORIOS.md](docs/TESTES_RELATORIOS.md)

**"Como é o layout?"** → [ESTRUTURA_VISUAL.md](ESTRUTURA_VISUAL.md)

**"Status geral?"** → [SUMARIO_EXECUTIVO.md](SUMARIO_EXECUTIVO.md)

**"Como fazer deploy?"** → [CHECKLIST_IMPLANTACAO.md](CHECKLIST_IMPLANTACAO.md)

---

## 📞 Documentação Relacionada

Outros arquivos importantes no projeto:
- `package.json` - Dependências (jsPDF, html2canvas)
- `app/layout.tsx` - Integração com print.css
- `components/app-sidebar.tsx` - Link para /relatorios

---

## 📈 Estatísticas

| Métrica | Valor |
|---------|-------|
| Componentes | 6 |
| Páginas | 1 |
| Linhas de Código | ~1.700 |
| Arquivos de Doc | 6 |
| Funcionalidades | 25+ |
| Casos de Teste | 100+ |

---

**Versão**: 1.0.0
**Data**: Janeiro 2026
**Status**: ✅ Pronto para Produção
**Última Atualização**: 15/01/2026

---

### 🎉 Bem-vindo ao Sistema de Relatórios de Oportunidades!

Escolha seu ponto de entrada acima e comece a explorar. 🚀
