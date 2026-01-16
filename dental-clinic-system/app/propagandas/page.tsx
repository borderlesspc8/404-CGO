"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { MainHeader } from "@/components/main-header"
import { MainFooter } from "@/components/main-footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RecommendationEngine } from "@/components/recommendation-engine"
import { SalesOpportunity } from "@/components/reports-table"
import { InventoryItem, initialInventory, serviceInventoryMap } from "@/lib/inventory-data"
import {
  Lightbulb,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Share2,
  Mail,
  ShoppingCart,
} from "lucide-react"
import { propagandaProductMap, ecommerceProducts } from "@/lib/ecommerce-data"

// Mock data de oportunidades (mesmo do relatório)
const mockOpportunities: SalesOpportunity[] = [
  {
    id: "1",
    date: "2026-01-10",
    patient: "Ana Paula Silva",
    email: "ana.silva@email.com",
    phone: "(11) 98765-4321",
    type: "Implante",
    description: "Implante dentário - dente 36",
    value: 3500.0,
    status: "aberta",
    probability: 75,
    nextAction: "Consulta de avaliação",
    nextActionDate: "2026-01-20",
  },
  {
    id: "2",
    date: "2026-01-09",
    patient: "Carlos Roberto Mendes",
    email: "carlos.mendes@email.com",
    phone: "(11) 98765-4322",
    type: "Clareamento",
    description: "Clareamento dental profissional",
    value: 800.0,
    status: "em_andamento",
    probability: 90,
    nextAction: "Primeira sessão",
    nextActionDate: "2026-01-18",
  },
  {
    id: "3",
    date: "2026-01-08",
    patient: "Maria Santos Costa",
    email: "maria.santos@email.com",
    phone: "(11) 98765-4323",
    type: "Tratamento",
    description: "Tratamento de canal - dentes 11, 12",
    value: 1200.0,
    status: "fechada",
    probability: 100,
    nextAction: "Acompanhamento",
    nextActionDate: "2026-02-08",
  },
  {
    id: "4",
    date: "2026-01-07",
    patient: "João Silva Pereira",
    email: "joao.pereira@email.com",
    phone: "(11) 98765-4324",
    type: "Ortodontia",
    description: "Alinhadores dentários - full case",
    value: 5000.0,
    status: "em_andamento",
    probability: 85,
    nextAction: "Moldagem digital",
    nextActionDate: "2026-01-22",
  },
  {
    id: "5",
    date: "2026-01-06",
    patient: "Patricia Oliveira",
    email: "patricia.oliveira@email.com",
    phone: "(11) 98765-4325",
    type: "Periodontia",
    description: "Limpeza profunda - raspagem radicular",
    value: 450.0,
    status: "perdida",
    probability: 20,
    nextAction: "Contato de acompanhamento",
    nextActionDate: "2026-01-25",
  },
  {
    id: "6",
    date: "2026-01-05",
    patient: "Roberto Alves",
    email: "roberto.alves@email.com",
    phone: "(11) 98765-4326",
    type: "Limpeza",
    description: "Limpeza e profilaxia",
    value: 250.0,
    status: "fechada",
    probability: 100,
    nextAction: "Próxima revisão",
    nextActionDate: "2026-04-05",
  },
]

interface PersonalizedAd {
  id: string
  patient: string
  email: string
  serviceType: string
  currentOffer: string
  missingItems: string[]
  recommendation: string
  estimatedValue: number
  priority: "alta" | "média" | "baixa"
}

export default function PropagandasPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [opportunities] = useState<SalesOpportunity[]>(mockOpportunities)
  const [inventory] = useState<InventoryItem[]>(initialInventory)
  const [ads, setAds] = useState<PersonalizedAd[]>([])

  useEffect(() => {
    if (!user) {
      router.push("/")
    }
  }, [user, router])

  // Gerar propagandas personalizadas
  useEffect(() => {
    const generatedAds: PersonalizedAd[] = []
    const inventoryMap = new Map(inventory.map((item) => [item.name, item]))

    // Para cada oportunidade aberta, gerar uma propaganda personalizada
    opportunities
      .filter((opp) => opp.status === "aberta")
      .forEach((opportunity) => {
        const requiredItems = serviceInventoryMap[opportunity.type.toLowerCase()] || []
        const availableItems = requiredItems.filter((item) => {
          const inv = inventoryMap.get(item)
          return inv && inv.quantity > 0
        })

        const missingItems = requiredItems.filter((item) => {
          const inv = inventoryMap.get(item)
          return !inv || inv.quantity <= 2
        })

        const baseRecommendations: Record<string, string> = {
          implante: "Implante de Titânio Premium - Durabilidade Garantida por 20 anos",
          clareamento:
            "Clareamento Profissional - Dentes mais brancos em apenas 2 sessões",
          tratamento: "Tratamento com Tecnologia Digital - Sem dor, mais eficiente",
          ortodoncia: "Alinhadores Invisíveis - Sorria discretamente durante o tratamento",
          periodontia: "Limpeza Profunda - Gengivals saudáveis, sorriso perfeito",
          limpeza: "Limpeza Premium - Boca limpa e saudável",
        }

        const ad: PersonalizedAd = {
          id: `ad-${opportunity.id}`,
          patient: opportunity.patient,
          email: opportunity.email,
          serviceType: opportunity.type,
          currentOffer: baseRecommendations[opportunity.type.toLowerCase()] || "Serviço especial",
          missingItems: missingItems,
          recommendation:
            missingItems.length > 0
              ? `⚠️ Atenção: Você precisa reabastecê-los de ${missingItems.join(", ")} antes de confirmar o agendamento`
              : `✅ Todos os materiais disponíveis! Pode confirmar com ${opportunity.patient}`,
          estimatedValue: opportunity.value,
          priority: missingItems.length > 0 ? "alta" : opportunity.probability >= 80 ? "alta" : "média",
        }

        generatedAds.push(ad)
      })

    setAds(generatedAds)
  }, [opportunities, inventory])

  const highPriorityAds = ads.filter((ad) => ad.priority === "alta")
  const mediumPriorityAds = ads.filter((ad) => ad.priority === "média")
  const allRecommendations = ads.length

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const AdCard = ({ ad }: { ad: PersonalizedAd }) => (
    <Card
      className={
        ad.priority === "alta"
          ? "border-red-300 bg-red-50"
          : "border-yellow-300 bg-yellow-50"
      }
    >
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
          <div>
            <CardTitle className="text-lg">{ad.currentOffer}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Para: {ad.patient}</p>
          </div>
          <Badge
            className={ad.priority === "alta" ? "bg-red-600" : "bg-yellow-600"}
          >
            {ad.priority === "alta" ? "URGENTE" : "IMPORTANTE"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Recomendação */}
        <div
          className={`p-3 rounded ${
            ad.missingItems.length > 0
              ? "bg-red-100 text-red-900"
              : "bg-green-100 text-green-900"
          }`}
        >
          <p className="text-sm font-medium">{ad.recommendation}</p>
        </div>

        {/* Detalhes */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Tipo de Serviço</p>
            <p className="font-semibold">{ad.serviceType}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Valor Estimado</p>
            <p className="font-bold text-green-600">{formatCurrency(ad.estimatedValue)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Email</p>
            <p className="text-sm">{ad.email.split("@")[0]}...</p>
          </div>
        </div>

        {/* Itens Faltando */}
        {ad.missingItems.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-muted-foreground mb-2">
              MATERIAIS FALTANDO:
            </p>
            <div className="flex flex-wrap gap-2">
              {ad.missingItems.map((item, idx) => (
                <Badge key={idx} variant="destructive" className="text-xs">
                  {item}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Produtos Recomendados do Ecommerce */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground mb-2">
            PRODUTOS RECOMENDADOS:
          </p>
          <div className="space-y-2">
            {(() => {
              const productIds = propagandaProductMap[ad.serviceType.toLowerCase()] || []
              const products = ecommerceProducts.filter((p) =>
                productIds.includes(p.id)
              )
              return products.map((product) => (
                <div
                  key={product.id}
                  className="p-2 border rounded bg-white hover:bg-blue-50 transition"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="text-sm font-semibold">{product.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {product.category}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-green-600">
                        {formatCurrency(product.price)}
                      </p>
                      <Badge variant="outline" className="text-xs">
                        {product.stock} unid.
                      </Badge>
                    </div>
                  </div>
                </div>
              ))
            })()}
          </div>
        </div>

        {/* Ações */}
        <div className="flex gap-2 pt-2 border-t">
          <Button
            size="sm"
            variant="outline"
            className="flex-1 gap-2"
            title="Enviar email personalizado"
          >
            <Mail className="h-4 w-4" />
            Email
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="flex-1 gap-2"
            title="Ir para ecommerce"
            onClick={() => window.location.href = "/ecommerce"}
          >
            <ShoppingCart className="h-4 w-4" />
            Comprar
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="flex-1 gap-2"
            title="Compartilhar em redes sociais"
          >
            <Share2 className="h-4 w-4" />
            Compartilhar
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <MainHeader />

      <main className="flex-1 container mx-auto py-6 px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Propagandas Personalizadas</h1>
        </div>

        {/* Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Propagandas</CardTitle>
              <Lightbulb className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{allRecommendations}</div>
              <p className="text-xs text-muted-foreground">baseadas em oportunidades</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ações Urgentes</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{highPriorityAds.length}</div>
              <p className="text-xs text-muted-foreground">faltam materiais</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Prontos para Vender</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {allRecommendations - highPriorityAds.length}
              </div>
              <p className="text-xs text-muted-foreground">com estoque completo</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="recomendacoes" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="recomendacoes">
              Propagandas Personalizadas
            </TabsTrigger>
            <TabsTrigger value="analise">Análise de Estoque</TabsTrigger>
            <TabsTrigger value="oportunidades">Oportunidades</TabsTrigger>
          </TabsList>

          {/* Tab: Propagandas */}
          <TabsContent value="recomendacoes" className="space-y-4">
            {highPriorityAds.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3 text-red-900">
                  ⚠️ Ações Urgentes - Reabastecimento Necessário
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {highPriorityAds.map((ad) => (
                    <AdCard key={ad.id} ad={ad} />
                  ))}
                </div>
              </div>
            )}

            {mediumPriorityAds.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3 text-yellow-900">
                  📢 Propagandas Secundárias
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {mediumPriorityAds.map((ad) => (
                    <AdCard key={ad.id} ad={ad} />
                  ))}
                </div>
              </div>
            )}

            {ads.length === 0 && (
              <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                  ✅ Nenhuma propaganda pendente no momento
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Tab: Análise de Estoque */}
          <TabsContent value="analise">
            <RecommendationEngine opportunities={opportunities} inventory={inventory} />
          </TabsContent>

          {/* Tab: Oportunidades */}
          <TabsContent value="oportunidades" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Oportunidades em Aberto</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {opportunities
                    .filter((opp) => opp.status === "aberta")
                    .map((opp) => (
                      <div
                        key={opp.id}
                        className="p-3 border rounded-lg hover:bg-muted/50 transition"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-semibold">{opp.patient}</p>
                            <p className="text-sm text-muted-foreground">{opp.type}</p>
                          </div>
                          <Badge>
                            {opp.probability}% de chance
                          </Badge>
                        </div>
                        <p className="text-sm">{opp.description}</p>
                        <div className="mt-2 flex justify-between text-sm">
                          <span>
                            Valor:{" "}
                            <strong>{formatCurrency(opp.value)}</strong>
                          </span>
                          <span>
                            Próxima ação:{" "}
                            <strong>{opp.nextAction}</strong>
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <MainFooter />
    </div>
  )
}
