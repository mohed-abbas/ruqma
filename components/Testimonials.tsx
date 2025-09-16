'use client';

import React from 'react';
import testimonialsData from '@/data/content/testimonials.json';

export default function Testimonials() {

  return (
    <section
      id="testimonials"
      className="min-h-screen bg-white py-20"
      aria-labelledby="testimonials-heading"
    >
      <div className="w-full max-w-[1280px] mx-auto px-4">
        {/* Header section - matching Figma typography exactly */}
        <header className="mb-[38px]">
          <h2
            id="testimonials-heading"
            className="text-[65px] leading-[1.2] text-[#151715] font-semibold"
            style={{ fontFamily: 'var(--font-ibm)' }}
          >
            <span className="text-[#151715]">What Our Users Say About</span>
            <span className="text-[var(--color-primary)] ml-2">Ruqma</span>
          </h2>
        </header>
      </div>
    </section>
  );
}