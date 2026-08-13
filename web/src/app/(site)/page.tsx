import { Fragment } from "react";
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
import type { SectionKey } from "@/lib/types";

export const revalidate = 60;

export default async function Home() {
  const [settings, valueProps, unitTypes, posts, partners, bankAccounts, offices, sections] = await Promise.all([
    getSiteSettings(),
    getValueProps(),
    getUnitTypes(),
    getPosts(3),
    getPartners(),
    getBankAccounts(),
    getOffices(),
    getPageSections("home"),
  ]);

  const renderers: Record<SectionKey, () => React.ReactNode> = {
    hero: () => <Hero settings={settings} />,
    value_props: () => <ValueProps items={valueProps} />,
    pricing: () => <PricingTable units={unitTypes} />,
    bank_details: () => <BankDetails accounts={bankAccounts} />,
    stats: () => (settings?.statsEnabled ? <StatsSection stats={settings.stats} /> : null),
    news: () => <NewsSection posts={posts} />,
    construction_sites: () => <ConstructionSites offices={offices} />,
    partners: () => <PartnersStrip partners={partners} />,
  };

  return sections
    .filter((section) => section.visible)
    .map((section) => <Fragment key={section.key}>{renderers[section.key]()}</Fragment>);
}
