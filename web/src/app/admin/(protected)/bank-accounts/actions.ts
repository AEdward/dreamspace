"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { query } from "@/lib/db";

function readFields(formData: FormData) {
  return {
    bank_name: String(formData.get("bank_name") ?? "").trim(),
    registration_account: String(formData.get("registration_account") ?? "").trim(),
    price_account: String(formData.get("price_account") ?? "").trim(),
    sort_order: Number(formData.get("sort_order") ?? 0),
  };
}

export async function createBankAccount(_prevState: string | null, formData: FormData): Promise<string | null> {
  const f = readFields(formData);
  await query(
    "INSERT INTO bank_accounts (bank_name, registration_account, price_account, sort_order) VALUES (?, ?, ?, ?)",
    [f.bank_name, f.registration_account, f.price_account, f.sort_order]
  );
  revalidatePath("/");
  revalidatePath("/admin/bank-accounts");
  redirect("/admin/bank-accounts");
}

export async function updateBankAccount(
  id: number,
  _prevState: string | null,
  formData: FormData
): Promise<string | null> {
  const f = readFields(formData);
  await query(
    "UPDATE bank_accounts SET bank_name = ?, registration_account = ?, price_account = ?, sort_order = ? WHERE id = ?",
    [f.bank_name, f.registration_account, f.price_account, f.sort_order, id]
  );
  revalidatePath("/");
  revalidatePath("/admin/bank-accounts");
  return "Saved.";
}

export async function deleteBankAccount(id: number): Promise<void> {
  await query("DELETE FROM bank_accounts WHERE id = ?", [id]);
  revalidatePath("/");
  revalidatePath("/admin/bank-accounts");
}
