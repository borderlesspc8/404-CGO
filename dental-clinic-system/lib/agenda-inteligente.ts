// Estrutura inicial para lógica da Agenda Inteligente
// agenda-inteligente.ts

export interface Profissional {
  id: string;
  nome: string;
  horarios: string[]; // Exemplo: ["08:00", "09:00", "10:00"]
}

export interface Consulta {
  id: string;
  profissionalId: string;
  paciente: string;
  horario: string;
}

// Função para sugerir horários disponíveis
export function sugerirHorarios(profissional: Profissional, consultas: Consulta[]): string[] {
  const ocupados = consultas.filter(c => c.profissionalId === profissional.id).map(c => c.horario);
  return profissional.horarios.filter(h => !ocupados.includes(h));
}

// Função para verificar conflitos
export function verificarConflito(consultas: Consulta[], novoHorario: string, profissionalId: string): boolean {
  return consultas.some(c => c.profissionalId === profissionalId && c.horario === novoHorario);
}
