'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { PartnerCTA as PartnerCTAType } from '@/types/content';

interface PartnerCTAProps {
  content: PartnerCTAType;
}

export default function PartnerCTA({ content }: PartnerCTAProps) {
  return (
    <section
      id="partner-cta"
      className="py-24 lg:py-32"
      style={{
        background: 'var(--wtb-bg-dark)',
        scrollMarginTop: '80px',
      }}
    >
      <div
        className="mx-auto text-center"
        style={{
          maxWidth: 'var(--wtb-container-max)',
          padding: `0 var(--wtb-container-padding)`,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {/* Decorative Element */}
          <div
            className="w-16 h-1 mx-auto mb-8 rounded-full"
            style={{ background: 'var(--wtb-text-accent)' }}
          />

          {/* Heading */}
          <h2
            className="font-semibold leading-[1.2] mb-6"
            style={{
              fontFamily: 'var(--font-ibm)',
              fontSize: 'var(--wtb-section-title-size)',
              color: 'var(--wtb-text-primary)',
            }}
          >
            {content.heading}
          </h2>

          {/* Subheading */}
          <p
            className="text-xl mb-12 max-w-2xl mx-auto leading-relaxed"
            style={{
              fontFamily: 'var(--font-nunito)',
              color: 'var(--wtb-text-secondary)',
            }}
          >
            {content.subheading}
          </p>

          {/* CTA Button */}
          <Link
            href={content.buttonLink}
            className="inline-block px-8 py-4 font-bold text-base capitalize transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#151715]"
            style={{
              background: 'var(--wtb-button-bg)',
              color: 'var(--wtb-button-text)',
              borderRadius: 'var(--wtb-button-radius)',
              boxShadow: 'var(--wtb-button-shadow)',
              fontFamily: 'var(--font-nunito)',
              fontVariationSettings: "'YTLC' 500, 'wdth' 100",
            }}
            aria-label={content.buttonAriaLabel}
          >
            {content.buttonText}
          </Link>

          {/* Additional Info */}
          <p
            className="mt-8 text-sm"
            style={{
              fontFamily: 'var(--font-nunito)',
              color: 'var(--wtb-text-muted)',
            }}
          >
            We carefully review all partnership applications
          </p>
        </motion.div>
      </div>
    </section>
  );
}
