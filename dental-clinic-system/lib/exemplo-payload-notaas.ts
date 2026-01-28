// Exemplo de payload para emissão automática de NFS-e via Notaas
export const exemploPayloadNota = {
  tomador: {
    razaoSocial: "Clínica Exemplo Ltda.",
    cpfCnpj: "12345678000199",
    endereco: {
      logradouro: "Rua Exemplo",
      numero: "123",
      bairro: "Centro",
      cidade: "São Paulo",
      uf: "SP",
      cep: "01000-000"
    },
    email: "cliente@exemplo.com"
  },
  servico: {
    descricao: "Mensalidade de serviço odontológico",
    codigo: "8599604",
    aliquota: 0.05,
    valor: 200.00,
    data: "2026-01-26"
  },
  pagamento: {
    forma: "cartao",
    parcelas: 1
  }
};
