/**
 * TestimonialCardsPreview Component - Phase 3: Visual Testing
 *
 * Preview component for testing and demonstrating all three card types
 * with sample data. This component is for development and testing purposes.
 */

'use client';

import React from 'react';
import TallTestimonial from './TallTestimonial';
import WideTestimonial from './WideTestimonial';
import CompactTestimonial from './CompactTestimonial';
import TestimonialCard from './TestimonialCard';

// Sample testimonial data for testing
const sampleTestimonials = [
  {
    id: "test-tall",
    name: "Sarah Johnson",
    company: "Tech Innovators Inc.",
    rating: 5,
    text: "This platform has completely transformed our workflow. The intuitive design and powerful features make it indispensable for our team. We've seen a 40% increase in productivity since implementation.",
    avatar: "/testimonials/testimonial1.jpg",
    cardType: "tall" as const,
    priority: 1
  },
  {
    id: "test-wide",
    name: "Michael Chen",
    company: "Digital Solutions Ltd.",
    rating: 4.5,
    text: "Excellent service and support. The team is responsive and the product delivers exactly what was promised.",
    avatar: "/testimonials/testimonial2.jpg",
    cardType: "wide" as const,
    priority: 2
  },
  {
    id: "test-compact",
    name: "Emily Rodriguez",
    company: "Creative Agency",
    rating: 5,
    text: "Simple, effective, and reliable. Exactly what we needed.",
    avatar: "/testimonials/testimonial3.svg",
    cardType: "compact" as const,
    priority: 3
  }
];

const TestimonialCardsPreview: React.FC = () => {
  return (
    <div className="p-8 bg-[var(--testimonials-bg)] min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-[var(--testimonials-text-primary)]">
        Phase 3: Testimonial Cards Preview
      </h1>

      {/* Individual Components */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-[var(--testimonials-text-primary)]">
          Individual Card Components
        </h2>
        <div className="flex flex-wrap gap-8 items-start">
          <div>
            <h3 className="text-lg font-medium mb-4 text-[var(--testimonials-text-secondary)]">
              TallTestimonial (291×429px)
            </h3>
            <TallTestimonial testimonial={sampleTestimonials[0]} />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4 text-[var(--testimonials-text-secondary)]">
              WideTestimonial (589×254px)
            </h3>
            <WideTestimonial testimonial={sampleTestimonials[1]} />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4 text-[var(--testimonials-text-secondary)]">
              CompactTestimonial (319×241px)
            </h3>
            <CompactTestimonial testimonial={sampleTestimonials[2]} />
          </div>
        </div>
      </section>

      {/* Smart TestimonialCard Component */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-[var(--testimonials-text-primary)]">
          Smart TestimonialCard Component
        </h2>
        <p className="text-[var(--testimonials-text-secondary)] mb-6">
          The TestimonialCard component automatically routes to the appropriate card type based on the testimonial's cardType property.
        </p>
        <div className="flex flex-wrap gap-8 items-start">
          {sampleTestimonials.map((testimonial) => (
            <div key={testimonial.id}>
              <h3 className="text-lg font-medium mb-4 text-[var(--testimonials-text-secondary)]">
                cardType: "{testimonial.cardType}"
              </h3>
              <TestimonialCard testimonial={testimonial} />
            </div>
          ))}
        </div>
      </section>

      {/* Loading States */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-[var(--testimonials-text-primary)]">
          Loading States
        </h2>
        <div className="flex flex-wrap gap-8 items-start">
          <div>
            <h3 className="text-lg font-medium mb-4 text-[var(--testimonials-text-secondary)]">
              Tall Loading
            </h3>
            <TallTestimonial testimonial={sampleTestimonials[0]} loading={true} />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4 text-[var(--testimonials-text-secondary)]">
              Wide Loading
            </h3>
            <WideTestimonial testimonial={sampleTestimonials[1]} loading={true} />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4 text-[var(--testimonials-text-secondary)]">
              Compact Loading
            </h3>
            <CompactTestimonial testimonial={sampleTestimonials[2]} loading={true} />
          </div>
        </div>
      </section>

      {/* Dark Mode Test */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-[var(--testimonials-text-primary)]">
          Dark Mode Compatibility
        </h2>
        <p className="text-[var(--testimonials-text-secondary)] mb-6">
          Switch your system to dark mode to test the dark theme compatibility using CSS custom properties.
        </p>
      </section>
    </div>
  );
};

export default TestimonialCardsPreview;