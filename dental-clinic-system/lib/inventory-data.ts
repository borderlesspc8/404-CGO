// Mapeamento de materiais necessários por tipo de serviço
export const serviceInventoryMap: Record<string, string[]> = {
  tratamento: [
    "Resina Composta",
    "Adesivo Dentário",
    "Ácido Fosfórico",
    "Brocas de Diamante",
    "Sugador Saliva",
  ],
  limpeza: [
    "Pedra Pomes",
    "Pasta de Polimento",
    "Escova de Limpeza",
    "Espelho Intrabucal",
  ],
  implante: [
    "Implante Dentário",
    "Parafuso Protético",
    "Coroa Protética",
    "Abutment",
    "Cone Morse",
    "Guia Cirúrgico",
  ],
  clareamento: [
    "Gel Clareador",
    "Bandeja Intrabucal",
    "Protetor de Gengiva",
    "Moldeira Customizada",
  ],
  ortodoncia: [
    "Aparelho Fixo",
    "Alinhadores",
    "Fio Ortodôntico",
    "Bráquetes",
    "Ligaduras",
  ],
  periodontia: [
    "Curetas Periodontais",
    "Pasta Profilática",
    "Ácido Fluorídrico",
    "Selante Periodontal",
  ],
}

// Interface de Estoque
export interface InventoryItem {
  id: string
  name: string
  quantity: number
  minStock: number
  category: string
  supplier: string
  lastPurchase: string
  unitPrice: number
}

// Estoque Inicial (Mock Data)
export const initialInventory: InventoryItem[] = [
  {
    id: "1",
    name: "Resina Composta",
    quantity: 15,
    minStock: 5,
    category: "tratamento",
    supplier: "3M",
    lastPurchase: "2025-12-15",
    unitPrice: 250,
  },
  {
    id: "2",
    name: "Adesivo Dentário",
    quantity: 8,
    minStock: 3,
    category: "tratamento",
    supplier: "Kuraray",
    lastPurchase: "2025-12-20",
    unitPrice: 180,
  },
  {
    id: "3",
    name: "Implante Dentário",
    quantity: 3,
    minStock: 2,
    category: "implante",
    supplier: "Nobel Biocare",
    lastPurchase: "2025-11-10",
    unitPrice: 2500,
  },
  {
    id: "4",
    name: "Parafuso Protético",
    quantity: 5,
    minStock: 3,
    category: "implante",
    supplier: "Nobel Biocare",
    lastPurchase: "2025-11-10",
    unitPrice: 350,
  },
  {
    id: "5",
    name: "Gel Clareador",
    quantity: 20,
    minStock: 5,
    category: "clareamento",
    supplier: "Whiteness",
    lastPurchase: "2025-12-25",
    unitPrice: 120,
  },
  {
    id: "6",
    name: "Bandeja Intrabucal",
    quantity: 2,
    minStock: 2,
    category: "clareamento",
    supplier: "Clonage",
    lastPurchase: "2025-12-01",
    unitPrice: 80,
  },
  {
    id: "7",
    name: "Aparelho Fixo",
    quantity: 1,
    minStock: 1,
    category: "ortodoncia",
    supplier: "Morelli",
    lastPurchase: "2025-10-15",
    unitPrice: 1500,
  },
  {
    id: "8",
    name: "Fio Ortodôntico",
    quantity: 12,
    minStock: 5,
    category: "ortodoncia",
    supplier: "Morelli",
    lastPurchase: "2025-12-10",
    unitPrice: 450,
  },
  {
    id: "9",
    name: "Curetas Periodontais",
    quantity: 4,
    minStock: 2,
    category: "periodontia",
    supplier: "Lascod",
    lastPurchase: "2025-12-05",
    unitPrice: 320,
  },
  {
    id: "10",
    name: "Pedra Pomes",
    quantity: 8,
    minStock: 3,
    category: "limpeza",
    supplier: "Tanalith",
    lastPurchase: "2025-12-20",
    unitPrice: 95,
  },
  {
    id: "11",
    name: "Coroa Protética",
    quantity: 0,
    minStock: 2,
    category: "implante",
    supplier: "Titanium",
    lastPurchase: "2025-10-01",
    unitPrice: 800,
  },
  {
    id: "12",
    name: "Moldeira Customizada",
    quantity: 1,
    minStock: 1,
    category: "clareamento",
    supplier: "Clonage",
    lastPurchase: "2025-12-20",
    unitPrice: 150,
  },
]
