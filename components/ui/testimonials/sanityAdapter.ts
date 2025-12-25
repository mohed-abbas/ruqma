import type { SanityTestimonial } from '@/lib/sanity/fetch'
import { urlForImage } from '@/lib/sanity/client'
import type { Testimonial } from './types'

/**
 * Transform Sanity testimonial to component Testimonial type
 * Handles image URL generation and optional field defaults
 */
export function transformSanityTestimonial(
  sanityTestimonial: SanityTestimonial
): Testimonial {
  return {
    id: sanityTestimonial._id,
    name: sanityTestimonial.name,
    role: sanityTestimonial.role,
    company: sanityTestimonial.company,
    content: sanityTestimonial.content,
    rating: sanityTestimonial.rating,
    imageUrl: sanityTestimonial.image
      ? urlForImage(sanityTestimonial.image)
          .width(400)
          .height(400)
          .fit('crop')
          .url()
      : undefined,
    cardType: sanityTestimonial.cardType,
    priority: sanityTestimonial.priority,
    featured: sanityTestimonial.featured,
  }
}

/**
 * Transform array of Sanity testimonials to component format
 */
export function transformSanityTestimonials(
  sanityTestimonials: SanityTestimonial[]
): Testimonial[] {
  return sanityTestimonials.map(transformSanityTestimonial)
}
