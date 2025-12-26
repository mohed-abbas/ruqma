'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { ProductGalleryData, GalleryImage, GalleryBorderRadius } from './types';
import ImageLightbox from './ImageLightbox';

/**
 * Auto-layout configuration for gallery images
 * Based on the Figma design pattern - creates visual variety automatically
 */
interface LayoutConfig {
  cols: number;
  rows: number;
  borderRadius: GalleryBorderRadius;
  flipVertical: boolean;
  priority: boolean;
}

/**
 * Figma design pattern for 9-image layout
 * This pattern creates the masonry look with visual interest
 */
const LAYOUT_PATTERN: LayoutConfig[] = [
  { cols: 2, rows: 1, borderRadius: 'default', flipVertical: false, priority: true },   // Wide top-left
  { cols: 1, rows: 1, borderRadius: 'pill', flipVertical: false, priority: true },      // Pill center
  { cols: 1, rows: 1, borderRadius: 'default', flipVertical: false, priority: true },   // Small top-right
  { cols: 1, rows: 1, borderRadius: 'none', flipVertical: true, priority: false },      // Flipped
  { cols: 1, rows: 2, borderRadius: 'default', flipVertical: false, priority: false },  // Tall center
  { cols: 2, rows: 1, borderRadius: 'default', flipVertical: false, priority: false },  // Wide mid-right
  { cols: 1, rows: 1, borderRadius: 'rounded', flipVertical: false, priority: false },  // Rounded bottom-left
  { cols: 1, rows: 1, borderRadius: 'rounded', flipVertical: false, priority: false },  // Rounded bottom-center
  { cols: 1, rows: 1, borderRadius: 'default', flipVertical: false, priority: false },  // Small bottom-right
];

/**
 * Alternative patterns for different image counts
 */
const LAYOUT_PATTERNS: Record<number, LayoutConfig[]> = {
  4: [
    { cols: 2, rows: 1, borderRadius: 'default', flipVertical: false, priority: true },
    { cols: 2, rows: 1, borderRadius: 'pill', flipVertical: false, priority: true },
    { cols: 2, rows: 1, borderRadius: 'rounded', flipVertical: false, priority: false },
    { cols: 2, rows: 1, borderRadius: 'default', flipVertical: false, priority: false },
  ],
  5: [
    { cols: 2, rows: 1, borderRadius: 'default', flipVertical: false, priority: true },
    { cols: 1, rows: 1, borderRadius: 'pill', flipVertical: false, priority: true },
    { cols: 1, rows: 1, borderRadius: 'default', flipVertical: false, priority: true },
    { cols: 1, rows: 2, borderRadius: 'rounded', flipVertical: false, priority: false },
    { cols: 1, rows: 1, borderRadius: 'default', flipVertical: false, priority: false },
  ],
  6: [
    { cols: 2, rows: 1, borderRadius: 'default', flipVertical: false, priority: true },
    { cols: 1, rows: 1, borderRadius: 'pill', flipVertical: false, priority: true },
    { cols: 1, rows: 1, borderRadius: 'default', flipVertical: false, priority: true },
    { cols: 1, rows: 1, borderRadius: 'rounded', flipVertical: false, priority: false },
    { cols: 1, rows: 1, borderRadius: 'default', flipVertical: false, priority: false },
    { cols: 2, rows: 1, borderRadius: 'rounded', flipVertical: false, priority: false },
  ],
  7: [
    { cols: 2, rows: 1, borderRadius: 'default', flipVertical: false, priority: true },
    { cols: 1, rows: 1, borderRadius: 'pill', flipVertical: false, priority: true },
    { cols: 1, rows: 1, borderRadius: 'default', flipVertical: false, priority: true },
    { cols: 1, rows: 2, borderRadius: 'rounded', flipVertical: false, priority: false },
    { cols: 2, rows: 1, borderRadius: 'default', flipVertical: false, priority: false },
    { cols: 1, rows: 1, borderRadius: 'rounded', flipVertical: false, priority: false },
    { cols: 1, rows: 1, borderRadius: 'default', flipVertical: false, priority: false },
  ],
  8: [
    { cols: 2, rows: 1, borderRadius: 'default', flipVertical: false, priority: true },
    { cols: 1, rows: 1, borderRadius: 'pill', flipVertical: false, priority: true },
    { cols: 1, rows: 1, borderRadius: 'default', flipVertical: false, priority: true },
    { cols: 1, rows: 1, borderRadius: 'none', flipVertical: true, priority: false },
    { cols: 1, rows: 2, borderRadius: 'default', flipVertical: false, priority: false },
    { cols: 2, rows: 1, borderRadius: 'rounded', flipVertical: false, priority: false },
    { cols: 1, rows: 1, borderRadius: 'rounded', flipVertical: false, priority: false },
    { cols: 1, rows: 1, borderRadius: 'default', flipVertical: false, priority: false },
  ],
};

/**
 * Get layout configuration for an image based on its index
 */
function getLayoutForIndex(index: number, totalImages: number): LayoutConfig {
  // Use specific pattern if available for this image count
  const pattern = LAYOUT_PATTERNS[totalImages] || LAYOUT_PATTERN;

  // Cycle through pattern if more images than pattern length
  return pattern[index % pattern.length];
}

/**
 * Border radius class mapping - using static classes for Tailwind purging
 */
const BORDER_RADIUS_MAP: Record<GalleryBorderRadius, string> = {
  default: 'rounded-[10px]',
  rounded: 'rounded-[12px]',
  pill: 'rounded-[36px]',
  none: 'rounded-none',
};

/**
 * Grid span class mappings - static classes for Tailwind purging
 */
const COL_SPAN_MAP: Record<number, string> = {
  1: 'col-span-1',
  2: 'col-span-2',
  3: 'col-span-3',
  4: 'col-span-4',
};

const ROW_SPAN_MAP: Record<number, string> = {
  1: 'row-span-1',
  2: 'row-span-2',
};

/**
 * Product Gallery with masonry-style layout matching Figma design
 *
 * Features:
 * - Automatic layout arrangement - just upload images!
 * - Visual variety with different sizes and border radius
 * - Accessible with ARIA labels
 * - Responsive 4-column grid layout
 */
export default function ProductGallery({
  galleryData,
  className,
}: {
  galleryData: ProductGalleryData | null;
  className?: string;
}) {
  // Lightbox state
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Lightbox handlers
  const openLightbox = useCallback((index: number) => {
    setCurrentImageIndex(index);
    setIsLightboxOpen(true);
  }, []);

  const closeLightbox = useCallback(() => {
    setIsLightboxOpen(false);
  }, []);

  const navigateLightbox = useCallback((index: number) => {
    setCurrentImageIndex(index);
  }, []);

  // Don't render if no gallery data
  if (!galleryData || !galleryData.images || galleryData.images.length === 0) {
    return null;
  }

  const totalImages = galleryData.images.length;

  // Animation variants
  const containerVariants = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const imageVariants = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
  };

  return (
    <section
      className={`
        w-full
        bg-[var(--product-page-bg,#151715)]
        py-20 lg:py-28
        ${className || ''}
      `}
      id="product-gallery"
      aria-label="Product Gallery - A Closer Look"
    >
      <div className="max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-[60px] xl:px-[100px]">
        {/* Section Title - Hardcoded as per design */}
        <motion.div
          className="mb-10 lg:mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        >
          <h2
            className="
              text-4xl sm:text-5xl lg:text-[50px]
              font-semibold
              leading-tight
              text-[var(--color-primary,#d4af37)]
              font-[family-name:var(--font-ibm-plex-sans)]
            "
          >
            A Closer Look
          </h2>
        </motion.div>

        {/* Masonry Grid Layout */}
        <motion.div
          className="
            grid
            grid-cols-2 sm:grid-cols-3 lg:grid-cols-4
            gap-3 sm:gap-4 lg:gap-5
            auto-rows-[160px] sm:auto-rows-[180px] lg:auto-rows-[200px]
          "
          initial="initial"
          animate="animate"
          variants={containerVariants}
          role="img"
          aria-label={`Gallery with ${totalImages} product images`}
        >
          {galleryData.images.map((image: GalleryImage, index: number) => (
            <GalleryItem
              key={image.id}
              image={image}
              layout={getLayoutForIndex(index, totalImages)}
              variants={imageVariants}
              index={index}
              onClick={() => openLightbox(index)}
            />
          ))}
        </motion.div>
      </div>

      {/* Lightbox Modal */}
      <ImageLightbox
        images={galleryData.images}
        currentIndex={currentImageIndex}
        isOpen={isLightboxOpen}
        onClose={closeLightbox}
        onNavigate={navigateLightbox}
      />
    </section>
  );
}

/**
 * Individual gallery item component with auto-layout
 */
function GalleryItem({
  image,
  layout,
  variants,
  index,
  onClick,
}: {
  image: GalleryImage;
  layout: LayoutConfig;
  variants: {
    initial: { opacity: number; scale: number };
    animate: { opacity: number; scale: number };
  };
  index: number;
  onClick: () => void;
}) {
  // Get static class names from layout config
  const colSpanClass = COL_SPAN_MAP[layout.cols] || 'col-span-1';
  const rowSpanClass = ROW_SPAN_MAP[layout.rows] || 'row-span-1';
  const borderRadiusClass = BORDER_RADIUS_MAP[layout.borderRadius];
  const flipClass = layout.flipVertical ? '-scale-y-100' : '';

  return (
    <motion.button
      className={`
        relative
        overflow-hidden
        shadow-[0_8px_32px_rgba(0,0,0,0.3)]
        bg-[var(--product-page-bg,#151715)]
        ${colSpanClass}
        ${rowSpanClass}
        ${borderRadiusClass}
        group
        cursor-pointer
        focus:outline-none focus:ring-2 focus:ring-[var(--color-primary,#d4af37)] focus:ring-offset-2 focus:ring-offset-[var(--product-page-bg,#151715)]
      `}
      variants={variants}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      whileHover={{
        scale: 1.02,
        transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
      }}
      onClick={onClick}
      aria-label={`View ${image.alt || `product image ${index + 1}`} in fullscreen`}
    >
      {/* Image with optional flip transform */}
      <div className={`relative w-full h-full ${flipClass}`}>
        <Image
          src={image.src}
          alt={image.alt || `Product image ${index + 1}`}
          fill
          className={`object-cover ${borderRadiusClass}`}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          priority={layout.priority}
        />
      </div>

      {/* Hover overlay with zoom icon */}
      <div
        className={`
          absolute inset-0
          bg-black/20
          opacity-0 group-hover:opacity-100
          transition-opacity duration-300
          flex items-center justify-center
          pointer-events-none
          ${borderRadiusClass}
        `}
        aria-hidden="true"
      >
        <div
          className="
            w-10 h-10
            bg-[var(--color-primary,#d4af37)]/90
            rounded-full
            flex items-center justify-center
            backdrop-blur-sm
            transform scale-75 group-hover:scale-100
            transition-transform duration-300
          "
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M14 1H10.5C10.2 1 10 1.2 10 1.5S10.2 2 10.5 2H13.3L8.9 6.4C8.7 6.6 8.7 6.9 8.9 7.1C9 7.2 9.1 7.2 9.2 7.2S9.4 7.2 9.5 7.1L14 2.7V5.5C14 5.8 14.2 6 14.5 6S15 5.8 15 5.5V2C15 1.4 14.6 1 14 1Z"
              fill="black"
            />
            <path
              d="M11.5 8C11.2 8 11 8.2 11 8.5V13H2V4H6.5C6.8 4 7 3.8 7 3.5S6.8 3 6.5 3H2C1.4 3 1 3.4 1 4V13C1 13.6 1.4 14 2 14H11C11.6 14 12 13.6 12 13V8.5C12 8.2 11.8 8 11.5 8Z"
              fill="black"
            />
          </svg>
        </div>
      </div>
    </motion.button>
  );
}
