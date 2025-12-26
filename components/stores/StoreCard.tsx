'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { PartnerStore } from '@/types/content';
import ImagePlaceholder from '@/components/about/ImagePlaceholder';

interface StoreCardProps {
  store: PartnerStore;
  index?: number;
}

export default function StoreCard({ store, index = 0 }: StoreCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.25, 0.1, 0.25, 1] }}
      className="group rounded-[var(--wtb-card-radius)] overflow-hidden transition-all duration-300 hover:scale-[1.02]"
      style={{
        background: 'var(--wtb-card-bg)',
        border: '2px solid var(--wtb-card-border)',
        boxShadow: 'var(--wtb-card-shadow)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--wtb-card-border-hover)';
        e.currentTarget.style.boxShadow = 'var(--wtb-card-shadow-hover)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--wtb-card-border)';
        e.currentTarget.style.boxShadow = 'var(--wtb-card-shadow)';
      }}
    >
      {/* Store Image */}
      <div className="relative w-full aspect-[16/10] overflow-hidden">
        <ImagePlaceholder
          width={400}
          height={250}
          label={store.storeName}
          variant="light"
        />
        {store.featured && (
          <div
            className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide z-10"
            style={{
              background: 'var(--wtb-button-bg)',
              color: 'var(--wtb-button-text)',
              fontFamily: 'var(--font-ibm)',
            }}
          >
            Featured
          </div>
        )}
      </div>

      {/* Store Information */}
      <div className="p-6 space-y-4">
        {/* Store Name */}
        <h3
          className="text-xl font-semibold"
          style={{
            fontFamily: 'var(--font-ibm)',
            color: 'var(--wtb-text-dark)',
          }}
        >
          {store.storeName}
        </h3>

        {/* Location */}
        <div className="flex items-start gap-3">
          <svg
            className="w-5 h-5 flex-shrink-0 mt-0.5"
            style={{ color: 'var(--wtb-text-accent)' }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <div
            className="text-sm leading-relaxed"
            style={{
              fontFamily: 'var(--font-nunito)',
              color: 'var(--wtb-text-dark-secondary)',
            }}
          >
            <p>{store.location.address}</p>
            <p>{store.location.city}, {store.location.state} {store.location.zipCode}</p>
          </div>
        </div>

        {/* Contact Information */}
        <div className="flex flex-wrap gap-4">
          {/* Phone */}
          <a
            href={`tel:${store.contact.phone}`}
            className="flex items-center gap-2 text-sm transition-colors hover:opacity-80"
            style={{
              fontFamily: 'var(--font-nunito)',
              color: 'var(--wtb-text-dark)',
            }}
          >
            <svg
              className="w-4 h-4"
              style={{ color: 'var(--wtb-text-accent)' }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            {store.contact.phone}
          </a>

          {/* Website */}
          <a
            href={store.contact.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm transition-colors hover:opacity-80"
            style={{
              fontFamily: 'var(--font-nunito)',
              color: 'var(--wtb-text-accent)',
            }}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Visit Website
          </a>
        </div>

        {/* Store Hours */}
        <div
          className="pt-4 mt-4"
          style={{ borderTop: '1px solid rgba(21, 23, 21, 0.1)' }}
        >
          <div className="flex items-start gap-3">
            <svg
              className="w-4 h-4 flex-shrink-0 mt-0.5"
              style={{ color: 'var(--wtb-text-accent)' }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div
              className="text-sm leading-relaxed"
              style={{
                fontFamily: 'var(--font-nunito)',
                color: 'var(--wtb-text-dark-secondary)',
              }}
            >
              <p>{store.hours.weekday}</p>
              <p>{store.hours.weekend}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
