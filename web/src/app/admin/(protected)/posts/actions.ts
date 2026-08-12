"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { query } from "@/lib/db";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function readFields(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  return {
    title,
    slug: slugInput ? slugify(slugInput) : slugify(title),
    excerpt: String(formData.get("excerpt") ?? "").trim() || null,
    content: String(formData.get("content") ?? "").trim(),
    cover_image_url: String(formData.get("cover_image_url") ?? "").trim() || null,
    author: String(formData.get("author") ?? "admin").trim() || "admin",
    category: String(formData.get("category") ?? "Uncategorized").trim() || "Uncategorized",
    published_date: String(formData.get("published_date") ?? "").trim(),
  };
}

export async function createPost(_prevState: string | null, formData: FormData): Promise<string | null> {
  const f = readFields(formData);
  await query(
    `INSERT INTO posts (title, slug, excerpt, content, cover_image_url, author, category, published_date)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [f.title, f.slug, f.excerpt, f.content, f.cover_image_url, f.author, f.category, f.published_date]
  );
  revalidatePath("/");
  revalidatePath("/news");
  revalidatePath("/admin/posts");
  redirect("/admin/posts");
}

export async function updatePost(id: number, _prevState: string | null, formData: FormData): Promise<string | null> {
  const f = readFields(formData);
  await query(
    `UPDATE posts SET title = ?, slug = ?, excerpt = ?, content = ?, cover_image_url = ?, author = ?, category = ?, published_date = ?
     WHERE id = ?`,
    [f.title, f.slug, f.excerpt, f.content, f.cover_image_url, f.author, f.category, f.published_date, id]
  );
  revalidatePath("/");
  revalidatePath("/news");
  revalidatePath("/admin/posts");
  return "Saved.";
}

export async function deletePost(id: number): Promise<void> {
  await query("DELETE FROM posts WHERE id = ?", [id]);
  revalidatePath("/");
  revalidatePath("/news");
  revalidatePath("/admin/posts");
}
