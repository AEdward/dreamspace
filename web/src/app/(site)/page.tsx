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
} from "@/lib/data";

export const revalidate = 60;

export default async function Home() {
  const [settings, valueProps, unitTypes, posts, partners, bankAccounts, offices] = await Promise.all([
    getSiteSettings(),
    getValueProps(),
    getUnitTypes(),
    getPosts(3),
    getPartners(),
    getBankAccounts(),
    getOffices(),
  ]);

  return (
    <>
      <Hero settings={settings} />
      <ValueProps items={valueProps} />
      <PricingTable units={unitTypes} />
      <BankDetails accounts={bankAccounts} />
      {settings?.statsEnabled && <StatsSection stats={settings.stats} />}
      <NewsSection posts={posts} />
      <ConstructionSites offices={offices} />
      <PartnersStrip partners={partners} />
    </>
  );
}
