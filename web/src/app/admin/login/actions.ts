"use server";

import { redirect } from "next/navigation";
import { createSession, verifyCredentials } from "@/lib/auth";

export async function login(_prevState: string | null, formData: FormData): Promise<string | null> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const session = await verifyCredentials(email, password);
  if (!session) {
    return "Incorrect email or password.";
  }

  await createSession(session.userId, session.role);
  redirect("/admin");
}
