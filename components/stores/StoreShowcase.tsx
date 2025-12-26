'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { StoryIntroduction, StoreFeature } from '@/types/content';
import ImagePlaceholder from '@/components/about/ImagePlaceholder';

interface StoreShowcaseProps {
  introduction: StoryIntroduction;
  features: StoreFeature[];
}

// Icon mapping for store features
const iconMap: Record<string, React.ReactElement> = {
  consultation: (
    <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  demonstration: (
    <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
    </svg>
  ),
  events: (
    <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  availability: (
    <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

export default function StoreShowcase({ introduction, features }: StoreShowcaseProps) {
  return (
    <section
      id="store-showcase"
      className="bg-[var(--wtb-bg-dark)] py-24 lg:py-32"
      style={{ scrollMarginTop: '80px' }}
    >
      <div className="max-w-[var(--wtb-container-max)] mx-auto px-[var(--wtb-container-padding)]">
        {/* Introduction Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={containerVariants}
          className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center mb-24"
        >
          {/* Text Column */}
          <motion.div variants={itemVariants} className="space-y-6">
            <h2 className="font-[var(--font-ibm)] font-semibold text-[var(--wtb-section-title-size)] leading-[1.2] text-[var(--wtb-text-primary)]">
              {introduction.heading}
              {introduction.headingAccent && (
                <span className="text-[var(--wtb-text-accent)]"> {introduction.headingAccent}</span>
              )}
            </h2>
            <div className="space-y-4">
              {introduction.paragraphs.map((paragraph, index) => (
                <p
                  key={index}
                  className="text-lg font-[var(--font-nunito)] text-[var(--wtb-text-secondary)] leading-relaxed"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </motion.div>

          {/* Image Column */}
          <motion.div
            variants={itemVariants}
            className="relative w-full aspect-[4/3] rounded-[var(--wtb-card-radius)] overflow-hidden"
            style={{
              boxShadow: 'var(--wtb-feature-shadow)',
            }}
          >
            {introduction.image.src.includes('placeholder') || !introduction.image.src.startsWith('/images') ? (
              <ImagePlaceholder width={600} height={450} label="Retail Experience" variant="dark" />
            ) : (
              <Image
                src={introduction.image.src}
                alt={introduction.image.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            )}
          </motion.div>
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={containerVariants}
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="mb-12 text-center">
            <h3 className="font-[var(--font-ibm)] font-semibold text-[var(--wtb-section-title-size)] leading-[1.2] text-[var(--wtb-text-primary)]">
              Why Visit <span className="text-[var(--wtb-text-accent)]">In Person?</span>
            </h3>
          </motion.div>

          {/* Features Grid - Glass Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.article
                key={index}
                variants={itemVariants}
                className="group relative p-6 rounded-[var(--wtb-card-radius)] transition-all duration-300 hover:scale-[1.02]"
                style={{
                  background: 'var(--wtb-feature-bg)',
                  border: '1px solid var(--wtb-feature-border)',
                  backdropFilter: `blur(var(--wtb-feature-backdrop-blur))`,
                  WebkitBackdropFilter: `blur(var(--wtb-feature-backdrop-blur))`,
                }}
              >
                {/* Icon */}
                <div className="mb-5 text-[var(--wtb-text-accent)] transition-transform duration-300 group-hover:scale-110">
                  {iconMap[feature.icon] || iconMap.consultation}
                </div>

                {/* Title */}
                <h4 className="font-[var(--font-ibm)] text-lg font-semibold text-[var(--wtb-text-primary)] mb-3">
                  {feature.title}
                </h4>

                {/* Description */}
                <p className="font-[var(--font-nunito)] text-sm text-[var(--wtb-text-secondary)] leading-relaxed">
                  {feature.description}
                </p>
              </motion.article>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
