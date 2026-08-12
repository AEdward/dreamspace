import Link from "next/link";
import { query } from "@/lib/db";
import { deleteUnitType } from "./actions";

interface Row {
  id: number;
  name: string;
  sqm: string;
  bedrooms: number;
  bathrooms: number;
  total_construction_cost: string;
  currency: string;
}

export default async function UnitTypesPage() {
  const rows = await query<Row[]>("SELECT * FROM unit_types ORDER BY sort_order ASC");

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#07283b]">Unit Types</h1>
          <p className="mt-1 text-sm text-slate-500">Housing units shown in the pricing table.</p>
        </div>
        <Link
          href="/admin/unit-types/new"
          className="rounded-lg bg-[#f4600a] px-4 py-2 text-sm font-semibold text-white hover:bg-[#d8540a]"
        >
          + New
        </Link>
      </div>

      <div className="mt-6 space-y-3">
        {rows.map((row) => (
          <div key={row.id} className="flex items-center justify-between gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <div>
              <p className="font-semibold text-[#07283b]">{row.name}</p>
              <p className="mt-1 text-sm text-slate-600">
                {row.sqm} Sqm &middot; {row.bedrooms} Beds &middot; {row.bathrooms} Baths &middot; Total:{" "}
                {Number(row.total_construction_cost).toLocaleString()} {row.currency}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-3 text-sm">
              <Link href={`/admin/unit-types/${row.id}`} className="font-medium text-[#07283b] hover:underline">
                Edit
              </Link>
              <form
                action={async () => {
                  "use server";
                  await deleteUnitType(row.id);
                }}
              >
                <button type="submit" className="font-medium text-red-600 hover:underline">
                  Delete
                </button>
              </form>
            </div>
          </div>
        ))}
        {rows.length === 0 && <p className="text-sm text-slate-500">No unit types yet.</p>}
      </div>
    </div>
  );
}
