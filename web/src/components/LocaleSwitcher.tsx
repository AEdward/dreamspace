import { getLocale, LOCALES, type Locale } from "@/lib/i18n/locale";
import { setLocaleAction } from "@/lib/i18n/actions";

const LABELS: Record<Locale, string> = { en: "EN", am: "አማ", om: "OM" };

export async function LocaleSwitcher() {
  const current = await getLocale();

  return (
    <div className="flex items-center gap-1">
      {LOCALES.map((locale) => (
        <form key={locale} action={setLocaleAction}>
          <input type="hidden" name="locale" value={locale} />
          <button
            type="submit"
            aria-current={locale === current}
            className={`rounded-full px-2 py-1 text-xs font-semibold transition-colors ${
              locale === current ? "bg-[#07283b] text-white" : "text-slate-500 hover:text-[#07283b]"
            }`}
          >
            {LABELS[locale]}
          </button>
        </form>
      ))}
    </div>
  );
}
