export interface Product {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  href?: string;
  category?: string;
  brand?: string;
  price?: number;
  inStock?: boolean;
}

export interface ProductCardProps extends Omit<Product, 'category' | 'price' | 'inStock'> {
  className?: string;
}