'use client';

import React from 'react';
import { motion } from 'framer-motion';
import StoreCard from './StoreCard';
import { PartnerStore } from '@/types/content';

interface PartnerStoresGridProps {
  stores: PartnerStore[];
}

export default function PartnerStoresGrid({ stores }: PartnerStoresGridProps) {
  return (
    <section
      id="partner-stores"
      className="py-24 lg:py-32"
      style={{
        background: 'var(--wtb-bg-light)',
        scrollMarginTop: '80px',
      }}
    >
      <div
        className="mx-auto"
        style={{
          maxWidth: 'var(--wtb-container-max)',
          padding: `0 var(--wtb-container-padding)`,
        }}
      >
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="mb-16 text-center"
        >
          <h2
            className="font-semibold leading-[1.2]"
            style={{
              fontFamily: 'var(--font-ibm)',
              fontSize: 'var(--wtb-section-title-size)',
              color: 'var(--wtb-text-dark)',
            }}
          >
            Our <span style={{ color: 'var(--wtb-text-accent)' }}>Partner Stores</span>
          </h2>
          <p
            className="mt-4 text-lg max-w-2xl mx-auto"
            style={{
              fontFamily: 'var(--font-nunito)',
              color: 'var(--wtb-text-dark-secondary)',
            }}
          >
            Visit these carefully selected partner locations to experience Ruqma products in person
          </p>
        </motion.div>

        {/* Stores Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stores.map((store, index) => (
            <StoreCard key={store.id} store={store} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
