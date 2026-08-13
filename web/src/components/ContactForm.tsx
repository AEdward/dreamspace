"use client";

import { useActionState } from "react";
import { submitBooking } from "@/app/actions/bookings";
import type { Dictionary } from "@/lib/i18n/dictionaries";

const inputClass =
  "mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#07283b] focus:outline-none";
const labelClass = "block text-sm font-medium text-slate-700";

export function ContactForm({
  source,
  dict,
  submitLabel,
  messageLabel,
  messagePlaceholder,
}: {
  source: "booking" | "contact";
  dict: Dictionary;
  submitLabel?: string;
  messageLabel?: string;
  messagePlaceholder?: string;
}) {
  const action = submitBooking.bind(null, source);
  const [message, formAction, pending] = useActionState(action, null);

  if (message === "success") {
    return (
      <div className="rounded-2xl bg-slate-50 p-6 text-center ring-1 ring-slate-200">
        <p className="text-lg font-semibold text-[#07283b]">{dict.form.thanksTitle}</p>
        <p className="mt-2 text-sm text-slate-500">{dict.form.thanksBody}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <label className={labelClass}>
        {dict.form.fullName}
        <input name="full_name" required className={inputClass} />
      </label>
      <label className={labelClass}>
        {dict.form.phone}
        <input name="phone" required className={inputClass} />
      </label>
      <label className={labelClass}>
        {dict.form.email}
        <input name="email" type="email" className={inputClass} />
      </label>
      <label className={labelClass}>
        {messageLabel ?? dict.form.message}
        <textarea name="message" rows={3} placeholder={messagePlaceholder} className={inputClass} />
      </label>

      {message && message !== "success" && <p className="text-sm text-red-600">{message}</p>}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-[#f4600a] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#d8540a] disabled:opacity-60"
      >
        {pending ? dict.form.sending : (submitLabel ?? dict.form.send)}
      </button>
    </form>
  );
}
