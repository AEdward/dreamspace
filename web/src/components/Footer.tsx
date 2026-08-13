import type { SiteSettings, Office } from "@/lib/types";
import { getLocale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionaries";

export async function Footer({ settings, offices }: { settings: SiteSettings | null; offices: Office[] }) {
  const branches = offices.filter((office) => !office.isConstructionSite);
  const dict = getDictionary(await getLocale());

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

        <div className="mt-10 border-t border-white/10 pt-8 text-sm text-white/70">
          {settings?.email && (
            <p>
              {dict.footer.email} {settings.email}
              {settings.secondaryEmail ? ` · ${settings.secondaryEmail}` : ""}
            </p>
          )}
          {settings?.phone && (
            <p className="mt-1">
              {dict.footer.mobile} {settings.phone}
            </p>
          )}
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} {settings?.siteName ?? "Dreamspace Realty"}. {dict.footer.rights}
          </p>
          {settings?.footerCredit &&
            (settings.footerCreditUrl ? (
              <a
                href={settings.footerCreditUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-white/80 underline underline-offset-2 hover:text-white"
              >
                {dict.footer.developedBy} {settings.footerCredit}
              </a>
            ) : (
              <p className="text-sm font-medium text-white/80">
                {dict.footer.developedBy} {settings.footerCredit}
              </p>
            ))}
        </div>
      </div>
    </footer>
  );
}
