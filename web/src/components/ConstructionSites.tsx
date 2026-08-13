"use client";

import { motion } from "framer-motion";
import type { Office } from "@/lib/types";

export function ConstructionSites({ offices }: { offices: Office[] }) {
  const sites = offices.filter((office) => office.isConstructionSite);
  if (sites.length === 0) return null;

  return (
    <section className="bg-slate-50 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center text-3xl font-bold tracking-tight text-[#07283b] sm:text-4xl"
        >
          Construction sites
        </motion.h2>

        <div className="mt-14 grid gap-8 lg:grid-cols-3">
          {sites.map((site, i) => {
            const label = site.name.replace(" (Construction Site)", "");
            const query = encodeURIComponent(`${label}, ${site.address}, Ethiopia`);
            return (
              <motion.div
                key={site.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: i * 0.08 }}
                className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition-shadow hover:shadow-xl"
              >
                <div className="h-56 w-full bg-slate-100">
                  <iframe
                    src={`https://www.google.com/maps?q=${query}&output=embed`}
                    title={`Map of ${label}`}
                    loading="lazy"
                    className="h-full w-full border-0"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-[#07283b]">{label}</h3>
                  <p className="mt-1 text-sm text-slate-500">{site.address}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
