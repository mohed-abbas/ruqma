// Testimonial card types for the bento grid layout
export type TestimonialCardType = 'tall' | 'wide' | 'compact';

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  imageUrl?: string;
  cardType: TestimonialCardType;
  priority?: number;
  featured?: boolean;
}

export interface TestimonialCardProps {
  testimonial: Testimonial;
  className?: string;
  /** Enable hover micro-interactions (used when wrapped by motion.div) */
  animated?: boolean;
}

export interface TestimonialsGridProps {
  testimonials: Testimonial[];
  className?: string;
}
