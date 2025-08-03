import React, { useState } from 'react';
import { products } from '@/data/products';
import { Button } from "@/components/ui/button";
import { Star, ArrowRight } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import ProductCard from './ProductCard';
import ProductInfoModal from './ProductInfoModal';
import { Skeleton } from "@/components/ui/skeleton";

// Define a type for our product
interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  unit: string;
  image?: string;
  image_url?: string;
  discount?: boolean;
  oldPrice?: number;
  badge?: string;
  organic?: boolean;
  description: string;
}

const FeaturedProducts = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter products based on active tab
  const filteredProducts = activeTab === "all" 
    ? products 
    : products.filter(product => 
        product.category.toLowerCase() === activeTab.toLowerCase()
      );
  
  const { displayedItems, isLoading, hasMore } = useInfiniteScroll({
    data: filteredProducts,
    itemsPerPage: 24
  });
  
  const categories = ["all", ...new Set(products.map(product => product.category.toLowerCase()))];

  const handleProductInfo = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  return (
    <section className="py-24 bg-gradient-to-br from-background via-muted/20 to-background relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 bg-farm-green rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-farm-accent-yellow rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Enhanced Header */}
        <div className="text-center mb-16 space-y-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-farm-green/10 mb-4 animate-pulse">
            <Star className="h-8 w-8 text-farm-green" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-farm-green-dark via-farm-green to-farm-green-dark bg-clip-text text-transparent">
            Featured Products
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Discover our hand-picked selection of premium, organic produce delivered straight from local farms to your doorstep. 
            Each product is carefully selected for quality, freshness, and exceptional taste.
          </p>
        </div>
        
        {/* Enhanced Tabs */}
        <Tabs defaultValue="all" className="w-full max-w-4xl mx-auto mb-16">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-12 bg-white/50 backdrop-blur-sm border border-border/50 p-2 rounded-2xl shadow-lg">
            {categories.slice(0, 4).map((category: string) => (
              <TabsTrigger 
                key={category} 
                value={category}
                className="capitalize px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 data-[state=active]:bg-farm-green data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-farm-green/10"
                onClick={() => setActiveTab(category)}
              >
                {category === "all" ? "All Products" : category}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        
        {/* Enhanced Product Grid with Infinite Scroll */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {displayedItems.map((product: Product, index) => (
            <ProductCard 
              key={product.id}
              product={product}
              onProductInfo={handleProductInfo}
              index={index}
            />
          ))}
        </div>

        {/* Loading skeleton */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 mt-6">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-square w-full rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-8 w-full" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Load more indicator */}
        {!hasMore && displayedItems.length > 0 && (
          <div className="text-center mt-12 py-8">
            <p className="text-muted-foreground text-lg">
              🎉 You've seen all our amazing products!
            </p>
          </div>
        )}

        {/* Enhanced CTA Section */}
        <div className="text-center mt-16">
          <div className="inline-flex flex-col items-center space-y-4 p-8 bg-white/60 backdrop-blur-sm rounded-3xl border border-border/50 shadow-xl">
            <h3 className="text-2xl font-bold text-farm-green-dark">
              Explore Our Complete Collection
            </h3>
            <p className="text-gray-600 max-w-md">
              Browse through hundreds of premium organic products in our shop
            </p>
            <Button 
              className="bg-gradient-to-r from-farm-green to-farm-green-dark hover:from-farm-green-dark hover:to-farm-green text-white rounded-full px-8 py-6 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              onClick={() => window.location.href = '/shop'}
            >
              Shop All {products.length}+ Products
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Product Info Modal */}
        <ProductInfoModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          productName={selectedProduct?.name || ''}
          productImage={selectedProduct?.image || selectedProduct?.image_url}
          productDescription={selectedProduct?.description}
          category={selectedProduct?.category}
        />
      </div>
    </section>
  );
};

export default FeaturedProducts;