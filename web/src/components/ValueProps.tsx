"use client";

import { motion } from "framer-motion";
import type { ValueProp } from "@/lib/types";

export function ValueProps({ items }: { items: ValueProp[] }) {
  if (items.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.06 }}
            className="rounded-2xl border border-slate-200 p-7 transition-shadow hover:shadow-md"
          >
            <div className="h-1 w-10 rounded-full bg-[#f4600a]" />
            <h3 className="mt-5 text-lg font-semibold text-[#07283b]">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
