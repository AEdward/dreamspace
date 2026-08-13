import { query } from "@/lib/db";
import { deleteBooking } from "./actions";

interface Row {
  id: number;
  source: "booking" | "contact";
  full_name: string;
  phone: string;
  email: string | null;
  message: string | null;
  created_at: string;
}

const SOURCE_LABEL: Record<Row["source"], string> = {
  booking: "Booking",
  contact: "Contact form",
};

export default async function BookingsPage() {
  const rows = await query<Row[]>("SELECT * FROM bookings ORDER BY created_at DESC");

  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold text-[#07283b]">Bookings & messages</h1>
        <p className="mt-1 text-sm text-slate-500">
          Appointment requests from the homepage &quot;Booking&quot; button and messages from the Contact Us page.
        </p>
      </div>

      <div className="mt-6 space-y-3">
        {rows.map((row) => (
          <div key={row.id} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-[#07283b]">{row.full_name}</p>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
                    {SOURCE_LABEL[row.source]}
                  </span>
                </div>
                <p className="mt-1 text-sm text-slate-600">
                  {row.phone}
                  {row.email && <> &middot; {row.email}</>}
                </p>
                {row.message && <p className="mt-2 text-sm text-slate-600">{row.message}</p>}
              </div>
              <div className="flex shrink-0 flex-col items-end gap-2 text-right">
                <p className="text-xs text-slate-400">{new Date(row.created_at).toLocaleString()}</p>
                <form
                  action={async () => {
                    "use server";
                    await deleteBooking(row.id);
                  }}
                >
                  <button type="submit" className="text-sm font-medium text-red-600 hover:underline">
                    Delete
                  </button>
                </form>
              </div>
            </div>
          </div>
        ))}
        {rows.length === 0 && <p className="text-sm text-slate-500">No bookings or messages yet.</p>}
      </div>
    </div>
  );
}
