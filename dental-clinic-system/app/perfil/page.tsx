const sections = [
  { id: "cadastro", label: "Cadastro" },
  { id: "procedimentos", label: "Procedimentos" },
  { id: "financeiro", label: "Financeiro" },
  { id: "fotos", label: "Fotos" },
  { id: "contratos", label: "Contratos" },
  { id: "agendamentos", label: "Agendamentos" },
  { id: "anamnese", label: "Anamnese" },
]

export default function PerfilPage() {
  return (
    <main className="min-h-screen bg-[#f6f5fb] text-[#50348F] pb-16">
      <section className="bg-white shadow-sm border-b border-[#e5e2f5]" id="cadastro">
        <div className="mx-auto max-w-6xl px-6 py-6 flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-[#d8d2f0]" />
                <div>
                  <p className="text-lg font-semibold">MARCO RODRIGO DE SOUZA (5083)</p>
                  <div className="flex gap-3 text-sm text-[#5c5c7a]">
                    <span className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
                      Ativo
                    </span>
                    <span>Não informado</span>
                    <span>(18) 99819-4445</span>
                    <span>gbncorretora@gmail.com</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <button className="rounded-full border border-[#50348F] px-4 py-2 text-[#50348F] bg-white">Consultar CPF</button>
                <button className="rounded-full border border-[#50348F] px-4 py-2 text-[#50348F] bg-white">
                  Sem Registro no SPC/Serasa
                  <span className="block text-xs text-[#7b769c]">Última consulta 15/10/2025</span>
                </button>
                <button className="rounded-full bg-[#50348F] text-white px-4 py-2 flex items-center gap-2">
                  <span className="text-xs bg-white text-[#50348F] rounded-full w-5 h-5 inline-flex items-center justify-center font-bold">1</span>
                  Anamnese
                  <span className="text-xs font-normal">Verificar</span>
                </button>
                <button className="rounded-full border border-[#d7cba0] bg-[#f9f5e7] text-[#50348F] px-4 py-2">Alerta de retorno</button>
                <button className="rounded-full bg-[#B8AF39] text-white font-semibold px-4 py-2">+ Novo Paciente</button>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 text-sm font-medium text-[#50348F]">
              {sections.map((tab, index) => (
                <a
                  key={tab.id}
                  href={`#${tab.id}`}
                  className={`px-4 py-2 rounded-full transition-colors ${index === 0 ? "bg-[#50348F] text-white" : "hover:bg-[#e9e6f7]"}`}
                >
                  {tab.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-8" id="contato">
        <div className="rounded-3xl bg-[#50348F] text-white px-8 py-10 shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold">Contato</h3>
              <div className="space-y-4 text-sm tracking-wide">
                {[
                  "Fone Fixo:",
                  "Celular:",
                  "Outros Telefones:",
                  "Email:",
                ].map((label) => (
                  <div key={label} className="space-y-1">
                    <p className="font-medium">{label}</p>
                    <div className="border-b border-white/40" />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl font-semibold">Endereço</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm tracking-wide">
                {[
                  "CEP:",
                  "Cidade:",
                  "Estado:",
                  "Endereço:",
                  "Número:",
                  "Bairro:",
                  "Complemento:",
                ].map((label) => (
                  <div key={label} className="space-y-1 col-span-1">
                    <p className="font-medium">{label}</p>
                    <div className="border-b border-white/40" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-12" id="dados-complementares">
        <div className="rounded-3xl bg-[#50348F] text-white px-8 py-10 shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold">Dados Complementares</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm tracking-wide">
                {[
                  "Profissão:",
                  "Num. Prontuário:",
                  "Local de Trabalho:",
                  "Tempo de Trabalho:",
                  "CPF do Pai:",
                  "Profissão do Pai:",
                  "CPF da Mãe:",
                ].map((label) => (
                  <div key={label} className="space-y-1 col-span-1">
                    <p className="font-medium">{label}</p>
                    <div className="border-b border-white/40" />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl font-semibold">Representante Legal</h3>
              <div className="space-y-4 text-sm tracking-wide">
                {[
                  "Nome:",
                  "RG:",
                  "CPF:",
                  "Telefone:",
                  "Data de Nascimento:",
                ].map((label) => (
                  <div key={label} className="space-y-1">
                    <p className="font-medium">{label}</p>
                    <div className="border-b border-white/40" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-12" id="procedimentos">
        <div className="rounded-3xl bg-white border border-[#e5e2f5] px-8 py-10 shadow-sm flex items-start gap-6">
          <div className="rounded-2xl bg-[#50348F] text-white px-6 py-5 text-center">
            <p className="text-sm">R$12.847,75</p>
            <p className="text-xs">Aprovado por Diovana</p>
            <span className="mt-2 inline-flex rounded-full bg-green-600 px-3 py-1 text-xs font-semibold">Aprovado 15/10/2025</span>
          </div>
          <div className="text-sm text-[#5c5c7a]">
            <p>Procedimentos aprovados e em andamento serão exibidos aqui.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-12" id="financeiro">
        <div className="rounded-3xl bg-white border border-[#e5e2f5] px-8 py-10 shadow-sm">
          <h3 className="text-xl font-semibold mb-3 text-[#50348F]">Financeiro</h3>
          <p className="text-sm text-[#5c5c7a]">Resumo financeiro do paciente ficará disponível aqui.</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-12" id="fotos">
        <div className="rounded-3xl bg-white border border-[#e5e2f5] px-8 py-10 shadow-sm">
          <h3 className="text-xl font-semibold mb-3 text-[#50348F]">Fotos</h3>
          <p className="text-sm text-[#5c5c7a]">Galeria de fotos do paciente.</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-12" id="contratos">
        <div className="rounded-3xl bg-white border border-[#e5e2f5] px-8 py-10 shadow-sm">
          <h3 className="text-xl font-semibold mb-3 text-[#50348F]">Contratos</h3>
          <p className="text-sm text-[#5c5c7a]">Contratos e assinaturas serão listados aqui.</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-12" id="agendamentos">
        <div className="rounded-3xl bg-white border border-[#e5e2f5] px-8 py-10 shadow-sm">
          <h3 className="text-xl font-semibold mb-3 text-[#50348F]">Agendamentos</h3>
          <p className="text-sm text-[#5c5c7a]">Próximos e passados agendamentos aparecerão aqui.</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-12" id="anamnese">
        <div className="rounded-3xl bg-white border border-[#e5e2f5] px-8 py-10 shadow-sm">
          <h3 className="text-xl font-semibold mb-3 text-[#50348F]">Anamnese</h3>
          <p className="text-sm text-[#5c5c7a]">Registros de anamnese e formulários.</p>
        </div>
      </section>
    </main>
  )
}
