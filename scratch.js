const allProducts = [
  { id: 1, brand: 'H&M', name: 'Product 1' },
  { id: 2, brand: 'Allen Solly', name: 'Product 2' },
  { id: 3, brand: 'H&M', name: 'Product 3' },
  { id: 4, name: 'Product 4 (No Brand)' }
];

const activeFilters = {
  brands: ['H&M'],
  colors: [],
  sizes: []
};

const checkMatch = (productValue, activeFilterArray) => {
  if (!activeFilterArray || activeFilterArray.length === 0) return true;
  if (!productValue) return false;
  
  const lowerActiveFilters = activeFilterArray.map(f => String(f).toLowerCase().trim());
  
  if (Array.isArray(productValue)) {
    return productValue.some(val => typeof val === 'string' && lowerActiveFilters.includes(val.toLowerCase().trim()));
  }
  
  return typeof productValue === 'string' && lowerActiveFilters.includes(productValue.toLowerCase().trim());
};

let localResults = [...allProducts];

localResults = localResults.filter(p => checkMatch(p.brand, activeFilters.brands));
localResults = localResults.filter(p => checkMatch(p.color || p.colors, activeFilters.colors));
localResults = localResults.filter(p => checkMatch(p.size || p.sizes, activeFilters.sizes));

console.log("Filtered length:", localResults.length);
console.log("Results:", localResults);
