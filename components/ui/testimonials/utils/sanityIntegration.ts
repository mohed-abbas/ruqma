/**
 * Sanity CMS Integration Utilities - Phase 5: Production Features
 *
 * Comprehensive utilities for integrating testimonials with Sanity CMS,
 * including schema validation, data transformation, and caching strategies.
 */

import type {
  Testimonial,
  SanityTestimonial,
  ValidationResult,
  TestimonialCardType
} from '../types';

/**
 * Sanity client configuration interface
 */
export interface SanityConfig {
  projectId: string;
  dataset: string;
  apiVersion: string;
  useCdn: boolean;
  token?: string;
}

/**
 * Cache configuration for testimonials
 */
export interface CacheConfig {
  ttl: number; // Time to live in seconds
  maxSize: number; // Maximum cache size
  invalidateOnUpdate: boolean;
  prefetchStrategy: 'none' | 'popular' | 'all';
}

/**
 * Sanity query configuration
 */
export interface QueryConfig {
  limit?: number;
  offset?: number;
  orderBy?: 'priority' | 'createdAt' | 'rating' | 'random';
  filterBy?: {
    minRating?: number;
    cardType?: TestimonialCardType[];
    featured?: boolean;
    status?: 'published' | 'draft' | 'archived';
  };
  includeMetadata?: boolean;
}

/**
 * Default configurations
 */
export const DEFAULT_SANITY_CONFIG: Partial<SanityConfig> = {
  apiVersion: '2024-01-01',
  useCdn: true,
};

export const DEFAULT_CACHE_CONFIG: CacheConfig = {
  ttl: 300, // 5 minutes
  maxSize: 100,
  invalidateOnUpdate: true,
  prefetchStrategy: 'popular',
};

export const DEFAULT_QUERY_CONFIG: QueryConfig = {
  limit: 20,
  offset: 0,
  orderBy: 'priority',
  includeMetadata: true,
};

/**
 * Transform Sanity testimonial to internal format
 */
export function transformSanityTestimonial(sanityTestimonial: SanityTestimonial): Testimonial {
  const {
    _id,
    name,
    company,
    role,
    text,
    rating,
    avatar,
    cardType,
    priority,
    featured,
    tags,
    metadata,
    _createdAt,
    _updatedAt,
  } = sanityTestimonial;

  // Generate avatar URL from Sanity asset reference
  const avatarUrl = avatar?.asset?._ref
    ? generateSanityImageUrl(avatar.asset._ref, { width: 200, height: 200, quality: 90 })
    : '/testimonials/default-avatar.svg';

  // Determine card type based on content or explicit setting
  const determinedCardType = cardType || determineOptimalCardType(text, company, role);

  // Calculate priority with fallback
  const calculatedPriority = priority || calculatePriorityFromMetadata(rating, featured, _createdAt);

  return {
    id: _id,
    name,
    company,
    role,
    text,
    rating,
    avatar: avatarUrl,
    cardType: determinedCardType,
    priority: calculatedPriority,
    featured: featured || false,
    tags: tags || [],
    metadata: {
      ...metadata,
      source: 'sanity',
      createdAt: _createdAt,
      updatedAt: _updatedAt,
      version: metadata?.version || '1.0',
    },
  };
}

/**
 * Transform internal testimonial to Sanity format
 */
export function transformToSanityTestimonial(testimonial: Testimonial): Partial<SanityTestimonial> {
  const {
    id,
    name,
    company,
    role,
    text,
    rating,
    cardType,
    priority,
    featured,
    tags,
    metadata,
  } = testimonial;

  return {
    _type: 'testimonial',
    name,
    company,
    role,
    text,
    rating,
    cardType,
    priority,
    featured,
    tags,
    metadata: {
      ...metadata,
      lastModified: new Date().toISOString(),
    },
    // Avatar handling would need to be done separately through Sanity's asset upload
  };
}

/**
 * Generate GROQ query for testimonials
 */
export function generateTestimonialsQuery(config: QueryConfig = {}): string {
  const {
    limit = 20,
    offset = 0,
    orderBy = 'priority',
    filterBy = {},
    includeMetadata = true,
  } = { ...DEFAULT_QUERY_CONFIG, ...config };

  const filters: string[] = [];

  // Base filter for published testimonials
  filters.push('_type == "testimonial"');
  filters.push('status == "published"');

  // Add optional filters
  if (filterBy.minRating) {
    filters.push(`rating >= ${filterBy.minRating}`);
  }

  if (filterBy.cardType && filterBy.cardType.length > 0) {
    const types = filterBy.cardType.map(t => `"${t}"`).join(', ');
    filters.push(`cardType in [${types}]`);
  }

  if (filterBy.featured !== undefined) {
    filters.push(`featured == ${filterBy.featured}`);
  }

  // Build filter clause
  const filterClause = filters.join(' && ');

  // Build order clause
  const orderClause = orderBy === 'random'
    ? '| order(_id)' // Pseudo-random ordering
    : `| order(${orderBy} desc)`;

  // Build projection
  const baseProjection = `
    _id,
    name,
    company,
    role,
    text,
    rating,
    avatar,
    cardType,
    priority,
    featured,
    tags,
    _createdAt,
    _updatedAt
  `;

  const metadataProjection = includeMetadata
    ? `, metadata`
    : '';

  const projection = baseProjection + metadataProjection;

  return `
    *[${filterClause}] ${orderClause} [${offset}...${offset + limit}] {
      ${projection}
    }
  `;
}

/**
 * Generate Sanity image URL with transformations
 */
export function generateSanityImageUrl(
  assetRef: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'jpg' | 'png';
    fit?: 'crop' | 'fill' | 'max' | 'min';
  } = {}
): string {
  const {
    width = 200,
    height = 200,
    quality = 90,
    format = 'webp',
    fit = 'crop',
  } = options;

  // Extract project ID and asset ID from reference
  const parts = assetRef.split('-');
  if (parts.length < 3) {
    throw new Error(`Invalid Sanity asset reference: ${assetRef}`);
  }

  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'your-project-id';
  const assetId = parts[1];
  const extension = parts[2].split('.')[1];

  const baseUrl = `https://cdn.sanity.io/images/${projectId}/production/${assetId}-${parts[2]}`;
  const params = new URLSearchParams({
    w: width.toString(),
    h: height.toString(),
    q: quality.toString(),
    fm: format,
    fit,
  });

  return `${baseUrl}?${params.toString()}`;
}

/**
 * Determine optimal card type based on content
 */
function determineOptimalCardType(
  text: string,
  company?: string,
  role?: string
): TestimonialCardType {
  const contentLength = text.length;
  const hasRichMetadata = Boolean(company && role);

  if (contentLength > 200 && hasRichMetadata) {
    return 'tall';
  } else if (contentLength > 100 || hasRichMetadata) {
    return 'wide';
  } else {
    return 'compact';
  }
}

/**
 * Calculate priority from metadata
 */
function calculatePriorityFromMetadata(
  rating: number,
  featured: boolean = false,
  createdAt: string
): number {
  let priority = rating * 2; // Base priority from rating (0-10)

  // Boost for featured testimonials
  if (featured) {
    priority += 3;
  }

  // Slight boost for newer testimonials
  const daysSinceCreated = (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24);
  const recencyBoost = Math.max(0, (30 - daysSinceCreated) / 30) * 0.5;
  priority += recencyBoost;

  return Math.min(10, Math.max(1, priority));
}

/**
 * Validate Sanity testimonial data
 */
export function validateSanityTestimonial(data: unknown): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!data || typeof data !== 'object') {
    errors.push('Invalid testimonial data structure');
    return { isValid: false, errors, warnings };
  }

  const testimonial = data as Partial<SanityTestimonial>;

  // Required fields validation
  if (!testimonial.name || testimonial.name.trim().length === 0) {
    errors.push('Name is required');
  }

  if (!testimonial.text || testimonial.text.trim().length === 0) {
    errors.push('Testimonial text is required');
  }

  if (typeof testimonial.rating !== 'number' || testimonial.rating < 0 || testimonial.rating > 5) {
    errors.push('Rating must be a number between 0 and 5');
  }

  // Optional fields validation
  if (testimonial.company && testimonial.company.trim().length === 0) {
    warnings.push('Company name is empty');
  }

  if (testimonial.role && testimonial.role.trim().length === 0) {
    warnings.push('Role is empty');
  }

  if (testimonial.text && testimonial.text.length < 20) {
    warnings.push('Testimonial text is very short (< 20 characters)');
  }

  if (testimonial.text && testimonial.text.length > 500) {
    warnings.push('Testimonial text is very long (> 500 characters)');
  }

  if (testimonial.priority && (testimonial.priority < 1 || testimonial.priority > 10)) {
    warnings.push('Priority should be between 1 and 10');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Create Sanity mutation for updating testimonial
 */
export function createTestimonialMutation(
  testimonial: Testimonial,
  operation: 'create' | 'update' | 'delete'
) {
  switch (operation) {
    case 'create':
      return {
        create: {
          _type: 'testimonial',
          ...transformToSanityTestimonial(testimonial),
        },
      };

    case 'update':
      return {
        patch: {
          id: testimonial.id,
          set: transformToSanityTestimonial(testimonial),
        },
      };

    case 'delete':
      return {
        delete: {
          id: testimonial.id,
        },
      };

    default:
      throw new Error(`Unsupported operation: ${operation}`);
  }
}

/**
 * Batch process testimonials with error handling
 */
export async function batchProcessTestimonials<T>(
  testimonials: SanityTestimonial[],
  processor: (testimonial: SanityTestimonial) => Promise<T>,
  options: {
    batchSize?: number;
    retryAttempts?: number;
    onError?: (error: Error, testimonial: SanityTestimonial) => void;
  } = {}
): Promise<{ results: T[]; errors: Array<{ testimonial: SanityTestimonial; error: Error }> }> {
  const {
    batchSize = 10,
    retryAttempts = 3,
    onError,
  } = options;

  const results: T[] = [];
  const errors: Array<{ testimonial: SanityTestimonial; error: Error }> = [];

  for (let i = 0; i < testimonials.length; i += batchSize) {
    const batch = testimonials.slice(i, i + batchSize);

    await Promise.allSettled(
      batch.map(async (testimonial) => {
        let lastError: Error;

        for (let attempt = 0; attempt <= retryAttempts; attempt++) {
          try {
            const result = await processor(testimonial);
            results.push(result);
            return;
          } catch (error) {
            lastError = error instanceof Error ? error : new Error(String(error));

            if (attempt === retryAttempts) {
              errors.push({ testimonial, error: lastError });
              onError?.(lastError, testimonial);
            } else {
              // Wait before retry
              await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 100));
            }
          }
        }
      })
    );
  }

  return { results, errors };
}