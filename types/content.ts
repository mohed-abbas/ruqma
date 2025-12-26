// Brand Identity Types
export interface BrandIdentity {
  name: string;
  tagline: string;
  description: string;
  year: number;
}

// SEO Types
export interface OrganizationSchema {
  '@context': string;
  '@type': string;
  name: string;
  description: string;
  url: string;
  logo: string;
  sameAs: string[];
}

export interface SeoData {
  organization: OrganizationSchema;
}

// Navigation Types
export interface NavItem {
  href: string;
  label: string;
  type: 'scroll' | 'page';
}

export interface MainNavigation {
  items: NavItem[];
}

export interface FooterLink {
  href: string;
  label: string;
}

export interface FooterNavigation {
  sections: {
    useful: FooterLink[];
    company: FooterLink[];
    support: FooterLink[];
  };
}

// Content Types
export interface CTAButton {
  text: string;
  ariaLabel: string;
}

export interface HeroContent {
  title: string;
  subtitle: string;
  cta: CTAButton;
}

export interface SectionContent {
  products: {
    title: string;
    titleAccent: string;
  };
}

export interface ActionButtons {
  buttons: {
    whereToBuy: CTAButton;
    discoverMore: CTAButton;
  };
}

// Product Types
export interface Product {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  href: string;
  brand: string;
  additionalDescription: string;
  showOnHome: boolean;
}

export interface ProductCatalog {
  products: Product[];
}

// Legal Types
export interface LegalContent {
  copyright: string;
}

// Our Story Types
export interface OurStoryHero {
  title: string;
  titleAccent: string;
  subtitle: string;
  backgroundImage?: string;
  ctaText?: string;
  ctaAriaLabel?: string;
}

export interface ImageContent {
  src: string;
  alt: string;
}

export interface StoryIntroduction {
  heading: string;
  headingAccent?: string;
  paragraphs: string[];
  image: ImageContent;
}

export interface ValueCard {
  id?: string;
  icon: string;
  title: string;
  description: string;
}

export interface TimelineMilestone {
  year: string;
  quarter?: string;
  title: string;
  description: string;
  isFuture?: boolean;
}

export interface CraftsmanshipStat {
  value: string;
  label: string;
}

export interface Craftsmanship {
  heading: string;
  headingAccent?: string;
  description: string;
  image: ImageContent;
  stats?: CraftsmanshipStat[];
}

export interface StoryCTA {
  heading: string;
  headingAccent?: string;
  subheading: string;
  buttonText: string;
  buttonLink: string;
  buttonAriaLabel: string;
  previewImage?: ImageContent;
}

export interface OurStoryContent {
  hero: OurStoryHero;
  introduction: StoryIntroduction;
  values: ValueCard[];
  timeline: TimelineMilestone[];
  craftsmanship: Craftsmanship;
  cta: StoryCTA;
}

// Where to Buy Types
export interface WhereToBuyHero {
  title: string;
  titleAccent: string;
  subtitle: string;
}

export interface StoreLocation {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface StoreContact {
  phone: string;
  email: string;
  website: string;
}

export interface StoreHours {
  weekday: string;
  weekend: string;
}

export interface PartnerStore {
  id: string;
  storeName: string;
  location: StoreLocation;
  contact: StoreContact;
  hours: StoreHours;
  image: ImageContent;
  featured: boolean;
}

export interface StoreLocator {
  heading: string;
  description: string;
  comingSoon: boolean;
  placeholder: string;
}

export interface StoreFeature {
  icon: string;
  title: string;
  description: string;
}

export interface PartnerCTA {
  heading: string;
  subheading: string;
  buttonText: string;
  buttonLink: string;
  buttonAriaLabel: string;
}

export interface WhereToBuyContent {
  hero: WhereToBuyHero;
  introduction: StoryIntroduction;
  storeLocator: StoreLocator;
  stores: PartnerStore[];
  features: StoreFeature[];
  partnerCTA: PartnerCTA;
}