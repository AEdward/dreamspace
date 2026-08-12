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
  ];

  if (existing[0]) {
    await query(
      `UPDATE site_settings SET
        site_name = ?, hero_headline = ?, hero_subheadline = ?, hero_image_url = ?, logo_url = ?,
        phone = ?, email = ?, secondary_email = ?, register_cta_label = ?, appointment_cta_label = ?,
        popup_enabled = ?, popup_headline = ?, footer_credit = ?
       WHERE id = ?`,
      [...values, existing[0].id]
    );
  } else {
    await query(
      `INSERT INTO site_settings
        (site_name, hero_headline, hero_subheadline, hero_image_url, logo_url, phone, email, secondary_email,
         register_cta_label, appointment_cta_label, popup_enabled, popup_headline, footer_credit)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      values
    );
  }

  revalidatePath("/");
  revalidatePath("/admin/site-settings");
  return "Saved.";
}
