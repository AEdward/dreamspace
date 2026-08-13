"use server";

import { revalidatePath } from "next/cache";
import { query } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function saveTranslation(
  entityType: string,
  entityId: number,
  locale: "am" | "om",
  field: string,
  value: string
): Promise<void> {
  await requireAdmin();
  const trimmed = value.trim();
  if (trimmed) {
    await query(
      `INSERT INTO translations (entity_type, entity_id, field, locale, value)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE value = VALUES(value)`,
      [entityType, entityId, field, locale, trimmed]
    );
  } else {
    await query(
      "DELETE FROM translations WHERE entity_type = ? AND entity_id = ? AND field = ? AND locale = ?",
      [entityType, entityId, field, locale]
    );
  }
  revalidatePath("/", "layout");
}

export async function getTranslationsFor(
  entityType: string,
  entityId: number
): Promise<{ am: Record<string, string>; om: Record<string, string> }> {
  const rows = await query<{ field: string; locale: string; value: string }[]>(
    "SELECT field, locale, value FROM translations WHERE entity_type = ? AND entity_id = ?",
    [entityType, entityId]
  );
  const result: { am: Record<string, string>; om: Record<string, string> } = { am: {}, om: {} };
  for (const row of rows) {
    if (row.locale === "am" || row.locale === "om") result[row.locale][row.field] = row.value;
  }
  return result;
}
