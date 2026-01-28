
"use client";

import { useState } from "react";
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
	const [showVideo, setShowVideo] = useState(true);
	// Esconde o vídeo após 8 segundos
	React.useEffect(() => {
		if (showVideo) {
			const timer = setTimeout(() => setShowVideo(false), 8000);
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
				}}>
					<video
						src="/intro.mp4"
						autoPlay
						muted
						style={{ maxWidth: '100vw', maxHeight: '100vh' }}
						onEnded={() => setShowVideo(false)}
					/>
				</div>
			)}
			<div className="min-h-screen flex flex-col bg-background" style={{ filter: showVideo ? 'blur(2px)' : 'none' }}>
				<MainHeader />
				<main className="flex-1 container mx-auto py-6 px-4">
				<div className="flex justify-between items-center mb-6">
					<h1 className="text-3xl font-bold">Propagandas Personalizadas</h1>
				</div>
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
							<div className="text-2xl font-bold text-green-600">{allRecommendations - highPriorityAds.length}</div>
							<p className="text-xs text-muted-foreground">com estoque completo</p>
						</CardContent>
					</Card>
				</div>
				<Tabs defaultValue="recomendacoes" className="w-full">
					<TabsList className="grid w-full grid-cols-3">
						<TabsTrigger value="recomendacoes">Propagandas Personalizadas</TabsTrigger>
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
								<h3 className="text-lg font-semibold mb-3 text-yellow-900">📢 Propagandas Secundárias</h3>
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
					<TabsContent value="analise">
						<div className="p-4 text-center text-muted-foreground">Funcionalidade de análise de estoque em desenvolvimento.</div>
					</TabsContent>
					<TabsContent value="oportunidades">
						<div className="p-4 text-center text-muted-foreground">Funcionalidade de oportunidades em desenvolvimento.</div>
					</TabsContent>
				</Tabs>
			</main>
				<MainFooter />
			</div>
		</>
	);
}
