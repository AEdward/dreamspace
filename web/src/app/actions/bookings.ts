"use server";

import { query } from "@/lib/db";

export async function submitBooking(
  source: "booking" | "contact",
  _prevState: string | null,
  formData: FormData
): Promise<string | null> {
  const fullName = String(formData.get("full_name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim() || null;
  const message = String(formData.get("message") ?? "").trim() || null;

  if (!fullName || !phone) {
    return "Please fill in your name and phone number.";
  }

  await query("INSERT INTO bookings (source, full_name, phone, email, message) VALUES (?, ?, ?, ?, ?)", [
    source,
    fullName,
    phone,
    email,
    message,
  ]);

  return "success";
}
