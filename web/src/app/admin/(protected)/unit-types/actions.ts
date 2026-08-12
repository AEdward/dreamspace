"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { query } from "@/lib/db";

function readFields(formData: FormData) {
  const num = (key: string) => Number(formData.get(key) ?? 0);
  return {
    name: String(formData.get("name") ?? "").trim(),
    sort_order: num("sort_order"),
    sqm: num("sqm"),
    bedrooms: num("bedrooms"),
    bathrooms: num("bathrooms"),
    down_payment: num("down_payment"),
    service_fee: num("service_fee"),
    monthly_savings: num("monthly_savings"),
    monthly_service_fee: num("monthly_service_fee"),
    final_service_fee_after_draw: num("final_service_fee_after_draw"),
    total_construction_cost: num("total_construction_cost"),
    currency: String(formData.get("currency") ?? "Birr").trim() || "Birr",
    image_url: String(formData.get("image_url") ?? "").trim() || null,
  };
}

export async function createUnitType(_prevState: string | null, formData: FormData): Promise<string | null> {
  const f = readFields(formData);
  await query(
    `INSERT INTO unit_types
      (name, sort_order, sqm, bedrooms, bathrooms, down_payment, service_fee, monthly_savings,
       monthly_service_fee, final_service_fee_after_draw, total_construction_cost, currency, image_url)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      f.name,
      f.sort_order,
      f.sqm,
      f.bedrooms,
      f.bathrooms,
      f.down_payment,
      f.service_fee,
      f.monthly_savings,
      f.monthly_service_fee,
      f.final_service_fee_after_draw,
      f.total_construction_cost,
      f.currency,
      f.image_url,
    ]
  );
  revalidatePath("/");
  revalidatePath("/admin/unit-types");
  redirect("/admin/unit-types");
}

export async function updateUnitType(id: number, _prevState: string | null, formData: FormData): Promise<string | null> {
  const f = readFields(formData);
  await query(
    `UPDATE unit_types SET
      name = ?, sort_order = ?, sqm = ?, bedrooms = ?, bathrooms = ?, down_payment = ?, service_fee = ?,
      monthly_savings = ?, monthly_service_fee = ?, final_service_fee_after_draw = ?, total_construction_cost = ?,
      currency = ?, image_url = ?
     WHERE id = ?`,
    [
      f.name,
      f.sort_order,
      f.sqm,
      f.bedrooms,
      f.bathrooms,
      f.down_payment,
      f.service_fee,
      f.monthly_savings,
      f.monthly_service_fee,
      f.final_service_fee_after_draw,
      f.total_construction_cost,
      f.currency,
      f.image_url,
      id,
    ]
  );
  revalidatePath("/");
  revalidatePath("/admin/unit-types");
  return "Saved.";
}

export async function deleteUnitType(id: number): Promise<void> {
  await query("DELETE FROM unit_types WHERE id = ?", [id]);
  revalidatePath("/");
  revalidatePath("/admin/unit-types");
}
