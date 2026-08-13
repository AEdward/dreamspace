import { Fragment } from "react";
import type { Metadata } from "next";
import { Hero } from "@/components/Hero";
import { ValueProps } from "@/components/ValueProps";
import { PricingTable } from "@/components/PricingTable";
import { BankDetails } from "@/components/BankDetails";
import { StatsSection } from "@/components/StatsSection";
import { NewsSection } from "@/components/NewsSection";
import { PartnersStrip } from "@/components/PartnersStrip";
import { ConstructionSites } from "@/components/ConstructionSites";
import {
  getSiteSettings,
  getValueProps,
  getUnitTypes,
  getPosts,
  getPartners,
  getBankAccounts,
  getOffices,
  getPageSections,
} from "@/lib/data";
import { getLocale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { SITE_URL } from "@/lib/seo";
import type { SectionKey } from "@/lib/types";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings(await getLocale());
  const title = settings?.siteName ?? "Dreamspace Realty";
  const description =
    settings?.heroSubheadline ??
    "Affordable housing development and homeownership solutions in Addis Ababa, Ethiopia.";
  const image = settings?.heroImageUrl ?? "/brand/hero.jpg";

  return {
    title,
    description,
    alternates: { canonical: "/" },
    openGraph: { title, description, url: SITE_URL, siteName: title, images: [image], type: "website" },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export default async function Home() {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const [settings, valueProps, unitTypes, posts, partners, bankAccounts, offices, sections] = await Promise.all([
    getSiteSettings(locale),
    getValueProps(locale),
    getUnitTypes(locale),
    getPosts(3, locale),
    getPartners(),
    getBankAccounts(),
    getOffices(locale),
    getPageSections("home"),
  ]);

  const renderers: Record<SectionKey, () => React.ReactNode> = {
    hero: () => <Hero settings={settings} dict={dict} />,
    value_props: () => <ValueProps items={valueProps} />,
    pricing: () => <PricingTable units={unitTypes} dict={dict} />,
    bank_details: () => <BankDetails accounts={bankAccounts} dict={dict} />,
    stats: () => (settings?.statsEnabled ? <StatsSection stats={settings.stats} dict={dict} /> : null),
    news: () => <NewsSection posts={posts} dict={dict} />,
    construction_sites: () => <ConstructionSites offices={offices} dict={dict} />,
    partners: () => <PartnersStrip partners={partners} dict={dict} />,
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: settings?.siteName ?? "Dreamspace Realty",
    url: SITE_URL,
    ...(settings?.logoUrl ? { logo: new URL(settings.logoUrl, SITE_URL).toString() } : {}),
    ...(settings?.phone ? { telephone: settings.phone } : {}),
    ...(settings?.email ? { email: settings.email } : {}),
    areaServed: { "@type": "City", name: "Addis Ababa" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {sections.filter((section) => section.visible).map((section) => (
        <Fragment key={section.key}>{renderers[section.key]()}</Fragment>
      ))}
    </>
  );
}
