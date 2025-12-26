import type { Metadata } from 'next';
import {
  WhereToBuyHero,
  StoreShowcase,
  PartnerStoresGrid,
  PartnerCTA,
} from '@/components/stores';
import whereToBuyData from '@/data/content/where-to-buy.json';
import { WhereToBuyContent } from '@/types/content';

export const metadata: Metadata = {
  title: 'Where to Buy | Ruqma - Find Partner Stores',
  description:
    'Discover authorized Ruqma partner stores near you. Experience our products in person with expert consultation and immediate availability at our carefully selected retail locations.',
  openGraph: {
    title: 'Where to Buy | Ruqma - Find Partner Stores',
    description:
      'Discover authorized Ruqma partner stores near you. Experience our products in person with expert consultation.',
    type: 'website',
  },
};

export default function WhereToBuyPage() {
  const content: WhereToBuyContent = whereToBuyData as WhereToBuyContent;

  return (
    <>
      {/* Hero Section - Full viewport with DarkVeil background */}
      <WhereToBuyHero content={content.hero} />

      {/* Store Showcase - Introduction + Features (Dark) */}
      <StoreShowcase
        introduction={content.introduction}
        features={content.features}
      />

      {/* Partner Stores Grid (Light) */}
      <PartnerStoresGrid stores={content.stores} />

      {/* Partner CTA (Dark) */}
      <PartnerCTA content={content.partnerCTA} />
    </>
  );
}
