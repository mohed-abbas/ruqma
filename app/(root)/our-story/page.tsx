import type { Metadata } from 'next';
import {
  OurStoryHero,
  StoryIntroduction,
  ValuesGrid,
  Timeline,
  Craftsmanship,
  StoryCTA
} from '@/components/about';
import storyData from '@/data/content/our-story.json';
import { OurStoryContent } from '@/types/content';

export const metadata: Metadata = {
  title: 'Our Story | Ruqma - Beyond Ordinary',
  description: 'Discover the story behind Ruqma, where luxury meets craftsmanship. Learn about our values, journey, and commitment to creating exceptional experiences.',
  openGraph: {
    title: 'Our Story | Ruqma - Beyond Ordinary',
    description: 'Discover the story behind Ruqma, where luxury meets craftsmanship.',
    type: 'website',
  },
};

export default function AboutPage() {
  const content: OurStoryContent = storyData as OurStoryContent;

  return (
    <>
      <OurStoryHero content={content.hero} />
      <StoryIntroduction content={content.introduction} />
      <ValuesGrid values={content.values} />
      <Timeline milestones={content.timeline} />
      <Craftsmanship content={content.craftsmanship} />
      <StoryCTA content={content.cta} />
    </>
  );
}
