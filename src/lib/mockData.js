import { largeProducts } from './largeProducts';

export const categories = [
  { id: 'c1', name: 'Men', slug: 'men', image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&q=80&w=800' },
  { id: 'c2', name: 'Women', slug: 'women', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800' },
  { id: 'c3', name: 'Kids', slug: 'kids', image: 'https://images.unsplash.com/photo-1621452773781-0f992fd1f5cb?auto=format&fit=crop&q=80&w=800' },
  { id: 'c4', name: 'Party Wear', slug: 'party-wear', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=800' }
];

export const products = [
  {
    id: 'p1',
    name: 'Classic Beige Trench Coat',
    slug: 'classic-beige-trench-coat',
    price: 14999,
    discount_price: 12499,
    category: 'Women',
    subcategory: 'Western Wear',
    rating: 4.8,
    review_count: 124,
    images: [
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1554412933-514a83d2f3c8?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'An elegant classic trench coat made from premium water-resistant fabric. Perfect for effortless layering during transitional weather.',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Beige', 'Black', 'Navy'],
    featured: true,
    bestseller: true,
    new_arrival: false,
    stock: 45
  },
  {
    id: 'p2',
    name: 'Premium Silk Blouse',
    slug: 'premium-silk-blouse',
    price: 4500,
    category: 'Women',
    subcategory: 'Western Wear',
    rating: 4.9,
    review_count: 89,
    images: [
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1550639525-c97d455acf70?auto=format&fit=crop&q=80&w=800'
    ],
    description: '100% pure silk blouse with a smooth finish. Features a delicate collar and relaxed fit for both office and casual wear.',
    sizes: ['S', 'M', 'L'],
    colors: ['White', 'Champagne', 'Emerald'],
    featured: true,
    bestseller: false,
    new_arrival: true,
    stock: 20
  },
  {
    id: 'p3',
    name: 'Tailored Wool Suit Jacket',
    slug: 'tailored-wool-suit-jacket',
    price: 18500,
    discount_price: 15999,
    category: 'Men',
    subcategory: 'Clothing',
    rating: 4.7,
    review_count: 56,
    images: [
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'Impeccably tailored from fine Italian wool. This jacket offers a modern slim fit with timeless appeal.',
    sizes: ['38R', '40R', '42R', '44R'],
    colors: ['Charcoal', 'Navy'],
    featured: true,
    bestseller: false,
    new_arrival: true,
    stock: 15
  },
  {
    id: 'p4',
    name: 'Essential Cotton T-Shirt',
    slug: 'essential-cotton-tshirt',
    price: 1200,
    category: 'Men',
    subcategory: 'T-Shirts & Polos',
    rating: 4.6,
    review_count: 210,
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'Your everyday essential t-shirt. Crafted from ultra-soft, breathable organic cotton for all-day comfort.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['White', 'Black', 'Grey', 'Olive'],
    featured: false,
    bestseller: true,
    new_arrival: false,
    stock: 100
  },
  {
    id: 'p5',
    name: 'High-Waist Denim Jeans',
    slug: 'high-waist-denim-jeans',
    price: 3500,
    category: 'Women',
    subcategory: 'Western Wear',
    rating: 4.8,
    review_count: 340,
    images: [
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'Classic high-waisted jeans with a straight leg cut. Made from premium vintage-wash denim with a slight stretch.',
    sizes: ['24', '26', '28', '30', '32'],
    colors: ['Light Blue', 'Vintage Wash', 'Black'],
    featured: false,
    bestseller: true,
    new_arrival: false,
    stock: 60
  },
  {
    id: 'p6',
    name: 'Velvet Evening Gown',
    slug: 'velvet-evening-gown',
    price: 25000,
    category: 'Women',
    subcategory: 'Western Wear',
    rating: 5.0,
    review_count: 12,
    images: [
      'https://images.unsplash.com/photo-1566160983995-15ff4f9f46fa?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'A show-stopping evening gown in rich crushed velvet. Features a sweeping silhouette and elegant draped neckline.',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Burgundy', 'Emerald', 'Black'],
    featured: true,
    bestseller: false,
    new_arrival: true,
    stock: 8
  },
  {
    id: 'p7',
    name: 'Minimalist Leather Jacket',
    slug: 'minimalist-leather-jacket',
    price: 18000,
    discount_price: 15000,
    category: 'Men',
    subcategory: 'Winter Wear',
    rating: 4.7,
    review_count: 75,
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1520975954732-57dd22299614?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'Sleek and masculine. This genuine leather jacket features clean lines, matte finish hardware, and a tailored fit.',
    sizes: ['M', 'L', 'XL'],
    colors: ['Black', 'Dark Brown'],
    featured: false,
    bestseller: true,
    new_arrival: false,
    stock: 25
  },
  {
    id: 'p8',
    name: 'Embroidered Silk Saree',
    slug: 'embroidered-silk-saree',
    price: 12500,
    category: 'Women',
    subcategory: 'Indian & Fusion Wear',
    rating: 4.9,
    review_count: 42,
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'Exquisite silk saree featuring intricate gold thread embroidery. Perfect for weddings and festive occasions.',
    sizes: ['Free Size'],
    colors: ['Red and Gold', 'Royal Blue'],
    featured: true,
    bestseller: false,
    new_arrival: true,
    stock: 12
  },
  {
    id: 'p9',
    name: 'Navy Blue Formal Suit',
    slug: 'navy-blue-formal-suit',
    price: 22000,
    category: 'Men',
    subcategory: 'Clothing',
    rating: 4.8,
    review_count: 34,
    images: [
      'https://images.unsplash.com/photo-1593032465175-481ac7f401a0?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'A sharp navy blue suit for the modern professional. Crafted from a blend of premium wool for comfort and style.',
    sizes: ['38R', '40R', '42R'],
    colors: ['Navy'],
    featured: true,
    bestseller: true,
    new_arrival: false,
    stock: 10
  },
  {
    id: 'p10',
    name: 'Floral Print Summer Dress',
    slug: 'floral-print-summer-dress',
    price: 3200,
    category: 'Women',
    subcategory: 'Western Wear',
    rating: 4.6,
    review_count: 156,
    images: [
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'Breezy and beautiful. This floral summer dress is perfect for brunch or a day at the beach.',
    sizes: ['S', 'M', 'L'],
    colors: ['Floral White', 'Blue Garden'],
    featured: false,
    bestseller: true,
    new_arrival: true,
    stock: 40
  },
  {
    id: 'p11',
    name: 'Casual White Sneakers',
    slug: 'casual-white-sneakers',
    price: 4999,
    category: 'Men',
    subcategory: 'Footwear',
    rating: 4.7,
    review_count: 88,
    images: [
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'Clean, minimalist sneakers that go with everything. Durable and comfortable for daily wear.',
    sizes: ['8', '9', '10', '11'],
    colors: ['White'],
    featured: false,
    bestseller: true,
    new_arrival: false,
    stock: 50
  },
  {
    id: 'p12',
    name: 'Designer Leather Handbag',
    slug: 'designer-leather-handbag',
    price: 12000,
    category: 'Women',
    subcategory: 'Accessories & Watches',
    rating: 4.9,
    review_count: 28,
    images: [
      'https://images.unsplash.com/photo-1584917033904-4911785b40ca?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'A luxurious leather handbag with gold-tone hardware. Spacious enough for all your essentials.',
    sizes: ['One Size'],
    colors: ['Tan', 'Black'],
    featured: true,
    bestseller: false,
    new_arrival: true,
    stock: 15
  },
  {
    id: 'p13',
    name: 'Bohemian Embroidered Midi Dress',
    slug: 'bohemian-embroidered-midi-dress',
    price: 4200,
    category: 'Women',
    subcategory: 'Western Wear',
    rating: 4.7,
    review_count: 45,
    images: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'A beautiful midi dress with intricate embroidery and a relaxed bohemian fit. Perfect for daytime events.',
    sizes: ['S', 'M', 'L'],
    colors: ['Off-White', 'Rust'],
    featured: false,
    bestseller: false,
    new_arrival: true,
    stock: 22
  },
  {
    id: 'p14',
    name: 'Satin Wrap Evening Gown',
    slug: 'satin-wrap-evening-gown',
    price: 18500,
    category: 'Women',
    subcategory: 'Western Wear',
    rating: 5.0,
    review_count: 18,
    images: [
      'https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'Elegant wrap-style evening gown in premium satin. Features a flattering silhouette and subtle sheen.',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Midnight Blue', 'Champagne'],
    featured: true,
    bestseller: true,
    new_arrival: false,
    stock: 10
  },
  {
    id: 'p15',
    name: 'Cotton Chikankari Anarkali Kurta',
    slug: 'cotton-chikankari-anarkali-kurta',
    price: 5800,
    category: 'Women',
    subcategory: 'Indian & Fusion Wear',
    rating: 4.9,
    review_count: 67,
    images: [
      'https://images.unsplash.com/photo-1610030469668-93514227916b?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'Traditional Lucknowi Chikankari embroidery on soft cotton. This Anarkali kurta offers grace and comfort.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Peach', 'Lavender', 'Seafoam'],
    featured: true,
    bestseller: true,
    new_arrival: true,
    stock: 30
  },
  {
    id: 'p16',
    name: 'Oversized Cashmere Scarf',
    slug: 'oversized-cashmere-scarf',
    price: 3500,
    category: 'Women',
    subcategory: 'Accessories & Watches',
    rating: 4.8,
    review_count: 92,
    images: [
      'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'Luxuriously soft oversized scarf made from 100% pure cashmere. A timeless accessory for colder days.',
    sizes: ['One Size'],
    colors: ['Camel', 'Grey', 'Black'],
    featured: false,
    bestseller: true,
    new_arrival: false,
    stock: 50
  },
  {
    id: 'p17',
    name: 'Italian Leather Belt',
    slug: 'italian-leather-belt',
    price: 2800,
    category: 'Men',
    subcategory: 'Accessories',
    rating: 4.7,
    review_count: 110,
    images: [
      'https://images.unsplash.com/photo-1624222247344-550fb8ecf7c4?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'Crafted from full-grain Italian leather with a brushed nickel buckle. An essential for every wardrobe.',
    sizes: ['32', '34', '36', '38'],
    colors: ['Dark Brown', 'Black'],
    featured: false,
    bestseller: true,
    new_arrival: false,
    stock: 75
  },
  {
    id: 'p18',
    name: 'Minimalist Chronograph Watch',
    slug: 'minimalist-chronograph-watch',
    price: 12500,
    category: 'Men',
    subcategory: 'Accessories',
    rating: 4.8,
    review_count: 54,
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'Sleek chronograph watch with a minimalist dial and stainless steel mesh strap. Water-resistant and versatile.',
    sizes: ['One Size'],
    colors: ['Silver', 'Gunmetal'],
    featured: true,
    bestseller: false,
    new_arrival: true,
    stock: 20
  },
  {
    id: 'p19',
    name: 'Canvas & Leather Weekender Bag',
    slug: 'canvas-leather-weekender-bag',
    price: 8900,
    category: 'Men',
    subcategory: 'Bags & Luggage',
    rating: 4.9,
    review_count: 43,
    images: [
      'https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'Spacious weekender bag made from heavy-duty canvas with genuine leather accents. Ideal for short trips.',
    sizes: ['One Size'],
    colors: ['Olive', 'Navy'],
    featured: true,
    bestseller: false,
    new_arrival: true,
    stock: 12
  },
  {
    id: 'p20',
    name: 'Sterling Silver Herringbone Chain',
    slug: 'sterling-silver-herringbone-chain',
    price: 4500,
    category: 'Women',
    subcategory: 'Accessories & Watches',
    rating: 4.7,
    review_count: 36,
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800'
    ],
    description: '925 sterling silver herringbone chain with a high-polish finish. Sits elegantly on the collarbone.',
    sizes: ['16"', '18"'],
    colors: ['Silver'],
    featured: false,
    bestseller: false,
    new_arrival: true,
    stock: 25
  },
  {
    id: 'p21',
    name: 'Velvet Clutch Bag',
    slug: 'velvet-clutch-bag',
    price: 2900,
    category: 'Women',
    subcategory: 'Accessories & Watches',
    rating: 4.6,
    review_count: 24,
    images: [
      'https://images.unsplash.com/photo-1566150905458-1bf1fd15dcb4?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'Elegant evening clutch in plush velvet with a detachable chain strap. Perfect for formal events.',
    sizes: ['One Size'],
    colors: ['Emerald Green', 'Deep Red'],
    featured: false,
    bestseller: false,
    new_arrival: true,
    stock: 18
  },
  {
    id: 'p22',
    name: 'Linen Blend Summer Blazer',
    slug: 'linen-blend-summer-blazer',
    price: 7500,
    category: 'Men',
    subcategory: 'Clothing',
    rating: 4.7,
    review_count: 51,
    images: [
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'Lightweight linen blend blazer for a sharp summer look. Breathable and unstructured for a relaxed fit.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Light Grey', 'Sand'],
    featured: true,
    bestseller: false,
    new_arrival: true,
    stock: 20
  },
  ...largeProducts
];
