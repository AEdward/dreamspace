import { OfficeForm } from "../OfficeForm";
import { createOffice } from "../actions";

export default function NewOfficePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-[#07283b]">New Office</h1>
      <OfficeForm action={createOffice} submitLabel="Create" />
    </div>
  );
}
