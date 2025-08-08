
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductGrid from '@/components/ProductGrid';
import ProductFilters from '@/components/ProductFilters';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger, 
  SheetClose,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet";
import { 
  FilterIcon, 
  Grid3X3, 
  List, 
  SlidersHorizontal,
  X,
  Sparkles
} from 'lucide-react';

const Shop = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

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

  const activeFilterCount = Object.keys(activeFilters).length + (activeCategory ? 1 : 0);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-12 bg-gradient-to-br from-primary/5 via-background to-primary/5 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.06)_0%,transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--primary)/0.06)_0%,transparent_50%)]"></div>
        
        <div className="container mx-auto px-4 relative">
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm">
              <Sparkles className="w-4 h-4" />
              Premium Organic Collection
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Fresh, Organic{" "}
              <span className="bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
                Groceries
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Discover our premium collection of farm-fresh, organic produce and artisanal food products, 
              carefully sourced from local farmers and trusted suppliers.
            </p>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-12">
        {/* Filters Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-normal text-muted-foreground">All Products</h2>
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="gap-2">
                <SlidersHorizontal className="w-3 h-3" />
                {activeFilterCount} Filter{activeFilterCount > 1 ? 's' : ''} Active
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="hidden sm:flex items-center bg-muted rounded-lg p-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="px-3 py-1.5"
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="px-3 py-1.5"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>

            {/* Clear Filters */}
            {activeFilterCount > 0 && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={clearFilters} 
                className="gap-2 hidden md:flex"
              >
                <X className="w-4 h-4" />
                Clear Filters
              </Button>
            )}
            
            {/* Mobile Filter Button */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 md:hidden">
                  <FilterIcon className="h-4 w-4" />
                  Filters
                  {activeFilterCount > 0 && (
                    <Badge variant="destructive" className="ml-1 px-1.5 py-0.5 text-xs">
                      {activeFilterCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[85%] sm:w-[400px] overflow-y-auto">
                <SheetHeader className="space-y-4 pb-6 border-b border-border">
                  <SheetTitle className="text-left text-xl font-semibold">
                    Filter Products
                  </SheetTitle>
                  {activeFilterCount > 0 && (
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="gap-2">
                        <SlidersHorizontal className="w-3 h-3" />
                        {activeFilterCount} Active
                      </Badge>
                      <Button variant="ghost" onClick={clearFilters} size="sm" className="gap-2">
                        <X className="w-4 h-4" />
                        Clear All
                      </Button>
                    </div>
                  )}
                </SheetHeader>
                <div className="py-6">
                  <ProductFilters 
                    activeCategory={activeCategory} 
                    onCategoryChange={handleCategoryChange}
                    activeFilters={activeFilters}
                    onFilterChange={handleFilterChange}
                  />
                  <SheetClose asChild>
                    <Button className="w-full mt-6">
                      Apply Filters
                    </Button>
                  </SheetClose>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-80 space-y-6">
            <div className="sticky top-24 space-y-6">
              <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-foreground">Filters</h3>
                  {activeFilterCount > 0 && (
                    <Button variant="ghost" onClick={clearFilters} size="sm" className="gap-2 text-xs">
                      <X className="w-3 h-3" />
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
              </div>
            </div>
          </aside>
          
          {/* Main Content */}
          <div className="flex-1 space-y-6">
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
