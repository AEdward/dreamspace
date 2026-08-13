"use client";

import { useState, useTransition } from "react";
import { saveTranslation } from "./actions";

interface Field {
  name: string;
  label: string;
  multiline?: boolean;
}

export function TranslationEditor({
  entityType,
  entityId,
  fields,
  initial,
}: {
  entityType: string;
  entityId: number;
  fields: Field[];
  initial: { am: Record<string, string>; om: Record<string, string> };
}) {
  const [locale, setLocale] = useState<"am" | "om">("am");
  const [values, setValues] = useState(initial);
  const [pending, startTransition] = useTransition();
  const [savedAt, setSavedAt] = useState(0);

  function setValue(field: string, value: string) {
    setValues((v) => ({ ...v, [locale]: { ...v[locale], [field]: value } }));
  }

  function save(field: string) {
    const value = values[locale][field] ?? "";
    startTransition(async () => {
      await saveTranslation(entityType, entityId, locale, field, value);
      setSavedAt(Date.now());
    });
  }

  return (
    <div className="mt-4 rounded-xl border border-slate-200 p-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-4 text-sm font-semibold">
          <button
            type="button"
            onClick={() => setLocale("am")}
            className={locale === "am" ? "text-[#07283b] underline underline-offset-4" : "text-slate-400"}
          >
            Amharic
          </button>
          <button
            type="button"
            onClick={() => setLocale("om")}
            className={locale === "om" ? "text-[#07283b] underline underline-offset-4" : "text-slate-400"}
          >
            Oromo
          </button>
        </div>
        {pending && <span className="text-xs text-slate-400">Saving...</span>}
        {!pending && savedAt > 0 && <span className="text-xs text-emerald-600">Saved</span>}
      </div>
      <p className="mt-1 text-xs text-slate-400">Leave a field blank to fall back to the English text above.</p>

      <div className="mt-3 space-y-3">
        {fields.map((f) => (
          <label key={f.name} className="block text-sm font-medium text-slate-700">
            {f.label}
            {f.multiline ? (
              <textarea
                rows={3}
                value={values[locale][f.name] ?? ""}
                onChange={(e) => setValue(f.name, e.target.value)}
                onBlur={() => save(f.name)}
                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#07283b] focus:outline-none"
              />
            ) : (
              <input
                value={values[locale][f.name] ?? ""}
                onChange={(e) => setValue(f.name, e.target.value)}
                onBlur={() => save(f.name)}
                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#07283b] focus:outline-none"
              />
            )}
          </label>
        ))}
      </div>
    </div>
  );
}
