
import React, { useState } from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { categoryList } from '@/data/categories';
import { ChevronDown, ChevronRight, Filter } from 'lucide-react';

interface ProductFiltersProps {
  activeCategory: string | null;
  activeFilters: Record<string, any>;
  onCategoryChange: (category: string | null) => void;
  onFilterChange: (filters: Record<string, any>) => void;
}

const ProductFilters = ({ 
  activeCategory, 
  activeFilters, 
  onCategoryChange, 
  onFilterChange 
}: ProductFiltersProps) => {
  
  const [categoriesOpen, setCategoriesOpen] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [priceOpen, setPriceOpen] = useState(true);

  const handleCheckboxChange = (key: string) => {
    const newFilters = { ...activeFilters };
    newFilters[key] = !newFilters[key];
    onFilterChange(newFilters);
  };

  const handlePriceRangeChange = (values: number[]) => {
    const newFilters = { ...activeFilters, priceRange: values };
    onFilterChange(newFilters);
  };

  return (
    <div className="space-y-4">
      {/* Categories Section */}
      <Collapsible open={categoriesOpen} onOpenChange={setCategoriesOpen}>
        <CollapsibleTrigger asChild>
          <Button 
            variant="ghost" 
            className="w-full justify-between p-3 h-auto hover:bg-muted/50"
          >
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              <span className="font-medium">Categories</span>
            </div>
            {categoriesOpen ? (
              <ChevronDown className="w-4 h-4 transition-transform" />
            ) : (
              <ChevronRight className="w-4 h-4 transition-transform" />
            )}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-2 pt-2">
          <div className="ml-6 space-y-1">
            <button 
              onClick={() => onCategoryChange(null)}
              className={`text-left w-full px-3 py-2 rounded-lg hover:bg-primary/10 transition-all duration-200 ${
                !activeCategory 
                  ? 'font-medium text-primary bg-primary/10 shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              All Products
            </button>
            {categoryList.map((category) => (
              <button 
                key={category.id}
                onClick={() => onCategoryChange(category.name)}
                className={`text-left w-full px-3 py-2 rounded-lg hover:bg-primary/10 transition-all duration-200 ${
                  activeCategory === category.name 
                    ? 'font-medium text-primary bg-primary/10 shadow-sm' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
      
      <Separator />
      
      {/* Filters Section */}
      <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen}>
        <CollapsibleTrigger asChild>
          <Button 
            variant="ghost" 
            className="w-full justify-between p-3 h-auto hover:bg-muted/50"
          >
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              <span className="font-medium">Product Filters</span>
            </div>
            {filtersOpen ? (
              <ChevronDown className="w-4 h-4 transition-transform" />
            ) : (
              <ChevronRight className="w-4 h-4 transition-transform" />
            )}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-3 pt-2">
          <div className="ml-6 space-y-3">
            <div className="flex items-center space-x-2 p-3 hover:bg-primary/5 rounded-lg transition-all duration-200">
              <Checkbox 
                id="organic" 
                checked={!!activeFilters.organic}
                onCheckedChange={() => handleCheckboxChange('organic')}
                className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <label
                htmlFor="organic"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                Organic Products
              </label>
            </div>
            <div className="flex items-center space-x-2 p-3 hover:bg-primary/5 rounded-lg transition-all duration-200">
              <Checkbox 
                id="sale" 
                checked={!!activeFilters.onSale}
                onCheckedChange={() => handleCheckboxChange('onSale')}
                className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <label
                htmlFor="sale"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                On Sale
              </label>
            </div>
            <div className="flex items-center space-x-2 p-3 hover:bg-primary/5 rounded-lg transition-all duration-200">
              <Checkbox 
                id="premium" 
                checked={!!activeFilters.premium}
                onCheckedChange={() => handleCheckboxChange('premium')}
                className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <label
                htmlFor="premium"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                Premium Quality
              </label>
            </div>
            <div className="flex items-center space-x-2 p-3 hover:bg-primary/5 rounded-lg transition-all duration-200">
              <Checkbox 
                id="local" 
                checked={!!activeFilters.local}
                onCheckedChange={() => handleCheckboxChange('local')}
                className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <label
                htmlFor="local"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                Local Farms
              </label>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
      
      <Separator />
      
      {/* Price Range Section */}
      <Collapsible open={priceOpen} onOpenChange={setPriceOpen}>
        <CollapsibleTrigger asChild>
          <Button 
            variant="ghost" 
            className="w-full justify-between p-3 h-auto hover:bg-muted/50"
          >
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              <span className="font-medium">Price Range</span>
            </div>
            {priceOpen ? (
              <ChevronDown className="w-4 h-4 transition-transform" />
            ) : (
              <ChevronRight className="w-4 h-4 transition-transform" />
            )}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2">
          <div className="ml-6 px-2 space-y-4">
            <Slider
              defaultValue={[0, 50]}
              max={50}
              step={1}
              value={activeFilters.priceRange || [0, 50]}
              onValueChange={handlePriceRangeChange}
              className="mb-4"
            />
            <div className="flex justify-between text-sm text-muted-foreground bg-muted/30 px-3 py-2 rounded-lg">
              <span className="font-medium">₹{activeFilters.priceRange ? activeFilters.priceRange[0] : 0}</span>
              <span className="font-medium">₹{activeFilters.priceRange ? activeFilters.priceRange[1] : 50}+</span>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default ProductFilters;
