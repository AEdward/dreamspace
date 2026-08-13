import { getSiteSettings, getOffices } from "@/lib/data";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MaintenanceScreen } from "@/components/MaintenanceScreen";

// Re-fetched periodically, and immediately on admin edits via revalidatePath.
export const revalidate = 60;

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [settings, offices] = await Promise.all([getSiteSettings(), getOffices()]);

  if (settings?.maintenanceMode) {
    return <MaintenanceScreen settings={settings} />;
  }

  return (
    <>
      <Header settings={settings} />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} offices={offices} />
    </>
  );
}
