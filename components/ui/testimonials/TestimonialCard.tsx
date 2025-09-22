/**
 * TestimonialCard Component - Phase 3: Smart Card Router
 *
 * Intelligent testimonial card wrapper that automatically routes to the
 * appropriate card component based on the testimonial's cardType property.
 *
 * Features:
 * - Smart routing based on cardType (tall, wide, compact)
 * - Consistent API across all card types
 * - Error boundary with fallback rendering
 * - Loading state management
 * - Accessibility and performance optimizations
 */

'use client';

import React from 'react';
import TallTestimonial from './TallTestimonial';
import WideTestimonial from './WideTestimonial';
import CompactTestimonial from './CompactTestimonial';
import type { Testimonial, TestimonialCardType } from './types';

interface TestimonialCardPropsExtended {
  /** Testimonial data object */
  testimonial: Testimonial;
  /** Override the card type (optional, uses testimonial.cardType by default) */
  cardType?: TestimonialCardType;
  /** Custom className for styling overrides */
  className?: string;
  /** Whether to show hover effects (default: true) */
  showHoverEffects?: boolean;
  /** Loading state for skeleton display */
  loading?: boolean;
}

/**
 * Error boundary fallback component for testimonial card failures
 */
const TestimonialCardFallback: React.FC<{
  testimonial: Testimonial;
  className?: string;
  error?: Error;
}> = ({ testimonial, className = '', error }) => {
  console.error('TestimonialCard Error:', error);

  return (
    <article
      className={`
        w-[319px] h-[241px]
        bg-[#E9ECF2]
        border border-red-300
        rounded-[var(--testimonials-card-radius)]
        p-4
        flex items-center justify-center
        ${className}
      `}
      role="alert"
      aria-label="Testimonial card error"
    >
      <div className="text-center">
        <p className="text-red-600 text-sm font-medium mb-2">
          Unable to display testimonial
        </p>
        <p className="text-[var(--testimonials-text-secondary)] text-xs">
          ID: {testimonial.id}
        </p>
      </div>
    </article>
  );
};

const TestimonialCard: React.FC<TestimonialCardPropsExtended> = ({
  testimonial,
  cardType,
  className = '',
  showHoverEffects = true,
  loading = false,
}) => {
  // Use provided cardType or fall back to testimonial's cardType
  const effectiveCardType = cardType || testimonial.cardType;

  // Validate testimonial data
  if (!testimonial || !testimonial.id) {
    return (
      <TestimonialCardFallback
        testimonial={testimonial}
        className={className}
        error={new Error('Invalid testimonial data')}
      />
    );
  }

  try {
    // Route to appropriate card component
    switch (effectiveCardType) {
      case 'tall':
        return (
          <TallTestimonial
            testimonial={testimonial}
            className={className}
            showHoverEffects={showHoverEffects}
            loading={loading}
          />
        );

      case 'wide':
        return (
          <WideTestimonial
            testimonial={testimonial}
            className={className}
            showHoverEffects={showHoverEffects}
            loading={loading}
          />
        );

      case 'compact':
        return (
          <CompactTestimonial
            testimonial={testimonial}
            className={className}
            showHoverEffects={showHoverEffects}
            loading={loading}
          />
        );

      default:
        // Fallback to compact for unknown card types
        console.warn(`Unknown card type: ${effectiveCardType}. Using compact as fallback.`);
        return (
          <CompactTestimonial
            testimonial={testimonial}
            className={className}
            showHoverEffects={showHoverEffects}
            loading={loading}
          />
        );
    }
  } catch (error) {
    return (
      <TestimonialCardFallback
        testimonial={testimonial}
        className={className}
        error={error as Error}
      />
    );
  }
};

export default TestimonialCard;