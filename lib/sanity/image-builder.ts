/**
 * Sanity Image Builder Utilities
 *
 * Provides optimized image URL generation with performance best practices.
 * Includes presets for common use cases and automatic format/quality optimization.
 */

import { urlForImage } from './client'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'

/**
 * Image optimization presets for different use cases
 */
export const IMAGE_PRESETS = {
  /**
   * Product card images on homepage
   * - Optimized for grid display
   * - WebP format with quality 85
   */
  productCard: {
    width: 800,
    height: 600,
    format: 'webp' as const,
    quality: 85,
    fit: 'max' as const
  },

  /**
   * Product hero images on detail pages
   * - Higher resolution for main product display
   * - WebP format with quality 90
   */
  productHero: {
    width: 1200,
    height: 900,
    format: 'webp' as const,
    quality: 90,
    fit: 'max' as const
  },

  /**
   * Product feature images
   * - Medium resolution for feature sections
   * - WebP format with quality 85
   */
  productFeature: {
    width: 1000,
    height: 750,
    format: 'webp' as const,
    quality: 85,
    fit: 'max' as const
  },

  /**
   * Testimonial avatars
   * - Small, circular images
   * - WebP format with quality 80
   */
  testimonialAvatar: {
    width: 200,
    height: 200,
    format: 'webp' as const,
    quality: 80,
    fit: 'crop' as const
  },

  /**
   * Partner logos
   * - Medium size for partner grid
   * - PNG format to preserve transparency
   */
  partnerLogo: {
    width: 300,
    height: 150,
    format: 'png' as const,
    quality: 90,
    fit: 'max' as const
  },

  /**
   * Thumbnail images
   * - Small preview images
   * - WebP format with quality 75
   */
  thumbnail: {
    width: 400,
    height: 300,
    format: 'webp' as const,
    quality: 75,
    fit: 'max' as const
  },

  /**
   * Open Graph images for social sharing
   * - 1200x630 per OG spec
   * - JPEG format for compatibility
   */
  openGraph: {
    width: 1200,
    height: 630,
    format: 'jpg' as const,
    quality: 85,
    fit: 'crop' as const
  }
} as const

/**
 * Responsive image configuration for srcset generation
 */
export const RESPONSIVE_WIDTHS = {
  small: [320, 640],
  medium: [640, 768, 1024],
  large: [768, 1024, 1280, 1920]
} as const

/**
 * Build optimized image URL with preset configuration
 *
 * @param source - Sanity image source
 * @param preset - Named preset from IMAGE_PRESETS
 * @returns Optimized image URL
 *
 * @example
 * ```tsx
 * const url = buildImageUrl(product.mainImage, 'productCard')
 * // Returns: https://cdn.sanity.io/images/.../800x600.webp?q=85&fit=max
 * ```
 */
export function buildImageUrl(
  source: SanityImageSource,
  preset: keyof typeof IMAGE_PRESETS
): string {
  if (!source) return ''

  const config = IMAGE_PRESETS[preset]
  const builder = urlForImage(source)
    .width(config.width)
    .height(config.height)
    .format(config.format)
    .quality(config.quality)
    .fit(config.fit)
    .auto('format') // Automatic format selection based on browser support

  return builder.url()
}

/**
 * Build responsive srcset for optimized image loading
 *
 * @param source - Sanity image source
 * @param widths - Array of widths for srcset generation
 * @param format - Image format (default: 'webp')
 * @param quality - Image quality (default: 85)
 * @returns srcset string for responsive images
 *
 * @example
 * ```tsx
 * const srcset = buildSrcSet(product.mainImage, [640, 1024, 1920])
 * // Returns: "https://.../640.webp 640w, https://.../1024.webp 1024w, ..."
 * ```
 */
export function buildSrcSet(
  source: SanityImageSource,
  widths: readonly number[],
  format: 'webp' | 'jpg' | 'png' = 'webp',
  quality: number = 85
): string {
  if (!source) return ''

  return widths
    .map(width => {
      const url = urlForImage(source)
        .width(width)
        .format(format)
        .quality(quality)
        .auto('format')
        .url()
      return `${url} ${width}w`
    })
    .join(', ')
}

/**
 * Build responsive srcset using preset configuration
 *
 * @param source - Sanity image source
 * @param size - Size category (small/medium/large)
 * @param format - Image format (default: 'webp')
 * @param quality - Image quality (default: 85)
 * @returns srcset string for responsive images
 *
 * @example
 * ```tsx
 * const srcset = buildResponsiveSrcSet(product.mainImage, 'large')
 * ```
 */
export function buildResponsiveSrcSet(
  source: SanityImageSource,
  size: keyof typeof RESPONSIVE_WIDTHS = 'medium',
  format: 'webp' | 'jpg' | 'png' = 'webp',
  quality: number = 85
): string {
  return buildSrcSet(source, RESPONSIVE_WIDTHS[size], format, quality)
}

/**
 * Get image metadata for optimization analysis
 *
 * @param source - Sanity image source
 * @returns Image metadata object with URL
 *
 * @example
 * ```tsx
 * const metadata = getImageMetadata(product.mainImage)
 * // Returns: { url: '...', aspectRatio: 1.78 }
 * ```
 */
export function getImageMetadata(source: SanityImageSource) {
  if (!source) return null

  const builder = urlForImage(source)

  // Note: Sanity image builder doesn't expose metadata directly
  // We return the URL builder for further manipulation
  return {
    url: builder.url(),
    builder: builder
  }
}

/**
 * Generate blur placeholder for progressive image loading
 *
 * @param source - Sanity image source
 * @returns Base64-encoded blur placeholder URL
 *
 * @example
 * ```tsx
 * const blurDataURL = buildBlurPlaceholder(product.mainImage)
 * <Image src={url} blurDataURL={blurDataURL} placeholder="blur" />
 * ```
 */
export function buildBlurPlaceholder(source: SanityImageSource): string {
  if (!source) return ''

  // Generate a tiny, low-quality image for blur placeholder
  return urlForImage(source)
    .width(20)
    .quality(10)
    .blur(50)
    .url()
}

/**
 * Build optimized Open Graph image URL for social sharing
 *
 * @param source - Sanity image source
 * @param title - Optional title text to overlay
 * @returns OG-optimized image URL
 *
 * @example
 * ```tsx
 * const ogImage = buildOGImage(product.mainImage)
 * // Use in meta tags for social sharing
 * ```
 */
export function buildOGImage(
  source: SanityImageSource,
  title?: string
): string {
  if (!source) return ''

  const config = IMAGE_PRESETS.openGraph
  const builder = urlForImage(source)
    .width(config.width)
    .height(config.height)
    .format(config.format)
    .quality(config.quality)
    .fit(config.fit)

  // Add title overlay if provided (requires custom Sanity image pipeline)
  // This is a placeholder - implement actual text overlay via Sanity
  if (title) {
    // Future: Add text overlay via Sanity image pipeline
  }

  return builder.url()
}

/**
 * Performance monitoring: Log image optimization metrics
 *
 * @param source - Sanity image source
 * @param preset - Preset used
 * @param loadTime - Time taken to load image (ms)
 */
export function logImagePerformance(
  source: SanityImageSource,
  preset: keyof typeof IMAGE_PRESETS,
  loadTime: number
) {
  if (process.env.NODE_ENV === 'development') {
    const config = IMAGE_PRESETS[preset]
    console.log(`[Image Performance] ${preset}:`, {
      source: typeof source === 'string' ? source : 'object',
      config,
      loadTime: `${loadTime}ms`,
      optimized: loadTime < 1000 ? '✅' : '⚠️'
    })
  }
}

/**
 * Helper: Check if image source is valid
 *
 * @param source - Sanity image source to validate
 * @returns true if source is valid and can be processed
 */
export function isValidImageSource(source: SanityImageSource): boolean {
  if (!source) return false

  if (typeof source === 'string') return source.length > 0

  if (typeof source === 'object') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return !!(source as any).asset || !!(source as any)._ref
  }

  return false
}
