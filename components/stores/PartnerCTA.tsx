import React from 'react';
import Link from 'next/link';
import { PartnerCTA as PartnerCTAType } from '@/types/content';

interface PartnerCTAProps {
  content: PartnerCTAType;
}

export default function PartnerCTA({ content }: PartnerCTAProps) {
  return (
    <section
      id="partner-cta"
      className="bg-white py-20"
      style={{ scrollMarginTop: '80px' }}
    >
      <div className="max-w-[1234px] mx-auto px-4 text-center">
        <h2 className="font-[var(--font-ibm)] font-semibold text-[clamp(2.5rem,5vw,4rem)] leading-[1.2] text-[#151715] mb-4">
          {content.heading}
        </h2>
        <p className="font-[var(--font-nunito)] text-xl text-[#151715]/80 mb-10 max-w-2xl mx-auto">
          {content.subheading}
        </p>
        <Link
          href={content.buttonLink}
          className="inline-block bg-[#d4af37] hover:bg-[#b8951f] text-black px-8 py-4 rounded-[52px] font-bold text-base capitalize transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:ring-offset-2"
          style={{
            fontFamily: 'var(--font-nunito)',
            fontVariationSettings: "'YTLC' 500, 'wdth' 100",
            boxShadow: '0px -4px 5.8px 0px inset rgba(161,161,161,0.25), 0px 4px 2.6px 0px inset rgba(255,255,255,0.25)'
          }}
          aria-label={content.buttonAriaLabel}
        >
          {content.buttonText}
        </Link>
      </div>
    </section>
  );
}
