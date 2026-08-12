import Link from "next/link";
import { query } from "@/lib/db";
import { deletePartner } from "./actions";

interface Row {
  id: number;
  name: string;
  logo_url: string | null;
}

export default async function PartnersPage() {
  const rows = await query<Row[]>("SELECT * FROM partners ORDER BY sort_order ASC");

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#07283b]">Partners</h1>
          <p className="mt-1 text-sm text-slate-500">Partner and sister company logos shown on the homepage.</p>
        </div>
        <Link
          href="/admin/partners/new"
          className="rounded-lg bg-[#f4600a] px-4 py-2 text-sm font-semibold text-white hover:bg-[#d8540a]"
        >
          + New
        </Link>
      </div>

      <div className="mt-6 space-y-3">
        {rows.map((row) => (
          <div key={row.id} className="flex items-center justify-between gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <p className="font-semibold text-[#07283b]">{row.name}</p>
            <div className="flex shrink-0 items-center gap-3 text-sm">
              <Link href={`/admin/partners/${row.id}`} className="font-medium text-[#07283b] hover:underline">
                Edit
              </Link>
              <form
                action={async () => {
                  "use server";
                  await deletePartner(row.id);
                }}
              >
                <button type="submit" className="font-medium text-red-600 hover:underline">
                  Delete
                </button>
              </form>
            </div>
          </div>
        ))}
        {rows.length === 0 && <p className="text-sm text-slate-500">No partners yet.</p>}
      </div>
    </div>
  );
}
