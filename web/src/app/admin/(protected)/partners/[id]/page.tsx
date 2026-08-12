import { notFound } from "next/navigation";
import { query } from "@/lib/db";
import { PartnerForm } from "../PartnerForm";
import { updatePartner } from "../actions";

interface Row {
  id: number;
  name: string;
  sort_order: number;
  logo_url: string | null;
  url: string | null;
}

export default async function EditPartnerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const rows = await query<Row[]>("SELECT * FROM partners WHERE id = ?", [Number(id)]);
  const row = rows[0];
  if (!row) notFound();

  const boundAction = updatePartner.bind(null, row.id);

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#07283b]">Edit Partner</h1>
      <PartnerForm initial={row} action={boundAction} submitLabel="Save" />
    </div>
  );
}
