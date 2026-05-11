"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { MainHeader } from "@/components/main-header"
import { MainFooter } from "@/components/main-footer"
import Link from "next/link"

interface ModuleCardProps {
  title: string
  description: string
  href: string
  color?: string
}

function ModuleCard({ title, description, href, color = "#50348F" }: ModuleCardProps) {
  return (
    <Link href={href}>
      <div
        className="relative aspect-square rounded-full flex items-center justify-center p-8 text-center cursor-pointer transition-transform hover:scale-105 border-4 border-white shadow-lg"
        style={{ backgroundColor: color }}
      >
        <div className="space-y-2">
          <h3 className="text-white font-bold text-xl">{title}</h3>
          <p className="text-white text-sm leading-relaxed">{description}</p>
        </div>
      </div>
    </Link>
  )
}



export default function DashboardPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const videoRef = useRef<HTMLVideoElement>(null)
  
  // Verifica se o vídeo já foi exibido nesta sessão de login
  const [showVideo, setShowVideo] = useState(() => {
    if (typeof window !== 'undefined') {
      const videoShown = sessionStorage.getItem('introVideoShown')
      return videoShown !== 'true'
    }
    return false
  })
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/")
    }
  }, [isLoading, isAuthenticated, router])

  // Define a velocidade do vídeo como 1.5x quando carrega
  useEffect(() => {
    if (videoRef.current && showVideo) {
      videoRef.current.playbackRate = 1.5
    }
  }, [showVideo])

  useEffect(() => {
    if (showVideo) {
      // Marca que o vídeo foi exibido nesta sessão
      sessionStorage.setItem('introVideoShown', 'true')
      
      // Ajusta o tempo considerando a velocidade de 1.5x (aproximadamente 5.3 segundos)
      const timer = setTimeout(() => {
        setFadeOut(true)
        setTimeout(() => setShowVideo(false), 1000)
      }, 5300)
      return () => clearTimeout(timer)
    }
  }, [showVideo])

  if (isLoading || !isAuthenticated) {
    return null
  }

  return (
    <>
      {showVideo && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: '#fff',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: fadeOut ? 0 : 1,
            transition: 'opacity 1s ease-out',
          }}
        >
          <video
            ref={videoRef}
            src="/intro.mp4"
            autoPlay
            onEnded={() => {
              setFadeOut(true)
              setTimeout(() => setShowVideo(false), 1000)
            }}
            style={{ maxWidth: '100vw', maxHeight: '100vh' }}
          />
        </div>
      )}
      <div className="min-h-screen flex flex-col bg-[#f5f5f5]" style={{ filter: showVideo ? 'blur(2px)' : 'none' }}>
        <MainHeader />

        <main className="flex-1 px-6 py-12">
          <div className="max-w-7xl mx-auto">
            {/* Welcome message */}
            <div className="mb-12 text-center">
              <h1 className="text-3xl font-semibold text-[#50348F]">Olá, {user?.name}!</h1>
            </div>

            {/* Module grid - 4 columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              <ModuleCard
                title="Agenda"
                description="Agende consultas, remarque e crie alertas de retorno para pacientes."
                href="/agenda"
                color="#50348F"
              />
              <ModuleCard
                title="Cadastro"
                description="Cadastro de pacientes, ficha de procedimentos, financeiro, contratos e outros"
                href="/pacientes"
                color="#50348F"
              />
              <ModuleCard
                title="Financeiro"
                description="Caixa, Conta Corrente, Fluxo de caixa, contas a receber, contas a pagar e outros"
                href="/financeiro"
                color="#50348F"
              />
              <ModuleCard
                title="Dashboard"
                description="Entrada, Saída, Inadimplência, Parcelamentos, Oportunidade e outros"
                href="/dashboard/analytics"
                color="#50348F"
              />
            </div>

            {/* Module grid - 4 columns (second row) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <ModuleCard
                title="CRM"
                description="Controle de Campanhas, Funil de Leads, Agendamentos, Desmarque, opção de relatório e outros"
                href="/crm"
                color="#50348F"
              />
              <ModuleCard
                title="Estoque"
                description="Adicionar, Quantidade, Reatórios e outros"
                href="/estoque"
                color="#50348F"
              />
              <ModuleCard
                title="Relatórios"
                description="Caixa, Pagamentos, Comissões, Contas a Pagar, Fluxo Financeiro, Inadimplentees, Oportunidades e outros"
                href="/relatorios"
                color="#50348F"
              />
              <ModuleCard
                title="Dental"
                description="E-commerce com os melhores valores para otimizar seus lucros"
                href="/ecommerce"
                color="#50348F"
              />
            </div>
          </div>
        </main>

        <MainFooter />
      </div>
    </>
  )
}
