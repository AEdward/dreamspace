"use client";

import { motion } from "framer-motion";
import type { UnitType } from "@/lib/types";
import { formatCurrency } from "@/lib/format";
import { UnitModelLoader } from "@/components/three/UnitModelLoader";

export function PricingTable({ units }: { units: UnitType[] }) {
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
          <h2 className="text-3xl font-bold tracking-tight text-[#07283b] sm:text-4xl">
            Types and distribution of houses
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-slate-500">
            Drag to rotate each model and explore the scale of every unit type.
          </p>
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
                <UnitModelLoader sqm={unit.sqm} bedrooms={unit.bedrooms} bathrooms={unit.bathrooms} />
              </div>

              <div className="flex flex-1 flex-col p-8">
                <h3 className="text-xl font-bold text-[#07283b]">{unit.name}</h3>
                <p className="mt-1 text-sm text-slate-500">
                  {unit.sqm} Sqm &middot; {unit.bedrooms} Beds &middot; {unit.bathrooms} Baths
                </p>

                <dl className="mt-6 space-y-3 text-sm">
                  <Row label="Down payment" value={formatCurrency(unit.downPayment, unit.currency)} />
                  <Row label="Service fee" value={formatCurrency(unit.serviceFee, unit.currency)} />
                  <Row label="Monthly savings" value={formatCurrency(unit.monthlySavings, unit.currency)} />
                  <Row
                    label="Monthly service fee"
                    value={formatCurrency(unit.monthlyServiceFee, unit.currency)}
                  />
                  <Row
                    label="Final service fee after the draw"
                    value={formatCurrency(unit.finalServiceFeeAfterDraw, unit.currency)}
                  />
                </dl>

                <div className="mt-6 border-t border-slate-200 pt-4 text-sm font-semibold text-[#07283b]">
                  Total construction cost: {formatCurrency(unit.totalConstructionCost, unit.currency)}
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
