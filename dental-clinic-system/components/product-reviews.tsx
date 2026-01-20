"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useReviews } from "@/components/reviews-context"
import { useAuth } from "@/lib/auth-context"
import { Star, Send } from "lucide-react"
import { Review } from "@/components/reviews-context"

interface ProductReviewsProps {
  productId: string
  productName: string
}

export function ProductReviews({
  productId,
  productName,
}: ProductReviewsProps) {
  const { user } = useAuth()
  const {
    getReviewsByProduct,
    getAverageRating,
    getTotalReviews,
    getRatingDistribution,
    addReview,
  } = useReviews()

  const [rating, setRating] = useState(5)
  const [title, setTitle] = useState("")
  const [comment, setComment] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const reviews = getReviewsByProduct(productId)
  const avgRating = getAverageRating(productId)
  const totalReviews = getTotalReviews(productId)
  const distribution = getRatingDistribution(productId)

  const handleSubmitReview = () => {
    if (!title.trim() || !comment.trim()) {
      alert("Preencha título e comentário")
      return
    }

    addReview({
      productId,
      productName,
      userName: user?.name || "Anônimo",
      rating,
      title,
      comment,
      verified: true,
    })

    setTitle("")
    setComment("")
    setRating(5)
    setSubmitted(true)

    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <div className="space-y-4">
      {/* Resumo de Avaliações */}
      <Card>
        <CardHeader>
          <CardTitle>⭐ Avaliações do Produto</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-500">
                {avgRating}
              </div>
              <div className="flex gap-1 justify-center mt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${
                      star <= Math.floor(avgRating)
                        ? "fill-yellow-500 text-yellow-500"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {totalReviews} avaliações
              </p>
            </div>

            {/* Distribuição */}
            <div className="flex-1 space-y-2">
              {[5, 4, 3, 2, 1].map((stars) => (
                <div key={stars} className="flex items-center gap-2">
                  <span className="text-xs w-12">{stars} ⭐</span>
                  <div className="flex-1 h-2 bg-gray-200 rounded overflow-hidden">
                    <div
                      className="h-full bg-yellow-500"
                      style={{
                        width: `${
                          totalReviews > 0
                            ? (distribution[stars] / totalReviews) * 100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground w-8">
                    {distribution[stars]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Formulário para Nova Avaliação */}
      {user && (
        <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950">
          <CardHeader>
            <CardTitle className="text-base">
              ✍️ Compartilhe sua avaliação
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Rating */}
            <div>
              <Label>Sua avaliação</Label>
              <div className="flex gap-2 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="transition transform hover:scale-110"
                  >
                    <Star
                      className={`h-8 w-8 cursor-pointer ${
                        star <= rating
                          ? "fill-yellow-500 text-yellow-500"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Título */}
            <div>
              <Label htmlFor="review-title">Título da avaliação</Label>
              <input
                id="review-title"
                type="text"
                placeholder="Ex: Excelente qualidade!"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full mt-1 px-3 py-2 border rounded-md bg-white"
              />
            </div>

            {/* Comentário */}
            <div>
              <Label htmlFor="review-comment">Seu comentário</Label>
              <Textarea
                id="review-comment"
                placeholder="Compartilhe sua experiência com este produto..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                className="mt-1"
              />
            </div>

            {/* Botão e Mensagem */}
            <div className="flex items-center justify-between">
              <Button
                onClick={handleSubmitReview}
                className="gap-2 bg-blue-600 hover:bg-blue-700"
              >
                <Send className="h-4 w-4" />
                Enviar Avaliação
              </Button>

              {submitted && (
                <span className="text-sm text-green-600 font-medium">
                  ✅ Avaliação enviada com sucesso!
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Listagem de Avaliações */}
      <div className="space-y-3">
        <h3 className="font-semibold">Avaliações dos clientes</h3>
        {reviews.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center text-muted-foreground">
              Nenhuma avaliação ainda. Seja o primeiro a avaliar!
            </CardContent>
          </Card>
        ) : (
          reviews.slice(0, 5).map((review: Review) => (
            <Card key={review.id}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${
                            star <= review.rating
                              ? "fill-yellow-500 text-yellow-500"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="font-semibold mt-1">{review.title}</p>
                  </div>
                  {review.verified && (
                    <Badge className="bg-green-600 text-xs">
                      ✓ Comprador verificado
                    </Badge>
                  )}
                </div>

                <p className="text-sm text-muted-foreground mb-2">
                  {review.comment}
                </p>

                <p className="text-xs text-muted-foreground">
                  por <strong>{review.userName}</strong> em{" "}
                  {new Date(review.date).toLocaleDateString("pt-BR")}
                </p>
              </CardContent>
            </Card>
          ))
        )}

        {reviews.length > 5 && (
          <Button variant="outline" className="w-full">
            Ver todas as {reviews.length} avaliações
          </Button>
        )}
      </div>
    </div>
  )
}
