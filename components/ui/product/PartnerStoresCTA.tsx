'use client';

import { motion } from 'framer-motion';
import { PartnerStoresCTAProps } from './types';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.2
    }
  }
};

const scaleOnHover = {
  whileHover: { scale: 1.05 },
  transition: { duration: 0.2 }
};

/**
 * Partner Stores CTA section matching Figma design
 * Features gold background with centered content and call-to-action button
 */
export default function PartnerStoresCTA({
  className,
  onButtonClick
}: PartnerStoresCTAProps) {
  // CTA data matching Figma design with appropriate content for Ruqma
  const ctaData = {
    headline: "Wanna Experience Our Premium Products ? Check Them Out At Our Partner Stores.",
    description: "Discover the precision and quality of Ruqma products in person. Visit our authorized retailers for hands-on experience and expert guidance.",
    buttonText: "See Partner Stores",
    buttonLink: "/partners"
  };

  const handleButtonClick = () => {
    if (onButtonClick) {
      onButtonClick();
    } else {
      // Default navigation behavior
      window.location.href = ctaData.buttonLink || '/partners';
    }
  };

  return (
    <section
      className={`
        w-full
        bg-white
        py-[80px] lg:py-[120px]
        ${className || ''}
      `}
      id="partner-stores-cta"
    >
      <div className="max-w-[1280px] mx-auto bg-[var(--color-primary)] p-[24px] rounded-[20px]">
        <motion.div
          className="
            text-center
            max-w-[800px]
            mx-auto
          "
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          {/* Headline */}
          <motion.h2
            className="
              text-[28px] sm:text-[36px] lg:text-[42px]
              font-bold
              leading-[1.2]
              text-white
              mb-[24px] lg:mb-[32px]
            "
            style={{ fontFamily: 'IBM Plex Sans, sans-serif' }}
            variants={fadeInUp}
          >
            {ctaData.headline}
          </motion.h2>

          {/* Description */}
          <motion.p
            className="
              text-[16px] sm:text-[18px] lg:text-[20px]
              font-normal
              leading-[1.5]
              text-white
              opacity-90
              mb-[40px] lg:mb-[48px]
            "
            style={{ fontFamily: 'Nunito Sans, sans-serif' }}
            variants={fadeInUp}
          >
            {ctaData.description}
          </motion.p>

          {/* CTA Button */}
          <motion.button
            className="
              bg-white
              text-[var(--color-primary)]
              px-[32px] sm:px-[40px]
              py-[14px] sm:py-[16px]
              rounded-[52px]
              font-bold
              text-[14px] sm:text-[16px]
              border-2
              border-white
              relative
              overflow-hidden
              min-w-[180px]
              h-[52px] sm:h-[56px]
              transition-all
              duration-300
              ease-in-out
              hover:bg-transparent
              hover:text-white
              hover:border-white
            "
            style={{
              fontFamily: 'Nunito Sans, sans-serif',
              boxShadow: '0px -4px 5.8px 0px inset rgba(161,161,161,0.25), 0px 4px 2.6px 0px inset rgba(255,255,255,0.25)'
            }}
            variants={fadeInUp}
            {...scaleOnHover}
            whileTap={{ scale: 0.95 }}
            onClick={handleButtonClick}
          >
            {ctaData.buttonText}
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}