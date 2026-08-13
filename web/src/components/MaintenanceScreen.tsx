import type { SiteSettings } from "@/lib/types";

export function MaintenanceScreen({ settings }: { settings: SiteSettings | null }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#07283b] px-6 text-center text-white">
      {settings?.logoUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={settings.logoUrl} alt={settings?.siteName ?? "Dreamspace Realty"} className="h-10 w-auto" />
      )}
      <h1 className="mt-8 text-3xl font-bold tracking-tight sm:text-4xl">We&apos;ll be right back</h1>
      <p className="mt-4 max-w-md text-white/70">
        {settings?.siteName ?? "This site"} is currently down for maintenance. Please check back shortly.
      </p>
      {settings?.phone && (
        <a
          href={`tel:${settings.phone.replace(/\s+/g, "")}`}
          className="mt-8 rounded-full border border-white/30 px-6 py-3 text-sm font-semibold transition-colors hover:bg-white/10"
        >
          Call us: {settings.phone}
        </a>
      )}
    </div>
  );
}
