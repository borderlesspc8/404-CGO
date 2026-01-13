import { Badge } from "@/components/ui/badge"

interface AppointmentStatusBadgeProps {
  status: "scheduled" | "confirmed" | "completed" | "cancelled" | "noshow"
}

export function AppointmentStatusBadge({ status }: AppointmentStatusBadgeProps) {
  const statusConfig = {
    scheduled: { label: "Agendado", color: "bg-gray-500" },
    confirmed: { label: "Confirmado", color: "bg-blue-500" },
    completed: { label: "Atendido", color: "bg-green-500" },
    cancelled: { label: "Cancelado", color: "bg-red-500" },
    noshow: { label: "Faltou", color: "bg-orange-500" },
  }

  const config = statusConfig[status]

  return <Badge className={`${config.color} text-white`}>{config.label}</Badge>
}
