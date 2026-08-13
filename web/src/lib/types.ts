export interface SiteSettings {
  siteName: string;
  heroHeadline: string;
  heroSubheadline: string | null;
  heroImageUrl: string | null;
  logoUrl: string | null;
  phone: string;
  email: string;
  secondaryEmail: string | null;
  registerCtaLabel: string;
  appointmentCtaLabel: string;
  popupEnabled: boolean;
  popupHeadline: string;
  footerCredit: string;
  statsEnabled: boolean;
  stats: { value: string; label: string }[];
  maintenanceMode: boolean;
}

export interface BankAccount {
  id: number;
  bankName: string;
  registrationAccount: string;
  priceAccount: string;
}

export interface ValueProp {
  id: number;
  title: string;
  description: string;
}

export interface UnitType {
  id: number;
  name: string;
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
  imageUrl: string | null;
}

export interface PhoneNumber {
  id: number;
  label: string | null;
  number: string;
}

export interface Office {
  id: number;
  name: string;
  address: string;
  phones: PhoneNumber[];
  isConstructionSite: boolean;
}

export interface Partner {
  id: number;
  name: string;
  logoUrl: string | null;
  url: string | null;
}

export interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  coverImageUrl: string | null;
  author: string;
  category: string;
  publishedDate: string;
}
