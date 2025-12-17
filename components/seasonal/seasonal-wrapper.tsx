"use client"

import { useSeason } from "./seasonal-manager"
import { SnowEffect } from "./snow-effect"
import { FireworksEffect } from "./fireworks-effect"
import { AnimatePresence, motion } from "framer-motion"

export function SeasonalWrapper() {
  const season = useSeason()

  return (
    <>
        <AnimatePresence>
            {season === "christmas" && (
                <motion.div
                    key="snow"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 2 }}
                >
                    <SnowEffect />
                </motion.div>
            )}
             {season === "new-year" && (
                <motion.div
                    key="fireworks"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                >
                    <FireworksEffect />
                </motion.div>
            )}
             {/* Avurudu and Vesak global effects can be added here if needed */}
        </AnimatePresence>
    </>
  )
}
