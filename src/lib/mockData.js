import { largeProducts } from './largeProducts';

export const categories = [
  { id: 'c1', name: 'Men', slug: 'men', image: '/images/men/clothing/casual-shirts/shirt1.webp' },
  { id: 'c2', name: 'Women', slug: 'women', image: '/images/men/clothing/formal-shirts/fshirt1.webp' },
  { id: 'c3', name: 'Kids', slug: 'kids', image: '/images/men/clothing/casual-shirts/shirt10.webp' },
  { id: 'c4', name: 'Party Wear', slug: 'party-wear', image: '/images/men/clothing/formal-shirts/fshirt2.webp' }
];

export const products = [
  ...largeProducts
];

