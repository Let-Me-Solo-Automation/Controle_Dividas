import { useState, type FormEvent } from "react";
import { AnimatedDisclosure } from "./AnimatedDisclosure";

export function GoalMetaEditor({ due, deadlineLabel, statusLabel, priority, onSave }: {
  due: string; deadlineLabel?: string; statusLabel?: string; priority?: string;
  onSave: (value: { due: string; deadlineLabel: string; statusLabel: string; priority: string }) => boolean;
}) {
  const [date, setDate] = useState(due);
  const [deadline, setDeadline] = useState(deadlineLabel || "Prazo");
  const [status, setStatus] = useState(statusLabel || "Em andamento");
  const [priorityValue, setPriorityValue] = useState(priority || "Normal");
  const [message, setMessage] = useState("");
  const [saved, setSaved] = useState(false);
  function submit(event: FormEvent) {
    event.preventDefault();
    if (!date || !deadline.trim() || !status.trim()) { setMessage("Informe uma data e os dois rótulos."); return; }
    const ok = onSave({ due: date, deadlineLabel: deadline.trim(), statusLabel: status.trim(), priority: priorityValue });
    setSaved(ok); setMessage(ok ? "Prazo, prioridade e situação atualizados." : "Não foi possível salvar as alterações.");
  }
  return <AnimatedDisclosure className="goal-target-editor goal-meta-editor" title="Editar prazo e situação">
    <form onSubmit={submit}>
      <label className="field"><span>Data prevista</span><input type="date" required value={date} onChange={event => { setDate(event.target.value); setSaved(false); }} /></label>
      <label className="field"><span>Nome do prazo</span><input required maxLength={32} value={deadline} onChange={event => { setDeadline(event.target.value); setSaved(false); }} placeholder="Prazo" /></label>
      <label className="field"><span>Situação</span><input required maxLength={32} value={status} onChange={event => { setStatus(event.target.value); setSaved(false); }} placeholder="Em andamento" /></label>
      <label className="field"><span>Prioridade</span><select value={priorityValue} onChange={event => { setPriorityValue(event.target.value); setSaved(false); }}>{["Baixa", "Normal", "Alta", "Urgente"].map(value => <option key={value}>{value}</option>)}</select></label>
      <button type="submit" className={`save-toggle ${saved ? "is-saved" : ""}`} aria-live="polite"><span className="save-toggle-icon">{saved ? "✓" : "↗"}</span><span>{saved ? "Salvo" : "Salvar alterações"}</span></button>
      {message && <p role="status">{message}</p>}
    </form>
  </AnimatedDisclosure>;
}
