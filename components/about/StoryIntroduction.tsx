'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { StoryIntroduction as StoryIntroductionType } from '@/types/content';
import ImagePlaceholder from './ImagePlaceholder';

interface StoryIntroductionProps {
  content: StoryIntroductionType;
}

export default function StoryIntroduction({ content }: StoryIntroductionProps) {
  const prefersReducedMotion = useReducedMotion();
  const [imageError, setImageError] = useState(false);

  const containerVariants = {
    hidden: { opacity: prefersReducedMotion ? 1 : 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: prefersReducedMotion ? 1 : 0, y: prefersReducedMotion ? 0 : 20 },
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
      id="story-introduction"
      className="bg-[var(--story-page-bg-light)] py-20 md:py-[var(--story-section-gap)] text-[#151515]"
      style={{ scrollMarginTop: '80px' }}
    >
      <motion.div
        className="max-w-[var(--story-container-max)] mx-auto px-[var(--story-container-padding)]"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
      >
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Text Column */}
          <motion.div className="space-y-6" variants={itemVariants}>
            <h2 className="font-[var(--font-ibm)] font-semibold text-[var(--story-section-title-size)] leading-[1.2] text-[var(--color-text)]">
              {content.heading}
              {content.headingAccent && (
                <span className="text-[var(--color-primary)]"> {content.headingAccent}</span>
              )}
            </h2>

            <div className="space-y-4">
              {content.paragraphs.map((paragraph, index) => (
                <p
                  key={index}
                  className="text-[var(--story-body-size)] font-[var(--font-nunito)] text-[var(--color-text)] leading-relaxed"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </motion.div>

          {/* Image Column */}
          <motion.div
            className="relative w-full aspect-[4/3] rounded-[var(--story-card-radius)] overflow-hidden shadow-xl"
            variants={itemVariants}
          >
            {imageError ? (
              <ImagePlaceholder
                width={800}
                height={600}
                label="Story Image"
                variant="light"
              />
            ) : (
              <Image
                src={content.image.src}
                alt={content.image.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                onError={() => setImageError(true)}
              />
            )}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
