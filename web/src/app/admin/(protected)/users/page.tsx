import Link from "next/link";
import { query } from "@/lib/db";
import { getSession, requireAdmin } from "@/lib/auth";
import { deleteUser } from "./actions";

interface Row {
  id: number;
  name: string;
  email: string;
  role: "admin" | "editor";
  created_at: string;
}

export default async function UsersPage() {
  await requireAdmin();
  const session = await getSession();
  const rows = await query<Row[]>("SELECT * FROM admin_users ORDER BY created_at ASC");
  const adminCount = rows.filter((r) => r.role === "admin").length;

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#07283b]">Users</h1>
          <p className="mt-1 text-sm text-slate-500">
            Admins can manage settings, users, and finances. Editors can edit site content only.
          </p>
        </div>
        <Link
          href="/admin/users/new"
          className="rounded-lg bg-[#f4600a] px-4 py-2 text-sm font-semibold text-white hover:bg-[#d8540a]"
        >
          + New
        </Link>
      </div>

      <div className="mt-6 space-y-3">
        {rows.map((row) => {
          const isSelf = row.id === session?.userId;
          const isLastAdmin = row.role === "admin" && adminCount <= 1;
          return (
            <div
              key={row.id}
              className="flex items-start justify-between gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200"
            >
              <div>
                <p className="font-semibold text-[#07283b]">
                  {row.name} {isSelf && <span className="font-normal text-slate-400">(you)</span>}
                </p>
                <p className="mt-1 text-sm text-slate-600">{row.email}</p>
                <span
                  className={`mt-2 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                    row.role === "admin" ? "bg-[#07283b]/10 text-[#07283b]" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {row.role === "admin" ? "Admin" : "Editor"}
                </span>
              </div>
              <div className="flex shrink-0 items-center gap-3 text-sm">
                <Link href={`/admin/users/${row.id}`} className="font-medium text-[#07283b] hover:underline">
                  Edit
                </Link>
                {!isSelf && !isLastAdmin && (
                  <form
                    action={async () => {
                      "use server";
                      await deleteUser(row.id);
                    }}
                  >
                    <button type="submit" className="font-medium text-red-600 hover:underline">
                      Delete
                    </button>
                  </form>
                )}
              </div>
            </div>
          );
        })}
        {rows.length === 0 && <p className="text-sm text-slate-500">No users yet.</p>}
      </div>
    </div>
  );
}
