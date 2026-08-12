"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { query } from "@/lib/db";

function readFields(formData: FormData) {
  return {
    title: String(formData.get("title") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    sort_order: Number(formData.get("sort_order") ?? 0),
  };
}

export async function createValueProp(_prevState: string | null, formData: FormData): Promise<string | null> {
  const fields = readFields(formData);
  await query("INSERT INTO value_props (title, description, sort_order) VALUES (?, ?, ?)", [
    fields.title,
    fields.description,
    fields.sort_order,
  ]);
  revalidatePath("/");
  revalidatePath("/admin/value-props");
  redirect("/admin/value-props");
}

export async function updateValueProp(id: number, _prevState: string | null, formData: FormData): Promise<string | null> {
  const fields = readFields(formData);
  await query("UPDATE value_props SET title = ?, description = ?, sort_order = ? WHERE id = ?", [
    fields.title,
    fields.description,
    fields.sort_order,
    id,
  ]);
  revalidatePath("/");
  revalidatePath("/admin/value-props");
  return "Saved.";
}

export async function deleteValueProp(id: number): Promise<void> {
  await query("DELETE FROM value_props WHERE id = ?", [id]);
  revalidatePath("/");
  revalidatePath("/admin/value-props");
}
