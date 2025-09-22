import Link from 'next/link';
import ArrowIcon from './ArrowIcon';

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  href?: string;
  brand?: string;
  additionalDescription?: string;
  className?: string;
}

export default function ProductCard({
  id,
  name,
  description,
  imageUrl,
  href = '#',
  brand = 'Ruqma',
  additionalDescription = 'Designed to deliver unparalleled tracking and gliding performance for amateurs and gamers alike',
  className = '',
}: ProductCardProps) {
  return (
    <article
      className={`bg-white overflow-hidden relative rounded-[10px] shadow-[var(--ruqma-shadow)]
                  w-full max-w-[542px] mx-auto
                  h-auto min-h-[400px] sm:min-h-[500px] lg:min-h-[552px] ${className}`}
      data-product-id={id}
    >
      {/* Inner card with subtle shadow - responsive positioning */}
      <div className="absolute bg-white
                      inset-0 sm:h-[553px] sm:left-px sm:top-[-1px] sm:w-[500px] md:w-[520px] lg:w-[541px]
                      rounded-[12px] shadow-[0px_4px_15.8px_0px_rgba(0,0,0,0.1)]" />

      {/* Main content container - responsive layout */}
      <div className="relative flex flex-col gap-[17px] items-start justify-start
                      p-4 sm:absolute sm:left-1/2 sm:top-[26px] sm:transform sm:-translate-x-1/2
                      w-full sm:w-[450px] md:w-[480px] lg:w-[492px]">
        
        {/* Product image section - responsive golden background */}
        <div className="aspect-[492/266] bg-[var(--color-primary)] overflow-hidden relative rounded-[10px] w-full">
          <div className="absolute flex items-center justify-center
                          w-full h-full p-4
                          sm:w-[285px] sm:h-[285px] sm:left-1/2 sm:top-1/2 sm:transform sm:-translate-x-1/2 sm:-translate-y-1/2">
            <div className="flex-none scale-y-[-1] w-full h-full max-w-[285px] max-h-[285px]">
              <div
                className="bg-center bg-cover bg-no-repeat w-full h-full"
                style={{ backgroundImage: `url('${imageUrl}')` }}
              />
            </div>
          </div>
        </div>

        {/* Product title - responsive typography */}
        <header className="w-full max-w-[476px]">
          <h2 className="font-[var(--font-ibm)] font-medium
                         text-2xl sm:text-[28px] md:text-[32px] lg:text-[39px]
                         leading-[1.2] text-[#2e3340]">
            {name}
          </h2>
        </header>

        {/* Product description - responsive text styling */}
        <div className="font-[var(--font-nunito)] font-normal
                        text-lg sm:text-[18px] md:text-[19px] lg:text-[20px]
                        leading-[1.2] text-[#151515] w-full max-w-[476px]" style={{ fontVariationSettings: "'YTLC' 500, 'wdth' 100" }}>
          <p className="mb-0">
            <span>{description.split(brand)[0]}</span>
            <span className="font-[var(--font-nunito)] font-bold text-[#d4af37]" style={{ fontVariationSettings: "'YTLC' 500, 'wdth' 100" }}>
              {brand}
            </span>
            <span>{description.split(brand)[1]}</span>
          </p>
          <p className="mt-0">
            {additionalDescription}
          </p>
        </div>
      </div>

      {/* Arrow button - responsive positioning and touch-friendly sizing */}
      <Link
        href={href}
        className="absolute
                    bottom-[0px] right-[0px]
                   w-[48px] h-[48px] sm:w-[58px] sm:h-[58px]
                   bg-[#1e1e1e] rounded-tl-[15px] rounded-tr-[4px] rounded-br-[4px] rounded-bl-[4px]
                   shadow-[0 4px 15.8px 0 rgba(0, 0, 0, 0.10)]
                   flex items-center justify-center group
                   hover:bg-gray-700 transition-colors duration-200
                   focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:ring-offset-2"
        aria-label={`View details for ${name}`}
      >
        <div className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center">
          <ArrowIcon className="w-6 h-6 sm:w-8 sm:h-8 text-white group-hover:scale-110 transition-transform duration-200" />
        </div>
      </Link>
    </article>
  );
}