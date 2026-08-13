import { getSiteSettings } from "@/lib/data";
import { requireAdmin } from "@/lib/auth";
import { query } from "@/lib/db";
import { SiteSettingsForm } from "./SiteSettingsForm";
import { TranslationEditor } from "../translations/TranslationEditor";
import { getTranslationsFor } from "../translations/actions";

export default async function SiteSettingsPage() {
  await requireAdmin();
  const settings = await getSiteSettings();
  const [row] = await query<{ id: number }[]>("SELECT id FROM site_settings LIMIT 1");

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#07283b]">Site Settings</h1>
      <p className="mt-1 text-sm text-slate-500">Hero copy, contact info, and global site text.</p>
      <SiteSettingsForm settings={settings} />

      {row && (
        <div className="mt-8 max-w-xl">
          <h2 className="text-lg font-semibold text-[#07283b]">Amharic / Oromo overrides</h2>
          <TranslationEditor
            entityType="site_settings"
            entityId={row.id}
            initial={await getTranslationsFor("site_settings", row.id)}
            fields={[
              { name: "hero_headline", label: "Hero headline" },
              { name: "hero_subheadline", label: "Hero subheadline" },
              { name: "popup_headline", label: "Popup headline" },
              { name: "register_cta_label", label: "Book button label" },
              { name: "about_heading", label: "About Us heading" },
              { name: "about_body", label: "About Us body", multiline: true },
              { name: "contact_heading", label: "Contact Us heading" },
              { name: "contact_intro", label: "Contact Us intro", multiline: true },
            ]}
          />
        </div>
      )}
    </div>
  );
}
