import { Suspense } from "react";
import Hero from "@/components/Hero";
import Products from "@/components/Products";
import { Testimonials } from "@/components/ui/testimonials";
import { ProductsSkeleton, TestimonialsSkeleton } from "@/components/ui/loading";

// Force dynamic rendering so skeletons show during navigation
export const dynamic = 'force-dynamic';

export default function Home() {
  return (
    <main>
      {/* Hero uses local JSON data - no async loading needed */}
      <Hero />

      {/* Products fetches from Sanity - shows skeleton while loading */}
      <Suspense fallback={<ProductsSkeleton />}>
        <Products />
      </Suspense>

      {/* Testimonials fetches from Sanity - shows skeleton while loading */}
      <Suspense fallback={<TestimonialsSkeleton />}>
        <Testimonials />
      </Suspense>
    </main>
  );
}
