import { query } from "./db";
import type { Locale } from "./i18n/locale";
import type {
  SiteSettings,
  ValueProp,
  UnitType,
  Office,
  PhoneNumber,
  Partner,
  Post,
  BankAccount,
  PageSection,
  SectionKey,
} from "./types";

interface TranslationRow {
  entity_id: number;
  field: string;
  value: string | null;
}

/** entityType/locale -> { "id:field": value }. A missing entry means "fall back to the English column". */
async function loadTranslationMap(entityType: string, locale: Locale): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  if (locale === "en") return map;
  try {
    const rows = await query<TranslationRow[]>(
      "SELECT entity_id, field, value FROM translations WHERE entity_type = ? AND locale = ?",
      [entityType, locale]
    );
    for (const row of rows) {
      if (row.value) map.set(`${row.entity_id}:${row.field}`, row.value);
    }
  } catch {
    // translations table may not exist yet on an un-migrated DB
  }
  return map;
}

function translate<T extends string | null>(map: Map<string, string>, id: number, field: string, fallback: T): T {
  return (map.get(`${id}:${field}`) as T) ?? fallback;
}

export const DEFAULT_SECTION_ORDER: SectionKey[] = [
  "hero",
  "value_props",
  "pricing",
  "bank_details",
  "stats",
  "news",
  "construction_sites",
  "partners",
];

interface SiteSettingsRow {
  id: number;
  site_name: string;
  hero_headline: string;
  hero_subheadline: string | null;
  hero_image_url: string | null;
  logo_url: string | null;
  phone: string;
  email: string;
  secondary_email: string | null;
  register_cta_label: string;
  popup_enabled: number;
  popup_headline: string;
  footer_credit: string;
  footer_credit_url: string | null;
  stats_enabled: number;
  stat1_value: string;
  stat1_label: string;
  stat2_value: string;
  stat2_label: string;
  stat3_value: string;
  stat3_label: string;
  stat4_value: string;
  stat4_label: string;
  maintenance_mode: number;
  about_heading: string | null;
  about_body: string | null;
  contact_heading: string;
  contact_intro: string | null;
}

export async function getSiteSettings(locale: Locale = "en"): Promise<SiteSettings | null> {
  try {
    const rows = await query<SiteSettingsRow[]>("SELECT * FROM site_settings LIMIT 1");
    const row = rows[0];
    if (!row) return null;
    const t = await loadTranslationMap("site_settings", locale);
    const id = row.id;
    return {
      siteName: row.site_name,
      heroHeadline: translate(t, id, "hero_headline", row.hero_headline),
      heroSubheadline: translate(t, id, "hero_subheadline", row.hero_subheadline),
      heroImageUrl: row.hero_image_url,
      logoUrl: row.logo_url,
      phone: row.phone,
      email: row.email,
      secondaryEmail: row.secondary_email,
      registerCtaLabel: translate(t, id, "register_cta_label", row.register_cta_label),
      popupEnabled: !!row.popup_enabled,
      popupHeadline: translate(t, id, "popup_headline", row.popup_headline),
      footerCredit: row.footer_credit,
      footerCreditUrl: row.footer_credit_url,
      statsEnabled: !!row.stats_enabled,
      stats: [
        { value: row.stat1_value, label: row.stat1_label },
        { value: row.stat2_value, label: row.stat2_label },
        { value: row.stat3_value, label: row.stat3_label },
        { value: row.stat4_value, label: row.stat4_label },
      ],
      maintenanceMode: !!row.maintenance_mode,
      aboutHeading: translate(t, id, "about_heading", row.about_heading),
      aboutBody: translate(t, id, "about_body", row.about_body),
      contactHeading: translate(t, id, "contact_heading", row.contact_heading),
      contactIntro: translate(t, id, "contact_intro", row.contact_intro),
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

export async function getValueProps(locale: Locale = "en"): Promise<ValueProp[]> {
  try {
    const rows = await query<ValuePropRow[]>("SELECT id, title, description FROM value_props ORDER BY sort_order ASC");
    const t = await loadTranslationMap("value_prop", locale);
    return rows.map((row) => ({
      id: row.id,
      title: translate(t, row.id, "title", row.title),
      description: translate(t, row.id, "description", row.description),
    }));
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

export async function getUnitTypes(locale: Locale = "en"): Promise<UnitType[]> {
  try {
    const rows = await query<UnitTypeRow[]>("SELECT * FROM unit_types ORDER BY sort_order ASC");
    const t = await loadTranslationMap("unit_type", locale);
    return rows.map((row) => ({
      id: row.id,
      name: translate(t, row.id, "name", row.name),
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

export async function getOffices(locale: Locale = "en"): Promise<Office[]> {
  try {
    const offices = await query<OfficeRow[]>("SELECT * FROM offices ORDER BY sort_order ASC");
    const phones = await query<PhoneRow[]>("SELECT * FROM office_phones ORDER BY sort_order ASC");
    const t = await loadTranslationMap("office", locale);
    return offices.map((office) => ({
      id: office.id,
      name: translate(t, office.id, "name", office.name),
      address: translate(t, office.id, "address", office.address),
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

function mapPost(row: PostRow, t: Map<string, string>): Post {
  return {
    id: row.id,
    title: translate(t, row.id, "title", row.title),
    slug: row.slug,
    excerpt: translate(t, row.id, "excerpt", row.excerpt),
    content: translate(t, row.id, "content", row.content),
    coverImageUrl: row.cover_image_url,
    author: row.author,
    category: row.category,
    publishedDate: row.published_date,
  };
}

export async function getPosts(limit = 3, locale: Locale = "en"): Promise<Post[]> {
  try {
    const rows = await query<PostRow[]>("SELECT * FROM posts ORDER BY published_date DESC LIMIT ?", [limit]);
    const t = await loadTranslationMap("post", locale);
    return rows.map((row) => mapPost(row, t));
  } catch {
    return [];
  }
}

export async function getPostBySlug(slug: string, locale: Locale = "en"): Promise<Post | null> {
  try {
    const rows = await query<PostRow[]>("SELECT * FROM posts WHERE slug = ? LIMIT 1", [slug]);
    if (!rows[0]) return null;
    const t = await loadTranslationMap("post", locale);
    return mapPost(rows[0], t);
  } catch {
    return null;
  }
}

interface BankAccountRow {
  id: number;
  bank_name: string;
  registration_account: string;
  price_account: string;
}

export async function getBankAccounts(): Promise<BankAccount[]> {
  try {
    const rows = await query<BankAccountRow[]>("SELECT * FROM bank_accounts ORDER BY sort_order ASC");
    return rows.map((row) => ({
      id: row.id,
      bankName: row.bank_name,
      registrationAccount: row.registration_account,
      priceAccount: row.price_account,
    }));
  } catch {
    return [];
  }
}

interface PageSectionRow {
  section_key: SectionKey;
  visible: number;
}

export async function getPageSections(page: string): Promise<PageSection[]> {
  try {
    const rows = await query<PageSectionRow[]>(
      "SELECT section_key, visible FROM page_sections WHERE page = ? ORDER BY sort_order ASC",
      [page]
    );
    if (rows.length === 0) {
      return DEFAULT_SECTION_ORDER.map((key) => ({ key, visible: true }));
    }
    return rows.map((row) => ({ key: row.section_key, visible: !!row.visible }));
  } catch {
    return DEFAULT_SECTION_ORDER.map((key) => ({ key, visible: true }));
  }
}
