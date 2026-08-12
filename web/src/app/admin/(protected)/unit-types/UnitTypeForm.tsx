"use client";

import { useActionState } from "react";

const inputClass =
  "mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#07283b] focus:outline-none";
const labelClass = "block text-sm font-medium text-slate-700";

interface UnitTypeFormValues {
  name: string;
  sort_order: number;
  sqm: number;
  bedrooms: number;
  bathrooms: number;
  down_payment: number;
  service_fee: number;
  monthly_savings: number;
  monthly_service_fee: number;
  final_service_fee_after_draw: number;
  total_construction_cost: number;
  currency: string;
  image_url: string | null;
}

export function UnitTypeForm({
  initial,
  action,
  submitLabel,
}: {
  initial?: UnitTypeFormValues;
  action: (prevState: string | null, formData: FormData) => Promise<string | null>;
  submitLabel: string;
}) {
  const [message, formAction, pending] = useActionState(action, null);

  return (
    <form action={formAction} className="mt-6 max-w-2xl space-y-5 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <label className={labelClass}>
        Name
        <input name="name" defaultValue={initial?.name} required className={inputClass} placeholder="e.g. 1 Bed Room" />
      </label>

      <div className="grid grid-cols-3 gap-4">
        <label className={labelClass}>
          Sqm
          <input name="sqm" type="number" step="0.01" defaultValue={initial?.sqm} required className={inputClass} />
        </label>
        <label className={labelClass}>
          Bedrooms
          <input name="bedrooms" type="number" defaultValue={initial?.bedrooms} required className={inputClass} />
        </label>
        <label className={labelClass}>
          Bathrooms
          <input name="bathrooms" type="number" defaultValue={initial?.bathrooms} required className={inputClass} />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <label className={labelClass}>
          Down payment
          <input name="down_payment" type="number" step="0.01" defaultValue={initial?.down_payment} required className={inputClass} />
        </label>
        <label className={labelClass}>
          Service fee
          <input name="service_fee" type="number" step="0.01" defaultValue={initial?.service_fee} required className={inputClass} />
        </label>
        <label className={labelClass}>
          Monthly savings
          <input name="monthly_savings" type="number" step="0.01" defaultValue={initial?.monthly_savings} required className={inputClass} />
        </label>
        <label className={labelClass}>
          Monthly service fee
          <input name="monthly_service_fee" type="number" step="0.01" defaultValue={initial?.monthly_service_fee} required className={inputClass} />
        </label>
        <label className={labelClass}>
          Final service fee after draw
          <input
            name="final_service_fee_after_draw"
            type="number"
            step="0.01"
            defaultValue={initial?.final_service_fee_after_draw}
            required
            className={inputClass}
          />
        </label>
        <label className={labelClass}>
          Total construction cost
          <input
            name="total_construction_cost"
            type="number"
            step="0.01"
            defaultValue={initial?.total_construction_cost}
            required
            className={inputClass}
          />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <label className={labelClass}>
          Currency
          <input name="currency" defaultValue={initial?.currency ?? "Birr"} className={inputClass} />
        </label>
        <label className={labelClass}>
          Sort order
          <input name="sort_order" type="number" defaultValue={initial?.sort_order ?? 0} className={inputClass} />
        </label>
      </div>

      <label className={labelClass}>
        Image URL
        <input name="image_url" defaultValue={initial?.image_url ?? ""} className={inputClass} />
      </label>

      {message && <p className="text-sm text-emerald-600">{message}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-[#07283b] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#0a3550] disabled:opacity-60"
      >
        {pending ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}
