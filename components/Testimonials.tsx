import React from 'react';
import { TestimonialsGrid } from '@/components/ui/testimonials';
import testimonialsData from '@/data/content/testimonials.json';
import { getTestimonials, SanityTestimonial } from '@/lib/sanity/fetch';
import { urlForImage } from '@/lib/sanity/client';

export default async function Testimonials() {
  const { section } = testimonialsData;

  // Fetch testimonials from Sanity CMS
  const sanityTestimonials: SanityTestimonial[] = await getTestimonials();

  // Transform Sanity data to match expected format
  const transformedTestimonials = sanityTestimonials.map((testimonial: SanityTestimonial) => ({
    ...testimonial,
    id: testimonial._id,
    avatar: urlForImage(testimonial.avatar).width(200).height(200).url(),
    priority: testimonial.priority ?? 0,
    cardType: testimonial.cardType as 'tall' | 'wide' | 'compact',
    role: testimonial.company || 'Customer',
    featured: (testimonial.priority ?? 5) <= 3,
    tags: ['general'],
    metadata: {
      source: 'sanity',
      version: '1.0',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  }));

  const testimonials = transformedTestimonials.slice(0, 8);
  const loading = false;
  const error = null;

  return (
    <section
      id="testimonials"
      className="min-h-screen bg-white py-20"
      aria-labelledby="testimonials-heading"
    >
      <div className="w-full max-w-[1280px] mx-auto px-4">
        {/* Header section - matching Figma typography exactly */}
        <header className="mb-[38px]">
          <h2
            id="testimonials-heading"
            className="text-[65px] leading-[1.2] text-[#151715] font-semibold"
            style={{ fontFamily: 'var(--font-ibm)' }}
          >
            <span className="text-[#151715]">{section.title}</span>
            <span className="text-[var(--color-primary)] ml-2">{section.titleAccent}</span>
          </h2>
        </header>

        {/* Advanced Testimonials Grid */}
        <div className="mt-12">
          {error ? (
            <div className="text-center text-red-600 py-8" role="alert">
              <p>Unable to load testimonials at this time.</p>
              <p className="text-sm text-gray-500 mt-2">Please try refreshing the page.</p>
            </div>
          ) : (
            <TestimonialsGrid
              testimonials={testimonials}
              loading={loading}
              animationPreset="luxury"
              maxTestimonials={8}
              className="testimonials-section-grid"
              accessibility={{
                announceChanges: true,
                keyboardNavigation: true,
                screenReaderOptimized: true,
                highContrastMode: false,
              }}
              responsive={{
                mobile: {
                  columns: 1,
                  maxWidth: '100%',
                  cardSpacing: '1rem',
                },
                tablet: {
                  columns: 2,
                  maxWidth: '100%',
                  cardSpacing: '1.5rem',
                },
                desktop: {
                  columns: 3,
                  maxWidth: '1200px',
                  cardSpacing: '1.5rem',
                },
              }}
            />
          )}
        </div>
      </div>

      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Ruqma",
            "review": testimonials.slice(0, 5).map((testimonial: typeof transformedTestimonials[0]) => ({
              "@type": "Review",
              "author": {
                "@type": "Person",
                "name": testimonial.name
              },
              "reviewRating": {
                "@type": "Rating",
                "ratingValue": testimonial.rating,
                "bestRating": 5
              },
              "reviewBody": testimonial.text,
              "publisher": {
                "@type": "Organization",
                "name": testimonial.company || "Customer"
              }
            }))
          })
        }}
      />
    </section>
  );
}