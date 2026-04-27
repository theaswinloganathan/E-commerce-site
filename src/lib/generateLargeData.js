import { writeFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join } from 'path';

const walkSync = (dir, filelist = []) => {
  if (!existsSync(dir)) return filelist;
  const files = readdirSync(dir);
  files.forEach((file) => {
    if (statSync(join(dir, file)).isDirectory()) {
      filelist = walkSync(join(dir, file), filelist);
    } else {
      if (file.match(/\.(jpg|jpeg|png|webp|gif)$/i)) {
        filelist.push(join(dir, file));
      }
    }
  });
  return filelist;
};

const cleanName = (filename) => {
  return filename
    .split('.')[0]
    .replace(/[-_]/g, ' ')
    .replace(/\d+$/, '') // Remove trailing numbers
    .trim()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const getProductDetails = (fullPath) => {
  const parts = fullPath.replace(/\\/g, '/').split('/');
  // Expected structure: public/images/[category]/[subcategory]/[type]/filename
  // OR: public/images/[category]/[type]/filename
  
  let category = 'Men';
  let subcategory = 'Clothing';
  let type = 'T-Shirts';

  if (parts.includes('women')) category = 'Women';
  if (parts.includes('kids')) category = 'Kids';

  // Subcategory detection
  if (parts.includes('indian-fusion-wear')) subcategory = 'Indian & Fusion Wear';
  else if (parts.includes('western-wear')) subcategory = 'Western Wear';
  else if (parts.includes('clothing')) subcategory = 'Clothing';
  else if (parts.includes('winterwear')) subcategory = 'Winter Wear';
  else if (parts.includes('sportswear')) subcategory = 'Sportswear';

  // Type detection (last folder before filename)
  const lastFolder = parts[parts.length - 2];
  type = lastFolder.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  return { category, subcategory, type };
};

const generatePrice = (filename) => {
  let hash = 0;
  for (let i = 0; i < filename.length; i++) {
    hash = filename.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.floor(Math.abs(hash % 2000)) + 699;
};

const generateAllFromLocal = () => {
  const baseDir = 'public/images';
  const allImageFiles = walkSync(baseDir);
  
  const products = allImageFiles.map((fullPath, index) => {
    const filename = fullPath.split(/[\\/]/).pop();
    const relativePath = fullPath.replace('public', '').replace(/\\/g, '/');
    const { category, subcategory, type } = getProductDetails(fullPath);
    const name = `${cleanName(filename)} ${type.replace(/s$/i, '')}`;
    const price = generatePrice(filename);
    
    return {
      id: `local_p_${index + 1}`,
      name,
      slug: `${name.toLowerCase().replace(/ /g, '-')}-${index + 1}`,
      price,
      category,
      subcategory,
      type,
      rating: (Math.random() * (5 - 3.8) + 3.8).toFixed(1),
      review_count: Math.floor(Math.random() * 100) + 10,
      images: [relativePath],
      description: `A premium ${name.toLowerCase()} designed for style and comfort.`,
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Neutral'],
      stock: 50
    };
  });
  
  return products;
};

const localProducts = generateAllFromLocal();
const fileContent = `export const largeProducts = ${JSON.stringify(localProducts, null, 2)};`;

writeFileSync('src/lib/largeProducts.js', fileContent);
console.log(`Successfully mapped ${localProducts.length} products from ALL local folders.`);
