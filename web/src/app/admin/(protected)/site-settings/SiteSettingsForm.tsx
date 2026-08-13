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
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
        <label className="flex items-center gap-2 text-sm font-semibold text-amber-900">
          <input
            type="checkbox"
            name="maintenance_mode"
            defaultChecked={settings?.maintenanceMode ?? false}
            className="h-4 w-4"
          />
          Maintenance mode
        </label>
        <p className="mt-1 text-xs text-amber-700">
          When on, every public page shows a maintenance screen instead of the site. This admin panel stays
          accessible so you can turn it back off.
        </p>
      </div>

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

      <div className="border-t border-slate-100 pt-5">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <input type="checkbox" name="stats_enabled" defaultChecked={settings?.statsEnabled ?? true} className="h-4 w-4" />
          Homepage stats section enabled
        </label>
        <p className="mt-1 text-xs text-slate-400">
          The &quot;Important information&quot; row of four numbers shown between the pricing table and the news
          section.
        </p>

        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="mt-4 grid grid-cols-2 gap-4">
            <label className={labelClass}>
              Stat {i + 1} value
              <input
                name={`stat${i + 1}_value`}
                defaultValue={settings?.stats[i]?.value ?? ""}
                className={inputClass}
              />
            </label>
            <label className={labelClass}>
              Stat {i + 1} label
              <input
                name={`stat${i + 1}_label`}
                defaultValue={settings?.stats[i]?.label ?? ""}
                className={inputClass}
              />
            </label>
          </div>
        ))}
      </div>

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
