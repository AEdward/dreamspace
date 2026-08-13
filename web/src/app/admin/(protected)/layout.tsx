import Link from "next/link";

const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/site-settings", label: "Site Settings" },
  { href: "/admin/value-props", label: "Value Props" },
  { href: "/admin/unit-types", label: "Unit Types" },
  { href: "/admin/offices", label: "Offices" },
  { href: "/admin/bank-accounts", label: "Bank Accounts" },
  { href: "/admin/partners", label: "Partners" },
  { href: "/admin/posts", label: "Posts" },
  { href: "/admin/bookings", label: "Bookings & Messages" },
];

export default function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  // Auth is enforced by middleware.ts for this whole (protected) group.
  return (
    <div className="mx-auto flex min-h-screen max-w-6xl">
      <aside className="w-56 shrink-0 border-r border-slate-200 bg-white px-4 py-6">
        <p className="px-2 text-sm font-bold text-[#07283b]">Dreamspace Admin</p>
        <nav className="mt-6 space-y-1">
          {NAV.map((item) => (
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
