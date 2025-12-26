'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { Craftsmanship as CraftsmanshipType } from '@/types/content';
import ImagePlaceholder from './ImagePlaceholder';

interface CraftsmanshipProps {
  content: CraftsmanshipType;
}

export default function Craftsmanship({ content }: CraftsmanshipProps) {
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
      id="craftsmanship"
      className="relative w-full min-h-[600px] overflow-hidden"
      style={{ scrollMarginTop: '80px' }}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        {imageError ? (
          <ImagePlaceholder
            width={1920}
            height={800}
            label="Craftsmanship Background"
            variant="dark"
          />
        ) : (
          <Image
            src={content.image.src}
            alt={content.image.alt}
            fill
            className="object-cover"
            sizes="100vw"
            priority
            onError={() => setImageError(true)}
          />
        )}
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 flex items-center min-h-[600px]"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
      >
        <div className="max-w-[var(--story-container-max)] mx-auto px-[var(--story-container-padding)] py-20 w-full">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <motion.div className="max-w-xl" variants={itemVariants}>
              <h2 className="font-[var(--font-ibm)] font-semibold text-[var(--story-section-title-size)] leading-[1.2] text-[var(--story-page-text-primary)] mb-6">
                {content.heading}
                {content.headingAccent && (
                  <span className="text-[var(--story-page-text-accent)]"> {content.headingAccent}</span>
                )}
              </h2>

              <p className="font-[var(--font-nunito)] text-[var(--story-body-size)] text-[var(--story-page-text-secondary)] leading-relaxed">
                {content.description}
              </p>
            </motion.div>

            {/* Stats Grid */}
            {content.stats && content.stats.length > 0 && (
              <motion.div
                className="grid grid-cols-3 gap-4 md:gap-8"
                variants={itemVariants}
              >
                {content.stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    className="text-center p-4 md:p-6 rounded-[var(--story-card-radius)]"
                    style={{
                      background: 'var(--story-card-bg)',
                      border: '1px solid var(--story-card-border)',
                      backdropFilter: 'blur(var(--story-card-backdrop-blur))',
                      WebkitBackdropFilter: 'blur(var(--story-card-backdrop-blur))',
                    }}
                    whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
                    transition={{ duration: prefersReducedMotion ? 0.01 : 0.2 }}
                  >
                    <div className="font-[var(--font-ibm)] text-3xl md:text-4xl font-bold text-[var(--story-page-text-accent)] mb-2">
                      {stat.value}
                    </div>
                    <div className="font-[var(--font-nunito)] text-xs md:text-sm text-[var(--story-page-text-secondary)]">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
