// Generate hundreds of food and grain products with realistic data
const categories = [
  'Fruits', 'Vegetables', 'Grains', 'Dairy', 'Meat', 'Seafood', 'Herbs', 'Spices', 
  'Nuts', 'Seeds', 'Oils', 'Honey', 'Bread', 'Pantry', 'Beverages', 'Snacks'
];

const fruits = [
  'Apples', 'Bananas', 'Oranges', 'Strawberries', 'Blueberries', 'Grapes', 'Peaches', 'Pears',
  'Cherries', 'Plums', 'Mangoes', 'Pineapples', 'Kiwis', 'Lemons', 'Limes', 'Avocados',
  'Blackberries', 'Raspberries', 'Pomegranates', 'Watermelons', 'Cantaloupes', 'Honeydew'
];

const vegetables = [
  'Spinach', 'Kale', 'Broccoli', 'Cauliflower', 'Carrots', 'Beets', 'Radishes', 'Turnips',
  'Potatoes', 'Sweet Potatoes', 'Onions', 'Garlic', 'Leeks', 'Celery', 'Bell Peppers', 'Tomatoes',
  'Cucumbers', 'Zucchini', 'Eggplant', 'Asparagus', 'Green Beans', 'Peas', 'Corn', 'Lettuce'
];

const grains = [
  'Quinoa', 'Brown Rice', 'Wild Rice', 'Oats', 'Barley', 'Buckwheat', 'Millet', 'Amaranth',
  'Bulgur', 'Farro', 'Spelt', 'Kamut', 'Teff', 'Sorghum', 'Wheat Berries', 'Rye'
];

const proteins = [
  'Chicken', 'Turkey', 'Duck', 'Beef', 'Pork', 'Lamb', 'Salmon', 'Tuna', 'Cod', 'Shrimp',
  'Crab', 'Lobster', 'Eggs', 'Cheese', 'Yogurt', 'Milk'
];

const nuts = [
  'Almonds', 'Walnuts', 'Pecans', 'Cashews', 'Pistachios', 'Hazelnuts', 'Brazil Nuts', 'Pine Nuts'
];

const seeds = [
  'Chia Seeds', 'Flax Seeds', 'Pumpkin Seeds', 'Sunflower Seeds', 'Hemp Seeds', 'Sesame Seeds'
];

const herbs = [
  'Basil', 'Oregano', 'Thyme', 'Rosemary', 'Sage', 'Cilantro', 'Parsley', 'Dill', 'Mint', 'Chives'
];

const spices = [
  'Turmeric', 'Cinnamon', 'Ginger', 'Paprika', 'Cumin', 'Coriander', 'Cardamom', 'Cloves', 'Nutmeg'
];

const foodImages = [
  'photo-1560806887-1e4cd0b6cbd6', // apples
  'photo-1576045057995-568f588f82fb', // spinach
  'photo-1598965402089-897ce52e8355', // eggs
  'photo-1518977822534-7049a61ee0c2', // tomatoes
  'photo-1587049352851-8d4e89133924', // honey
  'photo-1618164436241-4473940d1f9c', // basil
  'photo-1555507036-ab1f4038808a', // bread
  'photo-1551028150-64b9f398f678', // meat
  'photo-1498557850523-fd3d118b962e', // blueberries
  'photo-1559561853-08451507cbe7', // cheese
  'photo-1447175008436-054170c2e979', // carrots
  'photo-1589496933738-f5c27eb03dd6', // maple syrup
];

const getRandomImage = () => {
  const imageId = foodImages[Math.floor(Math.random() * foodImages.length)];
  return `https://images.unsplash.com/${imageId}?auto=format&fit=crop&w=600&q=80`;
};

const getRandomPrice = (min: number, max: number) => {
  return +(Math.random() * (max - min) + min).toFixed(2);
};

const getRandomUnit = (category: string) => {
  const units = {
    'Fruits': ['lb', 'kg', 'each', 'bunch', 'pint'],
    'Vegetables': ['lb', 'kg', 'bunch', 'each', 'bag'],
    'Grains': ['lb', 'kg', '2lb bag', '5lb bag'],
    'Dairy': ['gallon', 'quart', 'pint', '8oz', '16oz'],
    'Meat': ['lb', 'kg', 'each'],
    'Seafood': ['lb', 'kg', 'each'],
    'Herbs': ['bunch', 'oz', '2oz'],
    'Spices': ['oz', '2oz', '4oz'],
    'Nuts': ['lb', '8oz', '16oz'],
    'Seeds': ['lb', '8oz', '16oz'],
    'Oils': ['16oz', '32oz', '1L'],
    'Honey': ['8oz', '16oz', '32oz'],
    'Bread': ['loaf', 'each'],
    'Pantry': ['lb', 'kg', '16oz', '32oz'],
    'Beverages': ['gallon', 'quart', '16oz', '32oz'],
    'Snacks': ['bag', '8oz', '16oz']
  };
  const categoryUnits = units[category as keyof typeof units] || ['each'];
  return categoryUnits[Math.floor(Math.random() * categoryUnits.length)];
};

const generateProducts = () => {
  const products = [];
  let id = 1;

  // Generate products for each category
  categories.forEach(category => {
    let items: string[] = [];
    
    switch(category) {
      case 'Fruits':
        items = fruits;
        break;
      case 'Vegetables':
        items = vegetables;
        break;
      case 'Grains':
        items = grains;
        break;
      case 'Meat':
      case 'Seafood':
      case 'Dairy':
        items = proteins.filter(p => {
          if (category === 'Meat') return ['Chicken', 'Turkey', 'Duck', 'Beef', 'Pork', 'Lamb'].includes(p);
          if (category === 'Seafood') return ['Salmon', 'Tuna', 'Cod', 'Shrimp', 'Crab', 'Lobster'].includes(p);
          if (category === 'Dairy') return ['Eggs', 'Cheese', 'Yogurt', 'Milk'].includes(p);
          return false;
        });
        break;
      case 'Nuts':
        items = nuts;
        break;
      case 'Seeds':
        items = seeds;
        break;
      case 'Herbs':
        items = herbs;
        break;
      case 'Spices':
        items = spices;
        break;
      default:
        items = [
          'Premium ' + category,
          'Organic ' + category,
          'Fresh ' + category,
          'Artisan ' + category,
          'Local ' + category,
          'Wild ' + category,
          'Raw ' + category,
          'Natural ' + category
        ];
    }

    // Generate multiple variants for each item
    items.forEach(item => {
      const variants = ['Organic', 'Premium', 'Fresh', 'Local', 'Wild', 'Raw', 'Artisan'];
      const numVariants = Math.floor(Math.random() * 3) + 1; // 1-3 variants per item
      
      for (let i = 0; i < numVariants; i++) {
        const variant = i === 0 ? '' : variants[Math.floor(Math.random() * variants.length)] + ' ';
        const basePrice = getRandomPrice(1.99, 19.99);
        const hasDiscount = Math.random() < 0.3; // 30% chance of discount
        const isOrganic = Math.random() < 0.6; // 60% chance of being organic
        
        const product = {
          id: id++,
          name: `${variant}${item}`,
          category,
          price: hasDiscount ? +(basePrice * 0.8).toFixed(2) : basePrice,
          unit: getRandomUnit(category),
          image: getRandomImage(),
          discount: hasDiscount,
          oldPrice: hasDiscount ? basePrice : undefined,
          badge: hasDiscount ? 'Sale' : (Math.random() < 0.2 ? (Math.random() < 0.5 ? 'New' : 'Premium') : undefined),
          organic: isOrganic,
          description: `Fresh, high-quality ${item.toLowerCase()} ${isOrganic ? 'organically grown' : 'from trusted farms'}. Perfect for healthy cooking and nutritious meals.`
        };
        
        products.push(product);
      }
    });
  });

  return products.slice(0, 500); // Limit to 500 products
};

export const products = generateProducts();