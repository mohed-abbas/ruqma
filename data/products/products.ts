/**
 * Product data service for dynamic routing and product information
 * Provides type-safe access to product catalog with slug-based lookups
 */

import catalogData from './catalog.json';
import type { ProductInfo, BackgroundElements, ProductDetailsData } from '@/components/ui/product/types';

export interface Product {
  id: string;
  name: string;
  model?: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  href: string;
  slug: string;
  brand: string;
  additionalDescription: string;
  showOnHome: boolean;
  // Extended fields for ProductPage component
  ctaText?: string;
  detailedDescription?: string;
  // Product details for features section
  productDetails?: ProductDetailsData;
}

export interface ProductPageData {
  product: ProductInfo;
  backgroundElements?: BackgroundElements;
  metadata: {
    title: string;
    description: string;
    keywords: string[];
  };
}

/**
 * Get all products from catalog
 */
export function getAllProducts(): Product[] {
  return catalogData.products;
}

/**
 * Get product by slug
 * @param slug - Product slug (e.g., 'glidex', 'luxepro')
 */
export function getProductBySlug(slug: string): Product | null {
  const product = catalogData.products.find(product =>
    product.slug === slug
  );
  return product || null;
}

/**
 * Convert catalog product to ProductPage format
 * @param product - Product from catalog
 */
export function getProductPageData(product: Product): ProductPageData {
  return {
    product: {
      name: product.name,
      model: product.model || '',
      description: product.description,
      image: product.imageUrl,
      imageAlt: product.imageAlt,
      ctaText: product.ctaText || "Learn More"
    },
    metadata: {
      title: `${product.name}${product.model} - Premium ${getCategoryFromId(product.id)} | ${product.brand}`,
      description: product.description,
      keywords: generateKeywords(product)
    }
  };
}

/**
 * Get all valid product slugs for static generation
 */
export function getAllProductSlugs(): string[] {
  return catalogData.products.map(product => product.slug);
}

/**
 * Enhanced product data - now uses catalog data directly
 */
export function getEnhancedProductData(slug: string): ProductPageData | null {
  const product = getProductBySlug(slug);
  if (!product) return null;

  return getProductPageData(product);
}

/**
 * Helper functions
 */
function getCategoryFromId(id: string): string {
  if (id.includes('mouse-pad')) return 'Gaming Mouse Pad';
  if (id.includes('keyboard')) return 'Mechanical Keyboard';
  if (id.includes('headset')) return 'Wireless Headset';
  if (id.includes('mouse')) return 'Gaming Mouse';
  if (id.includes('stand')) return 'Monitor Stand';
  if (id.includes('lamp')) return 'Desk Lamp';
  return 'Gaming Accessory';
}

function generateKeywords(product: Product): string[] {
  const baseKeywords = [product.name.toLowerCase(), product.brand.toLowerCase()];
  const categoryKeywords = getCategoryFromId(product.id).toLowerCase().split(' ');
  return [...baseKeywords, ...categoryKeywords, 'premium', 'gaming', 'accessories'];
}

/**
 * Get product details by slug for ProductDetailsSection component
 * @param slug - Product slug (e.g., 'glidex', 'luxepro')
 * @returns ProductDetailsData or null if not found
 */
export function getProductDetails(slug: string): ProductDetailsData | null {
  const product = getProductBySlug(slug);
  return product?.productDetails || null;
}