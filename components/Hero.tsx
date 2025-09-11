'use client';

import React from 'react';
import DarkVeil from './Background';

export default function Hero() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Ruqma',
    description: 'Beyond Ordinary - Luxury goods platform',
    url: 'https://ruqma.com',
    logo: 'https://ruqma.com/logo.svg',
    sameAs: [
      // Add your social media links here
    ],
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const navHeight = 80; // Fixed navbar height
      let scrollOffset = navHeight;
      
      // Add enhanced offset for sections that need visual prominence
      if (sectionId === 'products') {
        // Additional offset to show more of Products white background
        scrollOffset += 200; // Total offset: 280px
      }
      // Future sections can be added here with custom offsets
      
      const elementPosition = element.offsetTop - scrollOffset;
      
      window.scrollTo({
        top: Math.max(0, elementPosition), // Prevent negative scroll
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <section 
        id="hero"
        className="relative w-full h-screen overflow-hidden bg-black"
        style={{ scrollMarginTop: '80px' }}
        role="banner"
        aria-labelledby="hero-title"
      >
        {/* Background */}
        <div className="absolute inset-0 w-full h-full" aria-hidden="true">
          <DarkVeil 
            hueShift={210}
            speed={1}
            noiseIntensity={0}
            scanlineIntensity={0}
            scanlineFrequency={0}
            warpAmount={0}
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center max-w-4xl px-4">
            {/* Main Heading */}
            <hgroup className="mb-12">
              <h1 
                id="hero-title"
                className="text-7xl sm:text-8xl md:text-9xl lg:text-[100px] font-medium leading-[1.2] mb-6 capitalize font-[var(--font-ibm)] text-[var(--primary)]"
              >
                Ruqma
              </h1>
              <p 
                className="text-4xl sm:text-5xl md:text-6xl font-normal text-white leading-[1.2] font-[var(--font-nunito)] "
              >
                Beyond Ordinary
              </p>
            </hgroup>

            {/* CTA Button */}
            <button 
              onClick={() => scrollToSection('products')}
              className="bg-[#d4af37] hover:bg-[#b8951f] text-black px-6 py-3 rounded-[52px] font-bold text-sm capitalize transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:ring-offset-2 focus:ring-offset-black"
              style={{ 
                fontFamily: 'var(--font-nunito)',
                fontVariationSettings: "'YTLC' 500, 'wdth' 100",
                boxShadow: '0px -4px 5.8px 0px inset rgba(161,161,161,0.25), 0px 4px 2.6px 0px inset rgba(255,255,255,0.25)'
              }}
              aria-label="Discover more about Ruqma products"
              type="button"
            >
              Discover More
            </button>
          </div>
        </div>
      </section>
    </>
  );
}