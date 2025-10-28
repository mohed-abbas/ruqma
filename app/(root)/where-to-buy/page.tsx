import type { Metadata } from 'next';
import {
  WhereToBuyHero,
  StoreIntroduction,
  StoreLocator,
  PartnerStoresGrid,
  StoreFeaturesGrid,
  PartnerCTA
} from '@/components/stores';
import whereToBuyData from '@/data/content/where-to-buy.json';
import { WhereToBuyContent } from '@/types/content';

export const metadata: Metadata = {
  title: 'Where to Buy | Ruqma - Find Partner Stores',
  description: 'Discover authorized Ruqma partner stores near you. Experience our products in person with expert consultation and immediate availability at our carefully selected retail locations.',
  openGraph: {
    title: 'Where to Buy | Ruqma - Find Partner Stores',
    description: 'Discover authorized Ruqma partner stores near you. Experience our products in person with expert consultation.',
    type: 'website',
  },
};

export default function WhereToBuyPage() {
  const content: WhereToBuyContent = whereToBuyData as WhereToBuyContent;

  return (
    <>
      <WhereToBuyHero content={content.hero} />
      <StoreIntroduction content={content.introduction} />
      <StoreLocator content={content.storeLocator} />
      <PartnerStoresGrid stores={content.stores} />
      <StoreFeaturesGrid features={content.features} />
      <PartnerCTA content={content.partnerCTA} />
    </>
  );
}
