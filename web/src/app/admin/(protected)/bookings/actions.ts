"use server";

import { revalidatePath } from "next/cache";
import { query } from "@/lib/db";

export async function deleteBooking(id: number): Promise<void> {
  await query("DELETE FROM bookings WHERE id = ?", [id]);
  revalidatePath("/admin/bookings");
}
