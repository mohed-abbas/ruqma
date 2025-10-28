'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ProductGalleryProps, GalleryImage } from './types';

/**
 * Product Gallery with masonry-style layout matching Figma design
 * Features "A Closer Look" section with asymmetric image grid
 */
export default function ProductGallery({
  productSlug, // eslint-disable-line @typescript-eslint/no-unused-vars
  className
}: ProductGalleryProps) {
  // Mock gallery data based on Figma design - using existing product images for demonstration
  const galleryData = {
    title: "A Closer Look",
    images: [
      {
        id: "gallery-1",
        src: "/products/featureImage1.png",
        alt: "GlideX mouse pad texture detail close-up view",
        gridSpan: { cols: 1, rows: 1 },
        aspectRatio: "1/1",
        priority: true
      },
      {
        id: "gallery-2",
        src: "/products/featureImage2.png",
        alt: "Gaming mouse on GlideX pad showing tracking precision",
        gridSpan: { cols: 1, rows: 1 },
        aspectRatio: "1/1"
      },
      {
        id: "gallery-3",
        src: "/products/product.png",
        alt: "GlideX product packaging and branding detail",
        gridSpan: { cols: 1, rows: 1 },
        aspectRatio: "1/1"
      },
      {
        id: "gallery-4",
        src: "/products/featureImage1.png",
        alt: "Side profile view of GlideX glass mouse pad thickness",
        gridSpan: { cols: 1, rows: 1 },
        aspectRatio: "1/1"
      },
      {
        id: "gallery-5",
        src: "/products/featureImage2.png",
        alt: "GlideX mouse pad edge detail with precision cutting",
        gridSpan: { cols: 1, rows: 1 },
        aspectRatio: "4/3"
      },
      {
        id: "gallery-6",
        src: "/products/featureImage1.png",
        alt: "Gaming setup with GlideX mouse pad in professional environment",
        gridSpan: { cols: 2, rows: 1 },
        aspectRatio: "16/9",
        priority: true
      },
      {
        id: "gallery-7",
        src: "/products/product.png",
        alt: "Botanical elements with GlideX mouse pad artistic composition",
        gridSpan: { cols: 1, rows: 1 },
        aspectRatio: "1/1"
      },
      {
        id: "gallery-8",
        src: "/products/featureImage2.png",
        alt: "Gaming mouse and GlideX pad from above showing scale",
        gridSpan: { cols: 1, rows: 1 },
        aspectRatio: "1/1"
      },
      {
        id: "gallery-9",
        src: "/products/featureImage1.png",
        alt: "Minimalist workspace featuring GlideX mouse pad with coffee",
        gridSpan: { cols: 1, rows: 1 },
        aspectRatio: "1/1"
      },
      {
        id: "gallery-10",
        src: "/products/product.png",
        alt: "GlideX mouse pad corner detail showing build quality",
        gridSpan: { cols: 1, rows: 1 },
        aspectRatio: "1/1"
      }
    ]
  };

  // Animation variants
  const containerVariants = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const imageVariants = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
  };

  return (
    <section
      className={`
        w-full
        bg-[#151715]
        py-[80px] lg:py-[120px]
        ${className || ''}
      `}
      id="product-gallery"
    >
      <div className="max-w-[1280px] mx-auto px-[24px] sm:px-[40px] lg:px-[60px] xl:px-[100px]">
        {/* Section Title */}
        <motion.div
          className="mb-[60px] lg:mb-[80px]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        >
          <h2
            className="
              text-[32px] sm:text-[40px] lg:text-[48px]
              font-bold
              leading-[1.1]
              text-[#d4af37]
              text-center
            "
            style={{ fontFamily: 'IBM Plex Sans, sans-serif' }}
          >
            {galleryData.title}
          </h2>
        </motion.div>

        {/* Masonry Grid Layout */}
        <motion.div
          className="
            grid
            grid-cols-2 sm:grid-cols-3 lg:grid-cols-4
            gap-[16px] lg:gap-[20px]
            auto-rows-[200px] lg:auto-rows-[240px]
          "
          initial="initial"
          animate="animate"
          variants={containerVariants}
        >
          {galleryData.images.map((image: GalleryImage, index: number) => (
            <motion.div
              key={image.id}
              className={`
                relative
                rounded-[12px]
                overflow-hidden
                shadow-[0px_8px_32px_rgba(0,0,0,0.3)]
                ${getGridSpanClasses(image, index)}
              `}
              variants={imageVariants}
              whileHover={{
                scale: 1.02,
                transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
              }}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                priority={image.priority}
              />

              {/* Hover overlay */}
              <div className="
                absolute inset-0
                bg-black/20
                opacity-0 hover:opacity-100
                transition-opacity duration-300
                flex items-center justify-center
              ">
                <div className="
                  w-[40px] h-[40px]
                  bg-[#d4af37]/90
                  rounded-full
                  flex items-center justify-center
                  backdrop-blur-sm
                ">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
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
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/**
 * Get appropriate grid span classes based on image configuration and position
 */
function getGridSpanClasses(image: GalleryImage, index: number): string {
  // Specific layout pattern based on Figma design
  const layoutMap: Record<number, string> = {
    0: "col-span-1 row-span-1", // Top left
    1: "col-span-1 row-span-1", // Top center-left
    2: "col-span-1 row-span-1", // Top center-right
    3: "col-span-1 row-span-1", // Top right
    4: "col-span-1 row-span-1", // Middle left
    5: "col-span-2 lg:col-span-2 row-span-1", // Large center image
    6: "col-span-1 row-span-1", // Middle right
    7: "col-span-1 row-span-1", // Bottom left
    8: "col-span-1 row-span-1", // Bottom center-left
    9: "col-span-1 row-span-1", // Bottom center-right
  };

  return layoutMap[index] || "col-span-1 row-span-1";
}