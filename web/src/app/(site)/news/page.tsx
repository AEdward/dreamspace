import { NewsSection } from "@/components/NewsSection";
import { getPosts } from "@/lib/data";

export const metadata = { title: "News - Dreamspace Realty" };
export const revalidate = 60;

export default async function NewsPage() {
  const posts = await getPosts(100);

  return <NewsSection posts={posts} heading="News" />;
}
