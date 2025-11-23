import { ProductPage } from '@/components/ui/product';
import ProductDetailsSection from '@/components/ui/product/ProductDetailsSection';
import ProductGallery from '@/components/ui/product/ProductGallery';
import PartnerStoresCTA from '@/components/ui/product/PartnerStoresCTA';
import { getProductBySlug, getProductSlugs } from '@/lib/sanity/fetch';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { urlForImage } from '@/lib/sanity/client';
import type { ProductDetailsData, ProductGalleryData, GalleryImage } from '@/components/ui/product/types';

interface ProductPageParams {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const products = await getProductSlugs();
  return products.map((product: { slug: string; _updatedAt: string }) => ({
    slug: product.slug,
  }));
}

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
    title: `${product.name} - ${product.model} | Ruqma`,
    description: product.description,
    keywords: [product.name, product.model, product.brand, 'Ruqma'].join(', '),
  };
}

export default async function DynamicProductPage({ params }: ProductPageParams) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Transform Sanity product data to ProductPage component format
  const productPageData = {
    product: {
      name: product.name,
      model: product.model,
      description: product.description,
      image: urlForImage(product.mainImage).width(1200).url(),
      imageAlt: product.mainImage.alt || product.name,
    },
    backgroundElements: {
      decorativePattern: '',
    },
  };

  // Transform product details data for ProductDetailsSection
  const productDetails: ProductDetailsData | null = product.productDetails ? {
    mainFeature: {
      title: product.productDetails.mainFeature.title,
      highlight: product.productDetails.mainFeature.highlight,
      description: product.productDetails.mainFeature.description,
      image: urlForImage(product.productDetails.mainFeature.image).width(800).url(),
      imageAlt: product.productDetails.mainFeature.image.alt || product.productDetails.mainFeature.title,
    },
    features: product.productDetails.features.map((feature: { _key: string; id: string; title: string; highlight: string; description: string }) => ({
      id: feature.id,
      title: feature.title,
      highlight: feature.highlight,
      description: feature.description,
    })),
    detailImage: {
      src: urlForImage(product.productDetails.detailImage).width(600).url(),
      alt: product.productDetails.detailImage.alt || 'Product detail',
    },
  } : null;

  // Transform gallery data for ProductGallery
  const galleryData: ProductGalleryData | null = product.gallery && product.gallery.images ? {
    title: product.gallery.title || 'A Closer Look',
    subtitle: product.gallery.subtitle,
    images: product.gallery.images.map((img: { _key: string; asset: { _ref: string }; alt?: string; gridSpan?: { cols: number; rows: number }; aspectRatio?: string; priority?: boolean }, index: number): GalleryImage => ({
      id: img._key || `gallery-${index}`,
      src: urlForImage(img).width(800).url(),
      alt: img.alt || `Product gallery image ${index + 1}`,
      gridSpan: img.gridSpan || { cols: 1, rows: 1 },
      aspectRatio: img.aspectRatio || '1/1',
      priority: img.priority || false,
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