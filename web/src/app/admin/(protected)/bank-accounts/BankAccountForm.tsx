"use client";

import { useActionState } from "react";

const inputClass =
  "mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#07283b] focus:outline-none";
const labelClass = "block text-sm font-medium text-slate-700";

interface BankAccountFormValues {
  bank_name: string;
  registration_account: string;
  price_account: string;
  sort_order: number;
}

export function BankAccountForm({
  initial,
  action,
  submitLabel,
}: {
  initial?: BankAccountFormValues;
  action: (prevState: string | null, formData: FormData) => Promise<string | null>;
  submitLabel: string;
}) {
  const [message, formAction, pending] = useActionState(action, null);

  return (
    <form action={formAction} className="mt-6 max-w-xl space-y-5 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <label className={labelClass}>
        Bank name
        <input name="bank_name" defaultValue={initial?.bank_name} required className={inputClass} />
      </label>
      <label className={labelClass}>
        Registration & service fee account number
        <input
          name="registration_account"
          defaultValue={initial?.registration_account}
          required
          className={inputClass}
        />
      </label>
      <label className={labelClass}>
        Price payment account number
        <input name="price_account" defaultValue={initial?.price_account} required className={inputClass} />
      </label>
      <label className={labelClass}>
        Sort order
        <input name="sort_order" type="number" defaultValue={initial?.sort_order ?? 0} className={inputClass} />
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
