import {
  useEffect,
  useRef,
  useState,
  useId,
  type InputHTMLAttributes,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
const iso = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
export function DateInput({
  value,
  defaultValue,
  onChange,
  name,
  required,
  min,
  max,
  "aria-label": label,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  const [local, setLocal] = useState(String(defaultValue || "")),
    [open, setOpen] = useState(false);
  const selected = String(value ?? local),
    [month, setMonth] = useState(
      () => new Date((selected || iso(new Date())) + "T12:00:00"),
    );
  const root = useRef<HTMLDivElement>(null),
    input = useRef<HTMLInputElement>(null),
    trigger = useRef<HTMLButtonElement>(null),
    id = useId(),
    reduce = useReducedMotion();
  useEffect(() => {
    if (!open) return;
    const close = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [open]);
  const pick = (next: string) => {
    if (value === undefined) setLocal(next);
    if (input.current) {
      const setter = Object.getOwnPropertyDescriptor(
        HTMLInputElement.prototype,
        "value",
      )?.set;
      setter?.call(input.current, next);
      input.current.dispatchEvent(new Event("input", { bubbles: true }));
      onChange?.({
        target: { value: next, name },
        currentTarget: { value: next, name },
      } as any);
    }
    setOpen(false);
    trigger.current?.focus();
  };
  const start = new Date(month.getFullYear(), month.getMonth(), 1, 12);
  start.setDate(1 - start.getDay());
  return (
    <div
      className="date-input"
      ref={root}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.stopPropagation();
          setOpen(false);
          trigger.current?.focus();
        }
      }}
    >
      <input
        {...props}
        ref={input}
        name={name}
        type="text"
        value={selected}
        onChange={() => {}}
        required={required}
        tabIndex={-1}
        aria-hidden="true"
        className="date-input-value"
        onInvalid={(event) => {
          event.preventDefault();
          setOpen(true);
          trigger.current?.focus();
        }}
      />
      <button
        ref={trigger}
        type="button"
        className="date-input-trigger"
        aria-label={label || "Escolher data"}
        aria-expanded={open}
        aria-controls={id}
        onClick={() => {
          if (!open)
            setMonth(new Date((selected || iso(new Date())) + "T12:00:00"));
          setOpen(!open);
        }}
      >
        <CalendarDays size={17} />
        <span>
          {selected
            ? new Date(selected + "T12:00:00").toLocaleDateString("pt-BR")
            : "Escolher data"}
        </span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            id={id}
            className="date-picker-panel"
            role="dialog"
            aria-label="Escolher data no calendário"
            initial={{ opacity: 0, y: reduce ? 0 : 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.2 }}
          >
            <div className="date-picker-heading">
              <button
                type="button"
                aria-label="Mês anterior"
                onClick={() =>
                  setMonth(
                    new Date(month.getFullYear(), month.getMonth() - 1, 1, 12),
                  )
                }
              >
                <ChevronLeft size={18} />
              </button>
              <strong>
                {month.toLocaleDateString("pt-BR", {
                  month: "long",
                  year: "numeric",
                })}
              </strong>
              <button
                type="button"
                aria-label="Próximo mês"
                onClick={() =>
                  setMonth(
                    new Date(month.getFullYear(), month.getMonth() + 1, 1, 12),
                  )
                }
              >
                <ChevronRight size={18} />
              </button>
            </div>
            <div className="date-picker-grid">
              {["D", "S", "T", "Q", "Q", "S", "S"].map((day, i) => (
                <small key={i}>{day}</small>
              ))}
              {Array.from({ length: 42 }, (_, i) => {
                const d = new Date(start);
                d.setDate(d.getDate() + i);
                const day = iso(d);
                return (
                  <button
                    type="button"
                    key={day}
                    data-outside={d.getMonth() !== month.getMonth()}
                    aria-pressed={day === selected}
                    aria-label={d.toLocaleDateString("pt-BR", {
                      dateStyle: "full",
                    })}
                    disabled={
                      !!(
                        (min && day < String(min)) ||
                        (max && day > String(max))
                      )
                    }
                    onClick={() => pick(day)}
                  >
                    {d.getDate()}
                  </button>
                );
              })}
            </div>
            <div className="date-picker-footer">
              <button type="button" onClick={() => pick(iso(new Date()))}>
                Hoje
              </button>
              <button type="button" onClick={() => setOpen(false)}>
                Fechar
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
