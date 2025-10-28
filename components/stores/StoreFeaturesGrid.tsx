import React from 'react';
import { StoreFeature } from '@/types/content';

interface StoreFeaturesGridProps {
  features: StoreFeature[];
}

// Icon mapping for store features
const iconMap: Record<string, React.ReactElement> = {
  consultation: (
    <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  demonstration: (
    <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
    </svg>
  ),
  events: (
    <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  availability: (
    <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

export default function StoreFeaturesGrid({ features }: StoreFeaturesGridProps) {
  return (
    <section
      id="store-features"
      className="bg-[#F9FAFB] py-20"
      style={{ scrollMarginTop: '80px' }}
    >
      <div className="max-w-[1234px] mx-auto px-4">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="font-[var(--font-ibm)] font-semibold text-[clamp(2.5rem,5vw,4rem)] leading-[1.2] text-[#151715]">
            Why Visit <span className="text-[var(--color-primary)]">In Person?</span>
          </h2>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <article
              key={index}
              className="group bg-[#E9ECF2] p-8 rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
            >
              {/* Icon */}
              <div className="mb-6 text-[var(--color-primary)] transition-transform duration-300 group-hover:scale-110">
                {iconMap[feature.icon] || iconMap.consultation}
              </div>

              {/* Title */}
              <h3 className="font-[var(--font-ibm)] text-xl font-semibold text-[#151715] mb-4">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="font-[var(--font-nunito)] text-base text-[#151715] leading-relaxed">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
