'use client';

import React from 'react';
import { motion, Variants, useReducedMotion } from 'framer-motion';
import { ProductCard } from './ui/product';

interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  imageUrl: string;
  href: string;
  brand: string;
}

interface ProductsClientProps {
  products: Product[];
  title: string;
  titleAccent: string;
}

export default function ProductsClient({ products, title, titleAccent }: ProductsClientProps) {
  const prefersReducedMotion = useReducedMotion();

  // Container variants for staggered children
  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.15,
        delayChildren: prefersReducedMotion ? 0 : 0.1,
      }
    }
  };

  // Header animation - subtle fade up
  const headerVariants: Variants = {
    hidden: {
      opacity: prefersReducedMotion ? 1 : 0,
      y: prefersReducedMotion ? 0 : 30
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: prefersReducedMotion ? 0.01 : 0.6,
        ease: [0.16, 1, 0.3, 1] // expo-out
      }
    }
  };

  // Row variants for staggered card reveals
  const rowVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.1,
      }
    }
  };

  // Card variants - subtle scale and fade
  const cardVariants: Variants = {
    hidden: {
      opacity: prefersReducedMotion ? 1 : 0,
      y: prefersReducedMotion ? 0 : 40,
      scale: prefersReducedMotion ? 1 : 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: prefersReducedMotion ? 0.01 : 0.5,
        ease: [0.16, 1, 0.3, 1] // expo-out
      }
    }
  };

  return (
    <section
      id="products"
      className="bg-white py-20"
      style={{ scrollMarginTop: '56px' }}
    >
      <div className="max-w-7xl mx-auto px-4">
        {/* Header section with scroll-reveal animation */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="mb-[70px]"
        >
          <h2 className="font-[var(--font-ibm)] font-semibold text-[65px] leading-[1.2] text-[#151715]">
            <span className="text-[#151715]">{title}</span>
            <span className="text-[var(--color-primary)] ml-2">{titleAccent}</span>
          </h2>
        </motion.div>

        {/* Products container with staggered scroll-reveal */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="content-stretch flex flex-col gap-[70px] w-full"
        >
          {/* Dynamically render products in rows of 2 */}
          {Array.from({ length: Math.ceil(products.length / 2) }, (_, rowIndex) => (
            <motion.div
              key={rowIndex}
              variants={rowVariants}
              className="flex flex-col md:flex-row gap-6 md:gap-8 lg:gap-[150px] items-center justify-center w-full"
            >
              {products.slice(rowIndex * 2, rowIndex * 2 + 2).map((product) => (
                <motion.div
                  key={product.id}
                  variants={cardVariants}
                  className="w-full max-w-[542px]"
                >
                  <ProductCard
                    id={product.slug}
                    name={product.name}
                    description={product.description}
                    imageUrl={product.imageUrl}
                    href={product.href}
                    brand={product.brand}
                  />
                </motion.div>
              ))}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
