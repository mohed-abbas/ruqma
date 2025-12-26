'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ValueCard } from '@/types/content';

interface ValuesGridProps {
  values: ValueCard[];
}

// Icon mapping for value cards - gold color for dark background
const iconMap: Record<string, React.ReactElement> = {
  quality: (
    <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  innovation: (
    <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  ),
  experience: (
    <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  ),
};

export default function ValuesGrid({ values }: ValuesGridProps) {
  const prefersReducedMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: prefersReducedMotion ? 1 : 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: prefersReducedMotion ? 1 : 0, y: prefersReducedMotion ? 0 : 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: prefersReducedMotion ? 0.01 : 0.6,
        ease: 'easeOut' as const,
      },
    },
  };
  return (
    <section
      id="values"
      className="bg-[var(--story-page-bg)] py-20 md:py-[var(--story-section-gap)]"
      style={{ scrollMarginTop: '80px' }}
    >
      <div className="max-w-[var(--story-container-max)] mx-auto px-[var(--story-container-padding)]">
        {/* Section Header */}
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: prefersReducedMotion ? 1 : 0, y: prefersReducedMotion ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: prefersReducedMotion ? 0.01 : 0.6 }}
        >
          <h2 className="font-[var(--font-ibm)] font-semibold text-[var(--story-section-title-size)] leading-[1.2] text-[var(--story-page-text-primary)]">
            Our <span className="text-[var(--story-page-text-accent)]">Values</span>
          </h2>
        </motion.div>

        {/* Values Grid with Glass Cards */}
        <motion.div
          className="grid md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {values.map((value, index) => (
            <motion.article
              key={value.id || index}
              className="group p-8 rounded-[var(--story-card-radius)] transition-all duration-300 hover:scale-[1.02]"
              style={{
                background: 'var(--story-card-bg)',
                border: '1px solid var(--story-card-border)',
                boxShadow: 'var(--story-card-shadow)',
                backdropFilter: 'blur(var(--story-card-backdrop-blur))',
                WebkitBackdropFilter: 'blur(var(--story-card-backdrop-blur))',
              }}
              variants={cardVariants}
            >
              {/* Icon */}
              <div className="mb-6 text-[var(--story-page-text-accent)] transition-transform duration-300 group-hover:scale-110">
                {iconMap[value.icon] || iconMap.quality}
              </div>

              {/* Title */}
              <h3 className="font-[var(--font-ibm)] text-2xl font-semibold text-[var(--story-page-text-primary)] mb-4">
                {value.title}
              </h3>

              {/* Description */}
              <p className="font-[var(--font-nunito)] text-base text-[var(--story-page-text-secondary)] leading-relaxed">
                {value.description}
              </p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
