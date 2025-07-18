import { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader, Star, Heart, ShoppingCart, Apple, Wheat } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/contexts/CartContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { productService } from '@/services/productService';
import { Product } from '@/services/api/types';

const SpoonacularFeaturedProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [currentQuery, setCurrentQuery] = useState('fruits');
  const { toast } = useToast();
  const { addToCart } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();

  const ITEMS_PER_PAGE = 12;
  const queries = ['fruits', 'vegetables', 'grains', 'berries', 'citrus', 'herbs'];

  const fetchProducts = useCallback(async (category: string) => {
    if (loading) return;

    setLoading(true);

    try {
      // Lightning-fast loading with preloaded cache
      const fetchedProducts = await productService.getProductsByCategory(category, ITEMS_PER_PAGE);
      setProducts(fetchedProducts);

      // Products loaded silently for better UX
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "Error loading products",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast, loading]); // Keep loading dependency for proper state management

  // Initial load
  useEffect(() => {
    fetchProducts(currentQuery);
  }, [currentQuery, fetchProducts]);

  // Helper function to convert string ID to number for compatibility with existing contexts
  const getNumericId = useCallback((id: string): number => {
    // Extract numeric part from string ID or generate a hash
    const numericPart = id.replace(/\D/g, '');
    return numericPart ? parseInt(numericPart) : Math.abs(id.split('').reduce((a, b) => a + b.charCodeAt(0), 0));
  }, []);

  const handleAddToCart = useCallback((product: Product) => {
    const cartProduct = {
      id: getNumericId(product.id),
      name: product.name,
      price: product.price,
      image_url: product.image,
      unit: product.unit
    };
    addToCart(cartProduct);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  }, [addToCart, toast, getNumericId]);

  const handleToggleFavorite = useCallback((product: Product) => {
    const numericId = getNumericId(product.id);
    const favoriteProduct = {
      id: numericId,
      name: product.name,
      price: product.price,
      image_url: product.image,
      unit: product.unit
    };

    if (isFavorite(numericId)) {
      removeFromFavorites(numericId);
    } else {
      addToFavorites(favoriteProduct);
    }
  }, [addToFavorites, removeFromFavorites, isFavorite, getNumericId]);

  const handleQueryChange = useCallback((newQuery: string) => {
    setCurrentQuery(newQuery);
  }, []);

  // Memoize fallback images to prevent recreation on every render
  const fallbackImages = useMemo(() => ({
    'fruits': 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=400&q=80',
    'vegetables': 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=400&q=80',
    'grains': 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=400&q=80',
    'berries': 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?auto=format&fit=crop&w=400&q=80',
    'citrus': 'https://images.unsplash.com/photo-1557800636-894a64c1696f?auto=format&fit=crop&w=400&q=80',
    'herbs': 'https://images.unsplash.com/photo-1515586000433-45406d8e6662?auto=format&fit=crop&w=400&q=80'
  }), []);

  // Memoize the image error handler
  const handleImageError = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = fallbackImages[currentQuery as keyof typeof fallbackImages] || fallbackImages.fruits;
  }, [fallbackImages, currentQuery]);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Clean Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Fresh Produce
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our premium selection of fresh, organic produce sourced directly from local farms.
          </p>
        </div>

        {/* Simple Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {queries.map((query) => (
            <Button
              key={query}
              variant={currentQuery === query ? "default" : "outline"}
              onClick={() => handleQueryChange(query)}
              className={`capitalize px-4 py-2 rounded-lg transition-all duration-200 ${currentQuery === query
                ? 'bg-green-600 text-white'
                : 'hover:bg-green-50'
                }`}
            >
              {query === 'fruits' && <Apple className="h-4 w-4 mr-2" />}
              {query === 'grains' && <Wheat className="h-4 w-4 mr-2" />}
              {query}
            </Button>
          ))}
        </div>

        {/* Modern Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {products.map((product, index) => (
            <Card
              key={`${product.id}-${index}`}
              className="group overflow-hidden border border-gray-200 hover:border-green-300 transition-all duration-300 hover:shadow-lg bg-white"
              onMouseEnter={() => setHoveredProduct(product.id)}
              onMouseLeave={() => setHoveredProduct(null)}
            >
              <div className="relative aspect-square overflow-hidden bg-gray-50">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={handleImageError}
                />

                {/* Quick Actions */}
                <div className={`absolute top-3 right-3 flex gap-2 transition-opacity duration-200 ${hoveredProduct === product.id ? 'opacity-100' : 'opacity-0'
                  }`}>
                  <Button
                    size="icon"
                    variant="secondary"
                    className={`w-8 h-8 rounded-full shadow-md ${isFavorite(getNumericId(product.id))
                      ? 'bg-red-500 hover:bg-red-600 text-white'
                      : 'bg-white hover:bg-gray-50'
                      }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleFavorite(product);
                    }}
                  >
                    <Heart className={`h-4 w-4 ${isFavorite(getNumericId(product.id)) ? 'fill-current' : ''
                      }`} />
                  </Button>
                </div>

                {/* Organic Badge */}
                <div className="absolute top-3 left-3">
                  <Badge className="bg-green-100 text-green-800 text-xs font-medium">
                    Organic
                  </Badge>
                </div>
              </div>

              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-green-600 font-medium uppercase tracking-wide">
                      {product.category}
                    </p>
                    <h3 className="font-semibold text-gray-900 mt-1">
                      {product.name}
                    </h3>
                  </div>

                  {/* Nutrition Summary */}
                  {product.nutritionSummary && (
                    <div className="text-xs text-gray-600 space-y-1">
                      <div className="flex justify-between">
                        <span>Calories:</span>
                        <span className="font-medium">{product.nutritionSummary.calories}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Protein:</span>
                        <span className="font-medium">{product.nutritionSummary.protein}g</span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-bold text-gray-900">
                        ₹{Math.round(product.price)}
                      </span>
                      <span className="text-sm text-gray-500">/ kg</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-gray-600">4.8</span>
                    </div>
                  </div>

                  <Button
                    className="w-full bg-green-600 hover:bg-green-700 text-white rounded-lg py-2 font-medium transition-colors duration-200"
                    onClick={() => handleAddToCart(product)}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Loading indicator */}
        {loading && (
          <div className="flex items-center justify-center py-8">
            <Loader className="h-6 w-6 animate-spin text-green-600 mr-2" />
            <span className="text-gray-600">Loading more products...</span>
          </div>
        )}

        {/* Simple CTA */}
        <div className="text-center mt-12">
          <Button
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium"
            onClick={() => window.location.href = '/shop'}
          >
            View All Products
          </Button>
        </div>
      </div>
    </section>
  );
};

export default SpoonacularFeaturedProducts;