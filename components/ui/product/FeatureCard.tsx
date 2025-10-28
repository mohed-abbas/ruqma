'use client';

import { motion } from 'framer-motion';
import { FeatureCardProps } from './types';

/**
 * Individual feature card component for product details section
 * Features hover effects and staggered entrance animations
 */
export default function FeatureCard({
  feature,
  className,
  delay = 0
}: FeatureCardProps) {
  const { title, highlight, description } = feature;

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1],
      delay
    }
  };

  return (
    <motion.article
      className={`
        bg-white
        rounded-[12px]
        p-[20px]
        shadow-[0px_4px_15.8px_0px_rgba(0,0,0,0.1)]
        transition-shadow
        duration-200
        hover:shadow-[0px_8px_25px_0px_rgba(0,0,0,0.15)]
        ${className || ''}
      `}
      initial="initial"
      animate="animate"
      variants={fadeInUp}
      whileHover={{
        y: -2,
        transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] }
      }}
      role="article"
      aria-labelledby={`feature-${feature.id}-title`}
    >
      {/* Feature Title */}
      <h3
        id={`feature-${feature.id}-title`}
        className="mb-[12px] text-[24px] font-bold leading-[1.2] text-[#1e1e1e]"
        style={{
          fontFamily: 'IBM Plex Sans, sans-serif'
        }}
      >
        <span className="text-[#1e1e1e]">{title}</span>
        {highlight && (
          <>
            <span className="text-[#1e1e1e]"> </span>
            <span className="text-[#d4af37]">{highlight}</span>
          </>
        )}
      </h3>

      {/* Feature Description */}
      <p
        className="text-[16px] font-normal leading-[1.5] text-[rgba(68,69,78,0.7)]"
        style={{
          fontFamily: 'Nunito Sans, sans-serif'
        }}
      >
        {description}
      </p>
    </motion.article>
  );
}