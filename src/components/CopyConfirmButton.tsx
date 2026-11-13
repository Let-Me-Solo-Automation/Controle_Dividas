import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check, Copy } from "lucide-react";
export function CopyConfirmButton({
  value,
  onFallback,
}: {
  value: string;
  onFallback?: (value: string) => void;
}) {
  const [copied, setCopied] = useState(false),
    [error, setError] = useState(""),
    timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined),
    reduce = useReducedMotion();
  useEffect(() => () => clearTimeout(timer.current), []);
  return (
    <div>
      <motion.button
        type="button"
        className={`copy-confirm ${copied ? "is-copied" : ""}`}
        whileTap={reduce ? undefined : { scale: 0.97 }}
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            setError("");
            clearTimeout(timer.current);
            timer.current = setTimeout(() => setCopied(false), 1800);
          } catch {
            if (onFallback) onFallback(value);
            else setError("Não foi possível copiar. Selecione o link acima.");
          }
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={String(copied)}
            initial={{ opacity: 0, scale: reduce ? 1 : 0.8, y: reduce ? 0 : 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, y: reduce ? 0 : -4 }}
            transition={{ duration: reduce ? 0 : 0.18 }}
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}{" "}
            {copied ? "Copiado" : "Copiar link"}
          </motion.span>
        </AnimatePresence>
      </motion.button>
      {error && <small role="alert">{error}</small>}
    </div>
  );
}
