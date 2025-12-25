'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import type { TestimonialCardProps } from './types';
import StarRating from './StarRating';
import { cardHover } from './animations';

// Base card styles with hover transition classes
const baseCardStyles = `
  bg-[var(--testimonials-card-bg)] rounded-2xl
  border border-[var(--testimonials-card-border)]
  transition-all duration-200 ease-out
`;

// Hover styles applied via group-hover for non-animated cards
const hoverStyles = `
  hover:shadow-[0px_8px_30px_rgba(157,175,181,0.35)]
  hover:border-[var(--color-primary)]
`;

// Tall card - has large image at top, suitable for featured testimonials
function TallCard({ testimonial, className = '', animated = false }: TestimonialCardProps) {
  const CardWrapper = animated ? motion.article : 'article';
  const wrapperProps = animated
    ? { whileHover: cardHover, className: `${baseCardStyles} shadow-sm flex flex-col ${className}` }
    : { className: `${baseCardStyles} ${hoverStyles} shadow-sm flex flex-col ${className}` };

  return (
    <CardWrapper {...wrapperProps}>
      {testimonial.imageUrl && (
        <div className="relative w-full h-64 rounded-t-2xl overflow-hidden mb-6">
          <Image
            src={testimonial.imageUrl}
            alt={testimonial.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 400px"
          />
        </div>
      )}
      <p className="text-[var(--testimonials-text-secondary)] px-6 mb-6 flex-grow font-[var(--font-nunito)]">
        &ldquo;{testimonial.content}&rdquo;
      </p>
      <footer className="p-6">
        <h4 className="font-bold text-[var(--testimonials-text-primary)] font-[var(--font-ibm)]">
          {testimonial.name}
        </h4>
        <p className="text-sm text-[var(--testimonials-text-secondary)]">
          {testimonial.role}, {testimonial.company}
        </p>
        <StarRating rating={testimonial.rating} className="mt-2" />
      </footer>
    </CardWrapper>
  );
}

// Wide card - horizontal layout with image on left side
function WideCard({ testimonial, className = '', animated = false }: TestimonialCardProps) {
  const CardWrapper = animated ? motion.article : 'article';
  const wrapperProps = animated
    ? { whileHover: cardHover, className: `${baseCardStyles} shadow-sm flex flex-col md:flex-row gap-6 ${className}` }
    : { className: `${baseCardStyles} ${hoverStyles} shadow-sm flex flex-col md:flex-row gap-6 ${className}` };

  return (
    <CardWrapper {...wrapperProps}>
      {testimonial.imageUrl && (
        <div className="relative w-full md:w-1/3 h-64 md:h-auto rounded-l-xl overflow-hidden flex-shrink-0">
          <Image
            src={testimonial.imageUrl}
            alt={testimonial.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 300px"
          />
        </div>
      )}
      <div className="flex flex-col justify-center p-6 md:p-0 md:pr-6">
        <p className="text-[var(--testimonials-text-secondary)] mb-6 font-[var(--font-nunito)]">
          &ldquo;{testimonial.content}&rdquo;
        </p>
        <h4 className="font-bold text-[var(--testimonials-text-primary)] font-[var(--font-ibm)]">
          {testimonial.name}
        </h4>
        <p className="text-sm text-[var(--testimonials-text-secondary)]">
          {testimonial.role}, {testimonial.company}
        </p>
        <StarRating rating={testimonial.rating} className="mt-2" />
      </div>
    </CardWrapper>
  );
}

// Compact card - avatar on left, content on right
function CompactCard({ testimonial, className = '', animated = false }: TestimonialCardProps) {
  const CardWrapper = animated ? motion.article : 'article';
  const wrapperProps = animated
    ? { whileHover: cardHover, className: `${baseCardStyles} shadow-sm p-6 ${className}` }
    : { className: `${baseCardStyles} ${hoverStyles} shadow-sm p-6 ${className}` };

  return (
    <CardWrapper {...wrapperProps}>
      <header className="flex items-center gap-4 mb-4">
        {testimonial.imageUrl ? (
          <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
            <Image
              src={testimonial.imageUrl}
              alt={testimonial.name}
              fill
              className="object-cover"
              sizes="48px"
            />
          </div>
        ) : (
          <div className="w-12 h-12 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white font-bold">
            {testimonial.name.charAt(0)}
          </div>
        )}
        <div>
          <h4 className="font-bold text-[var(--testimonials-text-primary)] leading-none font-[var(--font-ibm)]">
            {testimonial.name}
          </h4>
          <p className="text-xs text-[var(--testimonials-text-secondary)] mt-1">
            {testimonial.role}, {testimonial.company}
          </p>
          <StarRating rating={testimonial.rating} size="sm" className="mt-1" />
        </div>
      </header>
      <p className="text-[var(--testimonials-text-secondary)] text-sm font-[var(--font-nunito)]">
        &ldquo;{testimonial.content}&rdquo;
      </p>
    </CardWrapper>
  );
}

// Main TestimonialCard component that renders appropriate variant
// On mobile/tablet (<lg): All cards render as compact
// On desktop (lg+): Cards render according to their cardType
export default function TestimonialCard({
  testimonial,
  className = '',
  animated = false,
}: TestimonialCardProps) {
  // Compact cards are always compact - no responsive switching needed
  if (testimonial.cardType === 'compact') {
    return <CompactCard testimonial={testimonial} className={className} animated={animated} />;
  }

  // Tall and wide cards: show compact on mobile/tablet, original on desktop
  return (
    <>
      {/* Compact layout for mobile/tablet */}
      <div className={`lg:hidden ${className}`}>
        <CompactCard testimonial={testimonial} className="h-full" animated={animated} />
      </div>
      {/* Original layout for desktop */}
      <div className={`hidden lg:block ${className}`}>
        {testimonial.cardType === 'tall' ? (
          <TallCard testimonial={testimonial} className="h-full" animated={animated} />
        ) : (
          <WideCard testimonial={testimonial} className="h-full" animated={animated} />
        )}
      </div>
    </>
  );
}
