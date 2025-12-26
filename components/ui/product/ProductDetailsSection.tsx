import { ProductFeaturesSectionData } from './types';
import ProductFeaturesSection from './ProductFeaturesSection';

interface ProductDetailsSectionProps {
  productDetails: ProductFeaturesSectionData | null;
  className?: string;
}

/**
 * Product details section wrapper
 * Renders the new ProductFeaturesSection component with Sanity data
 */
export default function ProductDetailsSection({
  productDetails,
  className,
}: ProductDetailsSectionProps) {
  if (!productDetails) {
    return (
      <section className="w-full py-[120px] flex items-center justify-center">
        <p className="text-gray-500 text-lg">Product details not available</p>
      </section>
    );
  }

  return (
    <ProductFeaturesSection
      data={productDetails}
      className={className}
    />
  );
}
