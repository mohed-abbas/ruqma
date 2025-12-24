/**
 * TallTestimonial Component - Phase 3: Basic Card Components
 *
 * Tall format testimonial card (291×429px) designed for prominent placement
 * with detailed content display and comprehensive information layout.
 *
 * Features:
 * - Optimal for high-priority testimonials with longer content
 * - Prominent avatar and rating display
 * - Luxury brand styling with hover effects
 * - Accessibility-first design with semantic markup
 * - StarRating component integration from Phase 2
 */

'use client';

import React from 'react';
import Image from 'next/image';
import StarRating from './StarRating';
import type { Testimonial } from './types';

export interface TallTestimonialProps {
  /** Testimonial data object */
  testimonial: Testimonial;
  /** Custom className for styling overrides */
  className?: string;
  /** Whether to show hover effects (default: true) */
  showHoverEffects?: boolean;
  /** Loading state for skeleton display */
  loading?: boolean;
}

const TallTestimonial: React.FC<TallTestimonialProps> = ({
  testimonial,
  className = '',
  showHoverEffects = true,
  loading = false,
}) => {
  if (loading) {
    return (
      <article
        className={`
          w-full h-full min-h-[400px]
          bg-[var(--testimonials-card-bg)]
          border border-[var(--testimonials-border)]
          rounded-[var(--testimonials-card-radius)]
          p-[var(--testimonials-card-padding)]
          animate-pulse
          ${className}
        `}
        aria-label="Loading testimonial"
      >
        {/* Avatar skeleton */}
        <div className="w-[var(--testimonials-avatar-size)] h-[var(--testimonials-avatar-size)] bg-[var(--testimonials-border)] rounded-full mb-4" />

        {/* Rating skeleton */}
        <div className="h-5 w-24 bg-[var(--testimonials-border)] rounded mb-4" />

        {/* Text content skeleton */}
        <div className="space-y-2 mb-6">
          <div className="h-4 bg-[var(--testimonials-border)] rounded w-full" />
          <div className="h-4 bg-[var(--testimonials-border)] rounded w-5/6" />
          <div className="h-4 bg-[var(--testimonials-border)] rounded w-4/6" />
          <div className="h-4 bg-[var(--testimonials-border)] rounded w-3/6" />
        </div>

        {/* Name and company skeleton */}
        <div className="mt-auto">
          <div className="h-5 bg-[var(--testimonials-border)] rounded w-32 mb-1" />
          <div className="h-4 bg-[var(--testimonials-border)] rounded w-24" />
        </div>
      </article>
    );
  }

  return (
    <article
      className={`
        w-full h-full min-h-[400px]
        bg-[var(--testimonials-card-bg)]
        border border-[var(--testimonials-border)]
        rounded-[var(--testimonials-card-radius)]
        p-[var(--testimonials-card-padding)]
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
      {/* Header Section: Avatar */}
      <header className="flex flex-col items-center mb-6">
        <div className="relative mb-4">
          <Image
            src={testimonial.avatar}
            alt={`${testimonial.name} profile picture`}
            width={48}
            height={48}
            className="w-[var(--testimonials-avatar-size)] h-[var(--testimonials-avatar-size)] rounded-full object-cover border-2 border-[var(--testimonials-border)]"
            priority={testimonial.priority <= 3}
          />
        </div>

        {/* Rating Section */}
        <div className="flex flex-col items-center space-y-2">
          <StarRating
            rating={testimonial.rating}
            size="md"
            variant="luxury"
            ariaLabel={`${testimonial.name} rated ${testimonial.rating} out of 5 stars`}
          />
        </div>
      </header>

      {/* Main Content Section */}
      <main className="flex-grow flex flex-col">
        {/* Testimonial Text */}
        <blockquote
          className="text-[var(--testimonials-text-primary)] text-base leading-relaxed mb-6 flex-grow"
          id={`testimonial-${testimonial.id}-text`}
        >
          &ldquo;{testimonial.text}&rdquo;
        </blockquote>

        {/* Footer Section: Author Info */}
        <footer className="mt-auto">
          <div className="text-center">
            <h3
              className="font-medium text-[var(--testimonials-text-primary)] text-lg mb-1"
              id={`testimonial-${testimonial.id}-name`}
            >
              {testimonial.name}
            </h3>
            <p className="text-[var(--testimonials-text-secondary)] text-sm">
              {testimonial.company}
            </p>
          </div>
        </footer>
      </main>
    </article>
  );
};

export default TallTestimonial;