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
}

export interface ProductCatalog {
  products: Product[];
}

// Legal Types
export interface LegalContent {
  copyright: string;
}