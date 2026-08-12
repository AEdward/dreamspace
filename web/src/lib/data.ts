import { query } from "./db";
import type { SiteSettings, ValueProp, UnitType, Office, PhoneNumber, Partner, Post } from "./types";

interface SiteSettingsRow {
  site_name: string;
  hero_headline: string;
  hero_subheadline: string | null;
  hero_image_url: string | null;
  logo_url: string | null;
  phone: string;
  email: string;
  secondary_email: string | null;
  register_cta_label: string;
  appointment_cta_label: string;
  popup_enabled: number;
  popup_headline: string;
  footer_credit: string;
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  try {
    const rows = await query<SiteSettingsRow[]>("SELECT * FROM site_settings LIMIT 1");
    const row = rows[0];
    if (!row) return null;
    return {
      siteName: row.site_name,
      heroHeadline: row.hero_headline,
      heroSubheadline: row.hero_subheadline,
      heroImageUrl: row.hero_image_url,
      logoUrl: row.logo_url,
      phone: row.phone,
      email: row.email,
      secondaryEmail: row.secondary_email,
      registerCtaLabel: row.register_cta_label,
      appointmentCtaLabel: row.appointment_cta_label,
      popupEnabled: !!row.popup_enabled,
      popupHeadline: row.popup_headline,
      footerCredit: row.footer_credit,
    };
  } catch {
    return null;
  }
}

interface ValuePropRow {
  id: number;
  title: string;
  description: string;
}

export async function getValueProps(): Promise<ValueProp[]> {
  try {
    const rows = await query<ValuePropRow[]>("SELECT id, title, description FROM value_props ORDER BY sort_order ASC");
    return rows;
  } catch {
    return [];
  }
}

interface UnitTypeRow {
  id: number;
  name: string;
  sqm: string;
  bedrooms: number;
  bathrooms: number;
  down_payment: string;
  service_fee: string;
  monthly_savings: string;
  monthly_service_fee: string;
  final_service_fee_after_draw: string;
  total_construction_cost: string;
  currency: string;
  image_url: string | null;
}

export async function getUnitTypes(): Promise<UnitType[]> {
  try {
    const rows = await query<UnitTypeRow[]>("SELECT * FROM unit_types ORDER BY sort_order ASC");
    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      sqm: Number(row.sqm),
      bedrooms: row.bedrooms,
      bathrooms: row.bathrooms,
      downPayment: Number(row.down_payment),
      serviceFee: Number(row.service_fee),
      monthlySavings: Number(row.monthly_savings),
      monthlyServiceFee: Number(row.monthly_service_fee),
      finalServiceFeeAfterDraw: Number(row.final_service_fee_after_draw),
      totalConstructionCost: Number(row.total_construction_cost),
      currency: row.currency,
      imageUrl: row.image_url,
    }));
  } catch {
    return [];
  }
}

interface OfficeRow {
  id: number;
  name: string;
  address: string;
  is_construction_site: number;
}

interface PhoneRow {
  id: number;
  office_id: number;
  label: string | null;
  number: string;
}

export async function getOffices(): Promise<Office[]> {
  try {
    const offices = await query<OfficeRow[]>("SELECT * FROM offices ORDER BY sort_order ASC");
    const phones = await query<PhoneRow[]>("SELECT * FROM office_phones ORDER BY sort_order ASC");
    return offices.map((office) => ({
      id: office.id,
      name: office.name,
      address: office.address,
      isConstructionSite: !!office.is_construction_site,
      phones: phones
        .filter((p) => p.office_id === office.id)
        .map((p): PhoneNumber => ({ id: p.id, label: p.label, number: p.number })),
    }));
  } catch {
    return [];
  }
}

interface PartnerRow {
  id: number;
  name: string;
  logo_url: string | null;
  url: string | null;
}

export async function getPartners(): Promise<Partner[]> {
  try {
    const rows = await query<PartnerRow[]>("SELECT * FROM partners ORDER BY sort_order ASC");
    return rows.map((row) => ({ id: row.id, name: row.name, logoUrl: row.logo_url, url: row.url }));
  } catch {
    return [];
  }
}

interface PostRow {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image_url: string | null;
  author: string;
  category: string;
  published_date: string;
}

function mapPost(row: PostRow): Post {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    content: row.content,
    coverImageUrl: row.cover_image_url,
    author: row.author,
    category: row.category,
    publishedDate: row.published_date,
  };
}

export async function getPosts(limit = 3): Promise<Post[]> {
  try {
    const rows = await query<PostRow[]>("SELECT * FROM posts ORDER BY published_date DESC LIMIT ?", [limit]);
    return rows.map(mapPost);
  } catch {
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const rows = await query<PostRow[]>("SELECT * FROM posts WHERE slug = ? LIMIT 1", [slug]);
    return rows[0] ? mapPost(rows[0]) : null;
  } catch {
    return null;
  }
}
