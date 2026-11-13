import { ChevronDown } from "lucide-react";
export function semanticTone(value: string) {
  return /conclu|recebid|pago/i.test(value)
    ? "complete"
    : /paus/i.test(value)
      ? "paused"
      : /cancel/i.test(value)
        ? "cancelled"
        : /urgente/i.test(value)
          ? "urgent"
          : /alta/i.test(value)
            ? "high"
            : /baixa/i.test(value)
              ? "low"
              : /andamento/i.test(value)
                ? "progress"
                : "normal";
}
export function SemanticSelect({
  label,
  value,
  options,
  onChange,
  disabled = false,
}: {
  label: string;
  value: string;
  options: string[];
  onChange?: (value: string) => void;
  disabled?: boolean;
}) {
  return (
    <span className={`semantic-select tone-${semanticTone(value)}`}>
      <span>{value}</span>
      <ChevronDown size={16} aria-hidden="true" />
      <select
        aria-label={label}
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        disabled={disabled}
      >
        {[...new Set([value, ...options])].map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </span>
  );
}
