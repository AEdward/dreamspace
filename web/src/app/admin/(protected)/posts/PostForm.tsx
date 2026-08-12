"use client";

import { useActionState } from "react";

const inputClass =
  "mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#07283b] focus:outline-none";
const labelClass = "block text-sm font-medium text-slate-700";

interface PostFormValues {
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image_url: string | null;
  author: string;
  category: string;
  published_date: string;
}

export function PostForm({
  initial,
  action,
  submitLabel,
}: {
  initial?: PostFormValues;
  action: (prevState: string | null, formData: FormData) => Promise<string | null>;
  submitLabel: string;
}) {
  const [message, formAction, pending] = useActionState(action, null);

  return (
    <form action={formAction} className="mt-6 max-w-2xl space-y-5 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <label className={labelClass}>
        Title
        <input name="title" defaultValue={initial?.title} required className={inputClass} />
      </label>

      <label className={labelClass}>
        Slug (leave blank to auto-generate from title)
        <input name="slug" defaultValue={initial?.slug} className={inputClass} />
      </label>

      <label className={labelClass}>
        Excerpt
        <textarea name="excerpt" defaultValue={initial?.excerpt ?? ""} rows={2} className={inputClass} />
      </label>

      <label className={labelClass}>
        Content
        <textarea name="content" defaultValue={initial?.content} required rows={10} className={inputClass} />
      </label>

      <label className={labelClass}>
        Cover image URL
        <input name="cover_image_url" defaultValue={initial?.cover_image_url ?? ""} className={inputClass} />
      </label>

      <div className="grid grid-cols-3 gap-4">
        <label className={labelClass}>
          Author
          <input name="author" defaultValue={initial?.author ?? "admin"} className={inputClass} />
        </label>
        <label className={labelClass}>
          Category
          <input name="category" defaultValue={initial?.category ?? "Uncategorized"} className={inputClass} />
        </label>
        <label className={labelClass}>
          Published date
          <input name="published_date" type="date" defaultValue={initial?.published_date} required className={inputClass} />
        </label>
      </div>

      {message && <p className="text-sm text-emerald-600">{message}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-[#07283b] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#0a3550] disabled:opacity-60"
      >
        {pending ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}
