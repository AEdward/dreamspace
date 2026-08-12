import Image from "next/image";
import { notFound } from "next/navigation";
import { getPostBySlug, mediaUrl } from "@/lib/strapi";

export default async function NewsPostPage({ params }: PageProps<"/news/[slug]">) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const cover = mediaUrl(post.coverImage?.url);

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

      {cover && (
        <div className="relative mt-8 h-72 w-full overflow-hidden rounded-2xl bg-slate-100 sm:h-96">
          <Image src={cover} alt={post.title} fill className="object-cover" />
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
