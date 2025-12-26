'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Initial page loader that shows on first visit
 * Uses sessionStorage to only show once per session
 */
export function InitialLoader() {
  const [isVisible, setIsVisible] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    // Check if we've already shown the loader this session
    const hasLoaded = sessionStorage.getItem('ruqma-loaded');

    if (hasLoaded) {
      setIsVisible(false);
      return;
    }

    // Show loader for minimum time, then hide
    const timer = setTimeout(() => {
      setIsVisible(false);
      sessionStorage.setItem('ruqma-loaded', 'true');
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Don't render on server
  if (!isMounted) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-black"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
          <div className="flex flex-col items-center gap-8">
            {/* Animated Logo/Brand */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <h1
                className="text-5xl md:text-6xl font-semibold tracking-wider"
                style={{ fontFamily: 'var(--font-ibm-plex-sans), sans-serif' }}
              >
                <span className="text-white">RUQM</span>
                <span className="text-[#d4af37]">A</span>
              </h1>
            </motion.div>

            {/* Animated line */}
            <motion.div
              className="h-[2px] bg-[#d4af37] rounded-full"
              initial={{ width: 0 }}
              animate={{ width: 120 }}
              transition={{ duration: 1, ease: 'easeInOut', delay: 0.3 }}
            />

            {/* Tagline */}
            <motion.p
              className="text-white/60 text-sm tracking-widest uppercase"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              style={{ fontFamily: 'var(--font-nunito-sans), sans-serif' }}
            >
              Beyond Ordinary
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default InitialLoader;
