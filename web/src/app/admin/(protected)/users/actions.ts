"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { query } from "@/lib/db";
import { getSession, hashPassword, requireAdmin, type AdminRole } from "@/lib/auth";

function readRole(formData: FormData): AdminRole {
  return formData.get("role") === "admin" ? "admin" : "editor";
}

export async function createUser(_prevState: string | null, formData: FormData): Promise<string | null> {
  await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const role = readRole(formData);

  if (!name || !email || password.length < 8) {
    return "Name, email, and a password of at least 8 characters are required.";
  }

  const existing = await query<{ id: number }[]>("SELECT id FROM admin_users WHERE email = ?", [email]);
  if (existing.length > 0) {
    return "An account with that email already exists.";
  }

  await query("INSERT INTO admin_users (name, email, password_hash, role) VALUES (?, ?, ?, ?)", [
    name,
    email,
    hashPassword(password),
    role,
  ]);
  revalidatePath("/admin/users");
  redirect("/admin/users");
}

export async function updateUser(id: number, _prevState: string | null, formData: FormData): Promise<string | null> {
  await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const role = readRole(formData);

  if (!name || !email) {
    return "Name and email are required.";
  }

  const session = await getSession();
  if (session?.userId === id && role !== "admin") {
    return "You can't remove your own admin role.";
  }

  if (password) {
    if (password.length < 8) return "Password must be at least 8 characters.";
    await query("UPDATE admin_users SET name = ?, email = ?, role = ?, password_hash = ? WHERE id = ?", [
      name,
      email,
      role,
      hashPassword(password),
      id,
    ]);
  } else {
    await query("UPDATE admin_users SET name = ?, email = ?, role = ? WHERE id = ?", [name, email, role, id]);
  }
  revalidatePath("/admin/users");
  return "Saved.";
}

export async function deleteUser(id: number): Promise<void> {
  const session = await requireAdmin();
  if (session.userId === id) return;

  const [{ count }] = await query<{ count: number }[]>(
    "SELECT COUNT(*) AS count FROM admin_users WHERE role = 'admin'"
  );
  const [target] = await query<{ role: AdminRole }[]>("SELECT role FROM admin_users WHERE id = ?", [id]);
  if (target?.role === "admin" && count <= 1) return;

  await query("DELETE FROM admin_users WHERE id = ?", [id]);
  revalidatePath("/admin/users");
}
