"use client";

import { useActionState } from "react";
import { updateSiteSettings } from "./actions";
import type { SiteSettings } from "@/lib/types";

const inputClass =
  "mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#07283b] focus:outline-none";
const labelClass = "block text-sm font-medium text-slate-700";

export function SiteSettingsForm({ settings }: { settings: SiteSettings | null }) {
  const [message, formAction, pending] = useActionState(updateSiteSettings, null);

  return (
    <form action={formAction} className="mt-6 max-w-2xl space-y-5 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <label className={labelClass}>
        Site name
        <input name="site_name" defaultValue={settings?.siteName ?? "Dreamspace Realty"} required className={inputClass} />
      </label>

      <label className={labelClass}>
        Hero headline
        <input name="hero_headline" defaultValue={settings?.heroHeadline ?? ""} required className={inputClass} />
      </label>

      <label className={labelClass}>
        Hero subheadline
        <input name="hero_subheadline" defaultValue={settings?.heroSubheadline ?? ""} className={inputClass} />
      </label>

      <label className={labelClass}>
        Hero image URL
        <input name="hero_image_url" defaultValue={settings?.heroImageUrl ?? ""} className={inputClass} placeholder="/brand/hero.jpg or https://..." />
      </label>

      <label className={labelClass}>
        Logo URL
        <input name="logo_url" defaultValue={settings?.logoUrl ?? ""} className={inputClass} placeholder="/brand/logo.png or https://..." />
      </label>

      <div className="grid grid-cols-2 gap-4">
        <label className={labelClass}>
          Phone
          <input name="phone" defaultValue={settings?.phone ?? ""} required className={inputClass} />
        </label>
        <label className={labelClass}>
          Email
          <input name="email" type="email" defaultValue={settings?.email ?? ""} required className={inputClass} />
        </label>
      </div>

      <label className={labelClass}>
        Secondary email
        <input name="secondary_email" type="email" defaultValue={settings?.secondaryEmail ?? ""} className={inputClass} />
      </label>

      <div className="grid grid-cols-2 gap-4">
        <label className={labelClass}>
          Booking button label
          <input name="register_cta_label" defaultValue={settings?.registerCtaLabel ?? ""} className={inputClass} />
        </label>
        <label className={labelClass}>
          Appointment CTA label
          <input name="appointment_cta_label" defaultValue={settings?.appointmentCtaLabel ?? ""} className={inputClass} />
        </label>
      </div>

      <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
        <input type="checkbox" name="popup_enabled" defaultChecked={settings?.popupEnabled ?? true} className="h-4 w-4" />
        Registration popup enabled
      </label>

      <label className={labelClass}>
        Popup headline
        <input name="popup_headline" defaultValue={settings?.popupHeadline ?? ""} className={inputClass} />
      </label>

      <label className={labelClass}>
        Footer credit
        <input name="footer_credit" defaultValue={settings?.footerCredit ?? ""} className={inputClass} />
      </label>

      {message && <p className="text-sm text-emerald-600">{message}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-[#07283b] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#0a3550] disabled:opacity-60"
      >
        {pending ? "Saving..." : "Save"}
      </button>
    </form>
  );
}
