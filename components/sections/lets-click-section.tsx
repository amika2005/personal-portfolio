"use client"

import { motion } from "framer-motion"

export function LetsClickSection() {
  return (
    <section className="relative overflow-hidden bg-white dark:bg-gray-950 text-gray-900 dark:text-white pt-8 sm:pt-10 lg:pt-12 pb-3 sm:pb-5 lg:pb-6">
      <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-12 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-black leading-tight tracking-tight"
          style={{ color: "#f97066", fontFamily: "'Teko', sans-serif" }}
        >
          LET&apos;S MAKE
          <br />
          THINGS CLICK
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mt-2 text-xl sm:text-2xl lg:text-3xl font-medium text-gray-700 dark:text-gray-200 leading-none tracking-wide uppercase"
          style={{ fontFamily: "'Teko', sans-serif" }}
        >
          I am currently available
          <br />
          and actively looking for new opportunities
        </motion.p>
      </div>
    </section>
  )
}
