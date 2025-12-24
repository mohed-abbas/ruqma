import React from 'react'
import { SectionContent } from '@/types/content';
import sectionData from '@/data/content/sections.json';
import { getProducts } from '@/lib/sanity/fetch';
import { urlForImage } from '@/lib/sanity/client';
import { SanityProduct } from '@/lib/sanity/fetch';
import ProductsClient from './ProductsClient';

export default async function Products() {
  const sections: SectionContent = sectionData as SectionContent;

  // Fetch products from Sanity CMS
  const sanityProducts: SanityProduct[] = await getProducts();

  // Transform products for client component
  const products = sanityProducts.map((product: SanityProduct) => ({
    id: product._id,
    slug: product.slug,
    name: product.name,
    description: product.description,
    imageUrl: urlForImage(product.mainImage).width(800).url(),
    href: `/products/${product.slug}`,
    brand: product.brand,
  }));

  return (
    <ProductsClient
      products={products}
      title={sections.products.title}
      titleAccent={sections.products.titleAccent}
    />
  )
}