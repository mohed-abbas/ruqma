import { ProductDetailsData } from './types';
import FeatureCardGrid from './FeatureCardGrid';

/**
 * Product details section with card-based grid layout
 * Matches Figma design with asymmetric card positioning
 * Now receives data as props instead of fetching hardcoded data
 */
export default function ProductDetailsSection({
  productDetails,
  className
}: { productDetails: ProductDetailsData | null; className?: string }) {
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