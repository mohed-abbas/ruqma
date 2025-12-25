import TestimonialsClient from './TestimonialsClient'
import { getTestimonials } from '@/lib/sanity/fetch'
import { transformSanityTestimonials } from './sanityAdapter'
import { staticTestimonials } from './data'

interface TestimonialsProps {
  className?: string
  /** Use static data instead of fetching from Sanity */
  useStatic?: boolean
}

/**
 * Server component that fetches testimonial data from Sanity
 * Falls back to static data if Sanity fetch fails or useStatic is true
 */
export default async function Testimonials({
  className = '',
  useStatic = false,
}: TestimonialsProps) {
  let testimonials = staticTestimonials

  if (!useStatic) {
    const sanityTestimonials = await getTestimonials()
    if (sanityTestimonials && sanityTestimonials.length > 0) {
      testimonials = transformSanityTestimonials(sanityTestimonials)
    }
  }

  return (
    <div className={className}>
      <TestimonialsClient
        testimonials={testimonials}
        title="What Our Users Say About"
        titleAccent="Ruqma"
      />
    </div>
  )
}
