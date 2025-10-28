import React from 'react';
import Image from 'next/image';
import { StoryIntroduction } from '@/types/content';

interface StoreIntroductionProps {
  content: StoryIntroduction;
}

export default function StoreIntroduction({ content }: StoreIntroductionProps) {
  return (
    <section
      id="store-introduction"
      className="bg-white py-20"
      style={{ scrollMarginTop: '80px' }}
    >
      <div className="max-w-[1234px] mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Text Column */}
          <div className="space-y-6">
            <h2 className="font-[var(--font-ibm)] font-semibold text-[clamp(2.5rem,5vw,4rem)] leading-[1.2] text-[#151715]">
              {content.heading}
            </h2>
            <div className="space-y-4">
              {content.paragraphs.map((paragraph, index) => (
                <p
                  key={index}
                  className="text-lg font-[var(--font-nunito)] text-[#151715] leading-relaxed"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Image Column */}
          <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
            <Image
              src={content.image.src}
              alt={content.image.alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
