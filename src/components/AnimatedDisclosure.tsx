import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";

export function AnimatedDisclosure({ title, children, className = "", defaultOpen = false }: { title: string; children: ReactNode; className?: string; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return <details className={className} open={open}>
    <summary className="animated-disclosure-trigger" onClick={event => { event.preventDefault(); setOpen(value => !value); }}><span className="animated-disclosure-title">{title}</span><span aria-hidden="true" className={open ? "is-open" : ""}>⌄</span></summary>
    <AnimatePresence initial={false}>
      {open && <motion.div className="animated-disclosure-panel" initial={{ height: 0, opacity: 0, y: -3 }} animate={{ height: "auto", opacity: 1, y: 0 }} exit={{ height: 0, opacity: 0, y: -3 }} transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}><div>{children}</div></motion.div>}
    </AnimatePresence>
  </details>;
}
