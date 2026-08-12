import { ValuePropForm } from "../ValuePropForm";
import { createValueProp } from "../actions";

export default function NewValuePropPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-[#07283b]">New Value Prop</h1>
      <ValuePropForm action={createValueProp} submitLabel="Create" />
    </div>
  );
}
