'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ProductDetailsData } from './types';

interface FeatureCardGridProps {
  productDetails: ProductDetailsData;
  className?: string;
}

/**
 * @deprecated Use ProductFeaturesSection instead for the new two-column layout
 */

// Animation variants
const containerVariants = {
  animate: {
    transition: {
      staggerChildren: 0.15
    }
  }
};

const cardVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
};

/**
 * Asymmetric feature card grid matching Figma design
 * Features custom CSS Grid positioning for varied card sizes
 */
export default function FeatureCardGrid({
  productDetails,
  className
}: FeatureCardGridProps) {
  const { mainFeature, features, detailImage } = productDetails;

  // Guard against missing data
  if (!mainFeature || !features || !detailImage) {
    return null;
  }

  return (
    <section
      className={`
        w-full
        bg-white
        py-20 lg:py-28
        ${className || ''}
      `}
      id="product-details"
    >
      <div className="max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-24">
        <motion.div
          className="
            grid
            grid-cols-1
            lg:grid-cols-12
            gap-5 lg:gap-8
          "
          initial="initial"
          animate="animate"
          variants={containerVariants}
        >
          {/* Main Feature Card - Large Left Card */}
          <motion.div
            className="
              lg:col-span-5
              flex flex-col
              gap-8
              lg:row-span-2
            "
            variants={cardVariants}
          >
            {/* Main Feature Text */}
            <div className="flex flex-col gap-5">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-gray-900 font-heading">
                <span>{mainFeature.title} </span>
                {mainFeature.highlight && (
                  <span className="text-primary">{mainFeature.highlight}</span>
                )}
              </h2>

              <p className="text-base sm:text-lg lg:text-xl font-normal leading-relaxed text-gray-600 max-w-md font-body">
                {mainFeature.description}
              </p>
            </div>

            {/* Main Feature Image with Diagonal Product */}
            <motion.div
              className="
                relative
                aspect-[4/3]
                rounded-2xl
                overflow-hidden
                shadow-lg
                bg-gray-100
              "
              whileHover={{
                scale: 1.02,
                transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
              }}
            >
              <Image
                src={mainFeature.image}
                alt={mainFeature.imageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 500px"
                priority
              />

              {/* Diagonal overlay with product code */}
              <div className="
                absolute
                bottom-5
                left-5
                bg-white
                px-3
                py-2
                rounded-lg
                shadow-lg
                transform -rotate-12
                z-10
              ">
                <span className="text-sm font-bold text-gray-900 font-heading">
                  UA-005 ™
                </span>
              </div>
            </motion.div>
          </motion.div>

          {/* Feature Cards Grid - Right Side */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

            {/* Consistent Surface Card */}
            <motion.div
              className="
                bg-stone-50
                rounded-2xl
                p-6
                shadow-md
                flex flex-col
                justify-between
                min-h-[180px]
              "
              variants={cardVariants}
              whileHover={{ y: -4, transition: { duration: 0.3 } }}
            >
              <div className="flex flex-col gap-3">
                <h3 className="text-lg font-semibold text-gray-900 font-heading">
                  Consistent
                </h3>
                <h4 className="text-base font-semibold text-primary font-heading">
                  Surface
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed font-body">
                  {features[0]?.description}
                </p>
              </div>
            </motion.div>

            {/* For Strength Card */}
            <motion.div
              className="
                bg-gray-900
                rounded-2xl
                p-6
                shadow-md
                flex flex-col
                justify-between
                min-h-[180px]
                text-white
              "
              variants={cardVariants}
              whileHover={{ y: -4, transition: { duration: 0.3 } }}
            >
              <div className="flex flex-col gap-3">
                <h3 className="text-lg font-semibold font-heading">
                  Tempered Glass
                </h3>
                <h4 className="text-base font-semibold text-primary font-heading">
                  For Strength
                </h4>
                <p className="text-sm text-white/80 leading-relaxed font-body">
                  {features[1]?.description}
                </p>
              </div>
            </motion.div>

            {/* Large Size Card */}
            <motion.div
              className="
                sm:col-span-2 lg:col-span-1
                bg-gradient-to-br from-primary to-amber-600
                rounded-2xl
                p-6
                shadow-md
                flex flex-col
                justify-between
                min-h-[180px]
                text-white
              "
              variants={cardVariants}
              whileHover={{ y: -4, transition: { duration: 0.3 } }}
            >
              <div className="flex flex-col gap-3">
                <h3 className="text-xl font-bold leading-tight font-heading">
                  400x450mm
                </h3>
                <h4 className="text-lg font-semibold font-heading">
                  Large Size
                </h4>
                <p className="text-sm text-white/90 leading-relaxed font-body">
                  {features[2]?.description}
                </p>
              </div>
            </motion.div>

            {/* Large Image Card - Bottom spanning full width */}
            <motion.div
              className="
                col-span-1 sm:col-span-2 lg:col-span-3
                relative
                aspect-video lg:aspect-[21/9]
                rounded-2xl
                overflow-hidden
                shadow-lg
                mt-4
              "
              variants={cardVariants}
              whileHover={{
                scale: 1.01,
                transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
              }}
            >
              <Image
                src={detailImage.src}
                alt={detailImage.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 80vw, 800px"
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}