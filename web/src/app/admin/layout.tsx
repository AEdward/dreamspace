export const metadata = { title: "Admin - Dreamspace Realty", robots: "noindex, nofollow" };

// Admin is auth-gated and always shows live data — never cache any part of it
// (this also prevents Next from caching stale Server Action responses, which
// was previously causing every action to replay a cached logged-out result).
export const dynamic = "force-dynamic";

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-slate-100">{children}</div>;
}
