import React from 'react';
import { ValueCard } from '@/types/content';

interface ValuesGridProps {
  values: ValueCard[];
}

// Icon mapping for value cards
const iconMap: Record<string, React.ReactElement> = {
  quality: (
    <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  innovation: (
    <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  ),
  experience: (
    <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  ),
};

export default function ValuesGrid({ values }: ValuesGridProps) {
  return (
    <section
      id="values"
      className="bg-[#F9FAFB] py-20"
      style={{ scrollMarginTop: '80px' }}
    >
      <div className="max-w-[1234px] mx-auto px-4">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="font-[var(--font-ibm)] font-semibold text-[clamp(2.5rem,5vw,4rem)] leading-[1.2] text-[#151715]">
            Our <span className="text-[var(--color-primary)]">Values</span>
          </h2>
        </div>

        {/* Values Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <article
              key={index}
              className="group bg-[#E9ECF2] p-8 rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
            >
              {/* Icon */}
              <div className="mb-6 text-[var(--color-primary)] transition-transform duration-300 group-hover:scale-110">
                {iconMap[value.icon] || iconMap.quality}
              </div>

              {/* Title */}
              <h3 className="font-[var(--font-ibm)] text-2xl font-semibold text-[#151715] mb-4">
                {value.title}
              </h3>

              {/* Description */}
              <p className="font-[var(--font-nunito)] text-base text-[#151715] leading-relaxed">
                {value.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
