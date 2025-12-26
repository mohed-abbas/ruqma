'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ProductPageProps } from './types';

// Animation variants
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
  whileHover: { scale: 1.02 },
  transition: { duration: 0.2 }
};

// Design constants - single source of truth
const PRODUCT_IMAGE = {
  aspectRatio: '674/559',
  maxWidth: 674,
  offset: { left: -35, top: 25 },
} as const;

interface ExtendedProductPageProps extends ProductPageProps {
  productSlug: string;
}

export default function ProductPage({
  product,
  className,
  onLearnMoreClick,
  productSlug, // eslint-disable-line @typescript-eslint/no-unused-vars
}: ExtendedProductPageProps) {
  const router = useRouter();
  const {
    name,
    description,
    ctaText = "Learn More",
    image
  } = product;

  const handleLearnMoreClick = () => {
    if (onLearnMoreClick) {
      onLearnMoreClick();
    } else {
      // Scroll to more information or navigate to product details
      const element = document.getElementById('product-features');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else {
        // If no details section, navigate to products page
        router.push('/products');
      }
    }
  };
  return (
    <div className={`w-full ${className || ''}`}>
      {/* Hero Section */}
      <section
        className="
          relative min-h-screen w-full
          bg-[var(--product-page-bg)]
          text-white
          overflow-hidden
          flex flex-col
        "
        data-name="Product page dark"
      >
        {/* CSS Ellipses Background - golden glow on left side */}
        <div
          className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden"
          data-name="Ellipses"
        >
          {/* Primary golden glow - ellipse spread out for ambient effect */}
          <div
            className="absolute w-[1425px] h-[1625px] blur-[150px]"
            style={{
              left: '-511px',
              top: '-211px',
              background: 'radial-gradient(ellipse, rgba(212, 175, 55, 0.35) 70%, rgba(212, 175, 55, 0.5) 65%, transparent 50%)'
            }}
          />
        </div>

        {/* Hero Content Container - vertically centered with flex-1, matches Navbar container */}
        <div className="relative max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 flex-1 flex items-center z-10">
          {/* Hero Section */}
          <motion.div
            className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 xl:gap-20 w-full py-12 lg:py-0"
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >
            {/* Product Information */}
            <motion.div
              className="flex flex-col gap-6 items-start justify-start w-full lg:w-auto lg:max-w-[420px] xl:max-w-[480px] shrink-0"
              variants={fadeInUp}
            >
              {/* Product Title */}
              <h1
                id="product-title"
                className="capitalize font-medium leading-[1.1] text-[clamp(3rem,10vw,6.25rem)] w-full font-heading"
              >
                <span className="text-white">{name.slice(0, -1)}</span>
                <span className="text-primary">{name.slice(-1)}</span>
              </h1>

              {/* Description and Button Container */}
              <div className="flex flex-col gap-6 items-start justify-center">
                {/* Product Description */}
                <motion.div
                  className="max-w-[380px]"
                  variants={fadeInUp}
                >
                  <p className="font-normal leading-relaxed text-lg sm:text-xl text-white/90 font-body">
                    {description}
                  </p>
                </motion.div>

                {/* Learn More Button */}
                <motion.button
                  className="
                    bg-primary
                    text-black
                    px-6
                    py-3
                    rounded-full
                    font-bold
                    text-sm
                    capitalize
                    border
                    border-white
                    relative
                    overflow-hidden
                    min-w-[126px]
                    font-body
                  "
                  style={{
                    boxShadow: 'var(--product-page-button-shadow)'
                  }}
                  variants={fadeInUp}
                  {...scaleOnHover}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLearnMoreClick}
                >
                  {ctaText}
                </motion.button>
              </div>
            </motion.div>

            {/* Product Image Container - responsive with aspect ratio, scales on XL */}
            <motion.div
              className="relative w-full lg:w-auto lg:flex-1 max-w-[500px] lg:max-w-[600px] xl:max-w-[750px] 2xl:max-w-[850px]"
              style={{ aspectRatio: PRODUCT_IMAGE.aspectRatio }}
              variants={fadeInUp}
            >
              {/* Back Product Image (behind, slightly faded) */}
              <div className="absolute inset-0 z-0">
                <div
                  className="w-full h-full opacity-80"
                  style={{
                    backgroundImage: `url('${image}')`,
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat'
                  }}
                />
              </div>

              {/* Front Product Image (in front, offset left and down) */}
              <div
                className="absolute inset-0 z-10"
                style={{
                  transform: `translate(${PRODUCT_IMAGE.offset.left}px, ${PRODUCT_IMAGE.offset.top}px)`
                }}
              >
                <div
                  className="w-full h-full"
                  style={{
                    backgroundImage: `url('${image}')`,
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat'
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}