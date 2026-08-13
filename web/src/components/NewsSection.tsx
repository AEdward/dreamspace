"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Post } from "@/lib/types";

export function NewsSection({ posts, heading = "Latest news" }: { posts: Post[]; heading?: string }) {
  if (posts.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold tracking-tight text-[#07283b] sm:text-4xl"
      >
        {heading}
      </motion.h2>

      <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post, i) => {
          const cover = post.coverImageUrl;
          return (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <Link
                href={`/news/${post.slug}`}
                className="group block overflow-hidden rounded-2xl border border-slate-200 transition-shadow hover:shadow-lg"
              >
                {cover && (
                  <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={cover}
                      alt={post.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#f4600a]">{post.category}</p>
                  <h3 className="mt-2 text-lg font-semibold text-[#07283b] group-hover:underline">{post.title}</h3>
                  {post.excerpt && <p className="mt-2 line-clamp-3 text-sm text-slate-600">{post.excerpt}</p>}
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
