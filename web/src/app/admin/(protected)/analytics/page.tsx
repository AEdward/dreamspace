import { query } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

interface DailyRow {
  day: string;
  count: number;
}

interface TopPathRow {
  path: string;
  count: number;
}

export default async function AnalyticsPage() {
  await requireAdmin();

  const [totals] = await query<{ total: number; unique_visitors: number }[]>(
    `SELECT COUNT(*) AS total, COUNT(DISTINCT visitor_hash) AS unique_visitors
     FROM pageviews WHERE created_at >= NOW() - INTERVAL 30 DAY`
  );
  const [totals7] = await query<{ total: number; unique_visitors: number }[]>(
    `SELECT COUNT(*) AS total, COUNT(DISTINCT visitor_hash) AS unique_visitors
     FROM pageviews WHERE created_at >= NOW() - INTERVAL 7 DAY`
  );
  const [bookingTotals] = await query<{ total: number }[]>(
    `SELECT COUNT(*) AS total FROM bookings WHERE created_at >= NOW() - INTERVAL 30 DAY`
  );

  const daily = await query<DailyRow[]>(
    `SELECT DATE(created_at) AS day, COUNT(*) AS count
     FROM pageviews WHERE created_at >= NOW() - INTERVAL 14 DAY
     GROUP BY DATE(created_at) ORDER BY day ASC`
  );

  const topPaths = await query<TopPathRow[]>(
    `SELECT path, COUNT(*) AS count FROM pageviews
     WHERE created_at >= NOW() - INTERVAL 30 DAY
     GROUP BY path ORDER BY count DESC LIMIT 10`
  );

  const pageviews30 = Number(totals?.total ?? 0);
  const bookings30 = Number(bookingTotals?.total ?? 0);
  const conversionRate = pageviews30 > 0 ? ((bookings30 / pageviews30) * 100).toFixed(1) : "0.0";
  const maxDaily = Math.max(1, ...daily.map((d) => Number(d.count)));
  const maxPath = Math.max(1, ...topPaths.map((p) => Number(p.count)));

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#07283b]">Analytics</h1>
      <p className="mt-1 text-sm text-slate-500">
        Self-hosted pageview tracking, logged from real browser visits (not link prefetches).
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Pageviews (7 days)" value={totals7?.total ?? 0} />
        <StatCard label="Unique visitors (7 days)" value={totals7?.unique_visitors ?? 0} />
        <StatCard label="Pageviews (30 days)" value={pageviews30} />
        <StatCard label="Booking conversion (30 days)" value={`${conversionRate}%`} sub={`${bookings30} bookings`} />
      </div>

      <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-sm font-semibold text-[#07283b]">Daily pageviews — last 14 days</h2>
        <div className="mt-4 flex items-end gap-2" style={{ height: 140 }}>
          {daily.length === 0 && <p className="text-sm text-slate-400">No data yet.</p>}
          {daily.map((d) => (
            <div key={d.day} className="flex flex-1 flex-col items-center gap-1">
              <div
                className="w-full rounded-t bg-[#07283b]"
                style={{ height: `${Math.max(4, (Number(d.count) / maxDaily) * 120)}px` }}
                title={`${d.day}: ${d.count}`}
              />
              <span className="text-[10px] text-slate-400">
                {new Date(d.day).toLocaleDateString("en-US", { month: "numeric", day: "numeric" })}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-sm font-semibold text-[#07283b]">Top pages — last 30 days</h2>
        <div className="mt-4 space-y-3">
          {topPaths.length === 0 && <p className="text-sm text-slate-400">No data yet.</p>}
          {topPaths.map((p) => (
            <div key={p.path} className="text-sm">
              <div className="flex items-center justify-between">
                <span className="font-mono text-slate-700">{p.path}</span>
                <span className="text-slate-500">{p.count}</span>
              </div>
              <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-[#f4600a]"
                  style={{ width: `${(Number(p.count) / maxPath) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-[#07283b]">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-slate-400">{sub}</p>}
    </div>
  );
}
