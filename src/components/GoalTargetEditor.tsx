import { SaveToggleButton } from "./SaveToggleButton";
import { useState } from "react";
import { AdaptiveSlider } from "./reference/AdaptiveSlider";
import { AnimatedDisclosure } from "./AnimatedDisclosure";
export function GoalTargetEditor({
  target,
  deposited,
  parse,
  format,
  onSave,
}: {
  target: number;
  deposited: number;
  parse: (text: string) => number;
  format: (cents: number) => string;
  onSave: (cents: number) => boolean;
}) {
  const [draft, setDraft] = useState(
    (target / 100).toFixed(2).replace(".", ","),
  );
  const [message, setMessage] = useState("");
  const [saved, setSaved] = useState(false);
  let cents = 0;
  try {
    cents = parse(draft);
  } catch {}
  const ceiling = Math.min(
    1e12,
    Math.max(100000, target * 3, deposited * 2, cents),
  );
  return (
    <AnimatedDisclosure
      className="goal-target-editor"
      title="Ajustar valor da meta"
    >
      <form
        onSubmit={(event) => {
          event.preventDefault();
          try {
            const value = parse(draft);
            if (!Number.isSafeInteger(value) || value <= 0 || value > 1e12)
              throw Error("Informe um valor positivo válido.");
            if (onSave(value)) {
              setSaved(true);
              setMessage(
                "Valor da meta atualizado. Seus aportes foram preservados.",
              );
            }
          } catch (e) {
            setMessage(e instanceof Error ? e.message : "Confira o valor.");
          }
        }}
      >
        <label className="field">
          <span>Valor da meta (R$)</span>
          <input
            aria-label="Valor da meta (R$)"
            inputMode="decimal"
            required
            value={draft}
            onChange={(e) => {
              setDraft(e.target.value);
              setMessage("");
              setSaved(false);
            }}
          />
        </label>
        <AdaptiveSlider
          label="Ajustar objetivo"
          min={1}
          max={ceiling}
          step={1}
          value={Math.max(1, cents)}
          unit="R$"
          formatValue={(v) => (v / 100).toFixed(2).replace(".", ",")}
          onChange={(v) => {
            setDraft((v / 100).toFixed(2).replace(".", ","));
            setMessage("");
            setSaved(false);
          }}
        />
        <p className="muted">
          Guardado de verdade: {format(deposited)}. Alterar o objetivo não
          altera seu patrimônio.
        </p>
        <SaveToggleButton
          label="Salvar valor"
          revision={draft}
          onSave={() => {
            try {
              const value = parse(draft);
              if (!Number.isSafeInteger(value) || value <= 0 || value > 1e12)
                throw Error("Informe um valor positivo válido.");
              const ok = onSave(value);
              if (ok) setMessage("Valor atualizado. Aportes preservados.");
              return ok;
            } catch (error) {
              setMessage((error as Error).message);
              return false;
            }
          }}
        />

        {message && <p role="status">{message}</p>}
      </form>
    </AnimatedDisclosure>
  );
}
