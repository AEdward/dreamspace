"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { ResultSetHeader } from "mysql2";
import { query } from "@/lib/db";

function readFields(formData: FormData) {
  const phones = String(formData.get("phones") ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return {
    name: String(formData.get("name") ?? "").trim(),
    sort_order: Number(formData.get("sort_order") ?? 0),
    address: String(formData.get("address") ?? "").trim(),
    is_construction_site: formData.get("is_construction_site") ? 1 : 0,
    phones,
  };
}

export async function createOffice(_prevState: string | null, formData: FormData): Promise<string | null> {
  const f = readFields(formData);
  const result = await query<ResultSetHeader>(
    "INSERT INTO offices (name, sort_order, address, is_construction_site) VALUES (?, ?, ?, ?)",
    [f.name, f.sort_order, f.address, f.is_construction_site]
  );
  const officeId = result.insertId;
  for (let i = 0; i < f.phones.length; i++) {
    await query("INSERT INTO office_phones (office_id, number, sort_order) VALUES (?, ?, ?)", [officeId, f.phones[i], i]);
  }
  revalidatePath("/");
  revalidatePath("/admin/offices");
  redirect("/admin/offices");
}

export async function updateOffice(id: number, _prevState: string | null, formData: FormData): Promise<string | null> {
  const f = readFields(formData);
  await query("UPDATE offices SET name = ?, sort_order = ?, address = ?, is_construction_site = ? WHERE id = ?", [
    f.name,
    f.sort_order,
    f.address,
    f.is_construction_site,
    id,
  ]);
  await query("DELETE FROM office_phones WHERE office_id = ?", [id]);
  for (let i = 0; i < f.phones.length; i++) {
    await query("INSERT INTO office_phones (office_id, number, sort_order) VALUES (?, ?, ?)", [id, f.phones[i], i]);
  }
  revalidatePath("/");
  revalidatePath("/admin/offices");
  return "Saved.";
}

export async function deleteOffice(id: number): Promise<void> {
  await query("DELETE FROM offices WHERE id = ?", [id]);
  revalidatePath("/");
  revalidatePath("/admin/offices");
}
