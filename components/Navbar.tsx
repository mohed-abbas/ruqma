'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { useState } from 'react'

const imgLogo = "/logo.svg";

export default function Navbar() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Products' },
    { href: '/our-story', label: 'Our Story' },
    { href: '/contact', label: 'Contact' },
  ]
  
  return (
    <nav className="flex items-center justify-between w-full px-6 py-4 bg-transparent" role="navigation" aria-label="Main navigation">
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
        <h1 className="font-[var(--font-ibm)] font-extrabold text-[24px] leading-none text-[var(--primary)] w-[89px]">
          Ruqma
        </h1>
      </div>
      
      {/* Navigation links */}
      <div className="hidden md:flex items-center gap-10 text-[16px] text-white">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col justify-center transition-all duration-200 hover:text-[#d4af37]  font-[var(--font-nunito)] font-bold ${
                isActive ? 'text-[#d4af37]' : 'text-white'
              }`}
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
        className="md:hidden p-2 text-white hover:text-[#d4af37] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:ring-offset-2 focus:ring-offset-transparent"
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
        <div className="absolute top-full left-0 right-0 bg-black/95 backdrop-blur-sm md:hidden z-50 border-t border-[#d4af37]/20">
          <div className="px-6 py-4 space-y-3">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block py-3 px-4 rounded-lg text-[16px] transition-all duration-200 hover:bg-[#d4af37]/10 hover:text-[#d4af37] text-[#d4af37]`}
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
