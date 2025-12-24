'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
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
  const prefersReducedMotion = useReducedMotion();

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
        // On homepage - scroll directly to section
        element.scrollIntoView({ behavior: 'smooth' });
      } else {
        // Not on homepage - navigate to homepage with hash anchor
        window.location.href = '/' + href;
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

  // Modern slide + fade animation variants (Option A)
  // Using expo-out easing for smooth, professional feel
  const easeOutExpo = [0.16, 1, 0.3, 1] as const;
  const easeInOutQuart = [0.76, 0, 0.24, 1] as const;

  // Reduced motion variants - instant transitions
  const reducedMotionTransition = { duration: 0.01 };

  const mobileMenuVariants = {
    closed: {
      x: prefersReducedMotion ? 0 : '100%',
      opacity: 0,
      transition: prefersReducedMotion ? reducedMotionTransition : {
        duration: 0.3,
        ease: easeInOutQuart,
        when: 'afterChildren'
      }
    },
    open: {
      x: 0,
      opacity: 1,
      transition: prefersReducedMotion ? reducedMotionTransition : {
        duration: 0.4,
        ease: easeOutExpo,
        when: 'beforeChildren',
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  };

  const menuItemVariants = {
    closed: {
      y: prefersReducedMotion ? 0 : 16,
      opacity: 0,
      transition: prefersReducedMotion ? reducedMotionTransition : {
        duration: 0.2,
        ease: easeInOutQuart
      }
    },
    open: {
      y: 0,
      opacity: 1,
      transition: prefersReducedMotion ? reducedMotionTransition : {
        duration: 0.3,
        ease: easeOutExpo
      }
    }
  };

  const backdropVariants = {
    closed: {
      opacity: 0,
      transition: prefersReducedMotion ? reducedMotionTransition : {
        duration: 0.25,
        ease: 'easeOut' as const
      }
    },
    open: {
      opacity: 1,
      transition: prefersReducedMotion ? reducedMotionTransition : {
        duration: 0.35,
        ease: 'easeOut' as const
      }
    }
  };

  // CTA button slides up with slight delay for polished sequencing
  const ctaButtonVariants = {
    closed: {
      y: prefersReducedMotion ? 0 : 20,
      opacity: 0,
      transition: prefersReducedMotion ? reducedMotionTransition : {
        duration: 0.2,
        ease: easeInOutQuart
      }
    },
    open: {
      y: 0,
      opacity: 1,
      transition: prefersReducedMotion ? reducedMotionTransition : {
        duration: 0.4,
        ease: easeOutExpo,
        delay: 0.15
      }
    }
  };

  // Hamburger animation duration (respects reduced motion)
  const hamburgerTransition = prefersReducedMotion
    ? { duration: 0.01 }
    : { duration: 0.3, ease: easeOutExpo };

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

            {/* Mobile Menu Button - Animated Hamburger */}
            <div className="lg:hidden">
              <button
                onClick={toggleMobileMenu}
                className={`
                  relative w-10 h-10 flex items-center justify-center rounded-lg
                  transition-colors duration-200
                  focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2
                  ${state.isScrolled
                    ? 'text-gray-900 hover:text-[var(--color-primary)] focus:ring-offset-white'
                    : 'text-white hover:text-[var(--color-primary)] focus:ring-offset-transparent'
                  }
                `}
                aria-label={state.isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={state.isMobileMenuOpen}
              >
                <div className="w-6 h-5 relative flex flex-col justify-between">
                  {/* Top bar */}
                  <motion.span
                    className={`
                      block h-0.5 rounded-full origin-center
                      ${state.isScrolled ? 'bg-gray-900' : 'bg-white'}
                    `}
                    animate={{
                      rotate: state.isMobileMenuOpen ? 45 : 0,
                      y: state.isMobileMenuOpen ? 9 : 0,
                      backgroundColor: state.isMobileMenuOpen
                        ? 'rgb(17 24 39)'
                        : state.isScrolled ? 'rgb(17 24 39)' : 'rgb(255 255 255)'
                    }}
                    transition={hamburgerTransition}
                  />
                  {/* Middle bar */}
                  <motion.span
                    className={`
                      block h-0.5 rounded-full
                      ${state.isScrolled ? 'bg-gray-900' : 'bg-white'}
                    `}
                    animate={{
                      opacity: state.isMobileMenuOpen ? 0 : 1,
                      scaleX: state.isMobileMenuOpen ? 0 : 1
                    }}
                    transition={prefersReducedMotion ? reducedMotionTransition : { duration: 0.2, ease: 'easeOut' }}
                  />
                  {/* Bottom bar */}
                  <motion.span
                    className={`
                      block h-0.5 rounded-full origin-center
                      ${state.isScrolled ? 'bg-gray-900' : 'bg-white'}
                    `}
                    animate={{
                      rotate: state.isMobileMenuOpen ? -45 : 0,
                      y: state.isMobileMenuOpen ? -9 : 0,
                      backgroundColor: state.isMobileMenuOpen
                        ? 'rgb(17 24 39)'
                        : state.isScrolled ? 'rgb(17 24 39)' : 'rgb(255 255 255)'
                    }}
                    transition={hamburgerTransition}
                  />
                </div>
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

            {/* Mobile Menu Panel - Clean Slide Animation */}
            <motion.div
              variants={mobileMenuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="
                fixed top-0 right-0 h-full w-80 max-w-[85vw]
                bg-white z-50 lg:hidden
                flex flex-col overflow-hidden
              "
              style={{
                boxShadow: '-4px 0 24px rgba(0, 0, 0, 0.12)'
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

              {/* Mobile Menu Items - Clean Staggered Reveal */}
              <motion.nav
                className="flex-1 py-4"
                aria-label="Mobile navigation"
              >
                {navData.items.map((item, index) => (
                  <motion.button
                    key={index}
                    variants={menuItemVariants}
                    onClick={() => handleNavigation(item.href, item.isExternal)}
                    className={`
                      block w-full text-left px-6 py-4
                      font-[var(--font-nunito)] text-lg
                      transition-colors duration-200
                      ${item.isActive
                        ? 'text-[var(--color-primary)] bg-[var(--color-primary)]/5'
                        : 'text-gray-900 hover:text-[var(--color-primary)] hover:bg-gray-50 active:bg-gray-100'
                      }
                    `}
                    style={{ fontWeight: '500' }}
                  >
                    <span className="flex items-center justify-between">
                      {item.label}
                      {item.isExternal && (
                        <svg
                          className="w-4 h-4 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      )}
                    </span>
                  </motion.button>
                ))}
              </motion.nav>

              {/* Mobile CTA Button */}
              <motion.div
                className="p-6 border-t border-gray-100"
                variants={ctaButtonVariants}
              >
                <button
                  onClick={handleCTAClick}
                  className="
                    w-full bg-[var(--color-primary)]
                    text-black font-[var(--font-nunito)]
                    px-6 py-4 rounded-full text-lg
                    transition-all duration-200
                    hover:brightness-110 active:scale-[0.98]
                    focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2
                    motion-reduce:transition-none motion-reduce:transform-none
                  "
                  style={{ fontWeight: '600' }}
                  aria-label={`${navData.cta.label} - Find where to buy Ruqma products`}
                >
                  {navData.cta.label}
                </button>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}