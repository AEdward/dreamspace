import Link from "next/link";
import { query } from "@/lib/db";

const SECTIONS = [
  { href: "/admin/site-settings", label: "Site Settings", table: null },
  { href: "/admin/value-props", label: "Value Props", table: "value_props" },
  { href: "/admin/unit-types", label: "Unit Types", table: "unit_types" },
  { href: "/admin/offices", label: "Offices", table: "offices" },
  { href: "/admin/partners", label: "Partners", table: "partners" },
  { href: "/admin/posts", label: "Posts", table: "posts" },
];

export default async function AdminDashboard() {
  const counts = await Promise.all(
    SECTIONS.map(async (s) => {
      if (!s.table) return null;
      const rows = await query<{ count: number }[]>(`SELECT COUNT(*) as count FROM ${s.table}`);
      return rows[0]?.count ?? 0;
    })
  );

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#07283b]">Dashboard</h1>
      <p className="mt-1 text-sm text-slate-500">Manage the content shown on the live site.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SECTIONS.map((section, i) => (
          <Link
            key={section.href}
            href={section.href}
            className="rounded-2xl border border-slate-200 bg-white p-6 transition-shadow hover:shadow-md"
          >
            <p className="text-sm font-medium text-slate-500">{section.label}</p>
            {counts[i] !== null && <p className="mt-2 text-3xl font-bold text-[#07283b]">{counts[i]}</p>}
          </Link>
        ))}
      </div>
    </div>
  );
}
