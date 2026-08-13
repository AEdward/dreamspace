import { BankAccountForm } from "../BankAccountForm";
import { createBankAccount } from "../actions";

export default function NewBankAccountPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-[#07283b]">New Bank Account</h1>
      <BankAccountForm action={createBankAccount} submitLabel="Create" />
    </div>
  );
}
