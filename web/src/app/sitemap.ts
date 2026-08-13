import type { MetadataRoute } from "next";
import { getPosts } from "@/lib/data";
import { SITE_URL } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPosts(1000);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/about-us`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/contact-us`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/news`, changeFrequency: "weekly", priority: 0.6 },
  ];

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/news/${post.slug}`,
    lastModified: post.publishedDate,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...staticRoutes, ...postRoutes];
}
