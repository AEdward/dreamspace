import Link from "next/link";
import Image from "next/image";
import type { Post } from "@/lib/types";
import { mediaUrl } from "@/lib/strapi";

export function NewsSection({ posts, heading = "Latest news" }: { posts: Post[]; heading?: string }) {
  if (posts.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <h2 className="text-3xl font-bold text-[#07283b]">{heading}</h2>

      <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => {
          const cover = mediaUrl(post.coverImage?.url);
          return (
            <Link
              key={post.id}
              href={`/news/${post.slug}`}
              className="group block overflow-hidden rounded-2xl border border-slate-200 transition-shadow hover:shadow-md"
            >
              {cover && (
                <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                  <Image
                    src={cover}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
              )}
              <div className="p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#f4600a]">{post.category}</p>
                <h3 className="mt-2 text-lg font-semibold text-[#07283b] group-hover:underline">{post.title}</h3>
                {post.excerpt && <p className="mt-2 line-clamp-3 text-sm text-slate-600">{post.excerpt}</p>}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
