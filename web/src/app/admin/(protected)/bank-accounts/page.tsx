import Link from "next/link";
import { query } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { deleteBankAccount } from "./actions";

interface Row {
  id: number;
  bank_name: string;
  registration_account: string;
  price_account: string;
}

export default async function BankAccountsPage() {
  await requireAdmin();
  const rows = await query<Row[]>("SELECT * FROM bank_accounts ORDER BY sort_order ASC");

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#07283b]">Bank Accounts</h1>
          <p className="mt-1 text-sm text-slate-500">
            The &quot;Bank details&quot; table shown on the homepage for registration/service fee and price
            payments.
          </p>
        </div>
        <Link
          href="/admin/bank-accounts/new"
          className="rounded-lg bg-[#f4600a] px-4 py-2 text-sm font-semibold text-white hover:bg-[#d8540a]"
        >
          + New
        </Link>
      </div>

      <div className="mt-6 space-y-3">
        {rows.map((row) => (
          <div
            key={row.id}
            className="flex items-start justify-between gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200"
          >
            <div>
              <p className="font-semibold text-[#07283b]">{row.bank_name}</p>
              <p className="mt-1 text-sm text-slate-600">Registration & service fee: {row.registration_account}</p>
              <p className="text-sm text-slate-600">Price payment: {row.price_account}</p>
            </div>
            <div className="flex shrink-0 items-center gap-3 text-sm">
              <Link href={`/admin/bank-accounts/${row.id}`} className="font-medium text-[#07283b] hover:underline">
                Edit
              </Link>
              <form
                action={async () => {
                  "use server";
                  await deleteBankAccount(row.id);
                }}
              >
                <button type="submit" className="font-medium text-red-600 hover:underline">
                  Delete
                </button>
              </form>
            </div>
          </div>
        ))}
        {rows.length === 0 && <p className="text-sm text-slate-500">No bank accounts yet.</p>}
      </div>
    </div>
  );
}
