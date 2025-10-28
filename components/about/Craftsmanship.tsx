import React from 'react';
import Image from 'next/image';
import { Craftsmanship as CraftsmanshipType } from '@/types/content';

interface CraftsmanshipProps {
  content: CraftsmanshipType;
}

export default function Craftsmanship({ content }: CraftsmanshipProps) {
  return (
    <section
      id="craftsmanship"
      className="relative w-full min-h-[600px] overflow-hidden"
      style={{ scrollMarginTop: '80px' }}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={content.image.src}
          alt={content.image.alt}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center min-h-[600px]">
        <div className="max-w-[1234px] mx-auto px-4 py-20">
          <div className="max-w-2xl">
            <h2 className="font-[var(--font-ibm)] font-semibold text-[clamp(2.5rem,5vw,4rem)] leading-[1.2] text-white mb-6">
              {content.heading.split(' ')[0]}{' '}
              <span className="text-[var(--color-primary)]">
                {content.heading.split(' ').slice(1).join(' ')}
              </span>
            </h2>

            <p className="font-[var(--font-nunito)] text-xl text-white/90 leading-relaxed">
              {content.description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
