
import { Category, Product } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Quantum X1 Smartphone',
    description: 'High-performance smartphone with advanced AI photography capabilities and 120Hz display.',
    price: 899.99,
    category: Category.ELECTRONICS,
    image: 'https://picsum.photos/seed/phone1/600/600',
    stock: 15,
    rating: 4.8
  },
  {
    id: '2',
    name: 'Precision Chronograph Watch',
    description: 'Elegant stainless steel timepiece with sapphire crystal and Japanese movement.',
    price: 249.50,
    category: Category.FASHION,
    image: 'https://picsum.photos/seed/watch1/600/600',
    stock: 24,
    rating: 4.5
  },
  {
    id: '3',
    name: 'SonicWave Noise-Cancelling Headphones',
    description: 'Experience pure sound with active noise cancellation and 40-hour battery life.',
    price: 329.99,
    category: Category.ELECTRONICS,
    image: 'https://picsum.photos/seed/audio1/600/600',
    stock: 8,
    rating: 4.9
  },
  {
    id: '4',
    name: 'Nordic Oak Coffee Table',
    description: 'Minimalist Scandinavian design crafted from solid sustainable oak.',
    price: 450.00,
    category: Category.HOME,
    image: 'https://picsum.photos/seed/table1/600/600',
    stock: 5,
    rating: 4.7
  },
  {
    id: '5',
    name: 'UltraLite Running Shoes',
    description: 'Breathable mesh running shoes with responsive foam cushioning for ultimate performance.',
    price: 129.00,
    category: Category.SPORTS,
    image: 'https://picsum.photos/seed/shoes1/600/600',
    stock: 30,
    rating: 4.6
  },
  {
    id: '6',
    name: 'PureRadiance Glow Serum',
    description: 'Natural vitamin C infused serum for a brighter, more even skin tone.',
    price: 45.99,
    category: Category.BEAUTY,
    image: 'https://picsum.photos/seed/beauty1/600/600',
    stock: 50,
    rating: 4.4
  }
];
