import Link from "next/link";
import { query } from "@/lib/db";
import { deleteOffice } from "./actions";

interface Row {
  id: number;
  name: string;
  address: string;
  is_construction_site: number;
}

export default async function OfficesPage() {
  const rows = await query<Row[]>("SELECT * FROM offices ORDER BY sort_order ASC");

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#07283b]">Offices</h1>
          <p className="mt-1 text-sm text-slate-500">Branch addresses and construction sites shown in the footer.</p>
        </div>
        <Link
          href="/admin/offices/new"
          className="rounded-lg bg-[#f4600a] px-4 py-2 text-sm font-semibold text-white hover:bg-[#d8540a]"
        >
          + New
        </Link>
      </div>

      <div className="mt-6 space-y-3">
        {rows.map((row) => (
          <div key={row.id} className="flex items-start justify-between gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <div>
              <p className="font-semibold text-[#07283b]">
                {row.name} {row.is_construction_site ? <span className="text-xs font-normal text-slate-400">(construction site)</span> : null}
              </p>
              <p className="mt-1 text-sm text-slate-600">{row.address}</p>
            </div>
            <div className="flex shrink-0 items-center gap-3 text-sm">
              <Link href={`/admin/offices/${row.id}`} className="font-medium text-[#07283b] hover:underline">
                Edit
              </Link>
              <form
                action={async () => {
                  "use server";
                  await deleteOffice(row.id);
                }}
              >
                <button type="submit" className="font-medium text-red-600 hover:underline">
                  Delete
                </button>
              </form>
            </div>
          </div>
        ))}
        {rows.length === 0 && <p className="text-sm text-slate-500">No offices yet.</p>}
      </div>
    </div>
  );
}
