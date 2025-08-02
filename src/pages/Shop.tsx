
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-farm-green-light/5">
      <Navbar />
      <main className="container mx-auto px-4 py-12 mt-20">
        <div className="text-center mb-12">
          <div className="space-y-4">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-farm-green/10 to-farm-green-light/20 rounded-full border border-farm-green/20 mb-4">
              <span className="text-sm font-medium text-farm-green">🛒 Premium Organic Selection</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-farm-green via-farm-green-dark to-farm-green bg-clip-text text-transparent">
              Shop All Products
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover our carefully curated selection of fresh, organic produce from trusted local farms
            </p>
          </div>
        </div>
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <div className="text-sm text-muted-foreground">
              {(activeCategory || Object.keys(activeFilters).length > 0) && (
                <span className="bg-farm-green/10 text-farm-green px-3 py-1 rounded-full">
                  Filters Active
                </span>
              )}
            </div>
          </div>
          
          {/* Mobile filter button */}
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2 border-farm-green/20 text-farm-green hover:bg-gradient-to-r hover:from-farm-green hover:to-farm-green-dark hover:text-primary-foreground rounded-xl transition-all duration-300">
                  <FilterIcon className="h-4 w-4" />
                  Filters
                  {(activeCategory || Object.keys(activeFilters).length > 0) && (
                    <span className="bg-farm-accent-yellow text-white text-xs px-1.5 py-0.5 rounded-full ml-1">
                      !
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[85%] sm:w-[350px] overflow-y-auto scrollbar-hide bg-gradient-to-br from-background to-farm-green-light/5">
                <div className="py-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-farm-green to-farm-green-dark bg-clip-text text-transparent">Filters</h2>
                    {(activeCategory || Object.keys(activeFilters).length > 0) && (
                      <Button variant="ghost" onClick={clearFilters} size="sm" className="text-farm-green hover:text-primary-foreground hover:bg-gradient-to-r hover:from-farm-green hover:to-farm-green-dark rounded-xl">
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
                    <Button className="w-full mt-6 btn-primary">
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
              <Button variant="outline" onClick={clearFilters} className="btn-secondary">
                Clear All Filters
              </Button>
            )}
          </div>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block w-80 space-y-6 overflow-y-auto scrollbar-hide">
            <div className="card-elegant sticky top-24">
              <h3 className="text-xl font-bold mb-6 bg-gradient-to-r from-farm-green to-farm-green-dark bg-clip-text text-transparent">
                Filter Products
              </h3>
              <ProductFilters 
                activeCategory={activeCategory} 
                onCategoryChange={handleCategoryChange}
                activeFilters={activeFilters}
                onFilterChange={handleFilterChange}
              />
            </div>
          </aside>
          
          <div className="flex-1 space-y-6">
            <div className="bg-gradient-to-r from-card to-farm-green-light/5 rounded-2xl p-6 border border-farm-green/10">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Showing fresh, organic products</span>
                <span className="bg-farm-green/10 text-farm-green px-3 py-1 rounded-full font-medium">
                  Free Delivery Available
                </span>
              </div>
            </div>
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
