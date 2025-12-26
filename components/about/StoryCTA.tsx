'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion, useReducedMotion } from 'framer-motion';
import { StoryCTA as StoryCTAType } from '@/types/content';

interface StoryCTAProps {
  content: StoryCTAType;
}

export default function StoryCTA({ content }: StoryCTAProps) {
  const prefersReducedMotion = useReducedMotion();
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const link = content.buttonLink;

    // Check if it's a hash link to another page (e.g., "/#products")
    if (link.startsWith('/#')) {
      const hash = link.substring(1); // Get "#products"
      router.push('/');

      // Poll for element existence - Products section loads async via Suspense
      const scrollToElement = (attempts = 0) => {
        const maxAttempts = 50; // 50 * 100ms = 5 seconds max wait
        const element = document.querySelector(hash);

        if (element) {
          // Use requestAnimationFrame to ensure layout is stable
          requestAnimationFrame(() => {
            element.scrollIntoView({ behavior: 'smooth' });
          });
        } else if (attempts < maxAttempts) {
          setTimeout(() => scrollToElement(attempts + 1), 100);
        }
      };

      // Start polling after initial navigation delay
      setTimeout(() => scrollToElement(), 50);
    } else {
      router.push(link);
    }
  };

  const reducedFadeInUp = {
    initial: { opacity: prefersReducedMotion ? 1 : 0, y: prefersReducedMotion ? 0 : 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: prefersReducedMotion ? 0.01 : 0.6, ease: [0.4, 0, 0.2, 1] },
  };

  const reducedStaggerContainer = {
    animate: {
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.2,
      },
    },
  };

  return (
    <section
      id="story-cta"
      className="w-full bg-[var(--story-page-bg-light)] py-[80px] lg:py-[120px]"
      style={{ scrollMarginTop: '80px' }}
    >
      <div className="max-w-[1280px] mx-auto px-[var(--story-container-padding)]">
        <div className="bg-[var(--color-primary)] p-[24px] md:p-[48px] lg:p-[64px] rounded-[20px]">
          <motion.div
            className="text-center max-w-[800px] mx-auto"
            initial="initial"
            animate="animate"
            variants={prefersReducedMotion ? undefined : reducedStaggerContainer}
          >
            {/* Headline */}
            <motion.h2
              className="text-[28px] sm:text-[36px] lg:text-[42px] font-bold leading-[1.2] text-white mb-[24px] lg:mb-[32px]"
              style={{ fontFamily: 'var(--font-ibm)' }}
              variants={prefersReducedMotion ? undefined : reducedFadeInUp}
            >
              {content.heading}
              {content.headingAccent && <> {content.headingAccent}</>}
            </motion.h2>

            {/* Description */}
            <motion.p
              className="text-[16px] sm:text-[18px] lg:text-[20px] font-normal leading-[1.5] text-white opacity-90 mb-[40px] lg:mb-[48px]"
              style={{ fontFamily: 'var(--font-nunito)' }}
              variants={prefersReducedMotion ? undefined : reducedFadeInUp}
            >
              {content.subheading}
            </motion.p>

            {/* CTA Button */}
            <motion.div variants={prefersReducedMotion ? undefined : reducedFadeInUp}>
              <a
                href={content.buttonLink}
                onClick={handleClick}
                className="inline-block bg-white text-[var(--color-primary)] px-[32px] sm:px-[40px] py-[14px] sm:py-[16px] rounded-[52px] font-bold text-[14px] sm:text-[16px] border-2 border-white min-w-[180px] transition-all duration-300 ease-in-out hover:bg-transparent hover:text-white hover:border-white cursor-pointer"
                style={{
                  fontFamily: 'var(--font-nunito)',
                  boxShadow:
                    '0px -4px 5.8px 0px inset rgba(161,161,161,0.25), 0px 4px 2.6px 0px inset rgba(255,255,255,0.25)',
                }}
                aria-label={content.buttonAriaLabel}
              >
                {content.buttonText}
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
