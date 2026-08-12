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
  const { data } = await get<StrapiListResponse<ValueProp>>("/value-props?populate=*&sort=order:asc");
  return data;
}

export async function getUnitTypes(): Promise<UnitType[]> {
  const { data } = await get<StrapiListResponse<UnitType>>("/unit-types?populate=*&sort=order:asc");
  return data;
}

export async function getOffices(): Promise<Office[]> {
  const { data } = await get<StrapiListResponse<Office>>("/offices?populate=*&sort=order:asc");
  return data;
}

export async function getPartners(): Promise<Partner[]> {
  const { data } = await get<StrapiListResponse<Partner>>("/partners?populate=*&sort=order:asc");
  return data;
}

export async function getPosts(limit = 3): Promise<Post[]> {
  const { data } = await get<StrapiListResponse<Post>>(
    `/posts?populate=*&sort=publishedDate:desc&pagination[limit]=${limit}`
  );
  return data;
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const { data } = await get<StrapiListResponse<Post>>(
    `/posts?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=*`
  );
  return data[0] ?? null;
}
