import React from 'react'
import { ProductCard } from './ui/product';
import { SectionContent, ProductCatalog } from '@/types/content';
import sectionData from '@/data/content/sections.json';
import catalogData from '@/data/products/catalog.json';

export default function Products() {
  const sections: SectionContent = sectionData as SectionContent;
  const catalog: ProductCatalog = catalogData as ProductCatalog;

  return (
    <section 
      id="products" 
      className="min-h-screen bg-white py-20"
      style={{ scrollMarginTop: '80px' }}
    >
      <div className="w-full max-w-[1234px] mx-auto px-4">
        {/* Header section - matching Figma typography exactly */}
        <div className="mb-[70px]">
          <h2 className="font-[var(--font-ibm)] font-semibold text-[65px] leading-[1.2] text-[#151715]">
            <span className="text-[#151715]">{sections.products.title}</span>
            <span className="text-[var(--color-primary)] ml-2">{sections.products.titleAccent}</span>
          </h2>
        </div>

        {/* Products container - Figma-accurate desktop layout with responsive fallbacks */}
        <div className="content-stretch flex flex-col gap-[70px] w-full">
          {/* First row of products */}
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 lg:gap-[150px] items-center justify-center w-full">
            {catalog.products.slice(0, 2).map((product) => {
              if (product.showOnHome) {
                return <ProductCard key={product.id} {...product} />;
              }
            })}
          </div>

          {/* Second row of products */}
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 lg:gap-[150px] items-center justify-center w-full">
            {catalog.products.slice(2, 4).map((product) => {
              if (product.showOnHome) {
                return <ProductCard key={product.id} {...product} />;
              }
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
