import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader, Star, Heart, Eye, ShoppingCart, Apple, Wheat } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/contexts/CartContext';
import { useFavorites } from '@/contexts/FavoritesContext';

interface SpoonacularIngredient {
  id: number;
  name: string;
  image: string;
  aisle?: string;
  categoryPath?: string[];
  nutrition?: {
    nutrients: Array<{
      name: string;
      amount: number;
      unit: string;
    }>;
  };
}

interface SpoonacularSearchResponse {
  results: SpoonacularIngredient[];
  offset: number;
  number: number;
  totalResults: number;
}

const SpoonacularFeaturedProducts = () => {
  const [ingredients, setIngredients] = useState<SpoonacularIngredient[]>([]);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);
  const [currentQuery, setCurrentQuery] = useState('fruits');
  const { toast } = useToast();
  const { addToCart } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();

  const SPOONACULAR_API_KEY = 'demo'; // Using demo key - replace with actual key for production
  const ITEMS_PER_PAGE = 12;

  const queries = ['fruits', 'vegetables', 'grains', 'berries', 'citrus', 'herbs'];

  const fetchIngredients = useCallback(async (query: string, currentOffset: number, reset = false) => {
    if (loading) return;
    
    setLoading(true);
    
    try {
      // Using a mock API response since Spoonacular requires a paid API key
      // In production, replace this with actual Spoonacular API call
      const mockData = generateMockData(query, currentOffset, ITEMS_PER_PAGE);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (reset) {
        setIngredients(mockData.results);
      } else {
        setIngredients(prev => [...prev, ...mockData.results]);
      }
      
      setHasMore(mockData.results.length === ITEMS_PER_PAGE);
      setOffset(currentOffset + ITEMS_PER_PAGE);
      
    } catch (error) {
      console.error('Error fetching ingredients:', error);
      toast({
        title: "Error loading products",
        description: "Failed to load fresh produce. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [loading, toast]);

  // Generate mock data that simulates Spoonacular API response
  const generateMockData = (query: string, offset: number, limit: number): SpoonacularSearchResponse => {
    const baseIngredients = {
      fruits: [
        { name: 'Apple', category: 'Fruits', aisle: 'Produce' },
        { name: 'Banana', category: 'Fruits', aisle: 'Produce' },
        { name: 'Orange', category: 'Fruits', aisle: 'Produce' },
        { name: 'Strawberry', category: 'Fruits', aisle: 'Produce' },
        { name: 'Blueberry', category: 'Fruits', aisle: 'Produce' },
        { name: 'Mango', category: 'Fruits', aisle: 'Produce' },
        { name: 'Pineapple', category: 'Fruits', aisle: 'Produce' },
        { name: 'Grape', category: 'Fruits', aisle: 'Produce' },
        { name: 'Peach', category: 'Fruits', aisle: 'Produce' },
        { name: 'Pear', category: 'Fruits', aisle: 'Produce' },
        { name: 'Cherry', category: 'Fruits', aisle: 'Produce' },
        { name: 'Watermelon', category: 'Fruits', aisle: 'Produce' },
      ],
      vegetables: [
        { name: 'Carrot', category: 'Vegetables', aisle: 'Produce' },
        { name: 'Broccoli', category: 'Vegetables', aisle: 'Produce' },
        { name: 'Spinach', category: 'Vegetables', aisle: 'Produce' },
        { name: 'Tomato', category: 'Vegetables', aisle: 'Produce' },
        { name: 'Bell Pepper', category: 'Vegetables', aisle: 'Produce' },
        { name: 'Cucumber', category: 'Vegetables', aisle: 'Produce' },
        { name: 'Lettuce', category: 'Vegetables', aisle: 'Produce' },
        { name: 'Onion', category: 'Vegetables', aisle: 'Produce' },
      ],
      grains: [
        { name: 'Brown Rice', category: 'Grains', aisle: 'Pantry' },
        { name: 'Quinoa', category: 'Grains', aisle: 'Pantry' },
        { name: 'Oats', category: 'Grains', aisle: 'Pantry' },
        { name: 'Wheat', category: 'Grains', aisle: 'Pantry' },
        { name: 'Barley', category: 'Grains', aisle: 'Pantry' },
        { name: 'Millet', category: 'Grains', aisle: 'Pantry' },
      ],
      berries: [
        { name: 'Strawberry', category: 'Berries', aisle: 'Produce' },
        { name: 'Blueberry', category: 'Berries', aisle: 'Produce' },
        { name: 'Raspberry', category: 'Berries', aisle: 'Produce' },
        { name: 'Blackberry', category: 'Berries', aisle: 'Produce' },
        { name: 'Cranberry', category: 'Berries', aisle: 'Produce' },
      ],
      citrus: [
        { name: 'Orange', category: 'Citrus', aisle: 'Produce' },
        { name: 'Lemon', category: 'Citrus', aisle: 'Produce' },
        { name: 'Lime', category: 'Citrus', aisle: 'Produce' },
        { name: 'Grapefruit', category: 'Citrus', aisle: 'Produce' },
      ],
      herbs: [
        { name: 'Basil', category: 'Herbs', aisle: 'Produce' },
        { name: 'Cilantro', category: 'Herbs', aisle: 'Produce' },
        { name: 'Parsley', category: 'Herbs', aisle: 'Produce' },
        { name: 'Mint', category: 'Herbs', aisle: 'Produce' },
      ]
    };

    const items = baseIngredients[query as keyof typeof baseIngredients] || baseIngredients.fruits;
    const startIndex = offset;
    const endIndex = Math.min(startIndex + limit, items.length);
    
    const results = items.slice(startIndex, endIndex).map((item, index) => ({
      id: startIndex + index + 1,
      name: item.name,
      image: `https://images.unsplash.com/photo-${1500000000000 + (startIndex + index)}?auto=format&fit=crop&w=400&q=80`,
      aisle: item.aisle,
      categoryPath: [item.category],
      nutrition: {
        nutrients: [
          { name: 'Calories', amount: Math.floor(Math.random() * 100) + 20, unit: 'kcal' },
          { name: 'Protein', amount: Math.floor(Math.random() * 10) + 1, unit: 'g' },
          { name: 'Carbohydrates', amount: Math.floor(Math.random() * 30) + 5, unit: 'g' },
        ]
      }
    }));

    return {
      results,
      offset,
      number: limit,
      totalResults: items.length
    };
  };

  // Initial load
  useEffect(() => {
    fetchIngredients(currentQuery, 0, true);
  }, [currentQuery]);

  // Infinite scroll handler
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop
        >= document.documentElement.offsetHeight - 1000 && 
        hasMore && 
        !loading
      ) {
        fetchIngredients(currentQuery, offset);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [fetchIngredients, currentQuery, offset, hasMore, loading]);

  const handleAddToCart = (ingredient: SpoonacularIngredient) => {
    const product = {
      id: ingredient.id,
      name: ingredient.name,
      price: parseFloat((Math.random() * 8 + 2).toFixed(2)),
      image_url: ingredient.image,
      unit: "lb"
    };
    addToCart(product);
    toast({
      title: "Added to cart",
      description: `${ingredient.name} has been added to your cart.`,
    });
  };

  const handleToggleFavorite = (ingredient: SpoonacularIngredient) => {
    const product = {
      id: ingredient.id,
      name: ingredient.name,
      price: parseFloat((Math.random() * 8 + 2).toFixed(2)),
      image_url: ingredient.image,
      unit: "lb"
    };
    
    if (isFavorite(ingredient.id)) {
      removeFromFavorites(ingredient.id);
    } else {
      addToFavorites(product);
    }
  };

  const handleQueryChange = (newQuery: string) => {
    setCurrentQuery(newQuery);
    setOffset(0);
    setIngredients([]);
    setHasMore(true);
  };

  return (
    <section className="py-24 bg-gradient-to-br from-background via-muted/20 to-background relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-accent rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Enhanced Header */}
        <div className="text-center mb-16 space-y-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4 animate-pulse">
            <Star className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Fresh Produce Collection
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Discover our premium selection of fresh fruits, vegetables, and grains sourced from the finest farms. 
            Each product is carefully selected for quality, freshness, and exceptional nutritional value.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {queries.map((query) => (
            <Button
              key={query}
              variant={currentQuery === query ? "default" : "outline"}
              onClick={() => handleQueryChange(query)}
              className={`capitalize px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                currentQuery === query 
                  ? 'bg-primary text-primary-foreground shadow-lg' 
                  : 'hover:bg-primary/10'
              }`}
            >
              {query === 'fruits' && <Apple className="h-4 w-4 mr-2" />}
              {query === 'grains' && <Wheat className="h-4 w-4 mr-2" />}
              {query}
            </Button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-12">
          {ingredients.map((ingredient, index) => {
            const price = parseFloat((Math.random() * 8 + 2).toFixed(2));
            const category = ingredient.categoryPath?.[0] || ingredient.aisle || 'Fresh Produce';
            
            return (
              <Card 
                key={`${ingredient.id}-${index}`}
                className="group overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 border-0 bg-white/80 backdrop-blur-sm hover:scale-[1.02] animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
                onMouseEnter={() => setHoveredProduct(ingredient.id)}
                onMouseLeave={() => setHoveredProduct(null)}
              >
                <div className="relative aspect-square overflow-hidden">
                  <img 
                    src={ingredient.image} 
                    alt={ingredient.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => {
                      // Fallback to a placeholder if image fails to load
                      e.currentTarget.src = `https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=400&q=80`;
                    }}
                  />
                  
                  {/* Overlay with quick actions */}
                  <div className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
                    hoveredProduct === ingredient.id ? 'opacity-100' : 'opacity-0'
                  }`}>
                    <div className="absolute top-4 right-4 flex flex-col gap-2">
                      <Button
                        size="icon"
                        variant="secondary"
                        className={`w-10 h-10 rounded-full shadow-lg transition-all duration-300 ${
                          isFavorite(ingredient.id) 
                            ? 'bg-red-500 hover:bg-red-600 text-white' 
                            : 'bg-white/90 hover:bg-white text-gray-700'
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleFavorite(ingredient);
                        }}
                      >
                        <Heart className={`h-4 w-4 transition-all duration-300 ${
                          isFavorite(ingredient.id) ? 'fill-current scale-110' : ''
                        }`} />
                      </Button>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow-lg"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    <Badge className="bg-primary text-white font-semibold shadow-lg">
                      Organic
                    </Badge>
                    {Math.random() > 0.7 && (
                      <Badge className="bg-green-500 text-white font-semibold shadow-lg">
                        Fresh
                      </Badge>
                    )}
                  </div>
                </div>
                
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-primary uppercase tracking-wide">
                      {category}
                    </p>
                    <h3 className="font-bold text-lg text-gray-900 line-clamp-2 group-hover:text-primary transition-colors">
                      {ingredient.name}
                    </h3>
                  </div>
                  
                  <div className="text-sm text-gray-600 space-y-1">
                    {ingredient.nutrition?.nutrients.slice(0, 2).map((nutrient, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span>{nutrient.name}:</span>
                        <span className="font-medium">{nutrient.amount}{nutrient.unit}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-primary">
                          ${price.toFixed(2)}
                        </span>
                        <span className="text-sm text-gray-500">/ lb</span>
                      </div>
                    </div>
                    
                    {/* Rating stars */}
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className="h-4 w-4 fill-yellow-400 text-yellow-400" 
                        />
                      ))}
                      <span className="text-xs text-gray-500 ml-1">(4.8)</span>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl py-6 font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-primary/30 group"
                    onClick={() => handleAddToCart(ingredient)}
                  >
                    <ShoppingCart className="h-5 w-5 mr-2 transition-transform group-hover:scale-110" />
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Loading indicator */}
        {loading && (
          <div className="flex items-center justify-center py-8">
            <Loader className="h-8 w-8 animate-spin text-primary mr-2" />
            <span className="text-muted-foreground">Loading more fresh produce...</span>
          </div>
        )}

        {/* Enhanced CTA Section */}
        <div className="text-center mt-16">
          <div className="inline-flex flex-col items-center space-y-4 p-8 bg-white/60 backdrop-blur-sm rounded-3xl border border-border/50 shadow-xl">
            <h3 className="text-2xl font-bold text-primary">
              Discover More Fresh Products
            </h3>
            <p className="text-gray-600 max-w-md">
              Explore our complete collection of farm-fresh produce and artisanal goods
            </p>
            <Button 
              className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground rounded-full px-8 py-6 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              onClick={() => window.location.href = '/shop'}
            >
              View All Products
              <Star className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SpoonacularFeaturedProducts;