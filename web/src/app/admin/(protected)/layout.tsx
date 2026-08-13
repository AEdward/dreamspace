import Link from "next/link";
import { getSession } from "@/lib/auth";

const NAV = [
  { href: "/admin", label: "Dashboard", adminOnly: false },
  { href: "/admin/page-builder", label: "Page Builder", adminOnly: true },
  { href: "/admin/site-settings", label: "Site Settings", adminOnly: true },
  { href: "/admin/value-props", label: "Value Props", adminOnly: false },
  { href: "/admin/unit-types", label: "Unit Types", adminOnly: false },
  { href: "/admin/offices", label: "Offices", adminOnly: false },
  { href: "/admin/bank-accounts", label: "Bank Accounts", adminOnly: true },
  { href: "/admin/partners", label: "Partners", adminOnly: false },
  { href: "/admin/posts", label: "Posts", adminOnly: false },
  { href: "/admin/bookings", label: "Bookings & Messages", adminOnly: false },
  { href: "/admin/analytics", label: "Analytics", adminOnly: true },
  { href: "/admin/seo", label: "SEO", adminOnly: true },
  { href: "/admin/site-health", label: "Site Health", adminOnly: true },
  { href: "/admin/users", label: "Users", adminOnly: true },
];

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  // Auth is enforced by middleware.ts for this whole (protected) group.
  const session = await getSession();
  const nav = NAV.filter((item) => !item.adminOnly || session?.role === "admin");

  return (
    <div className="mx-auto flex min-h-screen max-w-6xl">
      <aside className="w-56 shrink-0 border-r border-slate-200 bg-white px-4 py-6">
        <p className="px-2 text-sm font-bold text-[#07283b]">Dreamspace Admin</p>
        <nav className="mt-6 space-y-1">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-8 space-y-2 border-t border-slate-100 pt-4">
          <Link href="/" className="block px-3 py-2 text-xs text-slate-500 hover:underline">
            View live site
          </Link>
          <form action="/admin/logout" method="post">
            <button type="submit" className="w-full rounded-lg px-3 py-2 text-left text-xs text-slate-500 hover:bg-slate-100">
              Sign out
            </button>
          </form>
        </div>
      </aside>
      <main className="flex-1 px-8 py-8">{children}</main>
    </div>
  );
}
