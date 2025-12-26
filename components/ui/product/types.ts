/**
 * Product page component types and interfaces
 * Following CLAUDE.md design system conventions
 */

/**
 * Background elements for decorative page elements
 */
export interface BackgroundElements {
  /** SVG or image path for decorative pattern/ellipses */
  decorativePattern: string;
  /** Optional additional background elements */
  secondaryPattern?: string;
}

/**
 * Product information structure
 */
export interface ProductInfo {
  /** Product name (e.g., "GlideX") */
  name: string;
  /** Product description text */
  description: string;
  /** Main product image URL */
  image: string;
  /** Alt text for product image */
  imageAlt: string;
  /** Call-to-action button text */
  ctaText?: string;
}

/**
 * Navigation item structure
 */
export interface NavigationItem {
  /** Link text */
  label: string;
  /** Link destination */
  href: string;
  /** Whether this item is currently active */
  active?: boolean;
}

/**
 * Props for ProductPage component
 */
export interface ProductPageProps {
  /** Product information */
  product: ProductInfo;
  /** Optional background decorative elements */
  backgroundElements?: BackgroundElements;
  /** Optional navigation items (falls back to default if not provided) */
  navigationItems?: NavigationItem[];
  /** Optional CSS class for container customization */
  className?: string;
  /** Optional callback for CTA button click - NOTE: Cannot be used from server components in Next.js 15 */
  onCtaClick?: () => void;
  /** Optional callback for learn more button click - NOTE: Cannot be used from server components in Next.js 15 */
  onLearnMoreClick?: () => void;
}

/**
 * Animation preset types for Framer Motion integration
 */
export type AnimationPreset = 'luxury' | 'minimal' | 'playful' | 'disabled';

/**
 * Responsive configuration for component behavior
 */
export interface ResponsiveConfig {
  /** Breakpoint behavior configuration */
  breakpoints: {
    mobile: string;
    tablet: string;
    desktop: string;
  };
  /** Container padding adjustments */
  containerPadding: {
    mobile: string;
    tablet: string;
    desktop: string;
  };
}

/**
 * Accessibility requirements interface
 */
export interface A11yRequirements {
  /** ARIA label for main section */
  sectionLabel?: string;
  /** ARIA description for complex interactions */
  description?: string;
  /** Whether component supports keyboard navigation */
  keyboardNavigation: boolean;
  /** Screen reader announcements */
  announcements?: string[];
}

/**
 * Component design specification interface
 * Following CLAUDE.md Figma-to-code workflow guidelines
 */
export interface ComponentDesignSpec {
  /** Layout approach */
  layout: 'grid' | 'flex' | 'absolute';
  /** Responsive behavior configuration */
  responsive: ResponsiveConfig;
  /** Animation presets to apply */
  animations: AnimationPreset[];
  /** Accessibility requirements */
  accessibility: A11yRequirements;
}

/**
 * Feature card for the new two-column layout
 */
export interface FeatureCardData {
  /** Unique feature identifier */
  _key?: string;
  /** Feature ID */
  id?: string;
  /** Gold/primary colored text */
  goldText: string;
  /** Dark colored text */
  darkText?: string;
  /** Feature description */
  description: string;
}

/**
 * Left column data for product features section
 */
export interface LeftColumnData {
  /** Product image */
  productImage?: {
    asset?: { _ref: string; url?: string };
    alt?: string;
  };
  /** Headline with mixed colors */
  headline?: {
    darkText?: string;
    goldText?: string;
  };
  /** Description text */
  description?: string;
}

/**
 * New product features section data structure (matches Figma design)
 */
export interface ProductFeaturesSectionData {
  /** Left column with image and headline */
  leftColumn?: LeftColumnData;
  /** Feature cards for right column */
  featureCards?: FeatureCardData[];
  /** Large detail image */
  detailImage?: {
    asset?: { _ref: string; url?: string };
    alt?: string;
  };
}

/**
 * Product feature information for the details section (Legacy)
 */
export interface ProductFeature {
  /** Unique feature identifier */
  id: string;
  /** Feature title */
  title: string;
  /** Gold-colored highlighted part of title */
  highlight: string;
  /** Feature description text */
  description: string;
  /** Optional icon path */
  icon?: string;
  /** Card type for varied layouts */
  cardType?: 'default' | 'large' | 'wide' | 'compact';
  /** Optional image for visual features */
  image?: string;
  /** Alt text for feature image */
  imageAlt?: string;
}

/**
 * Complete product details data structure (Legacy - for backward compatibility)
 */
export interface ProductDetailsData {
  /** Main feature showcase (Legacy) */
  mainFeature?: {
    /** Main feature title */
    title: string;
    /** Gold-colored highlighted part of title */
    highlight: string;
    /** Feature description */
    description: string;
    /** Feature image URL */
    image: string;
    /** Alt text for feature image */
    imageAlt: string;
  };
  /** Array of secondary features (Legacy) */
  features?: ProductFeature[];
  /** Detail image for right column */
  detailImage?: {
    /** Image URL */
    src: string;
    /** Alt text for detail image */
    alt: string;
  };
  /** New two-column layout fields */
  leftColumn?: LeftColumnData;
  /** Feature cards for new layout */
  featureCards?: FeatureCardData[];
}

/**
 * Props for ProductDetailsSection component
 */
export interface ProductDetailsSectionProps {
  /** Product slug for data lookup */
  productSlug: string;
  /** Optional CSS class for container customization */
  className?: string;
}

/**
 * Props for FeatureCard component
 */
export interface FeatureCardProps {
  /** Feature data */
  feature: ProductFeature;
  /** Optional CSS class for card customization */
  className?: string;
  /** Animation delay for staggered entrance */
  delay?: number;
}

/**
 * Enhanced ProductPageProps to include productSlug
 */
export interface EnhancedProductPageProps extends ProductPageProps {
  /** Product slug for data lookup */
  productSlug: string;
}

/**
 * Border radius options for gallery images (used internally by auto-layout)
 */
export type GalleryBorderRadius = 'default' | 'rounded' | 'pill' | 'none';

/**
 * Gallery image information
 * Simplified interface - layout is automatically determined by the component
 */
export interface GalleryImage {
  /** Unique image identifier */
  id: string;
  /** Thumbnail image URL (optimized for grid display, ~800px) */
  src: string;
  /** Full resolution image URL (for lightbox, ~1920px+) */
  fullSrc: string;
  /** Alt text for accessibility */
  alt: string;
}

/**
 * Product gallery data structure
 * Simplified - just an array of images, title is hardcoded as "A Closer Look"
 */
export interface ProductGalleryData {
  /** Array of gallery images */
  images: GalleryImage[];
}

/**
 * Props for ProductGallery component
 */
export interface ProductGalleryProps {
  /** Product slug for data lookup */
  productSlug: string;
  /** Optional CSS class for container customization */
  className?: string;
}

/**
 * Partner stores CTA data structure
 */
export interface PartnerStoresCTAData {
  /** Main headline text */
  headline: string;
  /** Descriptive text below headline */
  description: string;
  /** Call-to-action button text */
  buttonText: string;
  /** Optional button link destination */
  buttonLink?: string;
}

/**
 * Props for PartnerStoresCTA component
 */
export interface PartnerStoresCTAProps {
  /** Optional CSS class for container customization */
  className?: string;
  /** Optional callback for button click */
  onButtonClick?: () => void;
}