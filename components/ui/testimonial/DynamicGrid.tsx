'use client';

import React, { useMemo } from 'react';
import TestimonialCard from './TestimonialCard';
import { GridEngine } from './GridEngine';
import { Testimonial } from './types';

export interface DynamicGridProps {
  testimonials: Testimonial[];
  className?: string;
}

export default function DynamicGrid({ testimonials, className = '' }: DynamicGridProps) {
  // Calculate optimal grid strategy based on testimonial count
  const strategy = useMemo(() => {
    return GridEngine.calculateStrategy(testimonials.length);
  }, [testimonials.length]);

  // Assign intelligent card types based on strategy and content
  const processedTestimonials = useMemo(() => {
    return GridEngine.assignCardTypes(testimonials, strategy);
  }, [testimonials, strategy]);

  // Generate CSS custom properties for the strategy
  const cssProperties = useMemo(() => {
    return GridEngine.generateCSSProperties(strategy);
  }, [strategy]);

  // Generate animation delays for staggered entrance
  const animationDelays = useMemo(() => {
    return GridEngine.generateAnimationDelays(testimonials.length);
  }, [testimonials.length]);

  return (
    <div
      className={`dynamic-testimonial-grid ${strategy.containerClass} ${className}`}
      style={cssProperties as React.CSSProperties}
    >
      {processedTestimonials.map((testimonial: Testimonial, index: number) => {
        const area = strategy.areas?.[index];
        const animationDelay = animationDelays[index];

        return (
          <TestimonialCard
            key={testimonial.id}
            {...testimonial}
            style={{
              gridArea: area?.name,
              animationDelay,
              opacity: 0,
              animation: `fadeInUp 0.6s ease-out ${animationDelay} forwards`
            }}
            className="testimonial-card-dynamic"
          />
        );
      })}

      {/* Dynamic CSS styles based on strategy */}
      <style jsx>{`
        .dynamic-testimonial-grid {
          display: grid;
          grid-template-columns: var(--grid-columns);
          grid-template-rows: var(--grid-rows);
          gap: var(--grid-gap);
          width: 100%;
          max-width: 1240px;
          margin: 0 auto;
          container-type: inline-size;
        }

        /* Grid Areas Strategy Styles */
        .testimonial-grid-areas {
          grid-template-areas: var(--grid-template-areas);
        }

        /* Advanced Grid Strategy Styles */
        .testimonial-advanced-grid :global(.testimonial-card-dynamic:nth-child(6n+1)) {
          grid-row: span 2;
        }

        .testimonial-advanced-grid :global(.testimonial-card-dynamic:nth-child(6n+2)),
        .testimonial-advanced-grid :global(.testimonial-card-dynamic:nth-child(6n+5)) {
          grid-column: span 2;
        }

        /* Masonry Strategy Styles */
        .testimonial-masonry-grid {
          grid-template-rows: masonry;
          align-items: start;
        }

        @supports not (grid-template-rows: masonry) {
          .testimonial-masonry-grid {
            display: flex;
            flex-direction: column;
            flex-wrap: wrap;
            max-height: 1200px;
          }

          .testimonial-masonry-grid :global(.testimonial-card-dynamic) {
            flex: 0 0 auto;
            width: calc(33.333% - 1rem);
            margin-bottom: 1.5rem;
          }
        }

        /* Responsive Container Queries */
        @container (max-width: 768px) {
          .dynamic-testimonial-grid {
            grid-template-columns: 1fr !important;
            grid-template-areas: none !important;
            gap: 1.25rem;
            grid-template-rows: auto;
          }

          .dynamic-testimonial-grid :global(.testimonial-card-dynamic) {
            grid-area: auto !important;
            max-width: 600px;
            justify-self: center;
          }
        }

        @container (min-width: 769px) and (max-width: 1023px) {
          .dynamic-testimonial-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            grid-template-areas: none !important;
            gap: 1.5rem;
            grid-template-rows: auto;
          }

          .dynamic-testimonial-grid :global(.testimonial-card-dynamic) {
            grid-area: auto !important;
          }
        }

        /* Animation Keyframes */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Card Hover Effects */
        .dynamic-testimonial-grid :global(.testimonial-card-dynamic) {
          transition: transform 0.2s ease-out, box-shadow 0.2s ease-out;
        }

        .dynamic-testimonial-grid :global(.testimonial-card-dynamic:hover) {
          transform: translateY(-4px);
          box-shadow: 0px 8px 32px 0px rgba(157, 175, 181, 0.3);
        }

        /* Accessibility and Focus States */
        .dynamic-testimonial-grid :global(.testimonial-card-dynamic:focus-within) {
          outline: 2px solid var(--color-primary, #d4af37);
          outline-offset: 4px;
        }

        /* Print Styles */
        @media print {
          .dynamic-testimonial-grid {
            display: block !important;
            page-break-inside: avoid;
          }

          .dynamic-testimonial-grid :global(.testimonial-card-dynamic) {
            page-break-inside: avoid;
            break-inside: avoid;
            margin-bottom: 1rem;
            transform: none !important;
            box-shadow: none !important;
          }
        }
      `}</style>
    </div>
  );
}