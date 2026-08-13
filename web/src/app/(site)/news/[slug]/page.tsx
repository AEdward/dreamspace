import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPostBySlug } from "@/lib/data";
import { getLocale } from "@/lib/i18n/locale";

export const revalidate = 60;

export async function generateMetadata({ params }: PageProps<"/news/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug, await getLocale());
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    alternates: { canonical: `/news/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt ?? undefined,
      type: "article",
      images: post.coverImageUrl ? [post.coverImageUrl] : undefined,
    },
  };
}

export default async function NewsPostPage({ params }: PageProps<"/news/[slug]">) {
  const { slug } = await params;
  const locale = await getLocale();
  const post = await getPostBySlug(slug, locale);

  if (!post) {
    notFound();
  }

  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      <p className="text-xs font-semibold uppercase tracking-wide text-[#f4600a]">{post.category}</p>
      <h1 className="mt-2 text-3xl font-bold text-[#07283b] sm:text-4xl">{post.title}</h1>
      <p className="mt-3 text-sm text-slate-500">
        By {post.author} &middot; {new Date(post.publishedDate).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>

      {post.coverImageUrl && (
        <div className="relative mt-8 h-72 w-full overflow-hidden rounded-2xl bg-slate-100 sm:h-96">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.coverImageUrl} alt={post.title} className="h-full w-full object-cover" />
        </div>
      )}

      <div className="mt-8 space-y-4 text-base leading-relaxed text-slate-700">
        {post.content.split("\n\n").map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>
    </article>
  );
}
