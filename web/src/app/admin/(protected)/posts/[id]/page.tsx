import { notFound } from "next/navigation";
import { query } from "@/lib/db";
import { PostForm } from "../PostForm";
import { updatePost } from "../actions";
import { TranslationEditor } from "../../translations/TranslationEditor";
import { getTranslationsFor } from "../../translations/actions";

interface Row {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image_url: string | null;
  author: string;
  category: string;
  published_date: string;
}

function toDateInputValue(value: string): string {
  const d = new Date(value);
  return d.toISOString().slice(0, 10);
}

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const rows = await query<Row[]>("SELECT * FROM posts WHERE id = ?", [Number(id)]);
  const row = rows[0];
  if (!row) notFound();

  const boundAction = updatePost.bind(null, row.id);

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#07283b]">Edit Post</h1>
      <PostForm
        initial={{ ...row, published_date: toDateInputValue(row.published_date) }}
        action={boundAction}
        submitLabel="Save"
      />

      <div className="mt-8 max-w-xl">
        <h2 className="text-lg font-semibold text-[#07283b]">Amharic / Oromo overrides</h2>
        <TranslationEditor
          entityType="post"
          entityId={row.id}
          initial={await getTranslationsFor("post", row.id)}
          fields={[
            { name: "title", label: "Title" },
            { name: "excerpt", label: "Excerpt", multiline: true },
            { name: "content", label: "Content", multiline: true },
          ]}
        />
      </div>
    </div>
  );
}
