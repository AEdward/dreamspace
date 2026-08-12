import { getSiteSettings } from "@/lib/data";
import { SiteSettingsForm } from "./SiteSettingsForm";

export default async function SiteSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#07283b]">Site Settings</h1>
      <p className="mt-1 text-sm text-slate-500">Hero copy, contact info, and global site text.</p>
      <SiteSettingsForm settings={settings} />
    </div>
  );
}
