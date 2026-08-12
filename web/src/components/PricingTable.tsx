import type { UnitType } from "@/lib/types";
import { formatCurrency } from "@/lib/format";

export function PricingTable({ units }: { units: UnitType[] }) {
  if (units.length === 0) return null;

  return (
    <section className="bg-slate-50 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-center text-3xl font-bold text-[#07283b]">Types and distribution of houses</h2>

        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          {units.map((unit) => (
            <div key={unit.id} className="flex flex-col rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
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
