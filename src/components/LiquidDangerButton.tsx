import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { animate, motion, useReducedMotion } from "motion/react";

type LiquidDangerButtonProps = {
  onClick: () => void;
  children: ReactNode;
  className?: string;
  "aria-label"?: string;
  type?: "button" | "submit";
  disabled?: boolean;
};

/** Show destructive feedback before opening the existing confirmation. */
export function LiquidDangerButton({
  onClick,
  children,
  className = "",
  "aria-label": ariaLabel,
  type = "button",
  disabled = false,
}: LiquidDangerButtonProps) {
  const [armed, setArmed] = useState(false);
  const elementRef = useRef<HTMLButtonElement>(null);
  const mountedRef = useRef(false);
  const busyRef = useRef(false);
  const callbackRef = useRef(onClick);
  const reducedMotion = useReducedMotion();
  callbackRef.current = onClick;

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      busyRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (disabled) {
      setArmed(false);
      busyRef.current = false;
    }
  }, [disabled]);

  useEffect(() => {
    if (!armed) return;
    const disarmOutside = (event: Event) => {
      if (!elementRef.current?.contains(event.target as Node)) setArmed(false);
    };
    const disarmOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setArmed(false);
    };
    document.addEventListener("pointerdown", disarmOutside, true);
    document.addEventListener("focusin", disarmOutside, true);
    document.addEventListener("keydown", disarmOnEscape, true);
    return () => {
      document.removeEventListener("pointerdown", disarmOutside, true);
      document.removeEventListener("focusin", disarmOutside, true);
      document.removeEventListener("keydown", disarmOnEscape, true);
    };
  }, [armed]);

  const activate = useCallback(async () => {
    if (disabled || busyRef.current) return;
    setArmed(true);
    busyRef.current = true;
    if (reducedMotion) {
      busyRef.current = false;
      callbackRef.current();
      return;
    }

    const element = elementRef.current;
    if (element) {
      try {
        await animate(
          element,
          {
            scale: [1, 0.96, 1],
            filter: ["brightness(1)", "brightness(1.16)", "brightness(1)"],
          },
          { duration: 0.24, ease: "easeOut" },
        );
      } catch {
        // The animation may be stopped when the button unmounts.
      }
    }
    if (mountedRef.current && !disabled) callbackRef.current();
    busyRef.current = false;
  }, [disabled, reducedMotion]);

  return (
    <motion.button
      ref={elementRef}
      type={type}
      aria-label={ariaLabel}
      aria-disabled={disabled || undefined}
      data-state={armed ? "armed" : "idle"}
      className={`liquid-danger-button ${className}`.trim()}
      onClick={activate}
      onKeyDown={(event) => {
        if (event.key === "Escape" && armed) setArmed(false);
      }}
      style={{ transformOrigin: "center" }}
      disabled={disabled}
      whileTap={reducedMotion || disabled ? undefined : { scale: 0.985 }}
    >
      {children}
    </motion.button>
  );
}
