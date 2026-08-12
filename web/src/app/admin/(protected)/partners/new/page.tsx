import { PartnerForm } from "../PartnerForm";
import { createPartner } from "../actions";

export default function NewPartnerPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-[#07283b]">New Partner</h1>
      <PartnerForm action={createPartner} submitLabel="Create" />
    </div>
  );
}
