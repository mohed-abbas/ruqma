'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { Testimonial } from './types';
import TestimonialCard from './TestimonialCard';
import {
  headerVariants,
  containerVariants,
  cardVariants,
  DURATION,
} from './animations';

interface TestimonialsClientProps {
  testimonials: Testimonial[];
  title?: string;
  titleAccent?: string;
}

/**
 * Client component wrapper for testimonials with scroll-triggered animations
 * Handles the motion/animation layer while keeping data fetching in server component
 */
export default function TestimonialsClient({
  testimonials,
  title = 'What Our',
  titleAccent = 'Customers Say',
}: TestimonialsClientProps) {
  const prefersReducedMotion = useReducedMotion();

  // Adjust variants for reduced motion preference
  const getVariants = (variants: typeof headerVariants) => {
    if (prefersReducedMotion) {
      return {
        hidden: { opacity: 1, y: 0, scale: 1 },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: { duration: DURATION.fast },
        },
      };
    }
    return variants;
  };

  // Adjust container variants for reduced motion
  const getContainerVariants = () => {
    if (prefersReducedMotion) {
      return {
        hidden: {},
        visible: {
          transition: { staggerChildren: 0, delayChildren: 0 },
        },
      };
    }
    return containerVariants;
  };

  return (
    <section
      id="testimonials"
      className="bg-[var(--testimonials-bg)] py-16 md:py-20 lg:py-24"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with scroll-reveal animation */}
        <motion.div
          variants={getVariants(headerVariants)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="mb-12 md:mb-16"
        >
          <h2 className="font-[var(--font-ibm)] font-semibold text-3xl md:text-4xl lg:text-5xl leading-tight text-[var(--testimonials-text-primary)]">
            <span>{title}</span>
            <span className="text-[var(--color-primary)] ml-2">{titleAccent}</span>
          </h2>
        </motion.div>

        {/* Grid container with staggered card animations */}
        <motion.div
          variants={getContainerVariants()}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr"
        >
          {testimonials.map((testimonial) => {
            // Tall cards: span 2 rows on desktop only
            if (testimonial.cardType === 'tall') {
              return (
                <motion.div
                  key={testimonial.id}
                  variants={getVariants(cardVariants)}
                  className="lg:row-span-2"
                >
                  <TestimonialCard
                    testimonial={testimonial}
                    className="h-full"
                    animated
                  />
                </motion.div>
              );
            }

            // Wide cards: span 2 columns on desktop only
            if (testimonial.cardType === 'wide') {
              return (
                <motion.div
                  key={testimonial.id}
                  variants={getVariants(cardVariants)}
                  className="lg:col-span-2"
                >
                  <TestimonialCard
                    testimonial={testimonial}
                    className="h-full"
                    animated
                  />
                </motion.div>
              );
            }

            // Compact cards: always single cell
            return (
              <motion.div
                key={testimonial.id}
                variants={getVariants(cardVariants)}
              >
                <TestimonialCard testimonial={testimonial} animated />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
