import { ProductPage } from '@/components/ui/product';
import { getEnhancedProductData, getAllProductSlugs } from '@/data/products/products';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

interface ProductPageParams {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllProductSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: ProductPageParams): Promise<Metadata> {
  const { slug } = await params;
  const productPageData = getEnhancedProductData(slug);

  if (!productPageData) {
    return {
      title: 'Product Not Found | Ruqma',
      description: 'The requested product could not be found.',
    };
  }

  return {
    title: productPageData.metadata.title,
    description: productPageData.metadata.description,
    keywords: productPageData.metadata.keywords,
  };
}

export default async function DynamicProductPage({ params }: ProductPageParams) {
  const { slug } = await params;
  const productPageData = getEnhancedProductData(slug);

  if (!productPageData) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <ProductPage
        product={productPageData.product}
        backgroundElements={productPageData.backgroundElements}
        productSlug={slug}
      />
    </div>
  );
}