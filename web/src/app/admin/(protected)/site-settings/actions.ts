"use server";

import { revalidatePath } from "next/cache";
import { query } from "@/lib/db";

export async function updateSiteSettings(_prevState: string | null, formData: FormData): Promise<string | null> {
  const get = (key: string) => String(formData.get(key) ?? "").trim();

  const existing = await query<{ id: number }[]>("SELECT id FROM site_settings LIMIT 1");

  const values = [
    get("site_name"),
    get("hero_headline"),
    get("hero_subheadline") || null,
    get("hero_image_url") || null,
    get("logo_url") || null,
    get("phone"),
    get("email"),
    get("secondary_email") || null,
    get("register_cta_label"),
    get("appointment_cta_label"),
    formData.get("popup_enabled") ? 1 : 0,
    get("popup_headline"),
    get("footer_credit"),
    formData.get("stats_enabled") ? 1 : 0,
    get("stat1_value"),
    get("stat1_label"),
    get("stat2_value"),
    get("stat2_label"),
    get("stat3_value"),
    get("stat3_label"),
    get("stat4_value"),
    get("stat4_label"),
    formData.get("maintenance_mode") ? 1 : 0,
    get("about_heading") || null,
    get("about_body") || null,
    get("contact_heading"),
    get("contact_intro") || null,
  ];

  if (existing[0]) {
    await query(
      `UPDATE site_settings SET
        site_name = ?, hero_headline = ?, hero_subheadline = ?, hero_image_url = ?, logo_url = ?,
        phone = ?, email = ?, secondary_email = ?, register_cta_label = ?, appointment_cta_label = ?,
        popup_enabled = ?, popup_headline = ?, footer_credit = ?,
        stats_enabled = ?, stat1_value = ?, stat1_label = ?, stat2_value = ?, stat2_label = ?,
        stat3_value = ?, stat3_label = ?, stat4_value = ?, stat4_label = ?, maintenance_mode = ?,
        about_heading = ?, about_body = ?, contact_heading = ?, contact_intro = ?
       WHERE id = ?`,
      [...values, existing[0].id]
    );
  } else {
    await query(
      `INSERT INTO site_settings
        (site_name, hero_headline, hero_subheadline, hero_image_url, logo_url, phone, email, secondary_email,
         register_cta_label, appointment_cta_label, popup_enabled, popup_headline, footer_credit,
         stats_enabled, stat1_value, stat1_label, stat2_value, stat2_label, stat3_value, stat3_label,
         stat4_value, stat4_label, maintenance_mode, about_heading, about_body, contact_heading, contact_intro)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      values
    );
  }

  // "layout" scope so every page under the public (site) route group picks
  // up the change immediately (maintenance mode, header/footer edits, etc.)
  // instead of waiting out the 60s ISR window.
  revalidatePath("/", "layout");
  revalidatePath("/admin/site-settings");
  return "Saved.";
}
