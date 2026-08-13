import { getSiteSettings } from "@/lib/data";
import { requireAdmin } from "@/lib/auth";
import { SITE_URL } from "@/lib/seo";

export default async function SeoPage() {
  await requireAdmin();
  const settings = await getSiteSettings();

  const title = settings?.siteName ?? "Dreamspace Realty";
  const description =
    settings?.heroSubheadline ??
    "Affordable housing development and homeownership solutions in Addis Ababa, Ethiopia.";

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#07283b]">SEO</h1>
      <p className="mt-1 text-sm text-slate-500">
        Titles and descriptions are generated from Site Settings and each page&apos;s content — edit them there.
        This page is a read-only status check.
      </p>

      <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-sm font-semibold text-[#07283b]">Homepage preview</h2>
        <div className="mt-3 max-w-xl rounded-lg border border-slate-200 p-4">
          <p className="truncate text-base text-[#1a0dab]">{title}</p>
          <p className="text-xs text-emerald-700">{SITE_URL}</p>
          <p className="mt-1 text-sm text-slate-600">{description}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-sm font-semibold text-[#07283b]">Technical SEO</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li>
              ✓ Sitemap:{" "}
              <a href="/sitemap.xml" target="_blank" className="text-[#07283b] underline">
                /sitemap.xml
              </a>
            </li>
            <li>
              ✓ Robots:{" "}
              <a href="/robots.txt" target="_blank" className="text-[#07283b] underline">
                /robots.txt
              </a>
            </li>
            <li>✓ Open Graph & Twitter card tags on every page</li>
            <li>✓ RealEstateAgent structured data (JSON-LD) on the homepage</li>
            <li>✓ Canonical URLs on all public pages</li>
          </ul>
        </div>

        <div className="rounded-2xl bg-amber-50 p-6 ring-1 ring-amber-200">
          <h2 className="text-sm font-semibold text-amber-900">Known limitation: language URLs</h2>
          <p className="mt-2 text-sm text-amber-800">
            Amharic/Oromo switch by a cookie, not a URL prefix (e.g. there&apos;s no separate <code>/am/</code>{" "}
            path). That keeps the whole site translatable without restructuring every route, but it also means
            search engines will generally only index the English version — there&apos;s no crawlable URL to point
            them to for AM/OM specifically. If ranking in Amharic/Oromo search results becomes a priority, the
            fix is moving to URL-based locales (e.g. <code>/am/about-us</code>), which is a larger follow-up
            project, not a quick change.
          </p>
        </div>
      </div>
    </div>
  );
}
