import { writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const walkSync = (dir, filelist = []) => {
  try {
    const files = readdirSync(dir);
    files.forEach((file) => {
      const fullPath = join(dir, file);
      if (statSync(fullPath).isDirectory()) {
        filelist = walkSync(fullPath, filelist);
      } else {
        if (file.match(/\.(jpg|jpeg|png|webp|gif)$/i)) {
          filelist.push(fullPath);
        }
      }
    });
  } catch (e) {
    // ignore
  }
  return filelist;
};

const brands = ['Allen Solly', 'Puma', 'Nike', 'Zara', 'H&M', 'Levis', 'Raymond', 'Biba', 'W for Woman', 'FabIndia', 'Manyavar', 'Sabyasachi'];
const colors = ['Red', 'Blue', 'Green', 'Black', 'White', 'Yellow', 'Pink', 'Purple', 'Grey', 'Brown', 'Navy', 'Olive', 'Beige', 'Maroon', 'Teal'];
const fabrics = ['Cotton', 'Silk', 'Linen', 'Polyester', 'Wool', 'Denim', 'Velvet', 'Chiffon', 'Georgette', 'Crepe', 'Rayon', 'Nylon', 'Leather', 'Satin'];
const patterns = ['Solid', 'Striped', 'Checked', 'Floral', 'Printed', 'Polka Dots', 'Geometric', 'Embroidered', 'Abstract', 'Plaid'];
const fits = ['Regular Fit', 'Slim Fit', 'Relaxed Fit', 'Skinny Fit', 'Loose Fit', 'Oversized', 'Tailored Fit'];
const occasions = ['Casual', 'Formal', 'Party', 'Wedding', 'Sports', 'Lounge', 'Festive', 'Vacation', 'Work'];
const collars = ['Polo', 'Mandarin', 'Spread', 'Button-Down', 'Round Neck', 'V-Neck', 'Henley', 'Turtleneck', 'Boat Neck', 'Square Neck'];
const standardSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];
const pantsSizes = ['28', '30', '32', '34', '36', '38', '40'];

const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomPrice = (min, max) => Math.floor(randomNumber(min, max) / 10) * 10;

// Read all images
const allImages = walkSync('public/images');

// Manual color mapping for known images so the filter matches the visual picture
const imageColorMap = {
  'fshirt1.webp': 'Navy',
  'fshirt2.webp': 'Maroon',
  'jeans1.webp': 'Grey',
  'jeans2.webp': 'Grey',
  'tpants1.webp': 'Olive',
  'tpants2.webp': 'Brown',
  'tshirts1.webp': 'Navy',
  'tshirts2.webp': 'White',
  'shirt1.webp': 'Blue',
  'shirt2.webp': 'Black'
};

let products = [];
let idCounter = 1;

allImages.forEach((img) => {
  const normalizedPath = img.replace(/\\/g, '/');
  // path format: public/images/category/subcategory/type/filename
  const parts = normalizedPath.split('/');
  if (parts.length >= 5) {
    const categoryRaw = parts[2];
    const subcategoryRaw = parts[3];
    const typeRaw = parts[4];
    
    const categoryMap = {
      'men': 'Men',
      'women': 'Women',
      'kids': 'Kids',
      'party-wear': 'Party Wear',
      'party_wear': 'Party Wear'
    };
    const category = categoryMap[categoryRaw.toLowerCase()] || 'Men';
    
    // Formatting strings
    const formatName = (str) => str.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    
    const subcategory = formatName(subcategoryRaw);
    const type = formatName(typeRaw);
    
    const originalPrice = randomPrice(500, 5000);
    const discountPercentage = randomNumber(0, 50); // 0% to 50%
    const finalPrice = discountPercentage > 0 ? Math.floor(originalPrice * (1 - discountPercentage / 100)) : originalPrice;
    const stockVal = randomNumber(0, 15);

    const isBottom = typeRaw.includes('jeans') || typeRaw.includes('trousers') || typeRaw.includes('shorts') || typeRaw.includes('pants');

    // Specific logic for Sarees
    const isSaree = typeRaw.toLowerCase().includes('saree') || subcategoryRaw.toLowerCase().includes('saree');
    const fabric = isSaree ? randomItem(['Silk', 'Cotton', 'Chiffon', 'Georgette']) : randomItem(fabrics);

    const selectedBrand = randomItem(brands);
    const fileName = parts[parts.length - 1];
    const assignedColor = imageColorMap[fileName] || randomItem(colors);

    const product = {
      id: `local_p_${idCounter++}`,
      name: `${selectedBrand} ${formatName(typeRaw)}`,
      slug: `${selectedBrand.toLowerCase().replace(' ', '-')}-${typeRaw}-${idCounter}`,
      price: finalPrice,
      originalPrice: originalPrice,
      discount_price: finalPrice,
      discount: discountPercentage,
      discountPercentage: discountPercentage,
      category: category,
      subcategory: subcategory,
      brand: selectedBrand,
      color: assignedColor,
      fabric: fabric,
      type: type,
      pattern: randomItem(patterns),
      fit: isSaree ? 'Free Size' : randomItem(fits),
      occasion: randomItem(occasions),
      collar: isBottom || isSaree ? null : randomItem(collars),
      rating: parseFloat((Math.random() * (5 - 3.5) + 3.5).toFixed(1)),
      review_count: randomNumber(0, 500),
      images: [normalizedPath.replace('public', '')],
      image: normalizedPath.replace('public', ''),
      description: `A premium ${type.toLowerCase()} designed for style and comfort.`,
      sizes: isSaree ? ['Free Size'] : (isBottom ? pantsSizes.slice(0, randomNumber(3, 7)) : standardSizes.slice(0, randomNumber(3, 7))),
      size: isSaree ? 'Free Size' : (isBottom ? pantsSizes[0] : standardSizes[0]),
      stock: stockVal,
      isLimitedStock: stockVal > 0 && stockVal <= 5,
      featured: Math.random() > 0.8,
      bestseller: Math.random() > 0.8,
      new_arrival: Math.random() > 0.8,
    };
    
    products.push(product);
  }
});

const fileContent = `export const largeProducts = ${JSON.stringify(products, null, 2)};\n`;
writeFileSync('src/lib/largeProducts.js', fileContent);
console.log(`Generated ${products.length} products with complete filter fields in src/lib/largeProducts.js`);
