import Image from 'next/image';
import Link from 'next/link';

// Using relative paths for SVG assets that would be placed in the public folder
const logoSrc = "/logo.svg";
const dividerLineSrc = "/divider-line.svg";

const footerLinks = {
  useful: [
    { href: '/', label: 'Home' },
    { href: '#products', label: 'Products' },
    { href: '/where-to-buy', label: 'Where to buy?' },
  ],
  company: [
    { href: '/our-story', label: 'Our Story' },
    { href: '/terms', label: 'Terms of Service' },
    { href: '/privacy', label: 'Privacy Policy' },
  ],
  support: [
    { href: '/contact', label: 'Contact Us' },
    { href: '/live-chat', label: 'Live Chat' },
    { href: '/community', label: 'Community' },
  ],
};

export default function Footer() {
  return (
    <footer 
      className="bg-[var(--footer-bg)] border-t border-gray-200 pt-[60px] md:pt-[60px] pb-5 px-6 md:px-[100px] relative"
    >
      <div className="max-w-[1240px] mx-auto">
        {/* Main Footer Content */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-12 lg:gap-[60px] mb-12 lg:mb-[60px]">
          {/* Brand Section */}
          <section className="max-w-[478px]" aria-labelledby="brand-heading">
            <div className="flex items-center gap-2 mb-8">
              <div className="relative w-[34px] h-10 shrink-0">
                <Image
                  src={logoSrc}
                  alt="Ruqma logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <h2 
                id="brand-heading"
                className="text-[var(--primary)] text-2xl font-bold font-ibm leading-none"
              >
                Ruqma
              </h2>
            </div>
            
            <p className="text-2xl md:text-[36px] leading-[1.5] font-medium font-nunito capitalize">
              <span className="text-[#1e1e1e]">Take It beyond ordinary with our products as </span>
              <span className="text-[var(--primary)] font-bold">Ruqma</span>
              <span className="text-[#1e1e1e]"> makes you feel special.</span>
            </p>
          </section>

          {/* Navigation Links */}
          <nav className="flex flex-col md:flex-row gap-8 md:gap-12 lg:gap-[100px] w-full lg:w-auto" aria-label="Footer navigation">
            {Object.entries(footerLinks).map(([section, links]) => (
              <div className="min-w-[120px]" key={section}>
                <h3 className="text-xl font-medium font-ibm text-black mb-6">
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </h3>
                <ul className="space-y-5 text-gray-500 font-nunito">
                  {links.map(link => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="hover:text-[var(--primary)] transition-colors duration-200 focus:text-[var(--primary)] focus:outline-none"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {/* Bottom Footer Section */}
        <div className="flex flex-col items-center gap-6">
          {/* Divider Line */}
          <div className="w-full h-px bg-gray-200" role="separator" aria-hidden="true">
            
          </div>
          
          {/* Copyright */}
          <p className="text-sm text-gray-800 font-nunito leading-[22px] text-center">
            © 2025 Ruqma. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}