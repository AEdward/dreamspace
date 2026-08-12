import Image from "next/image";
import type { SiteSettings } from "@/lib/types";
import { mediaUrl } from "@/lib/strapi";

export function Hero({ settings }: { settings: SiteSettings | null }) {
  const heroUrl = mediaUrl(settings?.heroImage?.url) ?? "/brand/hero.jpg";

  return (
    <section className="relative isolate flex min-h-[70vh] items-center overflow-hidden bg-[#07283b] text-white">
      <Image src={heroUrl} alt="" fill priority className="object-cover opacity-50" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#07283b] via-[#07283b]/70 to-[#07283b]/20" />

      <div className="relative mx-auto w-full max-w-7xl px-6 py-24">
        <h1 className="max-w-2xl text-4xl font-bold leading-tight sm:text-5xl">
          {settings?.heroHeadline ?? "We will make it happen!"}
        </h1>
        {settings?.heroSubheadline && (
          <p className="mt-4 max-w-xl text-lg text-white/90">{settings.heroSubheadline}</p>
        )}

        <div className="mt-8 flex flex-wrap gap-4">
          <a
            href="/registration"
            className="rounded-full bg-[#f4600a] px-6 py-3 font-semibold transition-colors hover:bg-[#d8540a]"
          >
            {settings?.registerCtaLabel ?? "Register from home!"}
          </a>
          {settings?.phone && (
            <a
              href={`tel:${settings.phone.replace(/\s+/g, "")}`}
              className="rounded-full border border-white/60 px-6 py-3 font-semibold transition-colors hover:bg-white/10"
            >
              Call us: {settings.phone}
            </a>
          )}
        </div>

        <p className="mt-6 text-sm text-white/80">
          {settings?.appointmentCtaLabel ?? "Make an appointment now!"}
          {settings?.email && (
            <>
              {" "}
              &middot;{" "}
              <a href={`mailto:${settings.email}`} className="underline underline-offset-2">
                {settings.email}
              </a>
            </>
          )}
        </p>
      </div>
    </section>
  );
}
