import Hero from "@/components/Hero";
import Products from "@/components/Products";
import { Testimonials } from "@/components/ui/testimonials";

export default function Home() {
  return (
    <main>
      <Hero />
      <Products />
      <Testimonials />
    </main>
  );
}
