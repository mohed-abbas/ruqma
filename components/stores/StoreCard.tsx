import React from 'react';
import Image from 'next/image';
import { PartnerStore } from '@/types/content';

interface StoreCardProps {
  store: PartnerStore;
}

export default function StoreCard({ store }: StoreCardProps) {
  return (
    <article className="group bg-[#E9ECF2] rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
      {/* Store Image */}
      <div className="relative w-full aspect-[4/3] overflow-hidden">
        <Image
          src={store.image.src}
          alt={store.image.alt}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {store.featured && (
          <div className="absolute top-4 right-4 bg-[var(--color-primary)] text-black px-3 py-1 rounded-full text-sm font-[var(--font-ibm)] font-semibold">
            Featured
          </div>
        )}
      </div>

      {/* Store Information */}
      <div className="p-6 space-y-4">
        {/* Store Name */}
        <h3 className="font-[var(--font-ibm)] text-2xl font-semibold text-[#151715]">
          {store.storeName}
        </h3>

        {/* Location */}
        <div className="flex items-start gap-2 text-[#151715]">
          <svg className="w-5 h-5 flex-shrink-0 mt-0.5 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <div className="font-[var(--font-nunito)] text-sm">
            <p>{store.location.address}</p>
            <p>{store.location.city}, {store.location.state} {store.location.zipCode}</p>
            <p>{store.location.country}</p>
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-2">
          {/* Phone */}
          <div className="flex items-center gap-2 text-[#151715]">
            <svg className="w-5 h-5 flex-shrink-0 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <a
              href={`tel:${store.contact.phone}`}
              className="font-[var(--font-nunito)] text-sm hover:text-[var(--color-primary)] transition-colors"
            >
              {store.contact.phone}
            </a>
          </div>

          {/* Website */}
          <div className="flex items-center gap-2 text-[#151715]">
            <svg className="w-5 h-5 flex-shrink-0 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
            <a
              href={store.contact.website}
              target="_blank"
              rel="noopener noreferrer"
              className="font-[var(--font-nunito)] text-sm hover:text-[var(--color-primary)] transition-colors"
            >
              Visit Website
            </a>
          </div>
        </div>

        {/* Store Hours */}
        <div className="pt-4 border-t border-[#151715]/10">
          <div className="flex items-start gap-2 text-[#151715]">
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="font-[var(--font-nunito)] text-sm">
              <p>{store.hours.weekday}</p>
              <p>{store.hours.weekend}</p>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
