'use client';

import { useEffect, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { GalleryImage } from './types';

interface ImageLightboxProps {
  images: GalleryImage[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

/**
 * Lightbox component for full-screen image viewing
 *
 * Features:
 * - Full-screen modal overlay
 * - Keyboard navigation (ESC, Arrow keys)
 * - Touch/swipe support for mobile
 * - Smooth Framer Motion animations
 * - Image counter display
 */
export default function ImageLightbox({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNavigate,
}: ImageLightboxProps) {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Minimum swipe distance for navigation (in pixels)
  const minSwipeDistance = 50;

  const currentImage = images[currentIndex];
  const totalImages = images.length;

  // Navigate to previous image
  const goToPrevious = useCallback(() => {
    const newIndex = currentIndex === 0 ? totalImages - 1 : currentIndex - 1;
    onNavigate(newIndex);
  }, [currentIndex, totalImages, onNavigate]);

  // Navigate to next image
  const goToNext = useCallback(() => {
    const newIndex = currentIndex === totalImages - 1 ? 0 : currentIndex + 1;
    onNavigate(newIndex);
  }, [currentIndex, totalImages, onNavigate]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          goToPrevious();
          break;
        case 'ArrowRight':
          goToNext();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    // Prevent body scroll when lightbox is open
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose, goToPrevious, goToNext]);

  // Touch handlers for swipe navigation
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrevious();
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  // Animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const imageVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  const buttonVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.1 },
    tap: { scale: 0.95 },
  };

  if (!currentImage) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.3 }}
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/95 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Close button */}
          <motion.button
            className="
              absolute top-4 right-4 z-10
              w-12 h-12
              flex items-center justify-center
              bg-white/10 hover:bg-white/20
              rounded-full
              text-white
              transition-colors
              focus:outline-none focus:ring-2 focus:ring-[var(--color-primary,#d4af37)]
            "
            onClick={onClose}
            variants={buttonVariants}
            initial="rest"
            whileHover="hover"
            whileTap="tap"
            aria-label="Close lightbox"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </motion.button>

          {/* Image counter */}
          <div
            className="
              absolute top-4 left-4 z-10
              px-4 py-2
              bg-white/10 backdrop-blur-sm
              rounded-full
              text-white text-sm font-medium
              font-[family-name:var(--font-nunito-sans)]
            "
          >
            {currentIndex + 1} / {totalImages}
          </div>

          {/* Navigation buttons */}
          {totalImages > 1 && (
            <>
              {/* Previous button */}
              <motion.button
                className="
                  absolute left-4 z-10
                  w-12 h-12
                  flex items-center justify-center
                  bg-white/10 hover:bg-white/20
                  rounded-full
                  text-white
                  transition-colors
                  focus:outline-none focus:ring-2 focus:ring-[var(--color-primary,#d4af37)]
                  hidden sm:flex
                "
                onClick={goToPrevious}
                variants={buttonVariants}
                initial="rest"
                whileHover="hover"
                whileTap="tap"
                aria-label="Previous image"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </motion.button>

              {/* Next button */}
              <motion.button
                className="
                  absolute right-4 z-10
                  w-12 h-12
                  flex items-center justify-center
                  bg-white/10 hover:bg-white/20
                  rounded-full
                  text-white
                  transition-colors
                  focus:outline-none focus:ring-2 focus:ring-[var(--color-primary,#d4af37)]
                  hidden sm:flex
                "
                onClick={goToNext}
                variants={buttonVariants}
                initial="rest"
                whileHover="hover"
                whileTap="tap"
                aria-label="Next image"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </motion.button>
            </>
          )}

          {/* Main image container with swipe support */}
          <motion.div
            className="
              relative z-0
              w-full h-full
              max-w-[90vw] max-h-[85vh]
              flex items-center justify-center
              px-16 py-20
              cursor-pointer
            "
            onClick={onClose}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <AnimatePresence mode="wait" custom={1}>
              <motion.div
                key={currentIndex}
                className="relative w-full h-full flex items-center justify-center cursor-default"
                variants={imageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                custom={1}
                transition={{
                  x: { type: 'spring', stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <Image
                  src={currentImage.fullSrc}
                  alt={currentImage.alt}
                  fill
                  className="object-contain"
                  sizes="90vw"
                  quality={90}
                  priority
                />
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Thumbnail strip */}
          {totalImages > 1 && (
            <div
              className="
                absolute bottom-4 left-1/2 -translate-x-1/2 z-10
                flex gap-2
                px-4 py-2
                bg-black/50 backdrop-blur-sm
                rounded-full
                max-w-[90vw]
                overflow-x-auto
                scrollbar-hide
              "
            >
              {images.map((image, index) => (
                <motion.button
                  key={image.id}
                  className={`
                    relative
                    w-12 h-12 sm:w-14 sm:h-14
                    flex-shrink-0
                    rounded-lg
                    overflow-hidden
                    border-2 transition-colors
                    ${index === currentIndex
                      ? 'border-[var(--color-primary,#d4af37)]'
                      : 'border-transparent hover:border-white/50'
                    }
                    focus:outline-none focus:ring-2 focus:ring-[var(--color-primary,#d4af37)]
                  `}
                  onClick={() => onNavigate(index)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={`View image ${index + 1}`}
                  aria-current={index === currentIndex ? 'true' : 'false'}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                </motion.button>
              ))}
            </div>
          )}

          {/* Mobile swipe hint (shown briefly) */}
          <motion.div
            className="
              absolute bottom-20 left-1/2 -translate-x-1/2 z-10
              px-4 py-2
              bg-white/10 backdrop-blur-sm
              rounded-full
              text-white/70 text-xs
              sm:hidden
            "
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ delay: 2, duration: 0.5 }}
          >
            Swipe to navigate
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
