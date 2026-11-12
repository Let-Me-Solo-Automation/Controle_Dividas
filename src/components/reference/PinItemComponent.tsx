import { MotionProgress } from "../nexo-ui";
import React, { useState } from "react";
import {
  motion,
  AnimatePresence,
  MotionConfig,
  type Transition,
} from "motion/react";
import { Pin } from "lucide-react";
import { IoFastFood } from "react-icons/io5";
import {
  FaChargingStation,
  FaPills,
  FaSailboat,
  FaUtensils,
} from "react-icons/fa6";

export type PlaceItem = {
  id: number | string;
  name: string;
  type: string;
  status: string;
  subtitle?: string;
  amount?: string;
  progress?: number;
  icon: React.ComponentType<{ size?: number }>;
  pinned?: boolean;
  action?: () => void;
};

const INITIAL_PLACES: PlaceItem[] = [
  {
    id: 1,
    name: "Harbor Bay Marina",
    type: "Marina",
    status: "Closes 7:00 PM",
    icon: IoFastFood,
    pinned: false,
  },
  {
    id: 2,
    name: "Mocha Brew",
    type: "Cafe",
    status: "Closes 9:00 PM",
    icon: FaSailboat,
    pinned: false,
  },
  {
    id: 3,
    name: "Olive Bistro",
    type: "Restaurant",
    status: "Closes 11:00 PM",
    icon: FaUtensils,
    pinned: false,
  },
  {
    id: 4,
    name: "GreenVolt Hub",
    type: "EV Charger",
    status: "Open 24 hours",
    icon: FaChargingStation,
    pinned: false,
  },
  {
    id: 5,
    name: "CarePlus Pharmacy",
    type: "Pharmacy",
    status: "Open 24 hours",
    icon: FaPills,
    pinned: false,
  },
];

const springConfig: Transition = {
  type: "spring",
  stiffness: 400,
  damping: 40,
};

type PinItemComponentProps = {
  items?: PlaceItem[];
  onPinChange?: (id: number | string, pinned: boolean) => void;
};

export const PinItemComponent = ({
  items = INITIAL_PLACES,
  onPinChange,
}: PinItemComponentProps) => {
  const [localPlaces, setPlaces] = useState<PlaceItem[]>(
    items.map((p) => ({ ...p, pinned: p.pinned ?? false })),
  );

  const places = onPinChange ? items : localPlaces;
  const togglePin = (id: number | string) => {
    if (onPinChange) {
      onPinChange(id, !places.find((place) => place.id === id)?.pinned);
      return;
    }
    setPlaces((prev) =>
      prev.map((place) =>
        place.id === id ? { ...place, pinned: !place.pinned } : place,
      ),
    );
  };

  const pinnedPlaces = places.filter((p) => p.pinned);
  const unpinnedPlaces = places.filter((p) => !p.pinned);

  return (
    <div className="pin-items w-full max-w-[355px] space-y-6">
      <MotionConfig transition={springConfig}>
        <AnimatePresence mode="popLayout" initial={false}>
          {pinnedPlaces.length > 0 && (
            <motion.div
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              <motion.h3
                layout
                className="ml-1 text-[14px] font-semibold tracking-wider text-[#ADACB8] dark:text-neutral-500"
              >
                Fixadas
              </motion.h3>
              <div className="space-y-2">
                {pinnedPlaces.map((place) => (
                  <PlaceCard
                    key={place.id}
                    place={place}
                    onToggle={togglePin}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div layout className="space-y-3">
          <motion.h3
            layout
            className="ml-1 text-[14px] font-semibold tracking-wider text-[#ADACB8] dark:text-neutral-500"
          >
            {pinnedPlaces.length ? "Outras seções" : "Suas seções"}
          </motion.h3>
          <div className="space-y-3">
            {unpinnedPlaces.map((place) => (
              <PlaceCard key={place.id} place={place} onToggle={togglePin} />
            ))}
          </div>
        </motion.div>
      </MotionConfig>
    </div>
  );
};

const PlaceCard = ({
  place,
  onToggle,
}: {
  place: PlaceItem;
  onToggle: (id: number | string) => void;
}) => {
  const Icon = place.icon;

  return (
    <motion.div
      layoutId={`card-${place.id}`}
      transition={springConfig}
      className="pin-item group relative flex cursor-default items-center justify-between gap-2.5 rounded-2xl border border-gray-100 bg-[#F6F5FA] p-2.5 shadow-xs transition-shadow hover:shadow-sm sm:p-3 dark:border-neutral-800 dark:bg-neutral-900"
    >
      <button
        type="button"
        onClick={place.action}
        className="pin-item-open flex min-w-0 flex-1 items-center gap-3 text-left"
      >
        <motion.div
          layout
          className="pin-item-icon flex h-10 w-10 items-center justify-center rounded-xl bg-[#FEFEFE] text-[#AEADB9] dark:bg-neutral-800 dark:text-neutral-400"
        >
          <Icon size={22} />
        </motion.div>

        <motion.div layout className="pin-item-copy">
          <div className="pin-item-heading">
            <h4 className="text-base leading-tight font-bold text-[#27272B] dark:text-neutral-100">
              {place.name}
            </h4>
            {place.amount !== undefined && (
              <strong className="pin-item-amount">{place.amount}</strong>
            )}
          </div>
          <p className="mt-0.5 max-w-[180px] truncate text-[14px] font-semibold text-[#87868D] sm:max-w-none dark:text-neutral-400">
            {place.type}
            {place.subtitle
              ? ` · ${place.subtitle}`
              : place.amount === undefined
                ? ` • ${place.status}`
                : ""}
          </p>
          {place.progress !== undefined && <MotionProgress value={place.progress} label={`Quitação de ${place.name}`} />}
        </motion.div>
      </button>

      <motion.button
        layout
        type="button"
        aria-label={`${place.pinned ? "Desafixar" : "Fixar"} ${place.name}`}
        aria-pressed={!!place.pinned}
        onClick={() => onToggle(place.id)}
        className={`pin-item-toggle relative z-10 flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300 ${
          place.pinned
            ? "bg-yellow-400 text-white opacity-100"
            : "bg-[#CDCCD5] text-[#fefefe] opacity-70 group-hover:opacity-100 dark:bg-neutral-700 dark:text-neutral-400"
        }`}
      >
        <Pin size={16} className="fill-white" />
      </motion.button>
    </motion.div>
  );
};
