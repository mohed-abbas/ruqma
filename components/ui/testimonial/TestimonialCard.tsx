import Image from 'next/image';
import { TestimonialCardProps } from './types';
import StarRating from './StarRating';
import { getCardDimensions, getGridClasses } from './utils';

export default function TestimonialCard({
  id,
  name,
  company,
  rating,
  text,
  avatar,
  cardType,
  className = '',
  style = {}
}: TestimonialCardProps) {
  // Use the cardType directly from the data - no auto-detection
  const finalCardType = cardType;

  // Layout variations based on card type with Figma-accurate positioning
  const getCardLayout = (cardType: 'tall' | 'wide' | 'compact') => {
    switch (cardType) {
      case 'tall':
        // Full-width image above text, left-aligned content
        return {
          container: 'flex flex-col',
          contentPadding: 'p-[25px]',
          avatarSection: 'mb-[20px]', // Full width image at top
          textSection: 'mb-[20px]',
          userInfoSection: 'mt-auto', // Push to bottom
          userInfoLayout: 'flex flex-col items-start text-left', // Left-aligned
          avatarSize: 'w-full h-[250px]', // Full width, max 250px height
          showAvatarInContent: false // Avatar shown at top
        };
      case 'wide':
        return {
          container: 'flex flex-col',
          contentPadding: 'p-[20px] pl-[320px]',
          avatarSection: '',
          textSection: 'mb-[20px]',
          userInfoSection: '',
          userInfoLayout: 'flex flex-row gap-[15px] items-center',
          avatarSize: 'w-[53px] h-[53px]',
          showAvatarInContent: false // Background image used
        };
      case 'compact':
        return {
          container: 'flex flex-col',
          contentPadding: 'p-[25px]',
          avatarSection: '',
          textSection: 'mb-[15px]',
          userInfoSection: '',
          userInfoLayout: 'flex flex-row gap-[14px] items-center',
          avatarSize: 'w-[46px] h-[46px]',
          showAvatarInContent: true // Avatar beside name
        };
    }
  };

  const layout = getCardLayout(finalCardType);

  return (
    <article
      className={`
        ${getCardDimensions(finalCardType)}
        ${getGridClasses(finalCardType)}
        bg-white
        rounded-[15.36px]
        border border-[#e9ecf2]
        relative
        overflow-hidden
        ${className}
      `}
      style={style}
      data-testimonial-id={id}
      data-card-type={finalCardType}
    >
      {/* Background image for wide cards with person photo */}
      {finalCardType === 'wide' && (
        <div className="absolute left-0 top-0 w-[296px] h-full">
          <div
            className="w-full h-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${avatar})`,
            }}
          />
        </div>
      )}

      {/* Content container */}
      <div className={`${layout.container} h-full ${layout.contentPadding}`}>
        {/* Avatar section for tall cards - positioned at top */}
        {finalCardType === 'tall' && (
          <div className={layout.avatarSection}>
            <div className={`${layout.avatarSize} relative shrink-0 overflow-hidden`}>
              <Image
                src={avatar}
                alt={`${name} profile picture`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 291px"
              />
            </div>
          </div>
        )}

        {/* Testimonial text */}
        <div className={layout.textSection}>
          <p
            className="text-[14px] leading-[1.5] text-[#232527]"
            style={{
              fontFamily: 'var(--font-nunito)',
              fontVariationSettings: "'YTLC' 500, 'wdth' 100"
            }}
          >
            {text}
          </p>
        </div>

        {/* User info section */}
        <div className={`${layout.userInfoSection} ${layout.userInfoLayout}`}>
          {/* Avatar for compact cards only - beside name */}
          {layout.showAvatarInContent && (
            <div className={`${layout.avatarSize} relative shrink-0 rounded-full overflow-hidden`}>
              <Image
                src={avatar}
                alt={`${name} profile picture`}
                fill
                className="object-cover"
                sizes="60px"
              />
            </div>
          )}

          {/* Name, company and rating */}
          <div className="flex flex-col">
            <div className="mb-[7.68px]">
              <p className="font-['Poppins'] text-[13.44px] leading-normal text-[#293238]">
                <span className="font-bold">{name}</span>
                <br />
                <span className="text-[#7d7a7a] font-normal">{company}</span>
              </p>
            </div>
            <StarRating rating={rating} className="w-[77.78px]" />
          </div>
        </div>
      </div>
    </article>
  );
}