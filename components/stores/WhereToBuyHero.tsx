'use client';

import React from 'react';
import { motion } from 'framer-motion';
import DarkVeil from '@/components/Background';
import { WhereToBuyHero as WhereToBuyHeroType } from '@/types/content';

interface WhereToBuyHeroProps {
  content: WhereToBuyHeroType;
}

export default function WhereToBuyHero({ content }: WhereToBuyHeroProps) {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="where-to-buy-hero"
      className="relative w-full h-screen overflow-hidden"
      role="banner"
      aria-labelledby="where-to-buy-hero-title"
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
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center max-w-4xl px-4"
        >
          {/* Main Heading */}
          <h1
            id="where-to-buy-hero-title"
            className="text-7xl sm:text-8xl md:text-9xl lg:text-[var(--wtb-title-size)] font-[var(--font-ibm)] leading-[1.2] mb-6 capitalize"
          >
            <span className="text-[var(--wtb-text-primary)]">{content.title}</span>
            <span className="text-[var(--wtb-text-accent)] ml-3">{content.titleAccent}</span>
          </h1>

          {/* Subtitle */}
          <p className="mb-12 text-2xl sm:text-3xl md:text-4xl text-[var(--wtb-text-secondary)] leading-[1.3] font-[var(--font-nunito)]">
            {content.subtitle}
          </p>

          {/* CTA Button */}
          {content.ctaText && (
            <button
              onClick={() => scrollToSection('partner-stores')}
              className="bg-[var(--wtb-button-bg)] hover:bg-[#b8951f] text-[var(--wtb-button-text)] px-6 py-3 rounded-[var(--wtb-button-radius)] font-bold text-sm capitalize transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[var(--wtb-text-accent)] focus:ring-offset-2 focus:ring-offset-black"
              style={{
                fontFamily: 'var(--font-nunito)',
                fontVariationSettings: "'YTLC' 500, 'wdth' 100",
                boxShadow: 'var(--wtb-button-shadow)'
              }}
              aria-label={content.ctaAriaLabel || 'Scroll to explore stores'}
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
