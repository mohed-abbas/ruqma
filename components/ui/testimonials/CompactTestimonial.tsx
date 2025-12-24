/**
 * CompactTestimonial Component - Phase 3: Basic Card Components
 *
 * Compact format testimonial card (319×241px) designed for minimal space
 * usage while maintaining essential information and visual appeal.
 *
 * Features:
 * - Optimized for efficient bento grid placement
 * - Minimal design with essential information only
 * - Condensed layout with smart typography scaling
 * - StarRating component integration from Phase 2
 * - Perfect for lower-priority testimonials or grid fill
 */

'use client';

import React from 'react';
import Image from 'next/image';
import StarRating from './StarRating';
import type { Testimonial } from './types';

export interface CompactTestimonialProps {
  /** Testimonial data object */
  testimonial: Testimonial;
  /** Custom className for styling overrides */
  className?: string;
  /** Whether to show hover effects (default: true) */
  showHoverEffects?: boolean;
  /** Loading state for skeleton display */
  loading?: boolean;
}

const CompactTestimonial: React.FC<CompactTestimonialProps> = ({
  testimonial,
  className = '',
  showHoverEffects = true,
  loading = false,
}) => {
  // Truncate text for compact display (approximately 120 characters)
  const truncatedText = testimonial.text.length > 120
    ? `${testimonial.text.substring(0, 120).trim()}...`
    : testimonial.text;

  if (loading) {
    return (
      <article
        className={`
          w-full h-full min-h-[200px]
          bg-[var(--testimonials-card-bg)]
          border border-[var(--testimonials-border)]
          rounded-[var(--testimonials-card-radius)]
          p-4
          animate-pulse
          ${className}
        `}
        aria-label="Loading testimonial"
      >
        {/* Header skeleton */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-[var(--testimonials-avatar-size-sm)] h-[var(--testimonials-avatar-size-sm)] bg-[var(--testimonials-border)] rounded-full" />
          <div className="flex-1">
            <div className="h-4 bg-[var(--testimonials-border)] rounded w-24 mb-1" />
            <div className="h-3 bg-[var(--testimonials-border)] rounded w-20" />
          </div>
        </div>

        {/* Rating skeleton */}
        <div className="h-4 w-20 bg-[var(--testimonials-border)] rounded mb-3" />

        {/* Text skeleton */}
        <div className="space-y-2">
          <div className="h-3 bg-[var(--testimonials-border)] rounded w-full" />
          <div className="h-3 bg-[var(--testimonials-border)] rounded w-4/5" />
          <div className="h-3 bg-[var(--testimonials-border)] rounded w-3/5" />
        </div>
      </article>
    );
  }

  return (
    <article
      className={`
        w-full h-full min-h-[200px]
        bg-[var(--testimonials-card-bg)]
        border border-[var(--testimonials-border)]
        rounded-[var(--testimonials-card-radius)]
        p-4
        shadow-[var(--testimonials-shadow)]
        transition-[var(--testimonials-transition)]
        flex flex-col
        ${showHoverEffects ? 'hover:shadow-[var(--testimonials-shadow-hover)] hover:scale-[1.02]' : ''}
        ${className}
      `}
      role="article"
      aria-labelledby={`testimonial-${testimonial.id}-name`}
      aria-describedby={`testimonial-${testimonial.id}-text`}
    >
      {/* Header Section: Avatar and Author Info */}
      <header className="flex items-center space-x-3 mb-4">
        <div className="relative flex-shrink-0">
          <Image
            src={testimonial.avatar}
            alt={`${testimonial.name} profile picture`}
            width={40}
            height={40}
            className="w-[var(--testimonials-avatar-size-sm)] h-[var(--testimonials-avatar-size-sm)] rounded-full object-cover border border-[var(--testimonials-border)]"
            priority={testimonial.priority <= 3}
          />
        </div>

        <div className="flex-1 min-w-0">
          <h3
            className="font-medium text-[var(--testimonials-text-primary)] text-sm truncate"
            id={`testimonial-${testimonial.id}-name`}
          >
            {testimonial.name}
          </h3>
          <p className="text-[var(--testimonials-text-secondary)] text-xs truncate">
            {testimonial.company}
          </p>
        </div>
      </header>

      {/* Rating Section */}
      <div className="mb-3">
        <StarRating
          rating={testimonial.rating}
          size="sm"
          variant="luxury"
          ariaLabel={`${testimonial.name} rated ${testimonial.rating} out of 5 stars`}
        />
      </div>

      {/* Main Content Section */}
      <main className="flex-grow">
        <blockquote
          className="text-[var(--testimonials-text-primary)] text-sm leading-relaxed"
          id={`testimonial-${testimonial.id}-text`}
        >
          &ldquo;{truncatedText}&rdquo;
        </blockquote>
      </main>
    </article>
  );
};

export default CompactTestimonial;