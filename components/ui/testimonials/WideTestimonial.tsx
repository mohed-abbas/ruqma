/**
 * WideTestimonial Component - Phase 3: Basic Card Components
 *
 * Wide format testimonial card (589×254px) designed for horizontal content
 * layout with efficient space utilization and side-by-side information display.
 *
 * Features:
 * - Optimized for medium-priority testimonials with balanced content
 * - Horizontal layout with avatar and content side-by-side
 * - Efficient space utilization for bento grid placement
 * - StarRating component integration from Phase 2
 * - Responsive text sizing for optimal readability
 */

'use client';

import React from 'react';
import Image from 'next/image';
import StarRating from './StarRating';
import type { Testimonial } from './types';

export interface WideTestimonialProps {
  /** Testimonial data object */
  testimonial: Testimonial;
  /** Custom className for styling overrides */
  className?: string;
  /** Whether to show hover effects (default: true) */
  showHoverEffects?: boolean;
  /** Loading state for skeleton display */
  loading?: boolean;
}

const WideTestimonial: React.FC<WideTestimonialProps> = ({
  testimonial,
  className = '',
  showHoverEffects = true,
  loading = false,
}) => {
  if (loading) {
    return (
      <article
        className={`
          w-[589px] max-h-[241px]
          bg-[var(--testimonials-card-bg)]
          border border-[var(--testimonials-border)]
          rounded-[var(--testimonials-card-radius)]
          p-[var(--testimonials-card-padding)]
          animate-pulse
          ${className}
        `}
        aria-label="Loading testimonial"
      >
        <div className="flex h-full">
          {/* Left side: Avatar skeleton */}
          <div className="flex flex-col items-center justify-center pr-6 border-r border-[var(--testimonials-border)]">
            <div className="w-[var(--testimonials-avatar-size)] h-[var(--testimonials-avatar-size)] bg-[var(--testimonials-border)] rounded-full mb-3" />
            <div className="h-5 w-20 bg-[var(--testimonials-border)] rounded" />
          </div>

          {/* Right side: Content skeleton */}
          <div className="flex-1 pl-6 flex flex-col justify-between">
            {/* Text skeleton */}
            <div className="space-y-2">
              <div className="h-4 bg-[var(--testimonials-border)] rounded w-full" />
              <div className="h-4 bg-[var(--testimonials-border)] rounded w-4/5" />
              <div className="h-4 bg-[var(--testimonials-border)] rounded w-3/5" />
            </div>

            {/* Author info skeleton */}
            <div>
              <div className="h-5 bg-[var(--testimonials-border)] rounded w-32 mb-1" />
              <div className="h-4 bg-[var(--testimonials-border)] rounded w-24" />
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article
      className={`
        w-[589px] h-[241px]
        bg-[var(--testimonials-card-bg)]
        border border-[var(--testimonials-border)]
        rounded-[var(--testimonials-card-radius)]
        p-[var(--testimonials-card-padding)]
        shadow-[var(--testimonials-shadow)]
        transition-[var(--testimonials-transition)]
        ${showHoverEffects ? 'hover:shadow-[var(--testimonials-shadow-hover)] hover:scale-[1.01]' : ''}
        ${className}
      `}
      role="article"
      aria-labelledby={`testimonial-${testimonial.id}-name`}
      aria-describedby={`testimonial-${testimonial.id}-text`}
    >
      <div className="flex h-full">
        {/* Left Section: Avatar and Rating */}
        <header className="flex flex-col items-center justify-center pr-6 border-r border-[var(--testimonials-border)] min-w-[140px]">
          {/* Avatar */}
          <div className="relative mb-3">
            <Image
              src={testimonial.avatar}
              alt={`${testimonial.name} profile picture`}
              width={48}
              height={48}
              className="w-[var(--testimonials-avatar-size)] h-[var(--testimonials-avatar-size)] rounded-full object-cover border-2 border-[var(--testimonials-border)]"
              priority={testimonial.priority <= 3}
            />
          </div>

          {/* Rating */}
          <StarRating
            rating={testimonial.rating}
            size="sm"
            variant="luxury"
            ariaLabel={`${testimonial.name} rated ${testimonial.rating} out of 5 stars`}
          />
        </header>

        {/* Right Section: Content */}
        <main className="flex-1 pl-6 flex flex-col justify-between">
          {/* Testimonial Text */}
          <blockquote
            className="text-[var(--testimonials-text-primary)] text-sm leading-relaxed flex-grow flex items-center"
            id={`testimonial-${testimonial.id}-text`}
          >
            <p>&ldquo;{testimonial.text}&rdquo;</p>
          </blockquote>

          {/* Footer: Author Info */}
          <footer className="mt-4">
            <h3
              className="font-medium text-[var(--testimonials-text-primary)] text-base mb-1"
              id={`testimonial-${testimonial.id}-name`}
            >
              {testimonial.name}
            </h3>
            <p className="text-[var(--testimonials-text-secondary)] text-xs">
              {testimonial.company}
            </p>
          </footer>
        </main>
      </div>
    </article>
  );
};

export default WideTestimonial;