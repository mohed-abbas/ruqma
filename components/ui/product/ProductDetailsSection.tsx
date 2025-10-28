'use client';

import { ProductDetailsSectionProps } from './types';
import FeatureCardGrid from './FeatureCardGrid';
import { getProductDetails } from '@/data/products/products';

/**
 * Product details section with card-based grid layout
 * Matches Figma design with asymmetric card positioning
 */
export default function ProductDetailsSection({
  productSlug,
  className
}: ProductDetailsSectionProps) {
  const productDetails = getProductDetails(productSlug);

  if (!productDetails) {
    return (
      <section className="w-full py-[120px] flex items-center justify-center">
        <p className="text-gray-500 text-lg">Product details not available</p>
      </section>
    );
  }

  return (
    <FeatureCardGrid
      productDetails={productDetails}
      className={className}
    />
  );
}