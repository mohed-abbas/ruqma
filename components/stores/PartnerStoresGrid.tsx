import React from 'react';
import StoreCard from './StoreCard';
import { PartnerStore } from '@/types/content';

interface PartnerStoresGridProps {
  stores: PartnerStore[];
}

export default function PartnerStoresGrid({ stores }: PartnerStoresGridProps) {
  return (
    <section
      id="partner-stores"
      className="bg-white py-20"
      style={{ scrollMarginTop: '80px' }}
    >
      <div className="max-w-[1234px] mx-auto px-4">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="font-[var(--font-ibm)] font-semibold text-[clamp(2.5rem,5vw,4rem)] leading-[1.2] text-[#151715]">
            Our <span className="text-[var(--color-primary)]">Partner Stores</span>
          </h2>
          <p className="mt-4 text-lg font-[var(--font-nunito)] text-[#151715]/80 max-w-2xl mx-auto">
            Visit these carefully selected partner locations to experience Ruqma products in person
          </p>
        </div>

        {/* Stores Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stores.map((store) => (
            <StoreCard key={store.id} store={store} />
          ))}
        </div>
      </div>
    </section>
  );
}
