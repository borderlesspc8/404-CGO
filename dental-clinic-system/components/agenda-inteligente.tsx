import React, { useState } from "react";
import { Profissional, Consulta, sugerirHorarios, verificarConflito } from "../lib/agenda-inteligente";

const profissionais: Profissional[] = [
  { id: "1", nome: "Dr. Ana", horarios: ["08:00", "09:00", "10:00", "11:00"] },
  { id: "2", nome: "Dr. João", horarios: ["09:00", "10:00", "11:00", "12:00"] },
];

const AgendaInteligente: React.FC = () => {
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [profissionalId, setProfissionalId] = useState(profissionais[0].id);
  const [paciente, setPaciente] = useState("");
  const [horario, setHorario] = useState("");
  const [alerta, setAlerta] = useState<string | null>(null);

  const profissional = profissionais.find(p => p.id === profissionalId)!;
  const horariosDisponiveis = sugerirHorarios(profissional, consultas);

  const agendar = () => {
    if (!paciente || !horario) return;
    if (verificarConflito(consultas, horario, profissionalId)) {
      setAlerta("Conflito: horário já ocupado!");
      return;
    }
    setConsultas([...consultas, { id: Date.now().toString(), profissionalId, paciente, horario }]);
    setPaciente("");
    setHorario("");
    setAlerta(null);
  };

  return (
    <div style={{ border: "1px solid #ccc", borderRadius: 8, padding: 16, maxWidth: 400, marginTop: 24 }}>
      <h3>Agenda Inteligente</h3>
      <div style={{ marginBottom: 8 }}>
        <label>Profissional: </label>
        <select value={profissionalId} onChange={e => setProfissionalId(e.target.value)}>
          {profissionais.map(p => (
            <option key={p.id} value={p.id}>{p.nome}</option>
          ))}
        </select>
      </div>
      <div style={{ marginBottom: 8 }}>
        <label>Paciente: </label>
        <input value={paciente} onChange={e => setPaciente(e.target.value)} placeholder="Nome do paciente" />
      </div>
      <div style={{ marginBottom: 8 }}>
        <label>Horário: </label>
        <select value={horario} onChange={e => setHorario(e.target.value)}>
          <option value="">Selecione</option>
          {horariosDisponiveis.map((h: string) => (
            <option key={h} value={h}>{h}</option>
          ))}
        </select>
      </div>
      <button onClick={agendar}>Agendar</button>
      {alerta && <div style={{ color: "red", marginTop: 8 }}>{alerta}</div>}
      <div style={{ marginTop: 16 }}>
        <h4>Consultas Agendadas</h4>
        {consultas.map(c => (
          <div key={c.id}>
            {c.paciente} - {profissionais.find(p => p.id === c.profissionalId)?.nome} - {c.horario}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgendaInteligente;
