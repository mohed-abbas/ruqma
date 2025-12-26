'use client';

import React from 'react';
import { motion, Variants, useReducedMotion } from 'framer-motion';
import { TimelineMilestone } from '@/types/content';

interface TimelineProps {
  milestones: TimelineMilestone[];
}

export default function Timeline({ milestones }: TimelineProps) {
  const prefersReducedMotion = useReducedMotion();

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: prefersReducedMotion ? 1 : 0, y: prefersReducedMotion ? 0 : 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: prefersReducedMotion ? 0.01 : 0.6,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  return (
    <section
      id="timeline"
      className="bg-[var(--story-page-bg-light)] py-20 md:py-[var(--story-section-gap)] text-[#151515]"
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
          <h2 className="font-[var(--font-ibm)] font-semibold text-[var(--story-section-title-size)] leading-[1.2] text-[var(--color-text)]">
            Our <span className="text-[var(--color-primary)]">Journey</span>
          </h2>
        </motion.div>

        {/* Horizontal Timeline */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="relative"
        >
          {/* Horizontal Timeline Line */}
          <div
            className="absolute left-0 right-0 top-8 h-0.5 bg-[var(--story-timeline-line)]"
            aria-hidden="true"
          />

          {/* Milestones Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {milestones.map((milestone, index) => (
              <motion.article
                key={index}
                variants={itemVariants}
                className="relative pt-16"
              >
                {/* Timeline Dot */}
                <div
                  className={`absolute top-4 left-1/2 -translate-x-1/2 w-[var(--story-timeline-dot-size)] h-[var(--story-timeline-dot-size)] rounded-full ${
                    milestone.isFuture
                      ? 'border-2 border-dashed border-[var(--story-timeline-dot)] bg-transparent'
                      : 'bg-[var(--story-timeline-dot)]'
                  }`}
                  aria-hidden="true"
                />

                {/* Year + Quarter Badge */}
                <div className="text-center mb-4">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-[var(--font-ibm)] font-semibold ${
                      milestone.isFuture
                        ? 'bg-transparent border border-dashed border-[var(--color-primary)] text-[var(--color-primary)]'
                        : 'bg-[var(--color-primary)] text-white'
                    }`}
                  >
                    {milestone.quarter && `${milestone.quarter} `}
                    {milestone.year}
                  </span>
                </div>

                {/* Content Card */}
                <div className="bg-white p-6 rounded-[var(--story-card-radius)] shadow-md border border-[var(--color-gray-200)]">
                  <h3
                    className={`font-[var(--font-ibm)] text-lg font-semibold mb-2 ${
                      milestone.isFuture
                        ? 'text-[var(--color-gray-500)]'
                        : 'text-[var(--color-text)]'
                    }`}
                  >
                    {milestone.title}
                  </h3>
                  <p
                    className={`font-[var(--font-nunito)] text-sm leading-relaxed ${
                      milestone.isFuture
                        ? 'text-[var(--color-gray-500)]'
                        : 'text-[var(--color-text)]'
                    }`}
                  >
                    {milestone.description}
                  </p>
                </div>
              </motion.article>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
