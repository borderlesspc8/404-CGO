import { MessageCircle } from "lucide-react"

export function MainFooter() {
  return (
    <footer className="bg-[#c9b888] py-4 px-6 mt-auto">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MessageCircle className="w-6 h-6 text-[#5b4b8a]" />
          <div>
            <p className="text-[#5b4b8a] font-bold text-sm">CGO</p>
            <p className="text-[#5b4b8a] text-xs">CENTRO GERENCIAL ODONTOLÓGICO</p>
            <p className="text-[#5b4b8a] text-xs font-semibold">SUPORTE PERSONALIZADO</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
