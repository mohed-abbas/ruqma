/**
 * GROQ Queries for Sanity CMS
 *
 * GROQ (Graph-Relational Object Queries) is Sanity's query language
 * for fetching data from the Content Lake.
 */

// ============================================================================
// PRODUCT QUERIES
// ============================================================================

/**
 * Get all products that should be shown on homepage
 * Ordered by name alphabetically
 */
export const productsQuery = `
  *[_type == "product" && showOnHome == true] | order(name asc) {
    _id,
    name,
    model,
    "slug": slug.current,
    description,
    mainImage {
      asset->,
      alt
    },
    brand,
    showOnHome
  }
`

/**
 * Get all products (for products page or admin views)
 */
export const allProductsQuery = `
  *[_type == "product"] | order(name asc) {
    _id,
    name,
    model,
    "slug": slug.current,
    description,
    mainImage {
      asset->,
      alt
    },
    brand,
    showOnHome
  }
`

/**
 * Get single product by slug with full details
 * Includes nested productDetails with features and images
 */
export const productBySlugQuery = `
  *[_type == "product" && slug.current == $slug][0] {
    _id,
    name,
    model,
    "slug": slug.current,
    description,
    mainImage {
      asset->,
      alt
    },
    brand,
    productDetails {
      mainFeature {
        title,
        highlight,
        description,
        image {
          asset->,
          alt
        }
      },
      features[] {
        _key,
        id,
        title,
        highlight,
        description
      },
      detailImage {
        asset->,
        alt
      }
    },
    gallery {
      title,
      subtitle,
      images[] {
        _key,
        asset->,
        alt,
        gridSpan {
          cols,
          rows
        },
        aspectRatio,
        priority
      }
    }
  }
`

// ============================================================================
// TESTIMONIAL QUERIES
// ============================================================================

/**
 * Get all testimonials ordered by priority and date
 * Lower priority numbers appear first
 */
export const testimonialsQuery = `
  *[_type == "testimonial"] | order(priority asc, date desc) {
    _id,
    name,
    company,
    rating,
    text,
    avatar {
      asset->
    },
    cardType,
    priority,
    date
  }
`

/**
 * Get featured testimonials (priority <= 3) for homepage
 */
export const featuredTestimonialsQuery = `
  *[_type == "testimonial" && priority <= 3] | order(priority asc) [0...6] {
    _id,
    name,
    company,
    rating,
    text,
    avatar {
      asset->
    },
    cardType,
    priority,
    date
  }
`

// ============================================================================
// PARTNER QUERIES
// ============================================================================

/**
 * Get all active partners ordered by display order
 */
export const partnersQuery = `
  *[_type == "partner" && isActive == true] | order(displayOrder asc) {
    _id,
    name,
    logo {
      asset->
    },
    website,
    description,
    displayOrder
  }
`

// ============================================================================
// SITEMAP & METADATA QUERIES
// ============================================================================

/**
 * Get all product slugs for sitemap generation
 */
export const productSlugsQuery = `
  *[_type == "product" && defined(slug.current)] {
    "slug": slug.current,
    _updatedAt
  }
`

/**
 * Get counts for dashboard or analytics
 */
export const contentCountsQuery = `
  {
    "products": count(*[_type == "product"]),
    "testimonials": count(*[_type == "testimonial"]),
    "partners": count(*[_type == "partner" && isActive == true])
  }
`
