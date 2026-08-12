import type { ValueProp } from "@/lib/types";

export function ValueProps({ items }: { items: ValueProp[] }) {
  if (items.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div key={item.id} className="rounded-2xl border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-[#07283b]">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
