"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import type { Locale } from "@/lib/i18n/locale";

export function PageviewTracker({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const path = searchParams.toString() ? `${pathname}?${searchParams.toString()}` : pathname;
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path, locale, referrer: document.referrer || null }),
      keepalive: true,
    }).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams, locale]);

  return null;
}
