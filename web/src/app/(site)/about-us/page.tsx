import { getSiteSettings, getValueProps, getPartners } from "@/lib/data";

export const revalidate = 60;

export default async function AboutUsPage() {
  const [settings, valueProps, partners] = await Promise.all([getSiteSettings(), getValueProps(), getPartners()]);

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight text-[#07283b] sm:text-4xl">
        {settings?.aboutHeading || `About ${settings?.siteName ?? "Dreamspace Realty"}`}
      </h1>
      {settings?.aboutBody ? (
        <div className="mt-4 space-y-4 text-lg text-slate-600">
          {settings.aboutBody.split("\n").filter(Boolean).map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      ) : (
        <p className="mt-4 text-lg text-slate-600">
          {settings?.heroHeadline ?? "We will make it happen!"} {settings?.heroSubheadline ?? ""}
        </p>
      )}

      {valueProps.length > 0 && (
        <div className="mt-12 grid gap-8 sm:grid-cols-2">
          {valueProps.map((item) => (
            <div key={item.id} className="rounded-2xl border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-[#07283b]">{item.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.description}</p>
            </div>
          ))}
        </div>
      )}

      {partners.length > 0 && (
        <div className="mt-12">
          <h2 className="text-lg font-semibold text-[#07283b]">Partners and sister companies</h2>
          <div className="mt-4 flex flex-wrap items-center gap-8">
            {partners.map((partner) =>
              partner.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={partner.id} src={partner.logoUrl} alt={partner.name} className="h-10 w-auto object-contain" />
              ) : (
                <span key={partner.id} className="font-semibold text-[#07283b]">
                  {partner.name}
                </span>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}
