import React from 'react';
import { StoreLocator as StoreLocatorType } from '@/types/content';

interface StoreLocatorProps {
  content: StoreLocatorType;
}

export default function StoreLocator({ content }: StoreLocatorProps) {
  return (
    <section
      id="store-locator"
      className="bg-[#F9FAFB] py-20"
      style={{ scrollMarginTop: '80px' }}
    >
      <div className="max-w-[800px] mx-auto px-4 text-center">
        <h2 className="font-[var(--font-ibm)] font-semibold text-[clamp(2.5rem,5vw,4rem)] leading-[1.2] text-[#151715] mb-6">
          {content.heading}
        </h2>
        <p className="text-lg font-[var(--font-nunito)] text-[#151715]/80 mb-8">
          {content.description}
        </p>

        {content.comingSoon ? (
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-[#E9ECF2]">
            <div className="flex items-center justify-center gap-3 mb-4">
              <svg className="w-6 h-6 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-[var(--color-primary)] font-[var(--font-ibm)] font-semibold text-xl">
                Interactive Store Locator
              </span>
            </div>
            <p className="text-base font-[var(--font-nunito)] text-[#151715]/60">
              Coming Soon - Browse our partner stores below
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <input
              type="text"
              placeholder={content.placeholder}
              className="w-full px-6 py-4 rounded-xl border border-[#E9ECF2] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] font-[var(--font-nunito)]"
              aria-label="Search for stores by location"
            />
          </div>
        )}
      </div>
    </section>
  );
}
