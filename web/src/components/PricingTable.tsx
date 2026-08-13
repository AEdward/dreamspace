"use client";

import { motion } from "framer-motion";
import type { UnitType } from "@/lib/types";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { formatCurrency } from "@/lib/format";
import { UnitModelLoader } from "@/components/three/UnitModelLoader";

export function PricingTable({ units, dict }: { units: UnitType[]; dict: Dictionary }) {
  if (units.length === 0) return null;

  return (
    <section className="bg-slate-50 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-[#07283b] sm:text-4xl">{dict.pricing.heading}</h2>
          <p className="mx-auto mt-3 max-w-xl text-slate-500">{dict.pricing.sub}</p>
        </motion.div>

        <div className="mt-14 grid gap-8 lg:grid-cols-3">
          {units.map((unit, i) => (
            <motion.div
              key={unit.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: i * 0.08 }}
              className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition-shadow hover:shadow-xl"
            >
              <div className="relative h-56 shrink-0 bg-gradient-to-b from-slate-100 to-slate-50">
                <UnitModelLoader name={unit.name} sqm={unit.sqm} bedrooms={unit.bedrooms} bathrooms={unit.bathrooms} />
              </div>

              <div className="flex flex-1 flex-col p-8">
                <h3 className="text-xl font-bold text-[#07283b]">{unit.name}</h3>
                <p className="mt-1 text-sm text-slate-500">
                  {unit.sqm} {dict.pricing.sqm} &middot; {unit.bedrooms} {dict.pricing.beds} &middot; {unit.bathrooms}{" "}
                  {dict.pricing.baths}
                </p>

                <dl className="mt-6 space-y-3 text-sm">
                  <Row label={dict.pricing.downPayment} value={formatCurrency(unit.downPayment, unit.currency)} />
                  <Row label={dict.pricing.serviceFee} value={formatCurrency(unit.serviceFee, unit.currency)} />
                  <Row
                    label={dict.pricing.monthlySavings}
                    value={formatCurrency(unit.monthlySavings, unit.currency)}
                  />
                  <Row
                    label={dict.pricing.monthlyServiceFee}
                    value={formatCurrency(unit.monthlyServiceFee, unit.currency)}
                  />
                  <Row
                    label={dict.pricing.finalServiceFee}
                    value={formatCurrency(unit.finalServiceFeeAfterDraw, unit.currency)}
                  />
                </dl>

                <div className="mt-6 border-t border-slate-200 pt-4 text-sm font-semibold text-[#07283b]">
                  {dict.pricing.totalCost} {formatCurrency(unit.totalConstructionCost, unit.currency)}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-slate-500">{label}</dt>
      <dd className="font-medium text-[#07283b]">{value}</dd>
    </div>
  );
}
