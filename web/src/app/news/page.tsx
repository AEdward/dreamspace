import { NewsSection } from "@/components/NewsSection";
import { getPosts } from "@/lib/strapi";

export const metadata = { title: "News - Dreamspace Realty" };

export default async function NewsPage() {
  const posts = await getPosts(100);

  return <NewsSection posts={posts} heading="News" />;
}
