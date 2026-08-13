"use client";

import { motion } from "framer-motion";
import type { Partner } from "@/lib/types";
import type { Dictionary } from "@/lib/i18n/dictionaries";

export function PartnersStrip({ partners, dict }: { partners: Partner[]; dict: Dictionary }) {
  if (partners.length === 0) return null;

  return (
    <section className="border-y border-slate-200 bg-white py-16">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-center text-sm font-semibold uppercase tracking-wide text-slate-500">
          {dict.sections.partners}
        </h2>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-10"
        >
          {partners.map((partner) =>
            partner.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={partner.id}
                src={partner.logoUrl}
                alt={partner.name}
                className="h-12 w-auto object-contain grayscale transition-all hover:grayscale-0"
              />
            ) : (
              <span key={partner.id} className="text-lg font-semibold text-[#07283b]">
                {partner.name}
              </span>
            )
          )}
        </motion.div>
      </div>
    </section>
  );
}
