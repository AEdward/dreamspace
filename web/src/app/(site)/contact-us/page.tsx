import type { Metadata } from "next";
import { getSiteSettings, getOffices } from "@/lib/data";
import { getLocale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { ContactForm } from "@/components/ContactForm";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings(await getLocale());
  const title = settings?.contactHeading || "Contact us";
  const description = settings?.contactIntro || undefined;
  return { title, description, alternates: { canonical: "/contact-us" } };
}

export default async function ContactUsPage() {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const [settings, offices] = await Promise.all([getSiteSettings(locale), getOffices(locale)]);
  const branches = offices.filter((office) => !office.isConstructionSite);

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight text-[#07283b] sm:text-4xl">
        {settings?.contactHeading || "Contact us"}
      </h1>
      <p className="mt-3 max-w-xl text-slate-600">
        {settings?.contactIntro ||
          "Reach out with any questions about pricing, availability, or the registration process — we'll get back to you as soon as we can."}
      </p>

      <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_1fr]">
        <div>
          <h2 className="text-lg font-semibold text-[#07283b]">{dict.contactPage.sendMessage}</h2>
          <div className="mt-4">
            <ContactForm source="contact" dict={dict} submitLabel={dict.form.sendMessage} />
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-[#07283b]">{dict.contactPage.getInTouch}</h2>
          <div className="mt-4 space-y-2 text-sm text-slate-600">
            {settings?.phone && (
              <p>
                {dict.contactPage.mobile}{" "}
                <a href={`tel:${settings.phone.replace(/\s+/g, "")}`} className="text-[#07283b] hover:underline">
                  {settings.phone}
                </a>
              </p>
            )}
            {settings?.email && (
              <p>
                {dict.contactPage.email}{" "}
                <a href={`mailto:${settings.email}`} className="text-[#07283b] hover:underline">
                  {settings.email}
                </a>
                {settings.secondaryEmail && (
                  <>
                    {" "}
                    &middot;{" "}
                    <a href={`mailto:${settings.secondaryEmail}`} className="text-[#07283b] hover:underline">
                      {settings.secondaryEmail}
                    </a>
                  </>
                )}
              </p>
            )}
          </div>

          <h2 className="mt-8 text-lg font-semibold text-[#07283b]">{dict.contactPage.ourOffices}</h2>
          <div className="mt-4 space-y-4">
            {branches.map((office) => (
              <div key={office.id} className="rounded-2xl border border-slate-200 p-4">
                <p className="font-semibold text-[#07283b]">{office.name}</p>
                <p className="mt-1 text-sm text-slate-600">{office.address}</p>
                {office.phones.length > 0 && (
                  <ul className="mt-2 space-y-0.5 text-sm text-slate-500">
                    {office.phones.map((phone) => (
                      <li key={phone.id}>{phone.number}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
