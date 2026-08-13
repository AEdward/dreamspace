import { notFound } from "next/navigation";
import { query } from "@/lib/db";
import { BankAccountForm } from "../BankAccountForm";
import { updateBankAccount } from "../actions";

interface Row {
  id: number;
  bank_name: string;
  registration_account: string;
  price_account: string;
  sort_order: number;
}

export default async function EditBankAccountPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const rows = await query<Row[]>("SELECT * FROM bank_accounts WHERE id = ?", [Number(id)]);
  const row = rows[0];
  if (!row) notFound();

  const boundAction = updateBankAccount.bind(null, row.id);

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#07283b]">Edit Bank Account</h1>
      <BankAccountForm initial={row} action={boundAction} submitLabel="Save" />
    </div>
  );
}
