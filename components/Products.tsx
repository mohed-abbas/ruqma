import React from 'react'
import { ProductCard } from './ui/product';
import { SectionContent } from '@/types/content';
import sectionData from '@/data/content/sections.json';
import { getProducts } from '@/lib/sanity/fetch';
import { urlForImage } from '@/lib/sanity/client';
import { SanityProduct } from '@/lib/sanity/fetch';

export default async function Products() {
  const sections: SectionContent = sectionData as SectionContent;

  // Fetch products from Sanity CMS
  const sanityProducts: SanityProduct[] = await getProducts();

  return (
    <section
      id="products"
      className="min-h-screen bg-white py-20"
      style={{ scrollMarginTop: '56px' }}
    >
      <div className="w-full max-w-[1234px] mx-auto px-4">
        {/* Header section - matching Figma typography exactly */}
        <div className="mb-[70px]">
          <h2 className="font-[var(--font-ibm)] font-semibold text-[65px] leading-[1.2] text-[#151715]">
            <span className="text-[#151715]">{sections.products.title}</span>
            <span className="text-[var(--color-primary)] ml-2">{sections.products.titleAccent}</span>
          </h2>
        </div>

        {/* Products container - Dynamic grid showing all products that have showOnHome=true */}
        <div className="content-stretch flex flex-col gap-[70px] w-full">
          {/* Dynamically render products in rows of 2 */}
          {Array.from({ length: Math.ceil(sanityProducts.length / 2) }, (_, rowIndex) => (
            <div key={rowIndex} className="flex flex-col md:flex-row gap-6 md:gap-8 lg:gap-[150px] items-center justify-center w-full">
              {sanityProducts.slice(rowIndex * 2, rowIndex * 2 + 2).map((product: SanityProduct, indexInRow: number) => (
                <ProductCard
                  key={product._id}
                  id={product.slug}
                  name={product.name}
                  description={product.description}
                  imageUrl={urlForImage(product.mainImage).width(800).url()}
                  href={`/products/${product.slug}`}
                  brand={product.brand}
                  index={rowIndex * 2 + indexInRow}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}