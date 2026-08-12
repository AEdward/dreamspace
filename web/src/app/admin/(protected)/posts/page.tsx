import Link from "next/link";
import { query } from "@/lib/db";
import { deletePost } from "./actions";

interface Row {
  id: number;
  title: string;
  slug: string;
  category: string;
  published_date: string;
}

export default async function PostsPage() {
  const rows = await query<Row[]>("SELECT * FROM posts ORDER BY published_date DESC");

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#07283b]">Posts</h1>
          <p className="mt-1 text-sm text-slate-500">Blog / news articles shown in the Latest News section.</p>
        </div>
        <Link
          href="/admin/posts/new"
          className="rounded-lg bg-[#f4600a] px-4 py-2 text-sm font-semibold text-white hover:bg-[#d8540a]"
        >
          + New
        </Link>
      </div>

      <div className="mt-6 space-y-3">
        {rows.map((row) => (
          <div key={row.id} className="flex items-center justify-between gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <div>
              <p className="font-semibold text-[#07283b]">{row.title}</p>
              <p className="mt-1 text-sm text-slate-500">
                {row.category} &middot;{" "}
                {new Date(row.published_date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-3 text-sm">
              <Link href={`/news/${row.slug}`} target="_blank" className="font-medium text-slate-500 hover:underline">
                View
              </Link>
              <Link href={`/admin/posts/${row.id}`} className="font-medium text-[#07283b] hover:underline">
                Edit
              </Link>
              <form
                action={async () => {
                  "use server";
                  await deletePost(row.id);
                }}
              >
                <button type="submit" className="font-medium text-red-600 hover:underline">
                  Delete
                </button>
              </form>
            </div>
          </div>
        ))}
        {rows.length === 0 && <p className="text-sm text-slate-500">No posts yet.</p>}
      </div>
    </div>
  );
}
