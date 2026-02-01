import { MessageCircle } from "lucide-react"

export function MainFooter() {
  return (
    <footer className="w-full bg-[#B8AF39] py-4 px-6 mt-auto shrink-0">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MessageCircle className="w-6 h-6 text-[#50348F]" />
          <div>
            <p className="text-[#50348F] font-bold text-sm">Oris</p>
            <p className="text-[#50348F] text-xs">Gestão odontológica inteligente</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
