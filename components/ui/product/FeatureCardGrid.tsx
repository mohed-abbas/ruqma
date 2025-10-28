'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ProductDetailsData } from './types';

interface FeatureCardGridProps {
  productDetails: ProductDetailsData;
  className?: string;
}

/**
 * Asymmetric feature card grid matching Figma design
 * Features custom CSS Grid positioning for varied card sizes
 */
export default function FeatureCardGrid({
  productDetails,
  className
}: FeatureCardGridProps) {
  const { mainFeature, features, detailImage } = productDetails;

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

  return (
    <section
      className={`
        w-full
        bg-white
        py-[80px] lg:py-[120px]
        ${className || ''}
      `}
      id="product-details"
    >
      <div className="max-w-[1280px] mx-auto px-[24px] sm:px-[40px] lg:px-[60px] xl:px-[100px]">
        <motion.div
          className="
            grid
            grid-cols-1
            lg:grid-cols-12
            gap-[20px] lg:gap-[30px]
            min-h-[800px]
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
              gap-[30px]
              lg:row-span-2
            "
            variants={cardVariants}
          >
            {/* Main Feature Text */}
            <div className="flex flex-col gap-[20px]">
              <h2
                className="
                  text-[32px] sm:text-[40px] lg:text-[48px]
                  font-bold
                  leading-[1.1]
                  text-[#1e1e1e]
                "
                style={{ fontFamily: 'IBM Plex Sans, sans-serif' }}
              >
                <span className="text-[#1e1e1e]">{mainFeature.title} </span>
                {mainFeature.highlight && (
                  <span className="text-[#d4af37]">{mainFeature.highlight}</span>
                )}
              </h2>

              <p
                className="
                  text-[16px] sm:text-[18px] lg:text-[20px]
                  font-normal
                  leading-[1.5]
                  text-[rgba(68,69,78,0.7)]
                  max-w-[400px]
                "
                style={{ fontFamily: 'Nunito Sans, sans-serif' }}
              >
                {mainFeature.description}
              </p>
            </div>

            {/* Main Feature Image with Diagonal Product */}
            <motion.div
              className="
                relative
                aspect-[4/3]
                rounded-[20px]
                overflow-hidden
                shadow-[0px_8px_32px_rgba(0,0,0,0.12)]
                bg-[#f8f9fa]
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
                bottom-[20px]
                left-[20px]
                bg-white
                px-[12px]
                py-[8px]
                rounded-[8px]
                shadow-lg
                transform rotate-[-12deg]
                z-10
              ">
                <span
                  className="text-[14px] font-bold text-[#1e1e1e]"
                  style={{ fontFamily: 'IBM Plex Sans, sans-serif' }}
                >
                  UA-005 ™
                </span>
              </div>
            </motion.div>
          </motion.div>

          {/* Feature Cards Grid - Right Side */}
          <div className="lg:col-span-7 grid gap-[10px] lg:gap-[14px]">

            {/* Consistent Surface Card */}
            <motion.div
              className="
                lg:col-span-1
                bg-[#faf9f7]
                rounded-[16px]
                p-[24px]
                shadow-[0px_4px_20px_rgba(0,0,0,0.08)]
                flex flex-col
                justify-between
                min-h-[200px]
                w-[250px]
              "
              variants={cardVariants}
              whileHover={{ y: -4, transition: { duration: 0.3 } }}
            >
              <div className="flex flex-col gap-[12px]">
                <h3
                  className="text-[18px] font-semibold text-[#1e1e1e] leading-[1.2]"
                  style={{ fontFamily: 'IBM Plex Sans, sans-serif' }}
                >
                  Consistent
                </h3>
                <h4
                  className="text-[16px] font-semibold text-[#d4af37] leading-[1.2]"
                  style={{ fontFamily: 'IBM Plex Sans, sans-serif' }}
                >
                  Surface
                </h4>
                <p
                  className="text-[14px] text-[rgba(68,69,78,0.7)] leading-[1.4]"
                  style={{ fontFamily: 'Nunito Sans, sans-serif' }}
                >
                  {features[0]?.description}
                </p>
              </div>
            </motion.div>

            {/* For Strength Card */}
            <motion.div
              className="
                lg:col-span-1
                bg-[#1a1a1a]
                rounded-[16px]
                p-[24px]
                shadow-[0px_4px_20px_rgba(0,0,0,0.15)]
                flex flex-col
                justify-between
                min-h-[200px]
                w-[250px]
                text-white
              "
              variants={cardVariants}
              whileHover={{ y: -4, transition: { duration: 0.3 } }}
            >
              <div className="flex flex-col gap-[12px]">
                <h3
                  className="text-[18px] font-semibold leading-[1.2]"
                  style={{ fontFamily: 'IBM Plex Sans, sans-serif' }}
                >
                  Tempered Glass
                </h3>
                <h4
                  className="text-[16px] font-semibold text-[#d4af37] leading-[1.2]"
                  style={{ fontFamily: 'IBM Plex Sans, sans-serif' }}
                >
                  For Strength
                </h4>
                <p
                  className="text-[14px] text-[rgba(255,255,255,0.8)] leading-[1.4]"
                  style={{ fontFamily: 'Nunito Sans, sans-serif' }}
                >
                  {features[1]?.description}
                </p>
              </div>

              {/* Glass strength icon */}
              {/* <div className="flex justify-end">
                <div className="w-[40px] h-[40px] bg-[#d4af37] rounded-[8px] flex items-center justify-center">
                  <div className="w-[20px] h-[20px] bg-white rounded-[2px]"></div>
                </div>
              </div> */}
            </motion.div>

            {/* Large Size Card */}
            <motion.div
              className="
                lg:col-span-1
                sm:col-span-2 lg:col-span-1
                bg-gradient-to-br from-[#d4af37] to-[#b8941f]
                rounded-[16px]
                p-[24px]
                shadow-[0px_4px_20px_rgba(212,175,55,0.25)]
                flex flex-col
                justify-between
                min-h-[200px]
                w-[250px]
                text-white
              "
              variants={cardVariants}
              whileHover={{ y: -4, transition: { duration: 0.3 } }}
            >
              <div className="flex flex-col gap-[12px]">
                <h3
                  className="text-[20px] font-bold leading-[1.1]"
                  style={{ fontFamily: 'IBM Plex Sans, sans-serif' }}
                >
                  400x450mm
                </h3>
                <h4
                  className="text-[18px] font-semibold leading-[1.2]"
                  style={{ fontFamily: 'IBM Plex Sans, sans-serif' }}
                >
                  Large Size
                </h4>
                <p
                  className="text-[14px] text-[rgba(255,255,255,0.9)] leading-[1.4]"
                  style={{ fontFamily: 'Nunito Sans, sans-serif' }}
                >
                  {features[2]?.description}
                </p>
              </div>
            </motion.div>

            {/* Large Image Card - Bottom Right */}
            <motion.div
              className="
                sm:col-span-2 lg:col-span-3
                relative
                aspect-[16/10] lg:aspect-[21/9]
                rounded-[16px]
                overflow-hidden
                shadow-[0px_8px_32px_rgba(0,0,0,0.12)]
                mt-[20px]
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