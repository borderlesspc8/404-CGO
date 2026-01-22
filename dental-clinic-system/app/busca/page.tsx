"use client"

import { Suspense } from "react"
import SearchClient from "./search-client"

export default function BuscaPage() {
  return (
    <Suspense fallback={<div className="p-6">Carregando busca...</div>}>
      <SearchClient />
    </Suspense>
  )
}
