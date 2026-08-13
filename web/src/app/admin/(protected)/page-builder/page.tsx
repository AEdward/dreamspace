import { getPageSections } from "@/lib/data";
import { requireAdmin } from "@/lib/auth";
import { PageBuilderEditor } from "./PageBuilderEditor";

export default async function PageBuilderPage() {
  await requireAdmin();
  const sections = await getPageSections("home");

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#07283b]">Page Builder</h1>
      <p className="mt-1 text-sm text-slate-500">
        Drag to reorder the homepage's sections, or hide one entirely. Changes go live as soon as you save.
      </p>
      <PageBuilderEditor initialSections={sections} />
    </div>
  );
}
