import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Loader2 } from "lucide-react";
import { FaMap } from "react-icons/fa6";

interface ViewOnMapProps {
  locationName?: string;
  address?: string;
  mapImageUrl?: string;
  className?: string;
}

export const ViewOnMap: React.FC<ViewOnMapProps> = ({
  address = "Boston Public Garden",
  mapImageUrl = "",
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [isDark] = useState(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
    if (isOpen) setIsMapLoaded(false);
  };

  const springConfig = {
    type: "spring" as const,
    stiffness: 400,
    damping: 30,
    mass: 0.8,
  };

  const publicMapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(address)}&t=&z=16&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className={`transition-colors duration-500`}>
      <div
        className={`flex min-h-full w-full flex-col items-center justify-center bg-transparent px-4`}
      >
        <div
          className={`relative flex w-full items-center justify-center ${className}`}
        >
          <AnimatePresence mode="popLayout">
            {!isOpen ? (
              /* --- PILL BUTTON --- */
              <motion.div
                key="button"
                layoutId="map-container"
                onClick={toggleOpen}
                className="group relative flex cursor-pointer items-center justify-center overflow-hidden bg-[#E5E4EE] shadow-sm transition-colors duration-300 dark:bg-[#1C1C1E]"
                style={{ width: 180, height: 52, borderRadius: 26 }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={springConfig}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  layoutId="map-bg"
                  className="absolute inset-0 opacity-20 brightness-110 grayscale transition-opacity dark:opacity-10 dark:brightness-50"
                  style={{
                    backgroundImage: `url(${mapImageUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />

                <motion.div className="relative z-10 flex items-center space-x-3 px-4 py-4">
                  <FaMap className="h-5 w-5 text-[#6A6973] transition-colors dark:text-white/60" />
                  <span className="text-[18px] font-semibold tracking-tight text-[#3D3C43] transition-colors dark:text-white">
                    View on Map
                  </span>
                </motion.div>
              </motion.div>
            ) : (
              /* --- EXPANDED MAP --- */
              <motion.div
                key="map"
                layoutId="map-container"
                className="relative aspect-square w-[calc(100vw-64px)] overflow-hidden bg-[#DEDEDE] shadow-lg transition-colors duration-300 sm:w-[380px] dark:bg-[#141414]"
                style={{ borderRadius: 32 }}
                transition={springConfig}
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.15 }}
                  className="absolute inset-0 h-full w-full brightness-[1.02] contrast-[1.05] grayscale-[0.9] saturate-[0.8] sepia-[0.1]"
                >
                  <iframe
                    title="Mapa ilustrativo de demonstração"
                    width="100%"
                    height="100%"
                    style={{
                      border: 0,
                      filter: isDark
                        ? "invert(90%) hue-rotate(180deg)"
                        : "invert(15%) hue-rotate(180deg)",
                    }}
                    srcDoc={`<!doctype html><html><body style="margin:0;background:#e5eadf;overflow:hidden;font-family:system-ui"><svg viewBox="0 0 400 400" width="100%" height="100%"><path d="M0 70H400M0 180H400M0 290H400M65 0V400M180 0V400M295 0V400" stroke="#fafbf7" stroke-width="20"/><path d="M0 340Q150 250 400 360" stroke="#aed2cd" stroke-width="55" fill="none"/><rect x="83" y="95" width="70" height="60" rx="14" fill="#bccfac"/><circle cx="200" cy="200" r="35" fill="#148570" opacity=".15"/><circle cx="200" cy="200" r="12" fill="#148570" stroke="white" stroke-width="4"/></svg><p style="position:absolute;bottom:20px;left:0;right:0;text-align:center;font-size:12px;color:#52694f">Mapa ilustrativo · sem geolocalização</p></body></html>`}
                    allowFullScreen
                    onLoad={() => setIsMapLoaded(true)}
                    className={`transition-opacity duration-700 ${isMapLoaded ? "opacity-100" : "opacity-0"}`}
                  />
                </motion.div>

                {!isMapLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-[#E5E5E7] transition-colors dark:bg-[#1C1C1E]">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                  </div>
                )}

                {/* CLOSE BUTTON  */}
                <motion.button
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={toggleOpen}
                  aria-label="Fechar mapa"
                  className="absolute top-4 right-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#85848B] shadow-lg transition-all hover:bg-gray-50 active:scale-90 sm:top-6 sm:right-6 sm:h-11 sm:w-11 dark:bg-[#2A2A2D] dark:text-white dark:hover:bg-[#3A3A3D]"
                >
                  <X className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={3} />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
