import type { SiteSettings, Office } from "@/lib/types";

export function Footer({ settings, offices }: { settings: SiteSettings | null; offices: Office[] }) {
  const branches = offices.filter((office) => !office.isConstructionSite);
  const sites = offices.filter((office) => office.isConstructionSite);

  return (
    <footer className="bg-[#07283b] text-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {branches.map((office) => (
            <div key={office.id}>
              <h3 className="font-semibold text-[#f4600a]">{office.name}</h3>
              <p className="mt-2 text-sm text-white/80">{office.address}</p>
              {office.phones.length > 0 && (
                <ul className="mt-3 space-y-1 text-sm text-white/70">
                  {office.phones.map((phone) => (
                    <li key={phone.id}>{phone.number}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        {sites.length > 0 && (
          <div className="mt-10 border-t border-white/10 pt-8">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white/60">Construction sites</h3>
            <p className="mt-2 text-sm text-white/80">
              {sites.map((site) => site.name.replace(" (Construction Site)", "")).join(" · ")}
            </p>
          </div>
        )}

        <div className="mt-10 border-t border-white/10 pt-8 text-sm text-white/70">
          {settings?.email && (
            <p>
              Email: {settings.email}
              {settings.secondaryEmail ? ` · ${settings.secondaryEmail}` : ""}
            </p>
          )}
          {settings?.phone && <p className="mt-1">Mobile: {settings.phone}</p>}
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} {settings?.siteName ?? "Dreamspace Realty"}. All rights reserved.
          </p>
          {settings?.footerCredit && <p>Developed by {settings.footerCredit}</p>}
        </div>
      </div>
    </footer>
  );
}
