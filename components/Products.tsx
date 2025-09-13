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
      <div className="w-full max-w-[1280px] mx-auto px-4">
        {/* Header section - matching Figma typography exactly */}
        <div className="mb-[70px]">
          <h2 className="font-[var(--font-ibm)] font-semibold text-[65px] leading-[1.2] text-[#151715]">
            <span className="text-[#151715]">{sections.products.title}</span>
            <span className="text-[var(--color-primary)] ml-2">{sections.products.titleAccent}</span>
          </h2>
        </div>

        {/* Products grid container - matching Figma layout */}
        <div className="flex flex-col gap-[70px] w-full max-w-[1234px]">
          {/* First row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 lg:gap-x-[150px] gap-y-8 lg:gap-y-0 justify-items-center lg:justify-items-start w-full">
            {catalog.products.slice(0, 2).map((product) => (
              <ProductCard 
                key={product.id} 
                {...product}
                className="w-full max-w-[542px]"
              />
            ))}
          </div>
          
          {/* Second row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 lg:gap-x-[150px] gap-y-8 lg:gap-y-0 justify-items-center lg:justify-items-start w-full">
            {catalog.products.slice(2, 4).map((product) => (
              <ProductCard 
                key={product.id} 
                {...product}
                className="w-full max-w-[542px]"
              />
            ))}
          </div>

          {/* Additional rows for remaining products */}
          {catalog.products.length > 4 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 lg:gap-x-[150px] gap-y-8 lg:gap-y-0 justify-items-center lg:justify-items-start w-full">
              {catalog.products.slice(4, 6).map((product) => (
                <ProductCard 
                  key={product.id} 
                  {...product}
                  className="w-full max-w-[542px]"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
