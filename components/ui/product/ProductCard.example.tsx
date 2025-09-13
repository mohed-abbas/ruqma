import { ProductCard } from './index';

// Example usage of the ProductCard component
export default function ProductCardExample() {
  const sampleProduct = {
    id: 'glidex-mouse-pad',
    name: 'GlideX',
    description: 'Discover the ultimate mouse movement experience with glass mouse pads.',
    imageUrl: '/images/products/glidex-mousepad.png', // Replace with actual image path
    imageAlt: 'GlideX glass mouse pad with premium tracking surface',
    href: '/products/glidex',
    brand: 'Ruqma',
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Product Card Example</h1>
        
        {/* Single product card */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Single Product Card</h2>
          <ProductCard {...sampleProduct} />
        </div>

        {/* Grid of product cards */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Product Grid</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ProductCard 
              {...sampleProduct} 
              id="glidex-1"
              name="GlideX Pro"
            />
            <ProductCard 
              {...sampleProduct} 
              id="glidex-2"
              name="GlideX Ultra"
              description="Experience next-level precision with advanced glass mouse pads."
            />
            <ProductCard 
              {...sampleProduct} 
              id="glidex-3"
              name="GlideX Elite"
              description="Professional-grade glass surface for competitive gaming."
            />
          </div>
        </div>
      </div>
    </div>
  );
}