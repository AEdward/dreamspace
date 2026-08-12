import { UnitTypeForm } from "../UnitTypeForm";
import { createUnitType } from "../actions";

export default function NewUnitTypePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-[#07283b]">New Unit Type</h1>
      <UnitTypeForm action={createUnitType} submitLabel="Create" />
    </div>
  );
}
