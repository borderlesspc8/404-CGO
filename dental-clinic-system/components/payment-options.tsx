"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { CreditCard, Smartphone, Banknote } from "lucide-react"

interface PaymentOption {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  available: boolean
}

interface PaymentOptionsProps {
  onPaymentSelect: (methodId: string) => void
  selectedMethod: string
}

export function PaymentOptions({
  onPaymentSelect,
  selectedMethod,
}: PaymentOptionsProps) {
  const paymentOptions: PaymentOption[] = [
    {
      id: "credit_card",
      name: "Cartão de Crédito",
      description: "Visa, Mastercard, Elo",
      icon: <CreditCard className="h-6 w-6" />,
      available: true,
    },
    {
      id: "debit_card",
      name: "Cartão de Débito",
      description: "Débito em conta corrente",
      icon: <CreditCard className="h-6 w-6" />,
      available: true,
    },
    {
      id: "pix",
      name: "PIX",
      description: "Transferência instantânea",
      icon: <Smartphone className="h-6 w-6" />,
      available: true,
    },
    {
      id: "boleto",
      name: "Boleto Bancário",
      description: "Vencimento em 3 dias úteis",
      icon: <Banknote className="h-6 w-6" />,
      available: true,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          💳 Forma de Pagamento
        </CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup value={selectedMethod} onValueChange={onPaymentSelect}>
          <div className="space-y-3">
            {paymentOptions.map((option) => (
              <div
                key={option.id}
                className={`flex items-center space-x-3 p-4 border rounded-lg hover:bg-accent cursor-pointer transition ${
                  !option.available ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() => option.available && onPaymentSelect(option.id)}
              >
                <RadioGroupItem
                  value={option.id}
                  id={option.id}
                  disabled={!option.available}
                />
                <Label
                  htmlFor={option.id}
                  className="flex-1 cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="text-blue-600">{option.icon}</div>
                    <div>
                      <p className="font-semibold">{option.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {option.description}
                      </p>
                    </div>
                  </div>
                  {!option.available && (
                    <Badge variant="secondary">Em breve</Badge>
                  )}
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>

        {/* Info de segurança */}
        <div className="mt-4 p-3 bg-green-50 dark:bg-green-950 rounded border border-green-200 text-xs text-green-900 dark:text-green-400">
          🔒 Seus dados de pagamento são criptografados e seguros
        </div>
      </CardContent>
    </Card>
  )
}
