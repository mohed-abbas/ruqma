import { ProductPage } from '@/components/ui/product';
import ProductDetailsSection from '@/components/ui/product/ProductDetailsSection';
import ProductGallery from '@/components/ui/product/ProductGallery';
import PartnerStoresCTA from '@/components/ui/product/PartnerStoresCTA';
import { getProductBySlug } from '@/lib/sanity/fetch';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { urlForImage } from '@/lib/sanity/client';
import type { ProductFeaturesSectionData, ProductGalleryData, GalleryImage } from '@/components/ui/product/types';
import { withMinimumLoadingTime } from '@/lib/withMinimumLoadingTime';

interface ProductPageParams {
  params: Promise<{ slug: string }>;
}

// Force dynamic rendering so skeleton shows during navigation
export const dynamic = 'force-dynamic';

// Minimum time to show skeleton for consistent UX (ms)
const MINIMUM_LOADING_TIME = 400;

// Note: Removed generateStaticParams to ensure fully dynamic rendering
// This means product pages are server-rendered on each request, showing skeleton during load

export async function generateMetadata({ params }: ProductPageParams): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: 'Product Not Found | Ruqma',
      description: 'The requested product could not be found.',
    };
  }

  return {
    title: `${product.name} | Ruqma`,
    description: product.description,
    keywords: [product.name, product.brand, 'Ruqma'].join(', '),
  };
}

export default async function DynamicProductPage({ params }: ProductPageParams) {
  const { slug } = await params;

  // Fetch product with minimum loading time for polished skeleton display
  const product = await withMinimumLoadingTime(
    getProductBySlug(slug),
    MINIMUM_LOADING_TIME
  );

  if (!product) {
    notFound();
  }

  // Transform Sanity product data to ProductPage component format
  const productPageData = {
    product: {
      name: product.name,
      description: product.description,
      image: urlForImage(product.mainImage).width(1200).url(),
      imageAlt: product.mainImage.alt || product.name,
    },
    backgroundElements: {
      decorativePattern: '',
    },
  };

  // Transform product details data for ProductDetailsSection (new two-column layout)
  const productDetails: ProductFeaturesSectionData | null = product.productDetails ? (() => {
    const details = product.productDetails;

    // Check if using new schema structure (leftColumn exists)
    if (details.leftColumn) {
      return {
        leftColumn: {
          productImage: details.leftColumn.productImage?.asset ? {
            asset: {
              _ref: details.leftColumn.productImage.asset._ref || '',
              url: urlForImage(details.leftColumn.productImage).width(800).url(),
            },
            alt: details.leftColumn.productImage.alt,
          } : undefined,
          headline: details.leftColumn.headline,
          description: details.leftColumn.description,
        },
        featureCards: details.featureCards?.map((card: { _key: string; id?: string; goldText: string; darkText?: string; description: string }) => ({
          _key: card._key,
          id: card.id,
          goldText: card.goldText,
          darkText: card.darkText,
          description: card.description,
        })),
        detailImage: details.detailImage?.asset ? {
          asset: {
            _ref: details.detailImage.asset._ref || '',
            url: urlForImage(details.detailImage).width(1200).url(),
          },
          alt: details.detailImage.alt,
        } : undefined,
      };
    }

    // Fallback to legacy schema structure (mainFeature/features)
    if (details.mainFeature) {
      return {
        leftColumn: {
          productImage: details.mainFeature.image?.asset ? {
            asset: {
              _ref: details.mainFeature.image.asset._ref || '',
              url: urlForImage(details.mainFeature.image).width(800).url(),
            },
            alt: details.mainFeature.image.alt,
          } : undefined,
          headline: {
            darkText: details.mainFeature.title,
            goldText: details.mainFeature.highlight,
          },
          description: details.mainFeature.description,
        },
        featureCards: details.features?.map((feature: { _key: string; id: string; title: string; highlight: string; description: string }) => ({
          _key: feature._key,
          id: feature.id,
          goldText: feature.highlight,
          darkText: feature.title,
          description: feature.description,
        })),
        detailImage: details.detailImage?.asset ? {
          asset: {
            _ref: details.detailImage.asset._ref || '',
            url: urlForImage(details.detailImage).width(1200).url(),
          },
          alt: details.detailImage.alt,
        } : undefined,
      };
    }

    return null;
  })() : null;

  // Transform gallery data for ProductGallery
  // Layout is automatically determined by the component - just pass images!
  // Supports both new schema (direct array) and old schema (object with images array)
  const galleryImages = (product.galleryNew && product.galleryNew.length > 0)
    ? product.galleryNew
    : product.galleryOld;

  const galleryData: ProductGalleryData | null = galleryImages && galleryImages.length > 0 ? {
    images: galleryImages.map((img: {
      _key: string;
      asset: { _ref: string };
      alt?: string;
    }, index: number): GalleryImage => ({
      id: img._key || `gallery-${index}`,
      // Thumbnail for grid display (800px width)
      src: urlForImage(img).width(800).url(),
      // Full resolution for lightbox (1920px for crisp display on large screens)
      fullSrc: urlForImage(img).width(1920).quality(90).url(),
      alt: img.alt || `Product gallery image ${index + 1}`,
    })),
  } : null;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <ProductPage
        product={productPageData.product}
        backgroundElements={productPageData.backgroundElements}
        productSlug={slug}
      />
      
      {/* Product Details Section */}
      {productDetails && (
        <ProductDetailsSection 
          productDetails={productDetails}
        />
      )}
      
      {/* Product Gallery */}
      {galleryData && (
        <ProductGallery 
          galleryData={galleryData}
        />
      )}
      
      {/* Partner Stores CTA */}
      <PartnerStoresCTA />
    </div>
  );
}