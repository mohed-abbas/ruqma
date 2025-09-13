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
      className={`bg-white overflow-hidden relative rounded-[10px] shadow-[0px_4px_7.2px_0px_rgba(0,0,0,0.25)] w-[542px] h-[552px] ${className}`}
      data-product-id={id}
    >
      {/* Inner card with subtle shadow */}
      <div className="absolute bg-white h-[553px] left-px top-[-1px] w-[541px] rounded-[12px] shadow-[0px_4px_15.8px_0px_rgba(0,0,0,0.1)]" />
      
      {/* Main content container - matching Figma positioning */}
      <div className="absolute flex flex-col gap-[17px] items-start justify-start left-1/2 top-[26px] transform -translate-x-1/2 w-[492px]">
        
        {/* Product image section - matching Figma golden background */}
        <div className="aspect-[492/266] bg-[#d4af37] overflow-hidden relative rounded-[10px] w-full">
          <div className="absolute flex items-center justify-center w-[285px] h-[285px] left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="flex-none scale-y-[-1] w-[285px] h-[285px]">
              <div 
                className="bg-center bg-cover bg-no-repeat w-[285px] h-[285px]"
                style={{ backgroundImage: `url('${imageUrl}')` }}
              />
            </div>
          </div>
        </div>

        {/* Product title - matching Figma typography exactly */}
        <header className="w-[476px]">
          <h2 className="font-[var(--font-ibm)] font-medium text-[39px] leading-[1.2] text-[#2e3340]">
            {name}
          </h2>
        </header>

        {/* Product description - matching Figma text styling */}
        <div className="font-[var(--font-nunito)] font-normal text-[20px] leading-[1.2] text-[#151515] w-[476px]" style={{ fontVariationSettings: "'YTLC' 500, 'wdth' 100" }}>
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

      {/* Arrow button - matching Figma positioning and styling */}
      <Link
        href={href}
        className="absolute left-[484px] top-[494px] w-[58px] h-[58px] bg-[#1e1e1e] rounded-tl-[15px] rounded-tr-[4px] rounded-br-[4px] rounded-bl-[4px] shadow-[0px_4px_6.4px_0px_inset_rgba(0,0,0,0.25)] flex items-center justify-center group hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:ring-offset-2"
        aria-label={`View details for ${name}`}
      >
        <div className="w-10 h-10 flex items-center justify-center">
          <ArrowIcon className="w-full h-full text-white group-hover:scale-110 transition-transform duration-200" />
        </div>
      </Link>
    </article>
  );
}