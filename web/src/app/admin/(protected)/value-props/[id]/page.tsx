import { notFound } from "next/navigation";
import { query } from "@/lib/db";
import { ValuePropForm } from "../ValuePropForm";
import { updateValueProp } from "../actions";

interface Row {
  id: number;
  title: string;
  description: string;
  sort_order: number;
}

export default async function EditValuePropPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const rows = await query<Row[]>("SELECT * FROM value_props WHERE id = ?", [Number(id)]);
  const row = rows[0];
  if (!row) notFound();

  const boundAction = updateValueProp.bind(null, row.id);

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#07283b]">Edit Value Prop</h1>
      <ValuePropForm initial={row} action={boundAction} submitLabel="Save" />
    </div>
  );
}
