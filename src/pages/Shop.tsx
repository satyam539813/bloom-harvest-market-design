
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductGrid from '@/components/ProductGrid';
import ProductFilters from '@/components/ProductFilters';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger, 
  SheetClose
} from "@/components/ui/sheet";
import { FilterIcon } from 'lucide-react';

const Shop = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});

  const handleCategoryChange = (category: string | null) => {
    setActiveCategory(category);
  };

  const handleFilterChange = (filters: Record<string, any>) => {
    setActiveFilters(filters);
  };

  const clearFilters = () => {
    setActiveCategory(null);
    setActiveFilters({});
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8 mt-20">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-farm-green-dark dark:text-farm-green">Shop All Products</h1>
          
          {/* Mobile filter button */}
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <FilterIcon className="h-4 w-4" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[85%] sm:w-[350px] overflow-y-auto scrollbar-hide">
                <div className="py-4">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Filters</h2>
                    {(activeCategory || Object.keys(activeFilters).length > 0) && (
                      <Button variant="ghost" onClick={clearFilters} size="sm" className="text-farm-green hover:text-white hover:bg-farm-green">
                        Clear All
                      </Button>
                    )}
                  </div>
                  <ProductFilters 
                    activeCategory={activeCategory} 
                    onCategoryChange={handleCategoryChange}
                    activeFilters={activeFilters}
                    onFilterChange={handleFilterChange}
                  />
                  <SheetClose asChild>
                    <Button className="w-full mt-6 bg-farm-green hover:bg-farm-green-dark">
                      Apply Filters
                    </Button>
                  </SheetClose>
                </div>
              </SheetContent>
            </Sheet>
          </div>
          
          {/* Desktop clear filters button */}
          <div className="hidden lg:block">
            {(activeCategory || Object.keys(activeFilters).length > 0) && (
              <Button variant="outline" onClick={clearFilters} className="text-farm-green hover:text-white hover:bg-farm-green">
                Clear Filters
              </Button>
            )}
          </div>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block w-64 space-y-6 overflow-y-auto scrollbar-hide">
            <ProductFilters 
              activeCategory={activeCategory} 
              onCategoryChange={handleCategoryChange}
              activeFilters={activeFilters}
              onFilterChange={handleFilterChange}
            />
          </aside>
          
          <Separator orientation="vertical" className="h-auto hidden lg:block" />
          
          <div className="flex-1">
            <ProductGrid 
              activeCategory={activeCategory} 
              activeFilters={activeFilters}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Shop;
