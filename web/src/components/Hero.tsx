"use client";

import { motion } from "framer-motion";
import type { SiteSettings } from "@/lib/types";
import { HeroSceneLoader } from "@/components/three/HeroSceneLoader";

export function Hero({ settings }: { settings: SiteSettings | null }) {
  const heroUrl = settings?.heroImageUrl ?? "/brand/hero.jpg";

  return (
    <section className="relative isolate flex min-h-[56vh] items-center overflow-hidden bg-[#07283b] text-white">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={heroUrl} alt="" className="absolute inset-0 h-full w-full object-cover opacity-25" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#07283b] via-[#07283b]/85 to-[#07283b]/40" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#07283b] via-[#07283b]/60 to-transparent" />

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-12 px-6 py-16 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="max-w-2xl text-4xl font-bold leading-[1.1] tracking-tight sm:text-6xl"
          >
            {settings?.heroHeadline ?? "We will make it happen!"}
          </motion.h1>

          {settings?.heroSubheadline && (
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
              className="mt-5 max-w-xl text-lg text-white/80"
            >
              {settings.heroSubheadline}
            </motion.p>
          )}

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="mt-9 flex flex-wrap gap-4"
          >
            <a
              href="/registration"
              className="rounded-full bg-[#f4600a] px-7 py-3.5 font-semibold shadow-lg shadow-[#f4600a]/20 transition-all hover:-translate-y-0.5 hover:bg-[#d8540a] hover:shadow-xl hover:shadow-[#f4600a]/30"
            >
              {settings?.registerCtaLabel ?? "Register from home!"}
            </a>
            {settings?.phone && (
              <a
                href={`tel:${settings.phone.replace(/\s+/g, "")}`}
                className="rounded-full border border-white/30 px-7 py-3.5 font-semibold backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-white/60 hover:bg-white/10"
              >
                Call us: {settings.phone}
              </a>
            )}
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="mt-7 text-sm text-white/70"
          >
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
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.15, ease: "easeOut" }}
          className="relative hidden h-[300px] lg:block"
          aria-hidden="true"
        >
          <HeroSceneLoader />
        </motion.div>
      </div>
    </section>
  );
}
