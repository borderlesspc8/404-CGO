// Dados de produtos para o ecommerce
export interface Product {
  id: string
  name: string
  category: string
  price: number
  stock: number
  image?: string
  description: string
  supplier: string
  minQuantity?: number
  recommended?: boolean
  discount?: number
  inStock?: boolean
}

export interface CartItem {
  productId: string
  quantity: number
  price: number
}

export interface Order {
  id: string
  date: string
  items: CartItem[]
  total: number
  status: "pendente" | "processando" | "enviado" | "entregue"
  customer?: string
}

// Produtos do ecommerce (mesmo do inventário)
export const ecommerceProducts: Product[] = [
  {
    id: "prod-001",
    name: "Resina Composta Premium",
    category: "Materiais Restauradores",
    price: 85.5,
    stock: 45,
    description: "Resina composta fotopolimerizável - cor A2 universal",
    supplier: "3M ESPE",
    minQuantity: 10,
  },
  {
    id: "prod-002",
    name: "Adesivo Dentário Universal",
    category: "Materiais Restauradores",
    price: 42.0,
    stock: 120,
    description: "Adesivo universal de última geração - total etch",
    supplier: "Dentsply Sirona",
    minQuantity: 20,
  },
  {
    id: "prod-003",
    name: "Implante Dentário Titânio 4.1mm",
    category: "Implantologia",
    price: 450.0,
    stock: 12,
    description: "Implante cônico com superfície tratada",
    supplier: "Nobel Biocare",
    minQuantity: 5,
  },
  {
    id: "prod-004",
    name: "Gel Clareador 35%",
    category: "Clareamento",
    price: 28.75,
    stock: 89,
    description: "Gel clareador profissional com flúor",
    supplier: "Whiteness",
    minQuantity: 15,
  },
  {
    id: "prod-005",
    name: "Aparelho Fixo Cerâmico",
    category: "Ortodontia",
    price: 12.5,
    stock: 200,
    description: "Braquete cerâmico estético com slot 0.022",
    supplier: "Unitek",
    minQuantity: 50,
  },
  {
    id: "prod-006",
    name: "Curetas Periodontais Set",
    category: "Periodontia",
    price: 95.0,
    stock: 25,
    description: "Set completo de 5 curetas para raspagem",
    supplier: "Hu-Friedy",
    minQuantity: 5,
  },
  {
    id: "prod-007",
    name: "Fio Ortodôntico NiTi 0.016",
    category: "Ortodontia",
    price: 18.9,
    stock: 180,
    description: "Fio de níquel-titânio superelástico",
    supplier: "Ormco",
    minQuantity: 30,
  },
  {
    id: "prod-008",
    name: "Cimento Resinoso Dual",
    category: "Cimentação",
    price: 55.0,
    stock: 40,
    description: "Cimento resinoso autopolimerizável e fotoativável",
    supplier: "Rely X",
    minQuantity: 10,
  },
  {
    id: "prod-009",
    name: "Matriz Metálica Segmentada",
    category: "Restauração",
    price: 35.8,
    stock: 75,
    description: "Matriz para restaurações classe II e III",
    supplier: "Palodent",
    minQuantity: 20,
  },
  {
    id: "prod-010",
    name: "Pasta de Profilaxia Premium",
    category: "Profilaxia",
    price: 22.5,
    stock: 160,
    description: "Pasta sem flúor para limpeza profissional",
    supplier: "Dentsply",
    minQuantity: 30,
  },
  {
    id: "prod-011",
    name: "Escudo Facial Transparente",
    category: "EPI",
    price: 8.5,
    stock: 500,
    description: "Protetor facial reutilizável anti-embaçante",
    supplier: "3M",
    minQuantity: 100,
  },
  {
    id: "prod-012",
    name: "Luvas Nitrílicas Premium (caixa 100)",
    category: "EPI",
    price: 35.0,
    stock: 420,
    description: "Luvas nitrílicas sem pó premium - azul",
    supplier: "Supermax",
    minQuantity: 50,
  },
  {
    id: "prod-013",
    name: "Moldeira de Clareamento",
    category: "Clareamento",
    price: 15.0,
    stock: 150,
    description: "Moldeira customizável para clareamento dental",
    supplier: "Clonage",
    minQuantity: 20,
  },
  {
    id: "prod-014",
    name: "Bandeja de Clareamento",
    category: "Clareamento",
    price: 12.5,
    stock: 200,
    description: "Bandeja intrabucal para aplicação de gel clareador",
    supplier: "Clonage",
    minQuantity: 25,
  },
  {
    id: "prod-015",
    name: "Coroa Protética Temporária",
    category: "Prótese",
    price: 65.0,
    stock: 85,
    description: "Coroa protética temporária em resina",
    supplier: "Titanium",
    minQuantity: 10,
  },
]

// Mapeamento de propagandas para produtos recomendados
export const propagandaProductMap: Record<string, string[]> = {
  implante: ["prod-003", "prod-008", "prod-001"], // Implante, cimento, resina
  clareamento: ["prod-004", "prod-010"], // Gel clareador, pasta
  tratamento: ["prod-001", "prod-002", "prod-008"], // Resina, adesivo, cimento
  ortodoncia: ["prod-005", "prod-007"], // Aparelho, fio
  periodontia: ["prod-006", "prod-010"], // Curetas, pasta
  limpeza: ["prod-010", "prod-009"], // Pasta, matriz
}
