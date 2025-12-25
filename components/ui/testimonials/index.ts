// Barrel exports for testimonials components
export { default as Testimonials } from './Testimonials';
export { default as TestimonialsClient } from './TestimonialsClient';
export { default as TestimonialsGrid } from './TestimonialsGrid';
export { default as TestimonialCard } from './TestimonialCard';
export { default as StarRating } from './StarRating';

// Animation exports
export * from './animations';

// Sanity adapter exports
export {
  transformSanityTestimonial,
  transformSanityTestimonials,
} from './sanityAdapter';

// Type exports
export type {
  Testimonial,
  TestimonialCardType,
  TestimonialCardProps,
  TestimonialsGridProps,
} from './types';

// Data export
export { staticTestimonials } from './data';
