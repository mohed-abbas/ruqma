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
  testimonialsQuery,
  featuredTestimonialsQuery,
  partnersQuery,
  productSlugsQuery,
  contentCountsQuery,
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
// TESTIMONIAL FETCHING
// ============================================================================

/**
 * Get all testimonials ordered by priority and date
 */
export async function getTestimonials() {
  try {
    return await client.fetch(
      testimonialsQuery,
      {},
      {
        next: {
          revalidate: 60,
          tags: ['testimonials'],
        },
      }
    )
  } catch (error) {
    console.error('Error fetching testimonials:', error)
    return []
  }
}

/**
 * Get featured testimonials for homepage (priority <= 3, max 6)
 */
export async function getFeaturedTestimonials() {
  try {
    return await client.fetch(
      featuredTestimonialsQuery,
      {},
      {
        next: {
          revalidate: 60,
          tags: ['testimonials', 'featured-testimonials'],
        },
      }
    )
  } catch (error) {
    console.error('Error fetching featured testimonials:', error)
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
      testimonials: 0,
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
  model: string
  slug: string
  description: string
  mainImage: {
    asset: SanityAssetReference
    alt: string
  }
  brand: string
  showOnHome: boolean
  productDetails?: {
    mainFeature: {
      title: string
      highlight: string
      description: string
      image: {
        asset: SanityAssetReference
        alt: string
      }
    }
    features: Array<{
      _key: string
      id: string
      title: string
      highlight: string
      description: string
    }>
    detailImage: {
      asset: SanityAssetReference
      alt: string
    }
  }
}

/**
 * Sanity Testimonial Type (matches schema)
 */
export interface SanityTestimonial {
  _id: string
  name: string
  company: string
  rating: number
  text: string
  avatar: {
    asset: SanityAssetReference
  }
  cardType: 'tall' | 'wide' | 'compact'
  priority: number
  date: string
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
