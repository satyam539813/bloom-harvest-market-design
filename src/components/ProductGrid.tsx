
import { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Heart, Loader } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCart } from '@/contexts/CartContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { productService } from '@/services/productService';
import { Product } from '@/services/api/types';

interface ProductGridProps {
  activeCategory: string | null;
  activeFilters: Record<string, any>;
}

const ProductGrid = ({ activeCategory, activeFilters }: ProductGridProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  
  const { toast } = useToast();
  const { addToCart } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const ITEMS_PER_PAGE = 12;

  // Helper function to convert string ID to number for compatibility
  const getNumericId = (id: string): number => {
    const numericPart = id.replace(/\D/g, '');
    return numericPart ? parseInt(numericPart) : Math.abs(id.split('').reduce((a, b) => a + b.charCodeAt(0), 0));
  };

  // Load initial products - get ALL products for the category
  const loadProducts = useCallback(async (category: string | null, reset = false) => {
    if (loading && !reset) return;
    
    setLoading(true);
    
    try {
      const categoryToFetch = category || 'fruits';
      // Get ALL products for the category (up to 50)
      const allProducts = await productService.getProductsByCategory(categoryToFetch, 50);
      
      // Set initial batch for display
      const initialBatch = allProducts.slice(0, ITEMS_PER_PAGE);
      setProducts(initialBatch);
      setHasMore(allProducts.length > ITEMS_PER_PAGE);
      setPage(1);
      
      // Store all products for infinite scroll
      setAllProducts(allProducts);
      
      console.log(`Loaded ${allProducts.length} products for ${categoryToFetch}`);
    } catch (error) {
      console.error('Error loading products:', error);
      toast({
        title: "Error loading products",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Load more products for infinite scroll from cached data
  const loadMoreProducts = useCallback(async () => {
    if (loadingMore || !hasMore || !allProducts.length) return;
    
    setLoadingMore(true);
    
    try {
      const startIndex = page * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      const nextBatch = allProducts.slice(startIndex, endIndex);
      
      if (nextBatch.length > 0) {
        setProducts(prev => [...prev, ...nextBatch]);
        setPage(prev => prev + 1);
        setHasMore(endIndex < allProducts.length);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading more products:', error);
    } finally {
      setLoadingMore(false);
    }
  }, [page, hasMore, allProducts, loadingMore]);

  // Set up intersection observer for infinite scroll
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          loadMoreProducts();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, loadingMore, loadMoreProducts]);

  // Load products when category changes
  useEffect(() => {
    loadProducts(activeCategory, true);
  }, [activeCategory, loadProducts]);

  const handleAddToCart = (product: Product) => {
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
  };

  const handleToggleFavorite = (product: Product) => {
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
  };

  // Filter products based on active filters
  const filteredProducts = products.filter(product => {
    // Apply additional filters here if needed
    if (activeFilters.priceRange) {
      const [min, max] = activeFilters.priceRange;
      if (product.price < min || product.price > max) {
        return false;
      }
    }
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="h-8 w-8 animate-spin text-green-600 mr-2" />
        <span className="text-gray-600">Loading fresh products...</span>
      </div>
    );
  }

  return (
    <div>
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium text-gray-500">No products available</h3>
          <p className="mt-2 text-gray-400">Try selecting a different category</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-4">
            {filteredProducts.length} products {hasMore && '(loading more as you scroll)'}
          </p>
          
          {/* Product Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => (
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
                    loading="lazy"
                  />

                  {/* Quick Actions */}
                  <div className={`absolute top-3 right-3 flex gap-2 transition-opacity duration-200 ${
                    hoveredProduct === product.id ? 'opacity-100' : 'opacity-0'
                  }`}>
                    <Button
                      size="icon"
                      variant="secondary"
                      className={`w-8 h-8 rounded-full shadow-md ${
                        isFavorite(getNumericId(product.id))
                          ? 'bg-red-500 hover:bg-red-600 text-white'
                          : 'bg-white hover:bg-gray-50'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleFavorite(product);
                      }}
                    >
                      <Heart className={`h-4 w-4 ${
                        isFavorite(getNumericId(product.id)) ? 'fill-current' : ''
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
                        <span className="text-sm text-gray-500">/ {product.unit}</span>
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

          {/* Infinite Scroll Trigger */}
          <div ref={loadMoreRef} className="py-8">
            {loadingMore && (
              <div className="flex items-center justify-center">
                <Loader className="h-6 w-6 animate-spin text-green-600 mr-2" />
                <span className="text-gray-600">Loading more products...</span>
              </div>
            )}
            {!hasMore && filteredProducts.length > 0 && (
              <div className="text-center text-gray-500">
                <p>You've seen all products in this category!</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ProductGrid;
