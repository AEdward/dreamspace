"use client";

import { motion } from "framer-motion";

export function StatsSection({ stats }: { stats: { value: string; label: string }[] }) {
  if (stats.length === 0) return null;

  return (
    <section className="bg-[#07283b] py-20 text-white">
      <div className="mx-auto max-w-7xl px-6">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center text-sm font-semibold uppercase tracking-wide text-white/60"
        >
          Important information
        </motion.h2>

        <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="text-center"
            >
              <p className="text-4xl font-bold text-[#f4600a]">{stat.value}</p>
              <p className="mt-2 text-sm text-white/70">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
