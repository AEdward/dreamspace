import { notFound } from "next/navigation";
import { query } from "@/lib/db";
import { OfficeForm } from "../OfficeForm";
import { updateOffice } from "../actions";
import { TranslationEditor } from "../../translations/TranslationEditor";
import { getTranslationsFor } from "../../translations/actions";

interface OfficeRow {
  id: number;
  name: string;
  sort_order: number;
  address: string;
  is_construction_site: number;
}

interface PhoneRow {
  number: string;
}

export default async function EditOfficePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const rows = await query<OfficeRow[]>("SELECT * FROM offices WHERE id = ?", [Number(id)]);
  const row = rows[0];
  if (!row) notFound();

  const phones = await query<PhoneRow[]>("SELECT number FROM office_phones WHERE office_id = ? ORDER BY sort_order ASC", [
    row.id,
  ]);

  const boundAction = updateOffice.bind(null, row.id);

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#07283b]">Edit Office</h1>
      <OfficeForm
        initial={{
          name: row.name,
          sort_order: row.sort_order,
          address: row.address,
          is_construction_site: !!row.is_construction_site,
          phones: phones.map((p) => p.number),
        }}
        action={boundAction}
        submitLabel="Save"
      />

      <div className="mt-8 max-w-xl">
        <h2 className="text-lg font-semibold text-[#07283b]">Amharic / Oromo overrides</h2>
        <TranslationEditor
          entityType="office"
          entityId={row.id}
          initial={await getTranslationsFor("office", row.id)}
          fields={[
            { name: "name", label: "Name" },
            { name: "address", label: "Address", multiline: true },
          ]}
        />
      </div>
    </div>
  );
}
