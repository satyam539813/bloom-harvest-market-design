
import React, { useState } from 'react';
import { products } from '@/data/products';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import ProductCard from './ProductCard';
import ProductInfoModal from './ProductInfoModal';
import { Skeleton } from "@/components/ui/skeleton";

interface ProductGridProps {
  activeCategory: string | null;
  activeFilters: Record<string, any>;
}

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  unit: string;
  image?: string;
  discount?: boolean;
  oldPrice?: number;
  badge?: string;
  organic?: boolean;
  description: string;
}

const ProductGrid = ({ activeCategory, activeFilters }: ProductGridProps) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter products based on selected category and filters
  const filteredProducts = products.filter(product => {
    // Filter by category if one is selected
    if (activeCategory && product.category.toLowerCase() !== activeCategory.toLowerCase()) {
      return false;
    }

    // Filter by other active filters
    if (activeFilters.organic && !product.organic) {
      return false;
    }

    if (activeFilters.onSale && !product.discount) {
      return false;
    }

    // Price range filter
    if (activeFilters.priceRange) {
      const [min, max] = activeFilters.priceRange;
      if (product.price < min || product.price > max) {
        return false;
      }
    }

    return true;
  });

  const { displayedItems, isLoading, hasMore } = useInfiniteScroll({
    data: filteredProducts,
    itemsPerPage: 24
  });

  const handleProductInfo = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  return (
    <div>
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium text-gray-500">No products match your filters</h3>
          <p className="mt-2 text-gray-400">Try adjusting your filters or browse all products</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-6">
            {filteredProducts.length} products found
            {displayedItems.length < filteredProducts.length && 
              ` (showing ${displayedItems.length})`
            }
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
              {[...Array(8)].map((_, i) => (
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
              <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-farm-green/10 to-farm-green-light/20 rounded-full border border-farm-green/20">
                <span className="text-farm-green font-medium">
                  🎉 You've explored all {filteredProducts.length} products!
                </span>
              </div>
            </div>
          )}
        </>
      )}

      {/* Product Info Modal */}
      <ProductInfoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productName={selectedProduct?.name || ''}
        productImage={selectedProduct?.image}
        productDescription={selectedProduct?.description}
        category={selectedProduct?.category}
      />
    </div>
  );
};

export default ProductGrid;
