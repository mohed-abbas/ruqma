/**
 * Static Testimonials Service - Phase 5: Design-First Implementation
 *
 * Simplified service for loading testimonials from JSON file
 * Focused on design completion rather than complex backend integration
 */

'use client';

import type { Testimonial } from '../types';

/**
 * Simple query configuration for static data
 */
export interface StaticQueryConfig {
  limit?: number;
  offset?: number;
  featured?: boolean;
  cardType?: 'tall' | 'wide' | 'compact' | 'all';
  shuffle?: boolean;
}

/**
 * Static testimonials service for design purposes
 */
export class StaticTestimonialsService {
  private cachedData: Testimonial[] | null = null;
  private lastFetch: number = 0;
  private readonly cacheDuration = 5 * 60 * 1000; // 5 minutes

  /**
   * Load testimonials from JSON file
   */
  async loadTestimonials(config: StaticQueryConfig = {}): Promise<{
    testimonials: Testimonial[];
    total: number;
    metadata: {
      source: 'cache' | 'file';
      loadTime: number;
    };
  }> {
    const startTime = performance.now();

    try {
      // Check cache first
      if (this.cachedData && (Date.now() - this.lastFetch) < this.cacheDuration) {
        const filtered = this.applyFilters(this.cachedData, config);
        return {
          testimonials: filtered,
          total: this.cachedData.length,
          metadata: {
            source: 'cache',
            loadTime: performance.now() - startTime,
          },
        };
      }

      // Try primary data source first, then fallback
      let response;
      let data;

      try {
        response = await fetch('/data/testimonials.json');
        if (response.ok) {
          data = await response.json();
        } else {
          // Fallback to content testimonials
          response = await fetch('/data/content/testimonials.json');
          if (response.ok) {
            const contentData = await response.json();
            // Transform content data structure
            data = { testimonials: contentData.testimonials || [] };
          }
        }
      } catch {
        // Try content testimonials as final fallback
        response = await fetch('/data/content/testimonials.json');
        if (response.ok) {
          const contentData = await response.json();
          data = { testimonials: contentData.testimonials || [] };
        }
      }

      if (!data) {
        throw new Error(`Failed to load testimonials from both data sources`);
      }

      // Validate and transform data
      const testimonials = this.validateAndTransformTestimonials(data.testimonials || []);

      // Cache the results
      this.cachedData = testimonials;
      this.lastFetch = Date.now();

      // Apply filters
      const filtered = this.applyFilters(testimonials, config);

      return {
        testimonials: filtered,
        total: testimonials.length,
        metadata: {
          source: 'file',
          loadTime: performance.now() - startTime,
        },
      };
    } catch (error) {
      console.error('Error loading testimonials:', error);

      // Return fallback data
      return {
        testimonials: this.getFallbackTestimonials(),
        total: 0,
        metadata: {
          source: 'cache',
          loadTime: performance.now() - startTime,
        },
      };
    }
  }

  /**
   * Get a single testimonial by ID
   */
  async getTestimonialById(id: string): Promise<Testimonial | null> {
    const { testimonials } = await this.loadTestimonials();
    return testimonials.find(t => t.id === id) || null;
  }

  /**
   * Get featured testimonials
   */
  async getFeaturedTestimonials(limit: number = 6): Promise<Testimonial[]> {
    const { testimonials } = await this.loadTestimonials({
      featured: true,
      limit,
    });
    return testimonials;
  }

  /**
   * Get testimonials by card type
   */
  async getTestimonialsByType(
    cardType: 'tall' | 'wide' | 'compact',
    limit: number = 10
  ): Promise<Testimonial[]> {
    const { testimonials } = await this.loadTestimonials({
      cardType,
      limit,
    });
    return testimonials;
  }

  /**
   * Get random testimonials for showcase
   */
  async getRandomTestimonials(count: number = 8): Promise<Testimonial[]> {
    const { testimonials } = await this.loadTestimonials({
      shuffle: true,
      limit: count,
    });
    return testimonials;
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cachedData = null;
    this.lastFetch = 0;
  }

  /**
   * Private methods
   */

  private validateAndTransformTestimonials(data: unknown[]): Testimonial[] {
    return data
      .map(item => this.validateTestimonialItem(item))
      .filter((item): item is Testimonial => item !== null);
  }

  private validateTestimonialItem(item: unknown): Testimonial | null {
    try {
      // Type guard for basic object structure
      if (!item || typeof item !== 'object' || Array.isArray(item)) {
        console.warn('Invalid testimonial item: not an object', item);
        return null;
      }

      const testimonialData = item as Record<string, unknown>;

      // Basic validation
      if (!testimonialData.id || !testimonialData.name || !testimonialData.text || typeof testimonialData.rating !== 'number') {
        console.warn('Invalid testimonial item:', testimonialData);
        return null;
      }

      // Ensure required fields have defaults and handle content data structure
      const testimonial = {
        id: String(testimonialData.id),
        name: String(testimonialData.name),
        company: (testimonialData.company as string) || '',
        role: (testimonialData.role as string) || 'Customer', // Default role for content data
        text: String(testimonialData.text),
        rating: Math.max(0, Math.min(5, Number(testimonialData.rating))),
        avatar: (testimonialData.avatar as string) || '/testimonials/default-avatar.svg',
        cardType: ['tall', 'wide', 'compact'].includes(testimonialData.cardType as string)
          ? (testimonialData.cardType as 'tall' | 'wide' | 'compact')
          : this.determineCardType(String(testimonialData.text), testimonialData.company as string, testimonialData.role as string),
        priority: Math.max(1, Math.min(10, Number(testimonialData.priority || 5))),
        featured: Boolean(testimonialData.featured),
        tags: Array.isArray(testimonialData.tags) ? (testimonialData.tags as string[]) : ['general'], // Default tags
        metadata: {
          source: 'static',
          version: '1.0',
          createdAt: (testimonialData.metadata as Record<string, unknown>)?.createdAt as string || new Date().toISOString(),
          updatedAt: (testimonialData.metadata as Record<string, unknown>)?.updatedAt as string || new Date().toISOString(),
          ...(testimonialData.metadata as Record<string, unknown>),
        },
      };

      return testimonial;
    } catch (error) {
      console.error('Error validating testimonial item:', error, item);
      return null;
    }
  }

  private determineCardType(text: string, company?: string, role?: string): 'tall' | 'wide' | 'compact' {
    const textLength = text.length;
    const hasMetadata = Boolean(company && role);

    if (textLength > 200 && hasMetadata) {
      return 'tall';
    } else if (textLength > 100 || hasMetadata) {
      return 'wide';
    } else {
      return 'compact';
    }
  }

  private applyFilters(testimonials: Testimonial[], config: StaticQueryConfig): Testimonial[] {
    let filtered = [...testimonials];

    // Filter by featured status
    if (config.featured !== undefined) {
      filtered = filtered.filter(t => t.featured === config.featured);
    }

    // Filter by card type
    if (config.cardType && config.cardType !== 'all') {
      filtered = filtered.filter(t => t.cardType === config.cardType);
    }

    // Shuffle if requested
    if (config.shuffle) {
      filtered = this.shuffleArray(filtered);
    } else {
      // Sort by priority (descending) and rating (descending)
      filtered.sort((a, b) => {
        if (a.priority !== b.priority) {
          return b.priority - a.priority;
        }
        return b.rating - a.rating;
      });
    }

    // Apply pagination
    const offset = config.offset || 0;
    const limit = config.limit || filtered.length;

    return filtered.slice(offset, offset + limit);
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  private getFallbackTestimonials(): Testimonial[] {
    return [
      {
        id: 'fallback-1',
        name: 'John Doe',
        company: 'Example Corp',
        role: 'Manager',
        text: 'Great service and support.',
        rating: 5,
        avatar: '/testimonials/testimonial1.jpg',
        cardType: 'tall',
        priority: 5,
        featured: false,
        tags: ['fallback'],
        metadata: {
          source: 'fallback',
          version: '1.0',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      },
      {
        id: 'fallback-2',
        name: 'Jane Smith',
        company: 'Example Inc',
        role: 'Developer',
        text: 'Amazing experience from start to finish.',
        rating: 5,
        avatar: '/testimonials/testimonial1.jpg',
        cardType: 'wide',
        priority: 5,
        featured: false,
        tags: ['fallback'],
        metadata: {
          source: 'fallback',
          version: '1.0',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      },
    ];
  }
}

/**
 * Singleton service instance
 */
export const staticTestimonialsService = new StaticTestimonialsService();

/**
 * React hook for static testimonials
 */
export function useStaticTestimonials(config: StaticQueryConfig = {}) {
  const [data, setData] = React.useState<{
    testimonials: Testimonial[];
    loading: boolean;
    error: string | null;
    total: number;
  }>({
    testimonials: [],
    loading: true,
    error: null,
    total: 0,
  });


  React.useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      try {
        setData(prev => ({ ...prev, loading: true, error: null }));

        const result = await staticTestimonialsService.loadTestimonials(config);

        if (mounted) {
          setData({
            testimonials: result.testimonials,
            loading: false,
            error: null,
            total: result.total,
          });
        }
      } catch (error) {
        if (mounted) {
          setData(prev => ({
            ...prev,
            loading: false,
            error: error instanceof Error ? error.message : 'Unknown error',
          }));
        }
      }
    };

    loadData();

    return () => {
      mounted = false;
    };
  }, [config]);

  const refresh = React.useCallback(async () => {
    staticTestimonialsService.clearCache();
    const result = await staticTestimonialsService.loadTestimonials(config);
    setData({
      testimonials: result.testimonials,
      loading: false,
      error: null,
      total: result.total,
    });
  }, [config]);

  return {
    ...data,
    refresh,
  };
}

// React import
import React from 'react';