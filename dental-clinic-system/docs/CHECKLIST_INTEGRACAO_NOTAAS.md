# Checklist técnico para integração Notaas (NFS-e)

## 1. Campos obrigatórios para emissão de NFS-e
- Razão social do tomador (cliente)
- CPF/CNPJ do tomador
- Endereço completo do tomador
- E-mail do tomador
- Descrição do serviço
- Código do serviço (CNAE ou código municipal)
- Valor total da nota
- Data de prestação do serviço
- Município de prestação do serviço
- Alíquota de ISS
- Forma de pagamento (opcional)
- Número de parcelas (opcional)

## 2. Fluxo de emissão automática
1. Após confirmação de pagamento, coletar dados da cobrança.
2. Montar payload conforme API Notaas (ver exemplo abaixo).
3. Enviar requisição POST para endpoint de emissão.
4. Receber status da nota (emitida, rejeitada, etc.).
5. Armazenar XML/JSON e protocolo de retorno.

## 3. Fluxo de emissão manual
1. Usuário seleciona cobrança e clica em "Emitir Nota".
2. Sistema pré-preenche os campos obrigatórios.
3. Usuário pode revisar/editar antes de enviar.
4. Envio para API Notaas e tratamento do retorno.

## 4. Webhooks
- Configurar endpoint para receber notificações de status (emitida, cancelada, rejeitada).
- Atualizar status da cobrança no sistema.

## 5. Exemplo de payload (campos comuns)
```json
{
  "tomador": {
    "razaoSocial": "Clínica Exemplo Ltda.",
    "cpfCnpj": "12345678000199",
    "endereco": {
      "logradouro": "Rua Exemplo",
      "numero": "123",
      "bairro": "Centro",
      "cidade": "São Paulo",
      "uf": "SP",
      "cep": "01000-000"
    },
    "email": "cliente@exemplo.com"
  },
  "servico": {
    "descricao": "Mensalidade de serviço odontológico",
    "codigo": "8599604",
    "aliquota": 0.05,
    "valor": 200.00,
    "data": "2026-01-26"
  },
  "pagamento": {
    "forma": "cartao",
    "parcelas": 1
  }
}
```

## 6. Referências
- [API Notaas - Documentação](https://docs.notaas.com)
- [Exemplo de integração Node.js](https://docs.notaas.com/#/api/examples/nodejs)

---

Próximos passos: implementar endpoints e integração conforme checklist acima.