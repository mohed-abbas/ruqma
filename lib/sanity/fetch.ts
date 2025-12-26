/**
 * Data Fetching Utilities for Sanity CMS
 *
 * These functions provide a clean interface for fetching content from Sanity
 * with proper caching and revalidation strategies.
 */

import { client } from './client'
import {
  productsQuery,
  allProductsQuery,
  productBySlugQuery,
  partnersQuery,
  productSlugsQuery,
  contentCountsQuery,
  testimonialsQuery,
  featuredTestimonialsQuery,
} from './queries'

// ============================================================================
// PRODUCT FETCHING
// ============================================================================

/**
 * Get all products that should be shown on homepage
 * Uses ISR with 60-second revalidation
 */
export async function getProducts() {
  try {
    return await client.fetch(
      productsQuery,
      {},
      {
        next: {
          revalidate: 60, // Revalidate every 60 seconds
          tags: ['products'], // Tag for on-demand revalidation
        },
      }
    )
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}

/**
 * Get all products (including those not shown on homepage)
 */
export async function getAllProducts() {
  try {
    return await client.fetch(
      allProductsQuery,
      {},
      {
        next: {
          revalidate: 60,
          tags: ['products'],
        },
      }
    )
  } catch (error) {
    console.error('Error fetching all products:', error)
    return []
  }
}

/**
 * Get single product by slug with full details
 * @param slug - The product slug (e.g., "glidex")
 */
export async function getProductBySlug(slug: string) {
  try {
    return await client.fetch(
      productBySlugQuery,
      { slug },
      {
        next: {
          revalidate: 60,
          tags: ['products', `product-${slug}`],
        },
      }
    )
  } catch (error) {
    console.error(`Error fetching product ${slug}:`, error)
    return null
  }
}

/**
 * Get all product slugs (for sitemap or static path generation)
 */
export async function getProductSlugs() {
  try {
    return await client.fetch(productSlugsQuery, {}, {
      next: {
        revalidate: 3600, // Revalidate every hour
      },
    })
  } catch (error) {
    console.error('Error fetching product slugs:', error)
    return []
  }
}

// ============================================================================
// PARTNER FETCHING
// ============================================================================

/**
 * Get all active partners ordered by display order
 */
export async function getPartners() {
  try {
    return await client.fetch(
      partnersQuery,
      {},
      {
        next: {
          revalidate: 300, // Revalidate every 5 minutes
          tags: ['partners'],
        },
      }
    )
  } catch (error) {
    console.error('Error fetching partners:', error)
    return []
  }
}

// ============================================================================
// TESTIMONIAL FETCHING
// ============================================================================

/**
 * Get all active testimonials ordered by priority
 *
 * Caching strategy:
 * - Development: No cache (instant updates for content editing)
 * - Production: Static cache until webhook revalidation
 *
 * Testimonials are near-static content that rarely changes,
 * so we use on-demand revalidation via /api/revalidate webhook
 * instead of time-based ISR.
 */
export async function getTestimonials() {
  const isDev = process.env.NODE_ENV === 'development'

  try {
    return await client.fetch(
      testimonialsQuery,
      {},
      {
        next: isDev
          ? { revalidate: 0 } // No cache in development
          : { tags: ['testimonials'] }, // Static + on-demand revalidation in production
      }
    )
  } catch (error) {
    console.error('Error fetching testimonials:', error)
    return []
  }
}

/**
 * Get featured testimonials only
 */
export async function getFeaturedTestimonials() {
  const isDev = process.env.NODE_ENV === 'development'

  try {
    return await client.fetch(
      featuredTestimonialsQuery,
      {},
      {
        next: isDev
          ? { revalidate: 0 }
          : { tags: ['testimonials'] },
      }
    )
  } catch (error) {
    console.error('Error fetching featured testimonials:', error)
    return []
  }
}

// ============================================================================
// ANALYTICS & METADATA
// ============================================================================

/**
 * Get content counts for all document types
 * Useful for dashboards or analytics
 */
export async function getContentCounts() {
  try {
    return await client.fetch(
      contentCountsQuery,
      {},
      {
        next: {
          revalidate: 300,
        },
      }
    )
  } catch (error) {
    console.error('Error fetching content counts:', error)
    return {
      products: 0,
      partners: 0,
    }
  }
}

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Sanity Asset Reference Type
 */
interface SanityAssetReference {
  _ref: string
  _type: 'reference'
}

/**
 * Sanity Product Type (matches schema)
 */
export interface SanityProduct {
  _id: string
  name: string
  slug: string
  description: string
  mainImage: {
    asset: SanityAssetReference
    alt: string
  }
  brand: string
  showOnHome: boolean
  productDetails?: {
    // New two-column layout structure
    leftColumn?: {
      productImage?: {
        asset: SanityAssetReference & { url?: string }
        alt?: string
      }
      headline?: {
        darkText?: string
        goldText?: string
      }
      description?: string
    }
    featureCards?: Array<{
      _key: string
      id?: string
      goldText: string
      darkText?: string
      description: string
    }>
    detailImage?: {
      asset: SanityAssetReference & { url?: string }
      alt?: string
    }
    // Legacy fields for backward compatibility
    mainFeature?: {
      title: string
      highlight: string
      description: string
      image: {
        asset: SanityAssetReference
        alt: string
      }
    }
    features?: Array<{
      _key: string
      id: string
      title: string
      highlight: string
      description: string
    }>
  }
}

/**
 * Sanity Partner Type (matches schema)
 */
export interface SanityPartner {
  _id: string
  name: string
  logo: {
    asset: SanityAssetReference
  }
  website?: string
  description?: string
  displayOrder: number
}

/**
 * Sanity Testimonial Type (matches schema)
 */
export interface SanityTestimonial {
  _id: string
  name: string
  role: string
  company: string
  content: string
  rating: number
  image?: {
    asset: SanityAssetReference
    alt?: string
  }
  cardType: 'tall' | 'wide' | 'compact'
  priority: number
  featured?: boolean
}
