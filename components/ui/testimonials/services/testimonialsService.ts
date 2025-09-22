/**
 * Testimonials Data Service - Phase 5: Production Features
 *
 * Comprehensive data fetching service with intelligent caching, error handling,
 * and performance optimization for production environments.
 */

'use client';

import type {
  Testimonial,
  SanityTestimonial,
  ValidationResult,
  PerformanceMetrics,
} from '../types';
import {
  transformSanityTestimonial,
  validateSanityTestimonial,
  generateTestimonialsQuery,
  batchProcessTestimonials,
  type QueryConfig,
  type CacheConfig,
  DEFAULT_CACHE_CONFIG,
} from '../utils/sanityIntegration';

/**
 * Cache entry structure
 */
interface CacheEntry<T = any> {
  data: T;
  timestamp: number;
  ttl: number;
  accessCount: number;
  lastAccessed: number;
}

/**
 * Service configuration
 */
interface ServiceConfig {
  cache: CacheConfig;
  performance: {
    enableMetrics: boolean;
    slowQueryThreshold: number; // milliseconds
    retryAttempts: number;
    retryDelay: number; // milliseconds
  };
  fallback: {
    enableStaticFallback: boolean;
    staticData: Testimonial[];
  };
}

/**
 * Default service configuration
 */
const DEFAULT_SERVICE_CONFIG: ServiceConfig = {
  cache: DEFAULT_CACHE_CONFIG,
  performance: {
    enableMetrics: true,
    slowQueryThreshold: 1000,
    retryAttempts: 3,
    retryDelay: 500,
  },
  fallback: {
    enableStaticFallback: true,
    staticData: [],
  },
};

/**
 * Testimonials Data Service Class
 */
export class TestimonialsService {
  private cache = new Map<string, CacheEntry>();
  private config: ServiceConfig;
  private metrics: PerformanceMetrics;
  private isOnline = true;

  constructor(config: Partial<ServiceConfig> = {}) {
    this.config = { ...DEFAULT_SERVICE_CONFIG, ...config };
    this.metrics = {
      totalRequests: 0,
      cacheHits: 0,
      cacheMisses: 0,
      averageResponseTime: 0,
      errorRate: 0,
      lastUpdated: new Date().toISOString(),
    };

    // Monitor online status
    if (typeof window !== 'undefined') {
      this.isOnline = navigator.onLine;
      window.addEventListener('online', () => (this.isOnline = true));
      window.addEventListener('offline', () => (this.isOnline = false));
    }

    // Setup cache cleanup interval
    this.setupCacheCleanup();
  }

  /**
   * Fetch testimonials with intelligent caching
   */
  async fetchTestimonials(
    queryConfig: QueryConfig = {},
    options: {
      forceRefresh?: boolean;
      enableCache?: boolean;
      timeout?: number;
    } = {}
  ): Promise<{
    testimonials: Testimonial[];
    source: 'cache' | 'api' | 'fallback';
    metrics: Partial<PerformanceMetrics>;
  }> {
    const startTime = performance.now();
    const cacheKey = this.generateCacheKey('testimonials', queryConfig);
    const { forceRefresh = false, enableCache = true, timeout = 5000 } = options;

    this.metrics.totalRequests++;

    try {
      // Check cache first (unless force refresh)
      if (!forceRefresh && enableCache) {
        const cachedData = this.getCachedData<Testimonial[]>(cacheKey);
        if (cachedData) {
          this.metrics.cacheHits++;
          return {
            testimonials: cachedData,
            source: 'cache',
            metrics: this.calculateRequestMetrics(startTime),
          };
        }
      }

      this.metrics.cacheMisses++;

      // Check if online before making API calls
      if (!this.isOnline) {
        return this.handleOfflineMode(queryConfig);
      }

      // Fetch from API with timeout
      const testimonials = await this.fetchFromAPI(queryConfig, timeout);

      // Validate data
      const validatedTestimonials = await this.validateAndTransformData(testimonials);

      // Cache the results
      if (enableCache) {
        this.setCachedData(cacheKey, validatedTestimonials);
      }

      return {
        testimonials: validatedTestimonials,
        source: 'api',
        metrics: this.calculateRequestMetrics(startTime),
      };
    } catch (error) {
      this.handleError(error);

      // Try fallback data
      return this.handleFallback(queryConfig, startTime);
    }
  }

  /**
   * Prefetch testimonials for performance optimization
   */
  async prefetchTestimonials(configs: QueryConfig[]): Promise<void> {
    const prefetchPromises = configs.map(config =>
      this.fetchTestimonials(config, { enableCache: true })
        .catch(error => {
          console.warn('Prefetch failed for config:', config, error);
        })
    );

    await Promise.allSettled(prefetchPromises);
  }

  /**
   * Get single testimonial by ID
   */
  async getTestimonialById(
    id: string,
    options: { enableCache?: boolean } = {}
  ): Promise<Testimonial | null> {
    const cacheKey = this.generateCacheKey('testimonial', { id });
    const { enableCache = true } = options;

    // Check cache
    if (enableCache) {
      const cached = this.getCachedData<Testimonial>(cacheKey);
      if (cached) {
        return cached;
      }
    }

    try {
      // This would integrate with your Sanity client
      const testimonial = await this.fetchSingleFromAPI(id);

      if (testimonial) {
        const validated = transformSanityTestimonial(testimonial);

        if (enableCache) {
          this.setCachedData(cacheKey, validated);
        }

        return validated;
      }

      return null;
    } catch (error) {
      this.handleError(error);
      return null;
    }
  }

  /**
   * Get performance metrics
   */
  getMetrics(): PerformanceMetrics {
    return {
      ...this.metrics,
      cacheHitRate: this.metrics.totalRequests > 0
        ? (this.metrics.cacheHits / this.metrics.totalRequests) * 100
        : 0,
      cacheSizeKB: this.calculateCacheSize(),
    };
  }

  /**
   * Clear cache (optionally by pattern)
   */
  clearCache(pattern?: string): void {
    if (pattern) {
      const regex = new RegExp(pattern);
      for (const [key] of this.cache) {
        if (regex.test(key)) {
          this.cache.delete(key);
        }
      }
    } else {
      this.cache.clear();
    }
  }

  /**
   * Warm up cache with popular queries
   */
  async warmUpCache(): Promise<void> {
    const popularQueries: QueryConfig[] = [
      { limit: 6, orderBy: 'priority', filterBy: { featured: true } },
      { limit: 12, orderBy: 'rating', filterBy: { minRating: 4 } },
      { limit: 20, orderBy: 'priority' },
    ];

    await this.prefetchTestimonials(popularQueries);
  }

  /**
   * Private methods
   */

  private async fetchFromAPI(config: QueryConfig, timeout: number): Promise<SanityTestimonial[]> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      // Fetch from testimonials.json file
      const response = await fetch('/data/testimonials.json', {
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch testimonials: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      let testimonials = data.testimonials || [];

      // Apply filtering and sorting based on config
      if (config.filterBy) {
        testimonials = this.applyFilters(testimonials, config.filterBy);
      }

      if (config.orderBy) {
        testimonials = this.applySorting(testimonials, config.orderBy);
      }

      // Apply pagination
      const offset = config.offset || 0;
      const limit = config.limit || 20;
      testimonials = testimonials.slice(offset, offset + limit);

      // Transform to Sanity format for consistency with existing logic
      const sanityFormatTestimonials: SanityTestimonial[] = testimonials.map((t: Testimonial) => ({
        id: t.id,
        _id: t.id,
        _type: 'testimonial',
        name: t.name,
        company: t.company,
        role: t.role,
        text: t.text,
        rating: t.rating,
        avatar: t.avatar || '/testimonials/default-avatar.svg',
        cardType: t.cardType,
        priority: t.priority,
        featured: t.featured,
        tags: t.tags,
        metadata: t.metadata,
        _createdAt: t.metadata?.createdAt || new Date().toISOString(),
        _updatedAt: t.metadata?.updatedAt || new Date().toISOString(),
      }));

      clearTimeout(timeoutId);
      return sanityFormatTestimonials;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error(`Request timed out after ${timeout}ms`);
      }

      throw error;
    }
  }

  private applyFilters(testimonials: any[], filterBy: NonNullable<QueryConfig['filterBy']>): any[] {
    return testimonials.filter(testimonial => {
      if (filterBy.minRating && testimonial.rating < filterBy.minRating) {
        return false;
      }

      if (filterBy.cardType && filterBy.cardType.length > 0 && !filterBy.cardType.includes(testimonial.cardType)) {
        return false;
      }

      if (filterBy.featured !== undefined && testimonial.featured !== filterBy.featured) {
        return false;
      }

      if (filterBy.status && filterBy.status !== 'published') {
        return false; // All JSON testimonials are considered published
      }

      return true;
    });
  }

  private applySorting(testimonials: any[], orderBy: NonNullable<QueryConfig['orderBy']>): any[] {
    const sorted = [...testimonials];

    switch (orderBy) {
      case 'priority':
        return sorted.sort((a, b) => (b.priority || 0) - (a.priority || 0));

      case 'rating':
        return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));

      case 'createdAt':
        return sorted.sort((a, b) => {
          const dateA = new Date(a.metadata?.createdAt || 0);
          const dateB = new Date(b.metadata?.createdAt || 0);
          return dateB.getTime() - dateA.getTime();
        });

      case 'random':
        // Simple shuffle algorithm
        for (let i = sorted.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [sorted[i], sorted[j]] = [sorted[j], sorted[i]];
        }
        return sorted;

      default:
        return sorted;
    }
  }

  private async fetchSingleFromAPI(id: string): Promise<SanityTestimonial | null> {
    try {
      // Fetch from testimonials.json file
      const response = await fetch('/data/testimonials.json');

      if (!response.ok) {
        throw new Error(`Failed to fetch testimonials: ${response.status}`);
      }

      const data = await response.json();
      const testimonial = data.testimonials?.find((t: any) => t.id === id);

      if (!testimonial) {
        return null;
      }

      // Transform to Sanity format for consistency
      return {
        id: testimonial.id,
        _id: testimonial.id,
        _type: 'testimonial',
        name: testimonial.name,
        company: testimonial.company,
        role: testimonial.role,
        text: testimonial.text,
        rating: testimonial.rating,
        avatar: testimonial.avatar || '/testimonials/default-avatar.svg',
        cardType: testimonial.cardType,
        priority: testimonial.priority,
        featured: testimonial.featured,
        tags: testimonial.tags,
        metadata: testimonial.metadata,
        _createdAt: testimonial.metadata?.createdAt || new Date().toISOString(),
        _updatedAt: testimonial.metadata?.updatedAt || new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error fetching single testimonial:', error);
      return null;
    }
  }

  private async validateAndTransformData(data: SanityTestimonial[]): Promise<Testimonial[]> {
    const { results, errors } = await batchProcessTestimonials(
      data,
      async (testimonial) => {
        const validation = validateSanityTestimonial(testimonial);
        if (!validation.isValid) {
          throw new Error(`Invalid testimonial: ${validation.errors.join(', ')}`);
        }
        return transformSanityTestimonial(testimonial);
      },
      {
        batchSize: 10,
        retryAttempts: 2,
        onError: (error, testimonial) => {
          console.warn(`Failed to process testimonial ${testimonial._id}:`, error);
        },
      }
    );

    if (errors.length > 0) {
      console.warn(`${errors.length} testimonials failed validation`);
    }

    return results;
  }

  private generateCacheKey(type: string, config: any): string {
    return `${type}:${JSON.stringify(config)}`;
  }

  private getCachedData<T>(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    const now = Date.now();

    // Check if expired
    if (now - entry.timestamp > entry.ttl * 1000) {
      this.cache.delete(key);
      return null;
    }

    // Update access metrics
    entry.accessCount++;
    entry.lastAccessed = now;

    return entry.data;
  }

  private setCachedData<T>(key: string, data: T): void {
    const now = Date.now();

    // Enforce cache size limit
    if (this.cache.size >= this.config.cache.maxSize) {
      this.evictLeastRecentlyUsed();
    }

    const entry: CacheEntry<T> = {
      data,
      timestamp: now,
      ttl: this.config.cache.ttl,
      accessCount: 1,
      lastAccessed: now,
    };

    this.cache.set(key, entry);
  }

  private evictLeastRecentlyUsed(): void {
    let oldestKey: string | null = null;
    let oldestTime = Date.now();

    for (const [key, entry] of this.cache) {
      if (entry.lastAccessed < oldestTime) {
        oldestTime = entry.lastAccessed;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }

  private setupCacheCleanup(): void {
    if (typeof window !== 'undefined') {
      setInterval(() => {
        const now = Date.now();

        for (const [key, entry] of this.cache) {
          if (now - entry.timestamp > entry.ttl * 1000) {
            this.cache.delete(key);
          }
        }
      }, 60000); // Clean up every minute
    }
  }

  private calculateRequestMetrics(startTime: number): Partial<PerformanceMetrics> {
    const responseTime = performance.now() - startTime;

    // Update running average
    this.metrics.averageResponseTime =
      (this.metrics.averageResponseTime * (this.metrics.totalRequests - 1) + responseTime) /
      this.metrics.totalRequests;

    return {
      averageResponseTime: responseTime,
      lastUpdated: new Date().toISOString(),
    };
  }

  private calculateCacheSize(): number {
    let size = 0;
    for (const [key, entry] of this.cache) {
      size += JSON.stringify({ key, entry }).length;
    }
    return Math.round(size / 1024); // KB
  }

  private handleError(error: any): void {
    this.metrics.errorRate =
      (this.metrics.errorRate * (this.metrics.totalRequests - 1) + 1) /
      this.metrics.totalRequests;

    console.error('TestimonialsService error:', error);
  }

  private handleOfflineMode(queryConfig: QueryConfig) {
    console.warn('Operating in offline mode, using cached data');

    // Try to find any cached data that matches
    for (const [key, entry] of this.cache) {
      if (key.includes('testimonials')) {
        return {
          testimonials: entry.data as Testimonial[],
          source: 'cache' as const,
          metrics: { averageResponseTime: 0 },
        };
      }
    }

    return this.handleFallback(queryConfig, performance.now());
  }

  private handleFallback(_queryConfig: QueryConfig, startTime: number) {
    if (this.config.fallback.enableStaticFallback && this.config.fallback.staticData.length > 0) {
      return {
        testimonials: this.config.fallback.staticData,
        source: 'fallback' as const,
        metrics: this.calculateRequestMetrics(startTime),
      };
    }

    return {
      testimonials: [],
      source: 'fallback' as const,
      metrics: this.calculateRequestMetrics(startTime),
    };
  }
}

/**
 * Create singleton service instance
 */
export const testimonialsService = new TestimonialsService();

/**
 * React hook for testimonials data
 */
export function useTestimonials(
  queryConfig: QueryConfig = {},
  options: {
    enableCache?: boolean;
    autoRefresh?: boolean;
    refreshInterval?: number;
  } = {}
) {
  const [data, setData] = React.useState<{
    testimonials: Testimonial[];
    loading: boolean;
    error: Error | null;
    source: 'cache' | 'api' | 'fallback';
  }>({
    testimonials: [],
    loading: true,
    error: null,
    source: 'cache',
  });

  const {
    enableCache = true,
    autoRefresh = false,
    refreshInterval = 300000, // 5 minutes
  } = options;

  React.useEffect(() => {
    let mounted = true;
    let refreshTimer: NodeJS.Timeout;

    const fetchData = async () => {
      if (!mounted) return;

      try {
        setData(prev => ({ ...prev, loading: true, error: null }));

        const result = await testimonialsService.fetchTestimonials(queryConfig, {
          enableCache,
        });

        if (mounted) {
          setData({
            testimonials: result.testimonials,
            loading: false,
            error: null,
            source: result.source,
          });
        }
      } catch (error) {
        if (mounted) {
          setData(prev => ({
            ...prev,
            loading: false,
            error: error instanceof Error ? error : new Error(String(error)),
          }));
        }
      }
    };

    fetchData();

    if (autoRefresh) {
      refreshTimer = setInterval(fetchData, refreshInterval);
    }

    return () => {
      mounted = false;
      if (refreshTimer) {
        clearInterval(refreshTimer);
      }
    };
  }, [JSON.stringify(queryConfig), enableCache, autoRefresh, refreshInterval]);

  const refresh = React.useCallback(() => {
    return testimonialsService.fetchTestimonials(queryConfig, {
      enableCache,
      forceRefresh: true,
    });
  }, [JSON.stringify(queryConfig), enableCache]);

  return {
    ...data,
    refresh,
    metrics: testimonialsService.getMetrics(),
  };
}

// React import for the hook
import React from 'react';