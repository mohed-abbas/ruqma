'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import navigationData from '@/data/navigation/main-nav.json';

// TypeScript interfaces for navigation data
interface NavigationItem {
  href: string;
  label: string;
  isExternal: boolean;
  isActive: boolean;
}

interface NavigationCTA {
  label: string;
  href: string;
  isExternal: boolean;
}

interface NavigationSettings {
  scrollThreshold: number;
  activeOffset: number;
  mobileBreakpoint: number;
}

interface NavigationData {
  items: NavigationItem[];
  cta: NavigationCTA;
  settings: NavigationSettings;
}

interface NavbarState {
  isMobileMenuOpen: boolean;
  isScrolled: boolean;
  activeSection: string;
}

export default function Navbar() {
  const [state, setState] = useState<NavbarState>({
    isMobileMenuOpen: false,
    isScrolled: false,
    activeSection: 'hero'
  });

  const navData = navigationData as NavigationData;

  // Removed GSAP refs as parallax effects are no longer used

  // Handle scroll effect for navbar background and active section detection
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const threshold = navData.settings.scrollThreshold;
      const offset = navData.settings.activeOffset;

      // Detect active section
      let activeSection = 'hero';
      for (const item of navData.items) {
        if (item.href.startsWith('#')) {
          const element = document.querySelector(item.href);
          if (element) {
            const rect = element.getBoundingClientRect();
            const elementTop = rect.top + scrollY;
            if (scrollY >= elementTop - offset) {
              activeSection = item.href.replace('#', '');
            }
          }
        }
      }

      setState(prev => ({
        ...prev,
        isScrolled: scrollY > threshold,
        activeSection
      }));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [navData.settings.scrollThreshold, navData.settings.activeOffset, navData.items]);

  // Enhanced Accessibility and Performance
  useEffect(() => {
    // Keyboard navigation support
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && state.isMobileMenuOpen) {
        setState(prev => ({ ...prev, isMobileMenuOpen: false }));
      }

      // Focus management for mobile menu
      if (event.key === 'Tab' && state.isMobileMenuOpen) {
        const focusableElements = document.querySelectorAll(
          '[data-mobile-menu] button, [data-mobile-menu] a, [data-mobile-menu] [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (event.shiftKey && document.activeElement === firstElement) {
          event.preventDefault();
          lastElement?.focus();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
          event.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [state.isMobileMenuOpen]);

  // Handle smooth scroll to sections
  const handleNavigation = (href: string, isExternal: boolean) => {
    if (isExternal) {
      // Handle external links (routes)
      window.location.href = href;
    } else if (href.startsWith('#')) {
      // Handle internal section scrolling
      const element = document.querySelector(href);
      if (element) {
        const navbarHeight = navData.settings.activeOffset;
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - navbarHeight;

        window.scrollTo({
          top: Math.max(0, offsetPosition),
          behavior: 'smooth'
        });
      }
    }

    // Close mobile menu
    setState(prev => ({ ...prev, isMobileMenuOpen: false }));
  };

  // Handle CTA button click
  const handleCTAClick = () => {
    if (navData.cta.isExternal) {
      window.location.href = navData.cta.href;
    }
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setState(prev => ({ ...prev, isMobileMenuOpen: !prev.isMobileMenuOpen }));
  };

  // Enhanced mobile menu animation variants
  const mobileMenuVariants = {
    closed: {
      x: '100%',
      scale: 0.95,
      opacity: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 600,
        damping: 40,
        when: 'afterChildren'
      }
    },
    open: {
      x: 0,
      scale: 1,
      opacity: 1,
      transition: {
        type: 'spring' as const,
        stiffness: 500,
        damping: 50,
        when: 'beforeChildren',
        staggerChildren: 0.08
      }
    }
  };

  const menuItemVariants = {
    closed: {
      x: 60,
      opacity: 0,
      scale: 0.8,
      transition: {
        type: 'spring' as const,
        stiffness: 300,
        damping: 30
      }
    },
    open: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring' as const,
        stiffness: 400,
        damping: 25
      }
    }
  };

  const backdropVariants = {
    closed: {
      opacity: 0,
      backdropFilter: 'blur(0px)',
      transition: {
        duration: 0.3,
        ease: 'easeInOut' as const
      }
    },
    open: {
      opacity: 1,
      backdropFilter: 'blur(8px)',
      transition: {
        duration: 0.4,
        ease: 'easeInOut' as const
      }
    }
  };

  // Smooth CTA button animation variants for mobile menu
  const ctaButtonVariants = {
    closed: {
      y: 40,
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: [0.4, 0.0, 0.2, 1] as const // Tailwind's ease-out equivalent
      }
    },
    open: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: [0.0, 0.0, 0.2, 1] as const, // Tailwind's ease-out equivalent
        delay: 0.1 // Slight delay after menu items for polished feel
      }
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <nav
        className={`
          transition-all duration-300 ease-in-out
          ${state.isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-lg'
            : 'bg-transparent'
          }
        `}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`
            flex items-center justify-between transition-all duration-300
            ${state.isScrolled ? 'h-14' : 'h-20'}
          `}>

            {/* Logo Section */}
            <div className="flex items-center space-x-3">
              <Link
                href="/"
                className="flex items-center space-x-3 hover:opacity-80 transition-opacity duration-200"
                aria-label="Ruqma - Go to homepage"
              >
                <div className={`
                  relative flex-shrink-0 transition-all duration-300
                  ${state.isScrolled ? 'w-6 h-7' : 'w-8 h-9'}
                `}>
                  <Image
                    src="/logo.svg"
                    alt="Ruqma logo"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
                <span
                  className={`
                    font-[var(--font-ibm)] transition-all duration-300
                    ${state.isScrolled
                      ? 'text-xl text-[var(--color-primary)]'
                      : 'text-2xl text-[var(--color-primary)]'
                    }
                  `}
                  style={{ fontWeight: 'bold' }}
                >
                  Ruqma
                </span>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center space-x-8">
              {navData.items.map((item, index) => {
                const isCurrentActive = item.href === `#${state.activeSection}`;
                return (
                  <button
                    key={index}
                    onClick={() => handleNavigation(item.href, item.isExternal)}
                    className={`
                      font-[var(--font-nunito)] transition-all duration-300
                      focus:outline-none
                      ${state.isScrolled
                        ? 'text-sm px-2 py-1 text-gray-900 hover:text-[var(--color-primary)]'
                        : 'text-base px-3 py-2 text-white hover:text-[var(--color-primary)]'
                      }
                      ${isCurrentActive ? 'text-[var(--color-primary)]' : ''}
                    `}
                    style={{ fontWeight: '500' }}
                    aria-current={isCurrentActive ? 'page' : undefined}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>

            {/* CTA Button */}
            <div className="hidden lg:flex items-center">
              <button
                onClick={handleCTAClick}
                className={`
                  bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90
                  text-black font-[var(--font-nunito)] rounded-full
                  transition-all duration-300
                  hover:shadow-lg hover:shadow-[var(--color-primary)]/20
                  focus:outline-none whitespace-nowrap
                  ${state.isScrolled
                    ? 'px-4 py-2 text-sm'
                    : 'px-6 py-3 text-base'
                  }
                `}
                style={{ fontWeight: '600' }}
                aria-label={`${navData.cta.label} - Find where to buy Ruqma products`}
              >
                {navData.cta.label}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <button
                onClick={toggleMobileMenu}
                className={`
                  transition-colors duration-200 p-2 rounded-lg
                  focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2
                  ${state.isScrolled
                    ? 'text-gray-900 hover:text-[var(--color-primary)] focus:ring-offset-white'
                    : 'text-white hover:text-[var(--color-primary)] focus:ring-offset-transparent'
                  }
                `}
                aria-label={state.isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={state.isMobileMenuOpen}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {state.isMobileMenuOpen ? (
                    <path d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {state.isMobileMenuOpen && (
          <>
            {/* Enhanced Backdrop */}
            <motion.div
              variants={backdropVariants}
              initial="closed"
              animate="open"
              exit="closed"
              onClick={() => setState(prev => ({ ...prev, isMobileMenuOpen: false }))}
              className="fixed inset-0 bg-black/30 z-40 lg:hidden"
            />

            {/* Enhanced Mobile Menu with Drag Gestures */}
            <motion.div
              variants={mobileMenuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              drag="x"
              dragConstraints={{ left: 0, right: 300 }}
              dragElastic={{ left: 0, right: 0.2 }}
              onDragEnd={(_, info) => {
                if (info.offset.x > 100) {
                  setState(prev => ({ ...prev, isMobileMenuOpen: false }));
                }
              }}
              className="
                fixed top-0 right-0 h-full w-80 max-w-[80vw]
                bg-white shadow-2xl z-50 lg:hidden
                flex flex-col cursor-grab active:cursor-grabbing
                rounded-l-2xl overflow-hidden
              "
              style={{
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05)'
              }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="mobile-menu-title"
              data-mobile-menu
            >
              {/* Mobile Menu Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="relative w-8 h-9 flex-shrink-0">
                    <Image
                      src="/logo.svg"
                      alt="Ruqma logo"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <span
                    id="mobile-menu-title"
                    className="text-xl text-[var(--color-primary)] font-[var(--font-ibm)]"
                    style={{ fontWeight: 'bold' }}
                  >
                    Ruqma
                  </span>
                </div>
                <button
                  onClick={() => setState(prev => ({ ...prev, isMobileMenuOpen: false }))}
                  className="text-gray-500 hover:text-gray-700 transition-colors duration-200 p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2"
                  aria-label="Close navigation menu"
                  autoFocus
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Enhanced Mobile Menu Items */}
              <motion.div
                className="flex-1 py-6"
                variants={{
                  open: {
                    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
                  },
                  closed: {
                    transition: { staggerChildren: 0.05, staggerDirection: -1 }
                  }
                }}
              >
                {navData.items.map((item, index) => (
                  <motion.button
                    key={index}
                    variants={menuItemVariants}
                    whileHover={{
                      scale: 1.02,
                      x: 8,
                      transition: { type: 'spring', stiffness: 400, damping: 25 }
                    }}
                    whileTap={{
                      scale: 0.98,
                      transition: { type: 'spring', stiffness: 600, damping: 30 }
                    }}
                    onClick={() => handleNavigation(item.href, item.isExternal)}
                    className={`
                      block w-full text-left px-6 py-4 rounded-r-xl mx-2
                      font-[var(--font-nunito)]
                      transition-colors duration-200
                      border-l-4 border-transparent hover:border-[var(--color-primary)]
                      ${item.isActive
                        ? 'text-[var(--color-primary)] border-[var(--color-primary)] bg-[var(--color-primary)]/10'
                        : 'text-gray-900 hover:text-[var(--color-primary)] hover:bg-gray-50'
                      }
                    `}
                    style={{ fontWeight: '500' }}
                  >
                    <span className="flex items-center justify-between">
                      {item.label}
                      {item.isExternal && (
                        <motion.svg
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 + 0.3 }}
                          className="w-4 h-4 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </motion.svg>
                      )}
                    </span>
                  </motion.button>
                ))}
              </motion.div>

              {/* Enhanced Mobile CTA Button */}
              <motion.div
                className="p-6 border-t border-gray-200"
                variants={ctaButtonVariants}
              >
                <motion.button
                  whileHover={{
                    scale: 1.02,
                    transition: {
                      duration: 0.2,
                      ease: [0.0, 0.0, 0.2, 1] // Smooth ease-out for hover
                    }
                  }}
                  whileTap={{
                    scale: 0.98,
                    transition: {
                      duration: 0.15,
                      ease: [0.4, 0.0, 0.6, 1] // Quick ease for tap
                    }
                  }}
                  onClick={handleCTAClick}
                  className="
                    w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90
                    text-black font-[var(--font-nunito)]
                    px-6 py-4 rounded-full
                    transition-all duration-200
                    hover:shadow-lg hover:shadow-[var(--color-primary)]/20
                    text-center focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2
                    motion-reduce:transition-none motion-reduce:transform-none
                  "
                  style={{ fontWeight: '600' }}
                  aria-label={`${navData.cta.label} - Find where to buy Ruqma products`}
                >
                  {navData.cta.label}
                </motion.button>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}