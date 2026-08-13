"use server";

import { revalidatePath } from "next/cache";
import { query } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import type { SectionKey } from "@/lib/types";

export async function updatePageSections(
  page: string,
  sections: { key: SectionKey; visible: boolean }[]
): Promise<void> {
  await requireAdmin();
  await Promise.all(
    sections.map((section, i) =>
      query(
        `INSERT INTO page_sections (page, section_key, sort_order, visible)
         VALUES (?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE sort_order = VALUES(sort_order), visible = VALUES(visible)`,
        [page, section.key, i + 1, section.visible ? 1 : 0]
      )
    )
  );

  revalidatePath("/", "layout");
  revalidatePath("/admin/page-builder");
}
