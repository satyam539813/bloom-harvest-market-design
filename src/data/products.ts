
export const products = [
  {
    id: 1,
    name: "Organic Red Apples",
    category: "Fruits",
    price: 4.99,
    unit: "kg",
    image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80",
    discount: true,
    oldPrice: 6.99,
    badge: "Sale",
    organic: true,
    description: "Sweet and crisp organic red apples from local orchards. Perfect for snacking, baking, or adding to salads."
  },
  {
    id: 2,
    name: "Fresh Garden Spinach",
    category: "Vegetables",
    price: 3.49,
    unit: "bunch",
    image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=600&q=80",
    organic: true,
    description: "Nutrient-rich organic spinach leaves, freshly harvested from our sustainable farm. Great for salads, smoothies, or cooking."
  },
  {
    id: 3,
    name: "Free Range Eggs",
    category: "Dairy",
    price: 5.99,
    unit: "dozen",
    image: "https://images.unsplash.com/photo-1598965402089-897ce52e8355?auto=format&fit=crop&w=600&q=80",
    badge: "New",
    description: "Farm-fresh eggs from free-range chickens. These eggs have bright yellow yolks and exceptional flavor."
  },
  {
    id: 4,
    name: "Heirloom Tomatoes",
    category: "Vegetables",
    price: 4.29,
    unit: "lb",
    image: "https://images.unsplash.com/photo-1518977822534-7049a61ee0c2?auto=format&fit=crop&w=600&q=80",
    organic: true,
    description: "Colorful mix of heirloom tomato varieties, each with unique flavor profiles. Perfect for salads and gourmet dishes."
  },
  {
    id: 5,
    name: "Raw Wildflower Honey",
    category: "Honey",
    price: 9.99,
    unit: "jar",
    image: "https://images.unsplash.com/photo-1587049352851-8d4e89133924?auto=format&fit=crop&w=600&q=80",
    organic: true,
    description: "Pure, unfiltered wildflower honey collected from local bee farms. Rich in flavor and natural enzymes."
  },
  {
    id: 6,
    name: "Fresh Basil",
    category: "Herbs",
    price: 2.99,
    unit: "bunch",
    image: "https://images.unsplash.com/photo-1618164436241-4473940d1f9c?auto=format&fit=crop&w=600&q=80",
    organic: true,
    description: "Aromatic fresh basil with vibrant green leaves. Essential for Italian cooking, pesto, and summer salads."
  },
  {
    id: 7,
    name: "Whole Grain Bread",
    category: "Bread",
    price: 5.49,
    unit: "loaf",
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80",
    description: "Freshly baked whole grain bread made with organic flour. Hearty and delicious with a perfect crust."
  },
  {
    id: 8,
    name: "Grass-Fed Beef",
    category: "Meat",
    price: 12.99,
    unit: "lb",
    image: "https://images.unsplash.com/photo-1551028150-64b9f398f678?auto=format&fit=crop&w=600&q=80",
    badge: "Premium",
    discount: true,
    oldPrice: 15.99,
    description: "Ethically raised grass-fed beef from local farms. Lean, tender, and full of flavor without antibiotics or hormones."
  },
  {
    id: 9,
    name: "Organic Blueberries",
    category: "Fruits",
    price: 6.99,
    unit: "pint",
    image: "https://images.unsplash.com/photo-1498557850523-fd3d118b962e?auto=format&fit=crop&w=600&q=80",
    organic: true,
    description: "Sweet, plump organic blueberries packed with antioxidants. Perfect for snacking, baking, or topping cereals and yogurt."
  },
  {
    id: 10,
    name: "Artisan Goat Cheese",
    category: "Dairy",
    price: 8.49,
    unit: "8oz",
    image: "https://images.unsplash.com/photo-1559561853-08451507cbe7?auto=format&fit=crop&w=600&q=80",
    badge: "Local",
    description: "Creamy, tangy goat cheese made in small batches from a local dairy farm. Delicious in salads or on crackers."
  },
  {
    id: 11,
    name: "Fresh Carrots",
    category: "Vegetables",
    price: 2.99,
    unit: "bunch",
    image: "https://images.unsplash.com/photo-1447175008436-054170c2e979?auto=format&fit=crop&w=600&q=80",
    organic: true,
    discount: true,
    oldPrice: 3.99,
    description: "Sweet and crunchy organic carrots with tops. Versatile for snacking, cooking, or juicing."
  },
  {
    id: 12,
    name: "Maple Syrup",
    category: "Pantry",
    price: 14.99,
    unit: "16oz",
    image: "https://images.unsplash.com/photo-1589496933738-f5c27eb03dd6?auto=format&fit=crop&w=600&q=80",
    organic: true,
    description: "Pure maple syrup harvested and produced locally. Rich amber color with complex, sweet flavor perfect for breakfast."
  },
  {
    id: 13,
    name: "Organic Lemons",
    category: "Fruits",
    price: 3.99,
    unit: "lb",
    image: "https://images.unsplash.com/photo-1587486913049-53fc88980cfc?auto=format&fit=crop&w=600&q=80",
    organic: true,
    description: "Bright, juicy organic lemons perfect for cooking, baking, and beverages. High in vitamin C and natural citrus oils."
  },
  {
    id: 14,
    name: "Wild Salmon Fillet",
    category: "Fish",
    price: 18.99,
    unit: "lb",
    image: "https://images.unsplash.com/photo-1544943620-1a1b96aaef2b?auto=format&fit=crop&w=600&q=80",
    badge: "Fresh",
    description: "Premium wild-caught salmon fillet, rich in omega-3 fatty acids. Sustainably sourced and perfect for grilling or baking."
  },
  {
    id: 15,
    name: "Organic Avocados",
    category: "Fruits",
    price: 2.49,
    unit: "each",
    image: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=600&q=80",
    organic: true,
    description: "Creamy, ripe organic avocados perfect for toast, salads, or guacamole. Packed with healthy fats and nutrients."
  },
  {
    id: 16,
    name: "Farm Fresh Milk",
    category: "Dairy",
    price: 4.99,
    unit: "half gallon",
    image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80",
    description: "Creamy, fresh milk from local grass-fed cows. Non-homogenized and minimally processed for maximum flavor."
  },
  {
    id: 17,
    name: "Organic Kale",
    category: "Vegetables",
    price: 3.99,
    unit: "bunch",
    image: "https://images.unsplash.com/photo-1515543904379-3d37e9329b00?auto=format&fit=crop&w=600&q=80",
    organic: true,
    badge: "Superfood",
    description: "Nutrient-dense organic kale leaves, perfect for salads, smoothies, or sautéing. High in vitamins A, C, and K."
  },
  {
    id: 18,
    name: "Artisan Sourdough",
    category: "Bread",
    price: 6.99,
    unit: "loaf",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80",
    description: "Traditional sourdough bread with a tangy flavor and perfect crust. Made with natural fermentation and organic flour."
  },
  {
    id: 19,
    name: "Sweet Bell Peppers",
    category: "Vegetables",
    price: 4.49,
    unit: "3-pack",
    image: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=600&q=80",
    organic: true,
    description: "Colorful mix of red, yellow, and orange bell peppers. Sweet and crunchy, perfect for cooking or eating raw."
  },
  {
    id: 20,
    name: "Raw Almonds",
    category: "Nuts",
    price: 8.99,
    unit: "lb",
    image: "https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=600&q=80",
    organic: true,
    description: "Premium raw almonds, perfect for snacking or baking. Rich in healthy fats, protein, and vitamin E."
  },
  {
    id: 21,
    name: "Organic Strawberries",
    category: "Fruits",
    price: 5.99,
    unit: "pint",
    image: "https://images.unsplash.com/photo-1518635017498-87f514b751ba?auto=format&fit=crop&w=600&q=80",
    organic: true,
    discount: true,
    oldPrice: 7.99,
    badge: "Sale",
    description: "Sweet, juicy organic strawberries at peak ripeness. Perfect for desserts, smoothies, or enjoying fresh."
  },
  {
    id: 22,
    name: "Free-Range Chicken",
    category: "Meat",
    price: 8.99,
    unit: "lb",
    image: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=600&q=80",
    description: "Tender, flavorful free-range chicken raised without antibiotics or hormones. Ethically sourced from local farms."
  },
  {
    id: 23,
    name: "Organic Quinoa",
    category: "Grains",
    price: 7.99,
    unit: "2lb bag",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80",
    organic: true,
    badge: "Protein-Rich",
    description: "Premium organic quinoa, a complete protein grain. Fluffy texture and nutty flavor, perfect for salads and bowls."
  },
  {
    id: 24,
    name: "Greek Yogurt",
    category: "Dairy",
    price: 6.49,
    unit: "32oz",
    image: "https://images.unsplash.com/photo-1571212515416-6bb9a2b8ce4c?auto=format&fit=crop&w=600&q=80",
    description: "Thick, creamy Greek yogurt made from local milk. High in protein and probiotics for digestive health."
  }
];
