export interface Testimonial {
  id: string;
  name: string;
  company: string;
  rating: number;
  text: string;
  avatar: string;
  cardType: 'tall' | 'wide' | 'compact'; // Manual control over testimonial layout type
  priority?: number;  // CMS ordering
}

export interface TestimonialCardProps extends Testimonial {
  className?: string;
  style?: React.CSSProperties;
}

export interface TestimonialsContent {
  section: {
    title: string;
    titleAccent: string;
  };
  testimonials: Testimonial[];
}

export interface StarRatingProps {
  rating: number;
  maxRating?: number;
  className?: string;
}