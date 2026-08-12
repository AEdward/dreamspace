import type { Partner } from "@/lib/types";

export function PartnersStrip({ partners }: { partners: Partner[] }) {
  if (partners.length === 0) return null;

  return (
    <section className="border-y border-slate-200 bg-white py-14">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-center text-sm font-semibold uppercase tracking-wide text-slate-500">
          Partners and sister companies
        </h2>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-10">
          {partners.map((partner) =>
            partner.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={partner.id}
                src={partner.logoUrl}
                alt={partner.name}
                className="h-12 w-auto object-contain grayscale"
              />
            ) : (
              <span key={partner.id} className="text-lg font-semibold text-[#07283b]">
                {partner.name}
              </span>
            )
          )}
        </div>
      </div>
    </section>
  );
}
