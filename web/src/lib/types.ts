export interface StrapiImageFormat {
  url: string;
  width: number;
  height: number;
}

export interface StrapiImage {
  id: number;
  url: string;
  alternativeText: string | null;
  width: number;
  height: number;
  formats?: Record<string, StrapiImageFormat>;
}

export interface SiteSettings {
  siteName: string;
  heroHeadline: string;
  heroSubheadline: string | null;
  heroImage: StrapiImage | null;
  logo: StrapiImage | null;
  phone: string;
  email: string;
  secondaryEmail: string | null;
  registerCtaLabel: string;
  appointmentCtaLabel: string;
  popupEnabled: boolean;
  popupHeadline: string;
  footerCredit: string;
}

export interface ValueProp {
  id: number;
  title: string;
  description: string;
  order: number;
  icon: StrapiImage | null;
}

export interface UnitType {
  id: number;
  name: string;
  order: number;
  sqm: number;
  bedrooms: number;
  bathrooms: number;
  downPayment: number;
  serviceFee: number;
  monthlySavings: number;
  monthlyServiceFee: number;
  finalServiceFeeAfterDraw: number;
  totalConstructionCost: number;
  currency: string;
  image: StrapiImage | null;
}

export interface PhoneNumber {
  id: number;
  label: string | null;
  number: string;
}

export interface Office {
  id: number;
  name: string;
  order: number;
  address: string;
  phones: PhoneNumber[];
  isConstructionSite: boolean;
}

export interface Partner {
  id: number;
  name: string;
  order: number;
  logo: StrapiImage | null;
  url: string | null;
}

export interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  coverImage: StrapiImage | null;
  author: string;
  category: string;
  publishedDate: string;
}

export interface StrapiListResponse<T> {
  data: T[];
  meta: { pagination: { page: number; pageSize: number; pageCount: number; total: number } };
}

export interface StrapiSingleResponse<T> {
  data: T;
}
