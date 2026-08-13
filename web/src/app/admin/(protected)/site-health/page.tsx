import { query } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

const EXPECTED_TABLES = [
  "site_settings",
  "value_props",
  "unit_types",
  "offices",
  "office_phones",
  "partners",
  "posts",
  "bookings",
  "bank_accounts",
  "page_sections",
  "admin_users",
  "translations",
  "pageviews",
];

const REQUIRED_ENV = ["DATABASE_HOST", "DATABASE_USERNAME", "DATABASE_PASSWORD", "DATABASE_NAME", "ADMIN_SESSION_SECRET"];

function formatUptime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h === 0) return `${m}m`;
  return `${h}h ${m}m`;
}

export default async function SiteHealthPage() {
  await requireAdmin();

  let dbOk = false;
  let dbError: string | null = null;
  try {
    await query("SELECT 1");
    dbOk = true;
  } catch (err) {
    dbError = err instanceof Error ? err.message : String(err);
  }

  let existingTables: string[] = [];
  if (dbOk) {
    try {
      const rows = await query<{ TABLE_NAME: string }[]>(
        "SELECT TABLE_NAME FROM information_schema.tables WHERE TABLE_SCHEMA = DATABASE()"
      );
      existingTables = rows.map((r) => r.TABLE_NAME);
    } catch {
      // leave empty; missing-table checks below will just all show as missing
    }
  }
  const missingTables = EXPECTED_TABLES.filter((t) => !existingTables.includes(t));

  const envStatus = REQUIRED_ENV.map((key) => ({ key, present: !!process.env[key] }));

  let recentBookings = 0;
  let recentPageviews = 0;
  let userCount = 0;
  if (dbOk && missingTables.length === 0) {
    try {
      const [b] = await query<{ count: number }[]>(
        "SELECT COUNT(*) AS count FROM bookings WHERE created_at >= NOW() - INTERVAL 24 HOUR"
      );
      const [p] = await query<{ count: number }[]>(
        "SELECT COUNT(*) AS count FROM pageviews WHERE created_at >= NOW() - INTERVAL 24 HOUR"
      );
      const [u] = await query<{ count: number }[]>("SELECT COUNT(*) AS count FROM admin_users");
      recentBookings = Number(b?.count ?? 0);
      recentPageviews = Number(p?.count ?? 0);
      userCount = Number(u?.count ?? 0);
    } catch {
      // non-fatal — the counters just stay at 0
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#07283b]">Site Health</h1>
      <p className="mt-1 text-sm text-slate-500">
        Application-level checks. This is a shared web host, so system metrics like disk or CPU aren&apos;t
        available here — this covers what the app itself can see.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <HealthCard label="Database" ok={dbOk} detail={dbOk ? "Connected" : dbError ?? "Unreachable"} />
        <HealthCard
          label="Schema"
          ok={missingTables.length === 0}
          detail={missingTables.length === 0 ? "All expected tables present" : `Missing: ${missingTables.join(", ")}`}
        />
        <HealthCard
          label="Environment variables"
          ok={envStatus.every((e) => e.present)}
          detail={envStatus
            .filter((e) => !e.present)
            .map((e) => e.key)
            .join(", ") || "All required variables set"}
        />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Process uptime" value={formatUptime(process.uptime())} />
        <StatCard label="Node version" value={process.version} />
        <StatCard label="Admin users" value={userCount} />
        <StatCard label="Bookings (24h)" value={recentBookings} />
      </div>

      <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-sm font-semibold text-[#07283b]">Environment variables</h2>
        <ul className="mt-3 space-y-1 text-sm">
          {envStatus.map((e) => (
            <li key={e.key} className="flex items-center gap-2">
              <span className={e.present ? "text-emerald-600" : "text-red-600"}>{e.present ? "✓" : "✗"}</span>
              <span className="font-mono text-slate-600">{e.key}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-slate-400">
          Only presence is checked — values are never shown here.
        </p>
      </div>

      <p className="mt-6 text-xs text-slate-400">
        Pageviews recorded in the last 24 hours: {recentPageviews}. If this stays at 0 with real traffic, the
        analytics beacon (/api/track) isn&apos;t reaching the server — check for ad blockers or a caching layer
        stripping client-side requests.
      </p>
    </div>
  );
}

function HealthCard({ label, ok, detail }: { label: string; ok: boolean; detail: string }) {
  return (
    <div className={`rounded-2xl p-5 shadow-sm ring-1 ${ok ? "bg-emerald-50 ring-emerald-200" : "bg-red-50 ring-red-200"}`}>
      <div className="flex items-center gap-2">
        <span className={`h-2.5 w-2.5 rounded-full ${ok ? "bg-emerald-500" : "bg-red-500"}`} />
        <p className="text-sm font-semibold text-[#07283b]">{label}</p>
      </div>
      <p className={`mt-2 text-xs ${ok ? "text-emerald-700" : "text-red-700"}`}>{detail}</p>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-xl font-bold text-[#07283b]">{value}</p>
    </div>
  );
}
