"use server";

import { redirect } from "next/navigation";
import { createSession, verifyPassword } from "@/lib/auth";

export async function login(_prevState: string | null, formData: FormData): Promise<string | null> {
  const password = String(formData.get("password") ?? "");

  if (!verifyPassword(password)) {
    return "Incorrect password.";
  }

  await createSession();
  redirect("/admin");
}
