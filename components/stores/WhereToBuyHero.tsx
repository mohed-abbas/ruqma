'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { WhereToBuyHero as WhereToBuyHeroType } from '@/types/content';

interface WhereToBuyHeroProps {
  content: WhereToBuyHeroType;
}

export default function WhereToBuyHero({ content }: WhereToBuyHeroProps) {
  return (
    <section
      id="where-to-buy-hero"
      className="relative w-full h-[60vh] min-h-[500px] overflow-hidden bg-black"
      role="banner"
      aria-labelledby="where-to-buy-hero-title"
    >
      {/* Gradient Background */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%)'
        }}
        aria-hidden="true"
      />

      {/* Hero Content */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -10, opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="text-center max-w-4xl px-4"
        >
          <h1
            id="where-to-buy-hero-title"
            className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-[var(--font-ibm)] leading-[1.2] mb-6 capitalize"
          >
            <span className="text-white">{content.title}</span>
            <span className="text-[var(--color-primary)] ml-3">{content.titleAccent}</span>
          </h1>
          <p className="text-2xl sm:text-3xl md:text-4xl text-white/80 leading-[1.3] font-[var(--font-nunito)]">
            {content.subtitle}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
