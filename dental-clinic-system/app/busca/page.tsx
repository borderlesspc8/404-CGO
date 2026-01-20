"use client"

import React, { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { MainHeader } from "@/components/main-header"
import { AppSidebar } from "@/components/app-sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  Users,
  Calendar,
  DollarSign,
  MessageSquare,
  Package,
  FileText,
  Eye,
  Search as SearchIcon,
} from "lucide-react"
import { mockPatients, mockAppointments, mockProfessionals } from "@/lib/mock-data"

import { Suspense } from "react"
import SearchClient from "./search-client"

export default function BuscaPage() {
  return (
    <Suspense fallback={<div className="p-6">Carregando busca...</div>}>
      <SearchClient />
    </Suspense>
  )
}
                            <Eye className="w-4 h-4 mr-2" />
                            Ver
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && !query && (
              <div className="text-center py-12">
                <SearchIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  Digite algo para buscar
                </h3>
                <p className="text-gray-500">
                  Busque por pacientes, agendamentos, profissionais, funções do sistema e mais
                </p>
              </div>
            )}

            {/* No Results State */}
            {!loading && query && results.length === 0 && (
              <div className="text-center py-12">
                <SearchIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  Nenhum resultado encontrado
                </h3>
                <p className="text-gray-500">
                  Tente buscar com outros termos ou verifique a ortografia
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
