'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ProductPageProps } from './types';

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
    model,
    description,
    ctaText = "Learn More",
    image
  } = product;

  const handleLearnMoreClick = () => {
    if (onLearnMoreClick) {
      onLearnMoreClick();
    } else {
      // Scroll to more information or navigate to product details
      const element = document.getElementById('product-details');
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
          bg-[#151715]
          text-white
          overflow-hidden
        "
        data-name="Product page dark"
      >
        {/* CSS Ellipses Background */}
        <div
          className="absolute h-[1372px] left-[61px] top-[117px] w-[1318px] pointer-events-none"
          data-name="Ellipses"
        >
          <div className="absolute bottom-0 left-[-69.54%] right-0 top-[-49.02%]">
            {/* CSS Ellipses Pattern */}
            <div
              className="w-full h-full opacity-40"
              style={{
                background: `
                  radial-gradient(ellipse 400px 300px at 20% 30%, rgba(212, 175, 55, 0.15) 0%, transparent 50%),
                  radial-gradient(ellipse 300px 400px at 80% 20%, rgba(212, 175, 55, 0.10) 0%, transparent 50%),
                  radial-gradient(ellipse 500px 200px at 60% 80%, rgba(212, 175, 55, 0.08) 0%, transparent 50%),
                  radial-gradient(ellipse 200px 300px at 40% 60%, rgba(212, 175, 55, 0.12) 0%, transparent 50%)
                `
              }}
            />
          </div>
        </div>

        {/* Hero Content Container */}
        <div className="absolute flex flex-col gap-[100px] items-start justify-start left-[115px] top-[149px] w-[1280px] z-10">
          {/* Hero Section */}
          <motion.div
            className="flex gap-[265px] items-center justify-start w-full"
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >
            {/* Product Information */}
            <motion.div
              className="flex flex-col gap-[25px] h-[359px] items-start justify-start w-[360px]"
              variants={fadeInUp}
            >
              {/* Product Title */}
              <h1
                id="product-title"
                className="capitalize font-medium leading-[1.2] text-[100px] w-full"
                style={{
                  fontFamily: 'IBM Plex Sans, sans-serif'
                }}
              >
                <span className="text-white">{name}</span>
                <span className="text-[#d4af37]">{model}</span>
              </h1>

              {/* Description and Button Container */}
              <div className="flex flex-col gap-[25px] items-start justify-center">
                {/* Product Description */}
                <motion.div
                  className="h-[150px] w-[342px] flex items-center"
                  variants={fadeInUp}
                >
                  <p
                    className="font-normal leading-[1.5] text-[20px] text-white"
                    style={{
                      fontFamily: 'Nunito Sans, sans-serif'
                    }}
                  >
                    {description}
                  </p>
                </motion.div>

                {/* Learn More Button */}
                <motion.button
                  className="
                    bg-[#d4af37]
                    text-black
                    px-[24px]
                    py-[12px]
                    rounded-[52px]
                    font-bold
                    text-[14px]
                    capitalize
                    border
                    border-white
                    relative
                    overflow-hidden
                    min-w-[126px]
                    h-[46px]
                  "
                  style={{
                    fontFamily: 'Nunito Sans, sans-serif',
                    boxShadow: '0px -4px 5.8px 0px inset rgba(161,161,161,0.25), 0px 4px 2.6px 0px inset rgba(255,255,255,0.25)'
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

            {/* Product Image */}
            <motion.div
              className="h-[559px] w-[674px] relative"
              variants={fadeInUp}
            >
              {/* Main Product Image */}
              <div className="absolute flex h-[559px] items-center justify-center left-0 top-0 w-[674px]">
                <div className="flex-none">
                  <div
                    className="h-[559px] w-[674px]"
                    style={{
                      backgroundImage: `url('${image}')`,
                      backgroundPosition: '51.59% 50.21%',
                      backgroundSize: '118.69% 143.11%',
                      backgroundRepeat: 'no-repeat'
                    }}
                  />
                </div>
              </div>

              {/* Secondary/Shadow Product Image */}
              <div className="absolute flex h-[559px] items-center justify-center left-[-35px] top-[25px] w-[674px]">
                <div className="flex-none">
                  <div
                    className="h-[559px] w-[674px]"
                    style={{
                      backgroundImage: `url('${image}')`,
                      backgroundPosition: '51.59% 50.21%',
                      backgroundSize: '118.69% 143.11%',
                      backgroundRepeat: 'no-repeat'
                    }}
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}