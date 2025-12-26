'use client';

import React from 'react';
import { motion } from 'framer-motion';
import DarkVeil from '@/components/Background';
import { OurStoryHero as OurStoryHeroType } from '@/types/content';

interface OurStoryHeroProps {
  content: OurStoryHeroType;
}

export default function OurStoryHero({ content }: OurStoryHeroProps) {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="our-story-hero"
      className="relative w-full h-screen overflow-hidden"
      role="banner"
      aria-labelledby="story-hero-title"
    >
      {/* Background with DarkVeil */}
      <div className="absolute inset-0 w-full h-full" aria-hidden="true">
        <DarkVeil
          hueShift={210}
          speed={1.5}
          noiseIntensity={0}
          scanlineIntensity={0}
          scanlineFrequency={0}
          warpAmount={0}
        />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -10, opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="text-center max-w-4xl px-4"
        >
          {/* Main Heading */}
          <h1
            id="story-hero-title"
            className="text-7xl sm:text-8xl md:text-9xl lg:text-[var(--story-title-size)] font-[var(--font-ibm)] leading-[1.2] mb-6 capitalize"
          >
            <span className="text-[var(--story-page-text-primary)]">{content.title}</span>
            <span className="text-[var(--story-page-text-accent)] ml-3">{content.titleAccent}</span>
          </h1>

          {/* Subtitle */}
          <p className="mb-12 text-2xl sm:text-3xl md:text-4xl text-[var(--story-page-text-secondary)] leading-[1.3] font-[var(--font-nunito)]">
            {content.subtitle}
          </p>

          {/* CTA Button */}
          {content.ctaText && (
            <button
              onClick={() => scrollToSection('story-introduction')}
              className="bg-[var(--story-page-text-accent)] hover:bg-[#b8951f] text-black px-6 py-3 rounded-[52px] font-bold text-sm capitalize transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[var(--story-page-text-accent)] focus:ring-offset-2 focus:ring-offset-black"
              style={{
                fontFamily: 'var(--font-nunito)',
                fontVariationSettings: "'YTLC' 500, 'wdth' 100",
                boxShadow: 'var(--product-page-button-shadow)'
              }}
              aria-label={content.ctaAriaLabel || 'Scroll to learn more'}
              type="button"
            >
              {content.ctaText}
            </button>
          )}
        </motion.div>
      </div>
    </section>
  );
}
