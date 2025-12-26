'use client';

import { motion, type Variants } from 'framer-motion';
import Image from 'next/image';
import { ProductFeaturesSectionData, FeatureCardData } from './types';

interface ProductFeaturesSectionProps {
  data: ProductFeaturesSectionData;
  className?: string;
}

// Animation variants
const containerVariants: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const fadeInUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as const },
  },
};

const fadeInScale: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as const },
  },
};

/**
 * Feature card component matching Figma design
 */
function FeatureCard({ card, index }: { card: FeatureCardData; index: number }) {
  return (
    <motion.article
      className="
        flex-1
        bg-white
        rounded-[12px]
        p-5
        shadow-[0px_4px_15.8px_0px_rgba(0,0,0,0.1)]
        hover:shadow-[0px_8px_25px_0px_rgba(0,0,0,0.12)]
        transition-shadow
        duration-300
        min-w-0
      "
      variants={fadeInUp}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      aria-labelledby={`feature-${card.id || index}-title`}
    >
      <div className="flex flex-col gap-[9px]">
        {/* Title with mixed colors */}
        <h3
          id={`feature-${card.id || index}-title`}
          className="
            font-heading
            font-bold
            text-xl sm:text-2xl
            leading-[1.2]
            capitalize
          "
        >
          <span className="text-primary">{card.goldText} </span>
          {card.darkText && (
            <span className="text-[#1e1e1e]">{card.darkText}</span>
          )}
        </h3>

        {/* Description */}
        <p className="font-body text-sm sm:text-base leading-[1.5] text-[#1e1e1e]">
          {card.description}
        </p>
      </div>
    </motion.article>
  );
}

/**
 * Product Features Section - Two Column Layout
 * Matches Figma design node 106:382
 *
 * Layout:
 * - Left column (439px): Product image + headline + description
 * - Right column (769px): 3 feature cards + large product image
 */
export default function ProductFeaturesSection({
  data,
  className,
}: ProductFeaturesSectionProps) {
  const { leftColumn, featureCards, detailImage } = data;

  // Don't render if no data
  if (!leftColumn && !featureCards?.length && !detailImage) {
    return null;
  }

  return (
    <section
      className={`
        w-full
        bg-[#fafafa]
        py-16 sm:py-20 lg:py-[120px]
        ${className || ''}
      `}
      id="product-features"
      aria-label="Product Features"
    >
      <motion.div
        className="
          max-w-[1280px]
          mx-auto
          px-4 sm:px-6 lg:px-8
        "
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: '-100px' }}
        variants={containerVariants}
      >
        {/* Two Column Layout */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
          {/* LEFT COLUMN */}
          <motion.div
            className="w-full lg:w-[439px] lg:shrink-0 flex flex-col gap-6"
            variants={fadeInUp}
          >
            {/* Product Image */}
            {leftColumn?.productImage?.asset && (
              <motion.div
                className="
                  aspect-[333/352]
                  rounded-[36px]
                  overflow-hidden
                  relative
                "
                variants={fadeInScale}
                whileHover={{
                  scale: 1.02,
                  transition: { duration: 0.3 },
                }}
              >
                <Image
                  src={leftColumn.productImage.asset.url || ''}
                  alt={leftColumn.productImage.alt || 'Product image'}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 439px"
                  priority
                />
              </motion.div>
            )}

            {/* Text Block */}
            <div className="flex flex-col gap-5 lg:gap-[25px]">
              {/* Headline with mixed colors */}
              {leftColumn?.headline && (
                <h2 className="
                  font-heading
                  font-bold
                  text-3xl sm:text-4xl lg:text-[48px]
                  leading-[1.2]
                  capitalize
                ">
                  {leftColumn.headline.darkText && (
                    <span className="text-[#1e1e1e]">
                      {leftColumn.headline.darkText}
                    </span>
                  )}
                  {leftColumn.headline.goldText && (
                    <span className="text-primary">
                      {' '}{leftColumn.headline.goldText}
                    </span>
                  )}
                </h2>
              )}

              {/* Description */}
              {leftColumn?.description && (
                <p className="
                  font-body
                  text-base sm:text-lg lg:text-xl
                  leading-[1.5]
                  text-[rgba(68,69,78,0.7)]
                  max-w-md
                ">
                  {leftColumn.description}
                </p>
              )}
            </div>
          </motion.div>

          {/* RIGHT COLUMN */}
          <motion.div
            className="w-full lg:w-[769px] lg:shrink-0 flex flex-col gap-6 lg:gap-[29px]"
            variants={fadeInUp}
          >
            {/* Feature Cards Row */}
            {featureCards && featureCards.length > 0 && (
              <div className="
                flex
                flex-col sm:flex-row
                gap-4 lg:gap-6
              ">
                {featureCards.map((card, index) => (
                  <FeatureCard
                    key={card._key || card.id || index}
                    card={card}
                    index={index}
                  />
                ))}
              </div>
            )}

            {/* Large Detail Image */}
            {detailImage?.asset && (
              <motion.div
                className="
                  w-full
                  aspect-video lg:aspect-[769/504]
                  rounded-[10px]
                  overflow-hidden
                  relative
                  bg-gradient-to-br from-gray-100 to-gray-200
                "
                variants={fadeInScale}
                whileHover={{
                  scale: 1.01,
                  transition: { duration: 0.3 },
                }}
              >
                <Image
                  src={detailImage.asset.url || ''}
                  alt={detailImage.alt || 'Product detail image'}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 769px"
                />
              </motion.div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
