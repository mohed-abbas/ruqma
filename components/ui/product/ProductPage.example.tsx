/**
 * ProductPage component usage examples
 * Demonstrates how to implement the component from the Figma design
 */

import { ProductPage } from './index';
import type { ProductPageProps } from './types';

/**
 * GlideX Product Page Example - matches Figma design exactly
 * This recreates the specific product page design provided in Figma
 */
export function GlideXProductExample() {
  const glideXProduct: ProductPageProps = {
    product: {
      name: "Glide",
      model: "X",
      description: "Designed with a high-density pyramid-shaped microstructure matrix, the mouse pad minimizes the contact points between your mouse and the pad.",
      image: "/products/glidex-mousepad.png", // Replace with actual image path
      imageAlt: "GlideX premium gaming mouse pad with pyramid microstructure surface",
      ctaText: "Learn More"
    },
    backgroundElements: {
      decorativePattern: "/decorative/ellipses.svg" // Replace with actual ellipses SVG
    },
    onLearnMoreClick: () => {
      // Implement actual navigation or modal opening
      // Example: router.push('/products/glidex/details');
    }
  };

  return <ProductPage {...glideXProduct} productSlug="glidex" />;
}

/**
 * Generic Product Page Example
 * Shows how to customize for different products
 */
export function CustomProductExample() {
  const customProduct: ProductPageProps = {
    product: {
      name: "Precision",
      model: "Pro",
      description: "Experience unparalleled accuracy with our professional-grade precision tools designed for experts who demand perfection.",
      image: "/products/precision-pro.png",
      imageAlt: "PrecisionPro professional tool set",
      ctaText: "Discover More"
    },
    backgroundElements: {
      decorativePattern: "/decorative/geometric-pattern.svg"
    },
    className: "custom-product-styling", // Custom styling override
    onCtaClick: () => {
      // Handle "Where to buy?" button click
      window.open('/dealers', '_blank');
    },
    onLearnMoreClick: () => {
      // Handle "Discover More" button click
      window.location.href = '/products/precision-pro';
    }
  };

  return <ProductPage {...customProduct} productSlug="precision-pro" />;
}

/**
 * Minimal Product Page Example
 * Shows component with minimal props
 */
export function MinimalProductExample() {
  const minimalProduct: ProductPageProps = {
    product: {
      name: "Essential",
      model: "1",
      description: "Simple, elegant, effective. Everything you need, nothing you don't.",
      image: "/products/essential.png",
      imageAlt: "Essential product minimalist design"
    }
    // No background elements, uses default navigation, no custom callbacks
  };

  return <ProductPage {...minimalProduct} productSlug="essential" />;
}

/**
 * Usage with Next.js page component
 * Example of how to integrate into a Next.js 15 page
 */
export default function ProductPageExample() {
  return (
    <main className="min-h-screen">
      <GlideXProductExample />
    </main>
  );
}