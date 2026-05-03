
"use client";

import { useState, useRef, useEffect } from "react";
import { MainFooter } from "@/components/main-footer";
import { MainHeader } from "@/components/main-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RecommendationEngine } from "@/components/recommendation-engine";
import { AlertTriangle, CheckCircle, Lightbulb, Mail, Share2, ShoppingCart } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { sendEmail, sendWhatsApp } from "@/lib/notifications";

interface PersonalizedAd {
	id: string;
	patient: string;
	email: string;
	phone: string;
	serviceType: string;
	currentOffer: string;
	missingItems: string[];
	recommendation: string;
	estimatedValue: number;
	priority: "alta" | "média" | "baixa";
}

export default function PropagandasPage() {
	// Splash de vídeo
	const videoRef = useRef<HTMLVideoElement>(null);
	const [showVideo, setShowVideo] = useState(() => {
		if (typeof window !== 'undefined') {
			const videoShown = sessionStorage.getItem('introVideoShown');
			return videoShown !== 'true';
		}
		return false;
	});
	const [fadeOut, setFadeOut] = useState(false);

	// Define a velocidade do vídeo como 1.5x quando carrega
	useEffect(() => {
		if (videoRef.current && showVideo) {
			videoRef.current.playbackRate = 1.5;
		}
	}, [showVideo]);

	// Esconde o vídeo após exibição
	useEffect(() => {
		if (showVideo) {
			// Marca que o vídeo foi exibido nesta sessão
			sessionStorage.setItem('introVideoShown', 'true');
			
			// Ajusta o tempo considerando a velocidade de 1.5x (aproximadamente 5.3 segundos)
			const timer = setTimeout(() => {
				setFadeOut(true);
				setTimeout(() => setShowVideo(false), 1000);
			}, 5300);
			return () => clearTimeout(timer);
		}
	}, [showVideo]);
	// Simulação de dados
	const [ads] = useState<PersonalizedAd[]>([
		{
			id: "1",
			patient: "Maria Silva",
			email: "maria@email.com",
			phone: "5511999999999",
			serviceType: "Implante",
			currentOffer: "Desconto especial em implante!",
			missingItems: ["Parafuso", "Capa provisória"],
			recommendation: "Recomendamos agendar o procedimento assim que possível.",
			estimatedValue: 2500,
			priority: "alta",
		},
		{
			id: "2",
			patient: "João Souza",
			email: "joao@email.com",
			phone: "5511988888888",
			serviceType: "Clareamento",
			currentOffer: "Promoção clareamento dental!",
			missingItems: [],
			recommendation: "Aproveite o estoque completo para agendar.",
			estimatedValue: 800,
			priority: "média",
		},
	]);
	const [open, setOpen] = useState(false);
	const [customMessage, setCustomMessage] = useState("");
	const [sending, setSending] = useState(false);
	const [sendType, setSendType] = useState<"email"|"whatsapp"|null>(null);
	const [feedback, setFeedback] = useState<string|null>(null);
	const [selectedAd, setSelectedAd] = useState<PersonalizedAd|null>(null);

	const highPriorityAds = ads.filter((ad) => ad.priority === "alta");
	const mediumPriorityAds = ads.filter((ad) => ad.priority === "média");
	const allRecommendations = ads.length;

	const formatCurrency = (value: number) => {
		return new Intl.NumberFormat("pt-BR", {
			style: "currency",
			currency: "BRL",
		}).format(value);
	};

	function AdCard({ ad }: { ad: PersonalizedAd }) {
		const defaultMessage = `Olá ${ad.patient},\n${ad.currentOffer}\n${ad.recommendation}`;
		return (
			<Card className={ad.priority === "alta" ? "border-red-300 bg-red-50" : "border-yellow-300 bg-yellow-50"}>
				<CardHeader>
					<div className="flex justify-between items-start gap-4">
						<div>
							<CardTitle className="text-lg">{ad.currentOffer}</CardTitle>
							<p className="text-sm text-muted-foreground mt-1">Para: {ad.patient}</p>
						</div>
						<Badge className={ad.priority === "alta" ? "bg-red-600" : "bg-yellow-600"}>
							{ad.priority === "alta" ? "URGENTE" : "IMPORTANTE"}
						</Badge>
					</div>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className={`p-3 rounded ${ad.missingItems.length > 0 ? "bg-red-100 text-red-900" : "bg-green-100 text-green-900"}`}>
						<p className="text-sm font-medium">{ad.recommendation}</p>
					</div>
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
					{ad.missingItems.length > 0 && (
						<div>
							<p className="text-xs font-semibold text-muted-foreground mb-2">MATERIAIS FALTANDO:</p>
							<div className="flex flex-wrap gap-2">
								{ad.missingItems.map((item, idx) => (
									<Badge key={idx} variant="destructive" className="text-xs">{item}</Badge>
								))}
							</div>
						</div>
					)}
					<div className="flex gap-2 pt-2 border-t">
						<Dialog open={open && selectedAd?.id === ad.id} onOpenChange={(v) => { setOpen(v); if (!v) setFeedback(null); }}>
							<DialogTrigger asChild>
								<Button size="sm" variant="outline" className="flex-1 gap-2" title="Enviar email personalizado" onClick={() => { setSendType("email"); setCustomMessage(defaultMessage); setSelectedAd(ad); }}>
									<Mail className="h-4 w-4" />Email
								</Button>
							</DialogTrigger>
							<DialogTrigger asChild>
								<Button size="sm" variant="outline" className="flex-1 gap-2" title="Enviar WhatsApp personalizado" onClick={() => { setSendType("whatsapp"); setCustomMessage(defaultMessage); setSelectedAd(ad); }}>
									<img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" className="h-4 w-4" />WhatsApp
								</Button>
							</DialogTrigger>
							<DialogContent>
								<DialogHeader>
									<DialogTitle>Personalizar mensagem</DialogTitle>
								</DialogHeader>
								<Textarea className="mb-4" rows={6} value={customMessage} onChange={e => setCustomMessage(e.target.value)} />
								<DialogFooter>
									<Button onClick={async () => {
										setSending(true);
										setFeedback(null);
										try {
											if (sendType === "email") {
												await sendEmail({ to: ad.email, subject: `Oferta: ${ad.serviceType}`, text: customMessage });
												setFeedback("E-mail enviado com sucesso!");
											} else if (sendType === "whatsapp") {
												await sendWhatsApp({ phone: ad.phone, message: customMessage });
												setFeedback("WhatsApp enviado com sucesso!");
											}
										} catch {
											setFeedback("Erro ao enviar mensagem.");
										}
										setSending(false);
									}} disabled={sending}>
										{sending ? "Enviando..." : sendType === "email" ? "Enviar E-mail" : "Enviar WhatsApp"}
									</Button>
									<DialogClose asChild>
										<Button variant="outline">Cancelar</Button>
									</DialogClose>
								</DialogFooter>
								{feedback && <div className="mt-2 text-sm text-center">{feedback}</div>}
							</DialogContent>
						</Dialog>
						<Button size="sm" variant="outline" className="flex-1 gap-2" title="Ir para ecommerce" onClick={() => window.location.href = "/ecommerce"}>
							<ShoppingCart className="h-4 w-4" />Comprar
						</Button>
						<Button size="sm" variant="outline" className="flex-1 gap-2" title="Compartilhar em redes sociais">
							<Share2 className="h-4 w-4" />Compartilhar
						</Button>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<>
			{showVideo && (
				<div style={{
					position: 'fixed',
					top: 0,
					left: 0,
					width: '100vw',
					height: '100vh',
					background: '#000',
					zIndex: 9999,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					opacity: fadeOut ? 0 : 1,
					transition: 'opacity 1s ease-out',
				}}>
					<video
						ref={videoRef}
						src="/intro.mp4"
						autoPlay
						muted
						style={{ maxWidth: '100vw', maxHeight: '100vh' }}
						onEnded={() => {
							setFadeOut(true);
							setTimeout(() => setShowVideo(false), 1000);
						}}
					/>
				</div>
			)}
			<div className="min-h-screen flex flex-col bg-background" style={{ filter: showVideo ? 'blur(2px)' : 'none' }}>
				<MainHeader />
				<main className="flex-1 container mx-auto py-6 px-4">
				<div className="flex justify-between items-center mb-6">
					<h1 className="text-3xl font-bold">Descontos Personalizados</h1>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Total de Descontos</CardTitle>
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
							<div className="text-2xl font-bold text-green-600">{allRecommendations - highPriorityAds.length}</div>
							<p className="text-xs text-muted-foreground">com estoque completo</p>
						</CardContent>
					</Card>
				</div>
				<Tabs defaultValue="recomendacoes" className="w-full">
					<TabsList className="grid w-full grid-cols-3">
						<TabsTrigger value="recomendacoes">Descontos Personalizados</TabsTrigger>
						<TabsTrigger value="analise">Análise de Estoque</TabsTrigger>
						<TabsTrigger value="oportunidades">Oportunidades</TabsTrigger>
					</TabsList>
					<TabsContent value="recomendacoes" className="space-y-4">
						{highPriorityAds.length > 0 && (
							<div>
								<h3 className="text-lg font-semibold mb-3 text-red-900">⚠️ Ações Urgentes - Reabastecimento Necessário</h3>
								<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
									{highPriorityAds.map((ad) => (<AdCard key={ad.id} ad={ad} />))}
								</div>
							</div>
						)}
						{mediumPriorityAds.length > 0 && (
							<div>
								<h3 className="text-lg font-semibold mb-3 text-yellow-900">📢 Descontos Secundários</h3>
								<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
									{mediumPriorityAds.map((ad) => (<AdCard key={ad.id} ad={ad} />))}
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
					<TabsContent value="analise" className="space-y-4">
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
								<p className="text-2xl font-bold text-red-600">{ads.filter(a => a.missingItems.length > 0).length}</p>
								<p className="text-sm text-red-700 mt-1">Tratamentos com estoque insuficiente</p>
							</div>
							<div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
								<p className="text-2xl font-bold text-green-600">{ads.filter(a => a.missingItems.length === 0).length}</p>
								<p className="text-sm text-green-700 mt-1">Tratamentos com estoque completo</p>
							</div>
							<div className="bg-[#50348F]/5 border border-[#50348F]/20 rounded-lg p-4 text-center">
								<p className="text-2xl font-bold text-[#50348F]">
									{formatCurrency(ads.reduce((s, a) => s + (a.missingItems.length > 0 ? a.estimatedValue : 0), 0))}
								</p>
								<p className="text-sm text-[#50348F]/70 mt-1">Receita bloqueada por falta de estoque</p>
							</div>
						</div>
						<div className="bg-white rounded-lg border p-4 space-y-3">
							<h3 className="font-semibold text-gray-700">Materiais em falta por tratamento</h3>
							{ads.filter(a => a.missingItems.length > 0).length === 0 ? (
								<p className="text-gray-400 text-sm py-4 text-center">Todos os tratamentos têm estoque completo</p>
							) : ads.filter(a => a.missingItems.length > 0).map(ad => (
								<div key={ad.id} className="flex items-start justify-between gap-4 p-3 bg-red-50 rounded-lg border border-red-100">
									<div>
										<p className="font-medium text-sm">{ad.serviceType} — {ad.patient}</p>
										<div className="flex flex-wrap gap-1 mt-1">
											{ad.missingItems.map((item, i) => (
												<span key={i} className="text-xs bg-red-200 text-red-800 px-2 py-0.5 rounded-full">{item}</span>
											))}
										</div>
									</div>
									<span className="text-sm font-bold text-red-600 whitespace-nowrap">{formatCurrency(ad.estimatedValue)}</span>
								</div>
							))}
						</div>
						<div className="bg-white rounded-lg border p-4">
							<h3 className="font-semibold text-gray-700 mb-3">Resumo por tipo de serviço</h3>
							<div className="space-y-2">
								{Array.from(new Set(ads.map(a => a.serviceType))).map(service => {
									const serviceAds = ads.filter(a => a.serviceType === service)
									const withStock = serviceAds.filter(a => a.missingItems.length === 0).length
									const total = serviceAds.length
									return (
										<div key={service} className="flex items-center gap-3">
											<span className="text-sm w-36 font-medium">{service}</span>
											<div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
												<div className="h-full bg-green-500 rounded-full" style={{ width: `${(withStock / total) * 100}%` }} />
											</div>
											<span className="text-xs text-gray-500 w-20 text-right">{withStock}/{total} prontos</span>
										</div>
									)
								})}
							</div>
						</div>
					</TabsContent>
					<TabsContent value="oportunidades" className="space-y-4">
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<div className="bg-[#50348F]/5 border border-[#50348F]/20 rounded-lg p-4 text-center">
								<p className="text-2xl font-bold text-[#50348F]">{ads.length}</p>
								<p className="text-sm text-[#50348F]/70 mt-1">Oportunidades identificadas</p>
							</div>
							<div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
								<p className="text-2xl font-bold text-green-600">{formatCurrency(ads.reduce((s, a) => s + a.estimatedValue, 0))}</p>
								<p className="text-sm text-green-700 mt-1">Receita potencial total</p>
							</div>
							<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
								<p className="text-2xl font-bold text-yellow-600">{ads.filter(a => a.priority === "alta").length}</p>
								<p className="text-sm text-yellow-700 mt-1">Oportunidades urgentes</p>
							</div>
						</div>
						<div className="space-y-3">
							{[...ads].sort((a, b) => b.estimatedValue - a.estimatedValue).map(ad => (
								<div key={ad.id} className="bg-white rounded-lg border p-4 flex items-center justify-between gap-4">
									<div className="flex items-center gap-3 min-w-0">
										<div className={`w-3 h-3 rounded-full shrink-0 ${ad.priority === "alta" ? "bg-red-500" : ad.priority === "média" ? "bg-yellow-500" : "bg-green-500"}`} />
										<div className="min-w-0">
											<p className="font-semibold text-sm">{ad.patient}</p>
											<p className="text-xs text-gray-500">{ad.serviceType} · {ad.currentOffer}</p>
										</div>
									</div>
									<div className="flex items-center gap-4 shrink-0">
										<div className="text-right">
											<p className="font-bold text-green-600">{formatCurrency(ad.estimatedValue)}</p>
											<p className="text-xs text-gray-400">potencial</p>
										</div>
										<span className={`text-xs font-bold px-2 py-1 rounded-full ${
											ad.priority === "alta" ? "bg-red-100 text-red-700" :
											ad.priority === "média" ? "bg-yellow-100 text-yellow-700" :
											"bg-green-100 text-green-700"
										}`}>
											{ad.priority === "alta" ? "Urgente" : ad.priority === "média" ? "Importante" : "Normal"}
										</span>
										<span className={`text-xs px-2 py-1 rounded-full ${ad.missingItems.length > 0 ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}>
											{ad.missingItems.length > 0 ? `${ad.missingItems.length} item(s) em falta` : "Estoque OK"}
										</span>
									</div>
								</div>
							))}
						</div>
					</TabsContent>
				</Tabs>
			</main>
				<MainFooter />
			</div>
		</>
	);
}
import React from "react";
