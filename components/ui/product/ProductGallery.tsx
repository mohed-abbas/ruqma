'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ProductGalleryData, GalleryImage } from './types';

/**
 * Product Gallery with masonry-style layout matching Figma design
 * Features "A Closer Look" section with asymmetric image grid
 * Now receives data as props instead of using hardcoded data
 */
export default function ProductGallery({
  galleryData,
  className
}: { galleryData: ProductGalleryData | null; className?: string }) {
  // Default gallery data if none provided
  if (!galleryData || !galleryData.images || galleryData.images.length === 0) {
    return null; // Don't render gallery if no images
  }

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
            {galleryData.title || 'A Closer Look'}
          </h2>
          {galleryData.subtitle && (
            <p className="text-center text-gray-400 mt-4 text-lg">
              {galleryData.subtitle}
            </p>
          )}
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
          {galleryData.images.map((image: GalleryImage) => (
            <motion.div
              key={image.id}
              className={`
                relative
                rounded-[12px]
                overflow-hidden
                shadow-[0px_8px_32px_rgba(0,0,0,0.3)]
                ${getGridSpanClasses(image)}
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
 * Get appropriate grid span classes based on image configuration
 */
function getGridSpanClasses(image: GalleryImage): string {
  // Use grid span from image data if available
  const cols = image.gridSpan?.cols || 1;
  const rows = image.gridSpan?.rows || 1;
  
  return `col-span-${cols} row-span-${rows}`;
}