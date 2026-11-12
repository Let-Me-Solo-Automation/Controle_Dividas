import { useState, type FormEvent } from "react";

export function GoalMetaEditor({
  due,
  deadlineLabel,
  statusLabel,
  onSave,
}: {
  due: string;
  deadlineLabel?: string;
  statusLabel?: string;
  onSave: (value: { due: string; deadlineLabel: string; statusLabel: string }) => boolean;
}) {
  const [date, setDate] = useState(due);
  const [deadline, setDeadline] = useState(deadlineLabel || "Prazo");
  const [status, setStatus] = useState(statusLabel || "Em andamento");
  const [message, setMessage] = useState("");
  function submit(event: FormEvent) {
    event.preventDefault();
    if (!date || !deadline.trim() || !status.trim()) {
      setMessage("Informe uma data e os dois rótulos.");
      return;
    }
    setMessage(onSave({ due: date, deadlineLabel: deadline.trim(), statusLabel: status.trim() })
      ? "Prazo e situação atualizados."
      : "Não foi possível salvar as alterações.");
  }
  return (
    <details className="goal-target-editor goal-meta-editor">
      <summary>Editar prazo e situação</summary>
      <form onSubmit={submit}>
        <label className="field"><span>Data prevista</span><input type="date" required value={date} onChange={(event) => setDate(event.target.value)} /></label>
        <label className="field"><span>Nome do prazo</span><input required maxLength={32} value={deadline} onChange={(event) => setDeadline(event.target.value)} placeholder="Prazo" /></label>
        <label className="field"><span>Situação</span><input required maxLength={32} value={status} onChange={(event) => setStatus(event.target.value)} placeholder="Em andamento" /></label>
        <button type="submit" className="button full">Salvar prazo e situação</button>
        {message && <p role="status">{message}</p>}
      </form>
    </details>
  );
}
