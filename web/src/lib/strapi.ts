import type {
  SiteSettings,
  ValueProp,
  UnitType,
  Office,
  Partner,
  Post,
  StrapiListResponse,
  StrapiSingleResponse,
} from "./types";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337";

export function mediaUrl(url?: string | null): string | null {
  if (!url) return null;
  return url.startsWith("http") ? url : `${STRAPI_URL}${url}`;
}

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${STRAPI_URL}/api${path}`, { next: { revalidate: 60 } });
  if (!res.ok) {
    throw new Error(`Strapi request failed: ${path} (${res.status})`);
  }
  return res.json();
}

/**
 * The CMS may be temporarily unreachable (deploy in progress, restart, etc.)
 * — pages should degrade gracefully instead of failing to build/render.
 */
async function getListSafely<T>(path: string): Promise<T[]> {
  try {
    const { data } = await get<StrapiListResponse<T>>(path);
    return data;
  } catch {
    return [];
  }
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  try {
    const { data } = await get<StrapiSingleResponse<SiteSettings>>("/site-setting?populate=*");
    return data;
  } catch {
    // No entry created yet, or the CMS isn't reachable — pages fall back to defaults.
    return null;
  }
}

export async function getValueProps(): Promise<ValueProp[]> {
  return getListSafely<ValueProp>("/value-props?populate=*&sort=order:asc");
}

export async function getUnitTypes(): Promise<UnitType[]> {
  return getListSafely<UnitType>("/unit-types?populate=*&sort=order:asc");
}

export async function getOffices(): Promise<Office[]> {
  return getListSafely<Office>("/offices?populate=*&sort=order:asc");
}

export async function getPartners(): Promise<Partner[]> {
  return getListSafely<Partner>("/partners?populate=*&sort=order:asc");
}

export async function getPosts(limit = 3): Promise<Post[]> {
  return getListSafely<Post>(`/posts?populate=*&sort=publishedDate:desc&pagination[limit]=${limit}`);
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const { data } = await get<StrapiListResponse<Post>>(
      `/posts?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=*`
    );
    return data[0] ?? null;
  } catch {
    return null;
  }
}
