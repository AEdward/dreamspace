import { Suspense } from "react";
import { getSiteSettings, getOffices } from "@/lib/data";
import { getLocale } from "@/lib/i18n/locale";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MaintenanceScreen } from "@/components/MaintenanceScreen";
import { PageviewTracker } from "@/components/PageviewTracker";

// Re-fetched periodically, and immediately on admin edits via revalidatePath.
export const revalidate = 60;

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const [settings, offices] = await Promise.all([getSiteSettings(locale), getOffices(locale)]);

  if (settings?.maintenanceMode) {
    return <MaintenanceScreen settings={settings} />;
  }

  return (
    <>
      <Suspense fallback={null}>
        <PageviewTracker locale={locale} />
      </Suspense>
      <Header settings={settings} />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} offices={offices} />
    </>
  );
}
