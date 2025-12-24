import Link from 'next/link';
import ArrowIcon from './ArrowIcon';

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  href?: string;
  brand?: string;
  className?: string;
  index?: number;
}

// Truncate text to max words with ellipsis
function truncateWords(text: string, maxWords: number): string {
  const words = text.split(/\s+/);
  if (words.length <= maxWords) return text;
  return words.slice(0, maxWords).join(' ') + '...';
}

export default function ProductCard({
  id,
  name,
  description,
  imageUrl,
  href = '#',
  brand = 'Ruqma',
  className = '',
  index = 0,
}: ProductCardProps) {
  // Stagger delay: 150ms per card for smooth sequential reveal
  const animationDelay = `${index * 150}ms`;

  // Truncate description to 30 words max
  const truncatedText = truncateWords(description, 30);

  return (
    <article
      className={`group bg-white overflow-hidden relative rounded-[10px] shadow-[0px_4px_7.2px_0px_rgba(0,0,0,0.25)]
                  w-full max-w-[542px] mx-auto lg:mx-0
                  h-auto min-h-[400px] sm:min-h-[480px] lg:min-h-[552px] lg:h-[552px]
                  cursor-pointer transition-transform duration-300 hover:scale-[1.02]
                  product-card-animate ${className}`}
      style={{ animationDelay }}
      data-product-id={id}
    >
      {/* Clickable card overlay - entire card is now clickable */}
      <Link
        href={href}
        className="absolute inset-0 z-10"
        aria-label={`View details for ${name}`}
      >
        <span className="sr-only">View {name} product details</span>
      </Link>

      {/* Inner card with subtle shadow - responsive positioning */}
      <div className="absolute bg-white inset-0
                      lg:h-[553px] lg:left-px lg:top-[-1px] lg:w-[541px]
                      rounded-[12px] shadow-[0px_4px_15.8px_0px_rgba(0,0,0,0.1)]
                      transition-shadow duration-300 group-hover:shadow-[0px_8px_25px_0px_rgba(0,0,0,0.15)]" />

      {/* Main content container - responsive layout */}
      <div className="relative flex flex-col gap-3 sm:gap-[17px] items-start
                      p-4 sm:p-5
                      lg:absolute lg:left-1/2 lg:top-[26px] lg:-translate-x-1/2 lg:p-0
                      w-full lg:w-[492px]
                      pointer-events-none">

        {/* Product image section - responsive golden background */}
        <div className="aspect-[492/266] bg-[var(--color-primary)] overflow-hidden relative rounded-[10px] w-full">
          <div className="absolute flex items-center justify-center left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                          w-[180px] h-[180px] sm:w-[220px] sm:h-[220px] lg:w-[285px] lg:h-[285px]">
            <div
              className="bg-center bg-cover bg-no-repeat w-full h-full"
              style={{ backgroundImage: `url('${imageUrl}')` }}
            />
          </div>
        </div>

        {/* Product title - responsive typography */}
        <header className="w-full lg:w-[476px]">
          <h2 className="font-[var(--font-ibm)] font-medium
                         text-2xl sm:text-[32px] lg:text-[39px]
                         leading-[1.2] text-[#2e3340]">
            {name}
          </h2>
        </header>

        {/* Product description - responsive text styling */}
        <div className="font-[var(--font-nunito)] font-normal
                        text-base sm:text-lg lg:text-[20px]
                        leading-[1.3] lg:leading-[1.2] text-[#151515]
                        w-full lg:w-[476px] pr-12 sm:pr-14 lg:pr-16"
             style={{ fontVariationSettings: "'YTLC' 500, 'wdth' 100" }}>
          {/* Render truncated text with brand highlighting */}
          {truncatedText.includes(brand) ? (
            <p className="mb-0">
              <span>{truncatedText.split(brand)[0]}</span>
              <span className="font-[var(--font-nunito)] font-bold text-[#d4af37]"
                    style={{ fontVariationSettings: "'YTLC' 500, 'wdth' 100" }}>
                {brand}
              </span>
              <span>{truncatedText.split(brand)[1]}</span>
            </p>
          ) : (
            <p className="mb-0">{truncatedText}</p>
          )}
        </div>
      </div>

      {/* Arrow indicator - visual only, click handled by card overlay */}
      <div
        className="absolute z-20 bottom-0 right-0
                   w-[48px] h-[48px] sm:w-[54px] sm:h-[54px] lg:w-[58px] lg:h-[58px]
                   bg-[#1e1e1e] rounded-tl-[15px] rounded-tr-[4px] rounded-br-[4px] rounded-bl-[4px]
                   shadow-[inset_0px_4px_6.4px_0px_rgba(0,0,0,0.25)]
                   flex items-center justify-center
                   pointer-events-none
                   transition-colors duration-200
                   group-hover:bg-gray-700"
        aria-hidden="true"
      >
        <ArrowIcon className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 transition-transform duration-200 group-hover:scale-110" />
      </div>
    </article>
  );
}
