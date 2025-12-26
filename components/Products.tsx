import React from 'react'
import { SectionContent } from '@/types/content';
import sectionData from '@/data/content/sections.json';
import { getProducts } from '@/lib/sanity/fetch';
import { urlForImage } from '@/lib/sanity/client';
import { SanityProduct } from '@/lib/sanity/fetch';
import ProductsClient from './ProductsClient';
import { withMinimumLoadingTime } from '@/lib/withMinimumLoadingTime';

// Minimum time to show skeleton for consistent UX (ms)
const MINIMUM_LOADING_TIME = 400;

export default async function Products() {
  const sections: SectionContent = sectionData as SectionContent;

  // Fetch products from Sanity CMS with minimum loading time
  // This ensures skeleton is visible for at least 400ms for a polished feel
  const sanityProducts: SanityProduct[] = await withMinimumLoadingTime(
    getProducts(),
    MINIMUM_LOADING_TIME
  );

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