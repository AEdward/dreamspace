"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { query } from "@/lib/db";

function readFields(formData: FormData) {
  return {
    name: String(formData.get("name") ?? "").trim(),
    sort_order: Number(formData.get("sort_order") ?? 0),
    logo_url: String(formData.get("logo_url") ?? "").trim() || null,
    url: String(formData.get("url") ?? "").trim() || null,
  };
}

export async function createPartner(_prevState: string | null, formData: FormData): Promise<string | null> {
  const f = readFields(formData);
  await query("INSERT INTO partners (name, sort_order, logo_url, url) VALUES (?, ?, ?, ?)", [
    f.name,
    f.sort_order,
    f.logo_url,
    f.url,
  ]);
  revalidatePath("/");
  revalidatePath("/admin/partners");
  redirect("/admin/partners");
}

export async function updatePartner(id: number, _prevState: string | null, formData: FormData): Promise<string | null> {
  const f = readFields(formData);
  await query("UPDATE partners SET name = ?, sort_order = ?, logo_url = ?, url = ? WHERE id = ?", [
    f.name,
    f.sort_order,
    f.logo_url,
    f.url,
    id,
  ]);
  revalidatePath("/");
  revalidatePath("/admin/partners");
  return "Saved.";
}

export async function deletePartner(id: number): Promise<void> {
  await query("DELETE FROM partners WHERE id = ?", [id]);
  revalidatePath("/");
  revalidatePath("/admin/partners");
}
