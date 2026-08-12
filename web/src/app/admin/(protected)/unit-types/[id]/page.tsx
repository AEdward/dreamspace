import { notFound } from "next/navigation";
import { query } from "@/lib/db";
import { UnitTypeForm } from "../UnitTypeForm";
import { updateUnitType } from "../actions";

interface Row {
  id: number;
  name: string;
  sort_order: number;
  sqm: string;
  bedrooms: number;
  bathrooms: number;
  down_payment: string;
  service_fee: string;
  monthly_savings: string;
  monthly_service_fee: string;
  final_service_fee_after_draw: string;
  total_construction_cost: string;
  currency: string;
  image_url: string | null;
}

export default async function EditUnitTypePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const rows = await query<Row[]>("SELECT * FROM unit_types WHERE id = ?", [Number(id)]);
  const row = rows[0];
  if (!row) notFound();

  const boundAction = updateUnitType.bind(null, row.id);

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#07283b]">Edit Unit Type</h1>
      <UnitTypeForm
        initial={{
          name: row.name,
          sort_order: row.sort_order,
          sqm: Number(row.sqm),
          bedrooms: row.bedrooms,
          bathrooms: row.bathrooms,
          down_payment: Number(row.down_payment),
          service_fee: Number(row.service_fee),
          monthly_savings: Number(row.monthly_savings),
          monthly_service_fee: Number(row.monthly_service_fee),
          final_service_fee_after_draw: Number(row.final_service_fee_after_draw),
          total_construction_cost: Number(row.total_construction_cost),
          currency: row.currency,
          image_url: row.image_url,
        }}
        action={boundAction}
        submitLabel="Save"
      />
    </div>
  );
}
