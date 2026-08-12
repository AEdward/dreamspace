import Image from "next/image";
import type { Partner } from "@/lib/types";
import { mediaUrl } from "@/lib/strapi";

export function PartnersStrip({ partners }: { partners: Partner[] }) {
  if (partners.length === 0) return null;

  return (
    <section className="border-y border-slate-200 bg-white py-14">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-center text-sm font-semibold uppercase tracking-wide text-slate-500">
          Partners and sister companies
        </h2>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-10">
          {partners.map((partner) => {
            const logo = mediaUrl(partner.logo?.url);
            return logo ? (
              <Image
                key={partner.id}
                src={logo}
                alt={partner.name}
                width={140}
                height={60}
                className="h-12 w-auto object-contain grayscale"
              />
            ) : (
              <span key={partner.id} className="text-lg font-semibold text-[#07283b]">
                {partner.name}
              </span>
            );
          })}
        </div>
      </div>
    </section>
  );
}
