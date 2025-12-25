import type { TestimonialsGridProps } from './types';
import TestimonialCard from './TestimonialCard';

export default function TestimonialsGrid({
  testimonials,
  className = '',
}: TestimonialsGridProps) {
  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr ${className}`}
    >
      {testimonials.map((testimonial) => {
        // Tall cards: span 2 rows on desktop only (compact on mobile/tablet)
        if (testimonial.cardType === 'tall') {
          return (
            <div key={testimonial.id} className="lg:row-span-2">
              <TestimonialCard testimonial={testimonial} className="h-full" />
            </div>
          );
        }

        // Wide cards: span 2 columns on desktop only (compact on mobile/tablet)
        if (testimonial.cardType === 'wide') {
          return (
            <div key={testimonial.id} className="lg:col-span-2">
              <TestimonialCard testimonial={testimonial} className="h-full" />
            </div>
          );
        }

        // Compact cards: always single cell
        return (
          <TestimonialCard key={testimonial.id} testimonial={testimonial} />
        );
      })}
    </div>
  );
}
