import Link from "next/link";
import type { SiteSettings } from "@/lib/types";
import { getLocale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { LocaleSwitcher } from "./LocaleSwitcher";

export async function Header({ settings }: { settings: SiteSettings | null }) {
  const logoUrl = settings?.logoUrl;
  const dict = getDictionary(await getLocale());

  const NAV_LINKS = [
    { href: "/", label: dict.nav.home },
    { href: "/about-us", label: dict.nav.about },
    { href: "/news", label: dict.nav.news },
    { href: "/contact-us", label: dict.nav.contact },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-3">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt={settings?.siteName ?? "Dreamspace Realty"} className="h-9 w-auto" />
          ) : (
            <span className="text-xl font-bold text-[#07283b]">Dreamspace Realty</span>
          )}
        </Link>

        <nav className="hidden md:block">
          <ul className="flex items-center gap-6 text-sm font-medium text-[#07283b]">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition-colors hover:text-[#f4600a]">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden shrink-0 items-center gap-3 sm:flex">
          <LocaleSwitcher />
          {settings?.phone && (
            <a
              href={`tel:${settings.phone.replace(/\s+/g, "")}`}
              className="inline-flex items-center rounded-full bg-[#f4600a] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#d8540a]"
            >
              {dict.nav.call} {settings.phone}
            </a>
          )}
        </div>

        <details className="group relative md:hidden">
          <summary className="flex h-9 w-9 cursor-pointer list-none items-center justify-center rounded-md border border-slate-200 text-[#07283b] [&::-webkit-details-marker]:hidden">
            <span className="sr-only">{dict.nav.menu}</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
              <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </summary>
          <ul className="absolute right-0 top-12 z-50 w-64 rounded-xl border border-slate-200 bg-white p-2 text-sm font-medium text-[#07283b] shadow-lg">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="block rounded-lg px-3 py-2 hover:bg-slate-50">
                  {link.label}
                </Link>
              </li>
            ))}
            {settings?.phone && (
              <li className="mt-1 border-t border-slate-100 pt-1">
                <a href={`tel:${settings.phone.replace(/\s+/g, "")}`} className="block rounded-lg px-3 py-2 text-[#f4600a] hover:bg-slate-50">
                  {dict.nav.call} {settings.phone}
                </a>
              </li>
            )}
            <li className="mt-1 border-t border-slate-100 px-3 pt-2">
              <LocaleSwitcher />
            </li>
          </ul>
        </details>
      </div>
    </header>
  );
}
