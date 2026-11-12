"use client";

import { useEffect, useRef, useState, type FC } from "react";
import { motion, AnimatePresence, MotionConfig } from "motion/react";
import { FaBell, FaTasks } from "react-icons/fa";
import { IoCalendar } from "react-icons/io5";
import { BsCheckLg, BsFillPeopleFill, BsPinFill } from "react-icons/bs";
import { RiBubbleChartFill } from "react-icons/ri";
import { PiFunnelSimpleBold } from "react-icons/pi";
import type { IconType } from "react-icons";

export interface FilterItem {
  id: string;
  label: string;
  icon: IconType;
}

interface FilterDisclosureProps {
  items?: FilterItem[];
  label?: string;
  defaultActiveId?: string;
  onChange?: (id: string) => void;
}

const SPRING = {
  type: "spring",
  stiffness: 300,
  damping: 36,
  mass: 1,
} as const;

const DEFAULT_ITEMS: FilterItem[] = [
  { id: "tasks", label: "Tasks", icon: FaTasks },
  { id: "events", label: "Events", icon: IoCalendar },
  { id: "reminders", label: "Reminders", icon: FaBell },
  { id: "appointments", label: "Appointment", icon: BsPinFill },
  { id: "meetings", label: "Mettings", icon: BsFillPeopleFill },
  { id: "celebrations", label: "Celebrations", icon: RiBubbleChartFill },
];

export const FilterDisclosure: FC<FilterDisclosureProps> = ({
  items = DEFAULT_ITEMS,
  label = "Filtrar movimentos",
  defaultActiveId = "reminders",
  onChange,
}) => {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(defaultActiveId);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const restoreFocus = useRef(false);

  const cancelPendingClose = () => {
    if (closeTimer.current !== null) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  useEffect(() => () => cancelPendingClose(), []);
  useEffect(() => {
    if (!open) {
      if (restoreFocus.current)
        triggerRef.current?.focus({ preventScroll: true });
      restoreFocus.current = false;
      return;
    }
    containerRef.current
      ?.querySelector<HTMLButtonElement>('button[aria-pressed="true"]')
      ?.focus({ preventScroll: true });
    const close = (shouldRestore: boolean) => {
      cancelPendingClose();
      restoreFocus.current = shouldRestore;
      setOpen(false);
    };
    const outside = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        const target = event.target instanceof Element ? event.target : null;
        close(!target?.closest("button,a,input,textarea,select,[tabindex]"));
      }
    };
    const keyboard = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        close(true);
      }
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", keyboard, true);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", keyboard, true);
    };
  }, [open]);

  const activeItem = items.find((i) => i.id === active);
  const ActiveIcon = activeItem ? activeItem.icon : FaTasks;

  const handleSelect = (id: string) => {
    cancelPendingClose();
    setActive(id);

    closeTimer.current = setTimeout(() => {
      closeTimer.current = null;
      restoreFocus.current = true;
      setOpen(false);
      onChange?.(id);
    }, 320);
  };

  return (
    <div
      ref={containerRef}
      className="filter-disclosure relative flex h-[70px] w-[300px] items-center justify-center"
    >
      <MotionConfig
        transition={{
          type: "spring",
          bounce: 0,
          duration: 0.7,
        }}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {open ? (
            <motion.div
              key="open"

              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{
                opacity: 0,
                transition: { duration: 0 },
              }}
              style={{ transformOrigin: "50% 100%", borderRadius: 32 }}
              className="absolute z-20 flex w-[300px] flex-col gap-[4px] overflow-hidden rounded-2xl border-[1.6px] border-[#E5E5E9] bg-[#FEFEFE] p-[8px] shadow-[0_12px_40px_rgba(0,0,0,0.08)] will-change-transform dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
            >
              {items.map((item, index) => {
                const Icon = item.icon;
                const selected = active === item.id;

                return (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => handleSelect(item.id)}
                    whileTap={{ scale: 0.98 }}
                    transition={{ ...SPRING, delay: (3 + index) * 0.05 }}
                    className="flex w-full cursor-pointer items-center justify-between rounded-[16px] px-[12px] py-[10px] transition-colors hover:bg-[#F6F5FA] dark:hover:bg-neutral-800/60"
                  >
                    <div className="flex items-center gap-[28px]">
                      <Icon className="h-[24px] w-[24px] text-[#AFAEB9] dark:text-neutral-500" />
                      <span className="text-[18px] font-bold tracking-tight text-[#535257] dark:text-neutral-200">
                        {item.label}
                      </span>
                    </div>

                    <motion.div
                      animate={{
                        backgroundColor: selected ? "#31C051" : "rgba(0,0,0,0)",
                      }}
                      className={`flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full border-[3px] ${selected ? "border-[#31C051]" : "border-[#ADADB2] dark:border-neutral-700"} `}
                    >
                      <motion.div
                        animate={{
                          scale: selected ? 1 : 0,
                          opacity: selected ? 1 : 0,
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 520,
                          damping: 30,
                        }}
                      >
                        <BsCheckLg className="h-[16px] w-[16px] text-white" />
                      </motion.div>
                    </motion.div>
                  </motion.button>
                );
              })}
            </motion.div>
          ) : (
            <div key="close" className="flex items-center">
              <motion.button
                ref={triggerRef}

                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0 },
                }}
                type="button"
                aria-label={label}
                aria-expanded={open}
                onClick={() => setOpen(true)}
                whileHover={{ scale: 1 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  borderRadius: 32,
                }}
                className="z-30 flex h-[60px] w-[60px] cursor-pointer items-center justify-center rounded-full border-[1.6px] border-[#E5E5E9] bg-[#FEFEFE] shadow-xs will-change-transform dark:border-neutral-800 dark:bg-neutral-900"
              >
                <PiFunnelSimpleBold className="h-[30px] w-[30px] text-[#272729] dark:text-neutral-100" />
              </motion.button>

              <motion.div
                initial={false}
                animate={{ x: 0 }}
                transition={{
                  type: "spring",
                  bounce: 0,
                  duration: 1.2,
                }}
                className="z-10 -ml-[12px] flex h-[60px] w-[60px] items-center justify-center rounded-full border-[1.6px] border-[#E5E5E9] bg-[#FEFEFE] opacity-80 shadow-xs dark:border-neutral-800 dark:bg-neutral-900"
              >
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.div
                    key={active}
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.6 }}
                  >
                    <ActiveIcon className="h-[24px] w-[24px] text-[#AFAEB9] dark:text-neutral-500" />
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </MotionConfig>
    </div>
  );
};
