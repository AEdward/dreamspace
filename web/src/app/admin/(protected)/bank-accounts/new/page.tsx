import { requireAdmin } from "@/lib/auth";
import { BankAccountForm } from "../BankAccountForm";
import { createBankAccount } from "../actions";

export default async function NewBankAccountPage() {
  await requireAdmin();
  return (
    <div>
      <h1 className="text-2xl font-bold text-[#07283b]">New Bank Account</h1>
      <BankAccountForm action={createBankAccount} submitLabel="Create" />
    </div>
  );
}
