'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { useState, useEffect } from 'react'

const imgLogo = "/logo.svg";

export default function Navbar() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [currentSection, setCurrentSection] = useState('hero')
  
  const navItems = [
    { href: '#hero', label: 'Home', type: 'scroll' },
    { href: '#products', label: 'Products', type: 'scroll' },
    { href: '/our-story', label: 'Our Story', type: 'page' },
    { href: '/contact', label: 'Contact', type: 'page' },
  ]

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId.replace('#', ''));
    if (element) {
      const navHeight = 80; // Fixed navbar height
      let scrollOffset = navHeight;
      
      // Add enhanced offset for sections that need visual prominence
      if (sectionId === 'products') {
        // Additional offset to show more of Products white background
        scrollOffset += 200; // Total offset: 280px
      }
      // Future sections can be added here with custom offsets
      
      const elementPosition = element.offsetTop - scrollOffset;
      
      window.scrollTo({
        top: Math.max(0, elementPosition), // Prevent negative scroll
        behavior: 'smooth'
      });
    }
  };

  const handleNavClick = (item: typeof navItems[0]) => {
    if (item.type === 'scroll') {
      scrollToSection(item.href);
    }
    // For page navigation, let Next.js handle it normally
  };

  // Scroll detection for adaptive text colors
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'products'];
      const navHeight = 80;
      
      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          // Check if section is in view (accounting for navbar height)
          if (rect.top <= navHeight && rect.bottom > navHeight) {
            setCurrentSection(sectionId);
            break;
          }
        }
      }
    };

    // Set initial section
    handleScroll();
    
    // Add scroll listener
    window.addEventListener('scroll', handleScroll);
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Define colors based on current section
  const getTextColors = () => {
    switch (currentSection) {
      case 'hero':
        return {
          textColor: 'text-white',
          logoColor: 'text-[var(--primary)]',
          hoverColor: 'hover:text-[var(--primary)]',
          mobileIconColor: 'text-white'
        };
      case 'products':
        return {
          textColor: 'text-gray-900',
          logoColor: 'text-[var(--primary)]',
          hoverColor: 'hover:text-[var(--primary)]',
          mobileIconColor: 'text-gray-900'
        };
      default:
        return {
          textColor: 'text-white',
          logoColor: 'text-[var(--primary)]',
          hoverColor: 'hover:text-[var(--primary)]',
          mobileIconColor: 'text-white'
        };
    }
  };

  const colors = getTextColors();
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between w-full px-6 py-4 transition-colors duration-300" role="navigation" aria-label="Main navigation">
      {/* Logo section */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="relative w-[34px] h-10">
          <Image
            src={imgLogo}
            alt="Ruqma logo"
            fill
            className="object-contain"
            priority
          />
        </div>
        <h1 className={`font-extrabold text-[24px] leading-none ${colors.logoColor} w-[89px] transition-colors duration-300`} style={{ fontFamily: 'var(--font-ibm)' }}>
          Ruqma
        </h1>
      </div>
      
      {/* Navigation links */}
      <div className={`hidden md:flex items-center gap-10 text-[16px] ${colors.textColor} transition-colors duration-300`}>
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.type === 'scroll' && pathname === '/')
          
          if (item.type === 'scroll') {
            return (
              <button
                key={item.href}
                onClick={() => handleNavClick(item)}
                className={`flex flex-col justify-center transition-all duration-300 ${colors.hoverColor} font-bold ${
                  isActive ? 'text-[var(--primary)]' : colors.textColor
                }`}
                style={{ fontFamily: 'var(--font-nunito)' }}
                aria-current={isActive ? 'page' : undefined}
              >
                <span className="leading-[1.5] whitespace-nowrap">
                  {item.label}
                </span>
              </button>
            )
          }
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col justify-center transition-all duration-300 ${colors.hoverColor} font-bold ${
                isActive ? 'text-[var(--primary)]' : colors.textColor
              }`}
              style={{ fontFamily: 'var(--font-nunito)' }}
              aria-current={isActive ? 'page' : undefined}
            >
              <span className="leading-[1.5] whitespace-nowrap">
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
      
      {/* CTA Button */}
      <button 
        className="bg-[#d4af37] hover:bg-[#b8951f] transition-colors duration-200 px-6 py-3 rounded-[52px] relative overflow-hidden shrink-0 group focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:ring-offset-2 focus:ring-offset-transparent"
        aria-label="Find where to buy Ruqma products"
      >
        <span className="capitalize text-[14px] leading-[22px] text-black relative z-10 font-bold">
          Where to buy ?
        </span>
        <div className="absolute inset-0 pointer-events-none shadow-[0px_-4px_5.8px_0px_inset_rgba(161,161,161,0.25),0px_4px_2.6px_0px_inset_rgba(255,255,255,0.25)] group-hover:shadow-[0px_-2px_3px_0px_inset_rgba(161,161,161,0.25),0px_2px_1px_0px_inset_rgba(255,255,255,0.25)] transition-shadow duration-200" />
      </button>
      
      {/* Mobile menu button */}
      <button 
        className={`md:hidden p-2 ${colors.mobileIconColor} ${colors.hoverColor} transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:ring-offset-2 focus:ring-offset-transparent`}
        aria-label="Toggle mobile menu"
        aria-expanded={isMobileMenuOpen}
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <svg 
          className="w-6 h-6" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          {isMobileMenuOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-black/95 backdrop-blur-sm md:hidden z-50">
          <div className="px-6 py-4 space-y-3">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.type === 'scroll' && pathname === '/')
              
              if (item.type === 'scroll') {
                return (
                  <button
                    key={item.href}
                    onClick={() => {
                      handleNavClick(item);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`block w-full text-left py-3 px-4 rounded-lg text-[16px] transition-all duration-300 hover:bg-[#d4af37]/10 hover:text-[var(--primary)] ${
                      isActive ? 'text-[var(--primary)]' : colors.textColor
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {item.label}
                  </button>
                )
              }
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block py-3 px-4 rounded-lg text-[16px] transition-all duration-300 hover:bg-[#d4af37]/10 hover:text-[var(--primary)] ${
                    isActive ? 'text-[var(--primary)]' : colors.textColor
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              )
            })}
            <div className="pt-4 border-t border-[#d4af37]/20">
              <button 
                className="w-full bg-[#d4af37] hover:bg-[#b8951f] transition-colors duration-200 px-6 py-3 rounded-[52px] relative overflow-hidden group focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:ring-offset-2 focus:ring-offset-black"
                aria-label="Find where to buy Ruqma products"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="capitalize text-[14px] leading-[22px] text-black relative z-10">
                  Where to buy ?
                </span>
                <div className="absolute inset-0 pointer-events-none shadow-[0px_-4px_5.8px_0px_inset_rgba(161,161,161,0.25),0px_4px_2.6px_0px_inset_rgba(255,255,255,0.25)] group-hover:shadow-[0px_-2px_3px_0px_inset_rgba(161,161,161,0.25),0px_2px_1px_0px_inset_rgba(255,255,255,0.25)] transition-shadow duration-200" />
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
