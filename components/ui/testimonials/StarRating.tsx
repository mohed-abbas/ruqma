/**
 * StarRating Component - Phase 2: StarRating Component
 *
 * A luxury brand star rating component with accessibility features,
 * dynamic rating values, hover states, and animations.
 *
 * Features:
 * - Supports 1-5 star ratings with half-star precision
 * - WCAG AA accessible with screen reader support
 * - Luxury brand styling using CSS custom properties
 * - Smooth hover animations and transitions
 * - No layout shift (CLS optimization)
 */

'use client';

import React from 'react';

export interface StarRatingProps {
  /** Rating value from 0 to 5, supports decimal values (e.g., 4.5) */
  rating: number;
  /** Maximum number of stars (default: 5) */
  maxStars?: number;
  /** Size variant for different use cases */
  size?: 'sm' | 'md' | 'lg';
  /** Whether to show hover effects (default: false for display-only ratings) */
  interactive?: boolean;
  /** Whether to show half stars (default: true) */
  showHalfStars?: boolean;
  /** Custom className for styling */
  className?: string;
  /** Accessible label for screen readers */
  ariaLabel?: string;
  /** Callback when rating is clicked (only if interactive) */
  onRatingChange?: (rating: number) => void;
  /** Whether to show the numeric rating text */
  showRatingText?: boolean;
  /** Custom color scheme */
  variant?: 'default' | 'luxury' | 'minimal';
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxStars = 5,
  size = 'md',
  interactive = false,
  showHalfStars = true,
  className = '',
  ariaLabel,
  onRatingChange,
  showRatingText = false,
  variant = 'luxury',
}) => {
  const [hoveredRating, setHoveredRating] = React.useState<number | null>(null);

  // Clamp rating between 0 and maxStars
  const clampedRating = Math.max(0, Math.min(maxStars, rating));
  const displayRating = interactive && hoveredRating !== null ? hoveredRating : clampedRating;

  // Size configurations
  const sizeConfig = {
    sm: {
      starSize: 'w-4 h-4',
      textSize: 'text-sm',
      spacing: 'space-x-0.5',
    },
    md: {
      starSize: 'w-5 h-5',
      textSize: 'text-base',
      spacing: 'space-x-1',
    },
    lg: {
      starSize: 'w-6 h-6',
      textSize: 'text-lg',
      spacing: 'space-x-1.5',
    },
  };

  // Variant configurations
  const variantConfig = {
    default: {
      activeColor: 'var(--testimonials-star-active)',
      inactiveColor: 'var(--testimonials-star-inactive)',
      hoverColor: 'var(--testimonials-accent)',
    },
    luxury: {
      activeColor: 'var(--testimonials-star-active)',
      inactiveColor: 'var(--testimonials-star-inactive)',
      hoverColor: 'var(--testimonials-accent)',
    },
    minimal: {
      activeColor: 'var(--testimonials-text-primary)',
      inactiveColor: 'var(--testimonials-border)',
      hoverColor: 'var(--testimonials-text-secondary)',
    },
  };

  const currentSize = sizeConfig[size];
  const currentVariant = variantConfig[variant];

  // Generate aria-label if not provided
  const defaultAriaLabel = `${clampedRating} out of ${maxStars} stars`;
  const finalAriaLabel = ariaLabel || defaultAriaLabel;

  // Handle star click
  const handleStarClick = (starIndex: number) => {
    if (!interactive || !onRatingChange) return;

    const newRating = starIndex + 1;
    onRatingChange(newRating);
  };

  // Handle star hover
  const handleStarHover = (starIndex: number) => {
    if (!interactive) return;
    setHoveredRating(starIndex + 1);
  };

  // Handle mouse leave
  const handleMouseLeave = () => {
    if (!interactive) return;
    setHoveredRating(null);
  };

  // Render individual star
  const renderStar = (starIndex: number) => {
    const starValue = starIndex + 1;
    const fillPercentage = Math.max(0, Math.min(1, displayRating - starIndex));

    // Determine if star should show as filled, half-filled, or empty
    let starType: 'filled' | 'half' | 'empty';
    if (fillPercentage >= 1) {
      starType = 'filled';
    } else if (fillPercentage > 0 && showHalfStars) {
      starType = 'half';
    } else {
      starType = 'empty';
    }

    const isHovered = interactive && hoveredRating !== null && starIndex < hoveredRating;

    return (
      <button
        key={starIndex}
        type="button"
        className={`
          relative inline-flex items-center justify-center
          ${currentSize.starSize}
          ${interactive ? 'cursor-pointer' : 'cursor-default'}
          ${interactive ? 'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400' : ''}
          transition-all duration-200 ease-in-out
          ${interactive ? 'hover:scale-110' : ''}
        `}
        onClick={() => handleStarClick(starIndex)}
        onMouseEnter={() => handleStarHover(starIndex)}
        onFocus={() => handleStarHover(starIndex)}
        disabled={!interactive}
        aria-label={`${starValue} star${starValue !== 1 ? 's' : ''}`}
        tabIndex={interactive ? 0 : -1}
      >
        {/* Background star (inactive) */}
        <svg
          className={`absolute inset-0 ${currentSize.starSize}`}
          fill={currentVariant.inactiveColor}
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>

        {/* Foreground star (active) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{
            width: starType === 'filled' ? '100%' : starType === 'half' ? '50%' : '0%',
          }}
        >
          <svg
            className={`${currentSize.starSize}`}
            fill={isHovered ? currentVariant.hoverColor : currentVariant.activeColor}
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </div>
      </button>
    );
  };

  return (
    <div
      className={`
        inline-flex items-center
        ${currentSize.spacing}
        ${className}
      `}
      onMouseLeave={handleMouseLeave}
      role={interactive ? 'radiogroup' : 'img'}
      aria-label={finalAriaLabel}
      aria-describedby={showRatingText ? `rating-text-${Math.random().toString(36).substr(2, 9)}` : undefined}
    >
      {/* Star container with fixed width to prevent layout shift */}
      <div className={`flex ${currentSize.spacing}`} style={{ minWidth: `${maxStars * (size === 'sm' ? 20 : size === 'md' ? 24 : 28)}px` }}>
        {Array.from({ length: maxStars }, (_, index) => renderStar(index))}
      </div>

      {/* Optional rating text */}
      {showRatingText && (
        <span
          className={`
            ml-2 font-medium
            ${currentSize.textSize}
            text-[var(--testimonials-text-secondary)]
          `}
          id={`rating-text-${Math.random().toString(36).substr(2, 9)}`}
        >
          {clampedRating.toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default StarRating;