/**
 * Testimonials Demo Component - Phase 5: Design Showcase
 *
 * Comprehensive demonstration of the testimonials bento grid system
 * using static JSON data for design completion and testing.
 */

'use client';

import React, { useState } from 'react';
import TestimonialsGrid from './TestimonialsGrid';
import { useStaticTestimonials } from './services/staticTestimonialsService';
import type { StaticQueryConfig } from './services/staticTestimonialsService';
import {
  DEFAULT_RESPONSIVE_CONFIG,
  DEFAULT_ANIMATION_CONFIG,
  DEFAULT_ACCESSIBILITY_CONFIG,
  DEFAULT_PLACEMENT_ALGORITHM,
} from './index';

const TestimonialsDemo: React.FC = () => {
  const [queryConfig, setQueryConfig] = useState<StaticQueryConfig>({
    limit: 8,
    shuffle: false,
  });

  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const [selectedCardType, setSelectedCardType] = useState<'all' | 'tall' | 'wide' | 'compact'>('all');
  const [enableAnimations, setEnableAnimations] = useState(true);
  const [maxTestimonials, setMaxTestimonials] = useState(8);

  // Update query config when filters change
  const effectiveConfig: StaticQueryConfig = {
    ...queryConfig,
    limit: maxTestimonials,
    featured: showFeaturedOnly || undefined,
    cardType: selectedCardType === 'all' ? undefined : selectedCardType,
  };

  const { testimonials, loading, error, total, refresh } = useStaticTestimonials(effectiveConfig);

  const handleShuffle = () => {
    setQueryConfig(prev => ({ ...prev, shuffle: !prev.shuffle }));
  };

  const handleReset = () => {
    setShowFeaturedOnly(false);
    setSelectedCardType('all');
    setMaxTestimonials(8);
    setQueryConfig({ limit: 8, shuffle: false });
  };

  return (
    <div className="min-h-screen bg-[var(--testimonials-bg)] p-8">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-[var(--testimonials-text-primary)] mb-4">
          Testimonials Bento Grid System
        </h1>
        <p className="text-lg text-[var(--testimonials-text-secondary)] max-w-2xl">
          Intelligent testimonial placement system with responsive design,
          accessibility features, and advanced animations. Data loaded from testimonials.json.
        </p>
      </header>

      {/* Controls */}
      <div className="mb-8 bg-white rounded-lg border border-[var(--testimonials-border)] p-6">
        <h2 className="text-xl font-semibold text-[var(--testimonials-text-primary)] mb-4">
          Demo Controls
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Featured Filter */}
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={showFeaturedOnly}
                onChange={(e) => setShowFeaturedOnly(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm text-[var(--testimonials-text-primary)]">
                Featured Only
              </span>
            </label>
          </div>

          {/* Card Type Filter */}
          <div>
            <label className="block text-sm font-medium text-[var(--testimonials-text-primary)] mb-1">
              Card Type
            </label>
            <select
              value={selectedCardType}
              onChange={(e) => setSelectedCardType(e.target.value as 'all' | 'tall' | 'wide' | 'compact')}
              className="w-full px-3 py-1 border border-[var(--testimonials-border)] rounded text-sm"
            >
              <option value="all">All Types</option>
              <option value="tall">Tall Cards</option>
              <option value="wide">Wide Cards</option>
              <option value="compact">Compact Cards</option>
            </select>
          </div>

          {/* Max Testimonials */}
          <div>
            <label className="block text-sm font-medium text-[var(--testimonials-text-primary)] mb-1">
              Max Count: {maxTestimonials}
            </label>
            <input
              type="range"
              min="4"
              max="12"
              value={maxTestimonials}
              onChange={(e) => setMaxTestimonials(parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Animations */}
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={enableAnimations}
                onChange={(e) => setEnableAnimations(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm text-[var(--testimonials-text-primary)]">
                Enable Animations
              </span>
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mt-4">
          <button
            onClick={handleShuffle}
            className="px-4 py-2 bg-[var(--testimonials-accent)] text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium"
          >
            {queryConfig.shuffle ? 'Sort by Priority' : 'Shuffle Layout'}
          </button>

          <button
            onClick={refresh}
            className="px-4 py-2 bg-gray-100 text-[var(--testimonials-text-primary)] rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
          >
            Refresh Data
          </button>

          <button
            onClick={handleReset}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm font-medium"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-[var(--testimonials-border)] p-4 text-center">
          <div className="text-2xl font-bold text-[var(--testimonials-accent)]">
            {testimonials.length}
          </div>
          <div className="text-sm text-[var(--testimonials-text-secondary)]">Displayed</div>
        </div>

        <div className="bg-white rounded-lg border border-[var(--testimonials-border)] p-4 text-center">
          <div className="text-2xl font-bold text-[var(--testimonials-accent)]">
            {total}
          </div>
          <div className="text-sm text-[var(--testimonials-text-secondary)]">Total Available</div>
        </div>

        <div className="bg-white rounded-lg border border-[var(--testimonials-border)] p-4 text-center">
          <div className="text-2xl font-bold text-[var(--testimonials-accent)]">
            {testimonials.filter(t => t.featured).length}
          </div>
          <div className="text-sm text-[var(--testimonials-text-secondary)]">Featured</div>
        </div>

        <div className="bg-white rounded-lg border border-[var(--testimonials-border)] p-4 text-center">
          <div className="text-2xl font-bold text-[var(--testimonials-accent)]">
            {testimonials.length > 0 ? (testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length).toFixed(1) : '0'}
          </div>
          <div className="text-sm text-[var(--testimonials-text-secondary)]">Avg Rating</div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center h-64 bg-white rounded-lg border border-[var(--testimonials-border)]">
          <div className="text-[var(--testimonials-text-secondary)]">
            Loading testimonials...
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="text-red-600 font-medium">Error loading testimonials</div>
          <div className="text-red-500 text-sm mt-1">{error}</div>
        </div>
      )}

      {/* Main Grid */}
      {!loading && !error && testimonials.length > 0 && (
        <div className="bg-white rounded-lg border border-[var(--testimonials-border)] p-6">
          <h3 className="text-lg font-semibold text-[var(--testimonials-text-primary)] mb-6">
            Intelligent Bento Grid Layout
          </h3>

          <TestimonialsGrid
            testimonials={testimonials}
            placement={DEFAULT_PLACEMENT_ALGORITHM}
            responsive={DEFAULT_RESPONSIVE_CONFIG}
            animation={enableAnimations ? DEFAULT_ANIMATION_CONFIG : { ...DEFAULT_ANIMATION_CONFIG, enabled: false }}
            accessibility={DEFAULT_ACCESSIBILITY_CONFIG}
            maxTestimonials={maxTestimonials}
            debug={false}
            onError={(error) => console.error('Grid Error:', error)}
          />
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && testimonials.length === 0 && (
        <div className="flex items-center justify-center h-64 bg-white rounded-lg border border-[var(--testimonials-border)]">
          <div className="text-center">
            <div className="text-[var(--testimonials-text-secondary)] text-lg mb-2">
              No testimonials found
            </div>
            <div className="text-[var(--testimonials-text-secondary)] text-sm">
              Try adjusting your filters or refresh the data
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-12 text-center text-[var(--testimonials-text-secondary)] text-sm">
        <p>
          Testimonials Bento Grid System - Phase 5: Design Completion
        </p>
        <p className="mt-1">
          Data loaded from <code className="bg-gray-100 px-2 py-1 rounded">testimonials.json</code>
        </p>
      </footer>
    </div>
  );
};

export default TestimonialsDemo;