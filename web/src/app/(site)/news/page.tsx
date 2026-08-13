import { NewsSection } from "@/components/NewsSection";
import { getPosts } from "@/lib/data";
import { getLocale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionaries";

export const metadata = {
  title: "News",
  description: "Housing market news, financing guides, and updates from Dreamspace Realty.",
  alternates: { canonical: "/news" },
};
export const revalidate = 60;

export default async function NewsPage() {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const posts = await getPosts(100, locale);

  return <NewsSection posts={posts} dict={dict} heading={dict.news.all} />;
}
