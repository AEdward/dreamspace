import { Hero } from "@/components/Hero";
import { ValueProps } from "@/components/ValueProps";
import { PricingTable } from "@/components/PricingTable";
import { NewsSection } from "@/components/NewsSection";
import { PartnersStrip } from "@/components/PartnersStrip";
import { getSiteSettings, getValueProps, getUnitTypes, getPosts, getPartners } from "@/lib/strapi";

export default async function Home() {
  const [settings, valueProps, unitTypes, posts, partners] = await Promise.all([
    getSiteSettings(),
    getValueProps(),
    getUnitTypes(),
    getPosts(3),
    getPartners(),
  ]);

  return (
    <>
      <Hero settings={settings} />
      <ValueProps items={valueProps} />
      <PricingTable units={unitTypes} />
      <NewsSection posts={posts} />
      <PartnersStrip partners={partners} />
    </>
  );
}
