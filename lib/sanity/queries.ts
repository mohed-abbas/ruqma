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
 * Includes nested productDetails with two-column layout structure
 */
export const productBySlugQuery = `
  *[_type == "product" && slug.current == $slug][0] {
    _id,
    name,
    "slug": slug.current,
    description,
    mainImage {
      asset->,
      alt
    },
    brand,
    productDetails {
      // New two-column layout structure
      leftColumn {
        productImage {
          asset->,
          alt
        },
        headline {
          darkText,
          goldText
        },
        description
      },
      featureCards[] {
        _key,
        id,
        goldText,
        darkText,
        description
      },
      detailImage {
        asset->,
        alt
      },
      // Legacy fields for backward compatibility
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
// TESTIMONIAL QUERIES
// ============================================================================

/**
 * Get all active testimonials ordered by priority
 * Used for homepage testimonials section
 */
export const testimonialsQuery = `
  *[_type == "testimonial" && isActive == true] | order(priority asc) {
    _id,
    name,
    role,
    company,
    content,
    rating,
    image {
      asset->,
      alt
    },
    cardType,
    priority,
    featured
  }
`

/**
 * Get featured testimonials only
 * For hero sections or highlighted displays
 */
export const featuredTestimonialsQuery = `
  *[_type == "testimonial" && isActive == true && featured == true] | order(priority asc) {
    _id,
    name,
    role,
    company,
    content,
    rating,
    image {
      asset->,
      alt
    },
    cardType,
    priority,
    featured
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
    "partners": count(*[_type == "partner" && isActive == true]),
    "testimonials": count(*[_type == "testimonial" && isActive == true])
  }
`
