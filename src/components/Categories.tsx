import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { categoryList } from '@/data/categories';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Categories = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryName: string) => {
    navigate(`/shop?category=${categoryName.toLowerCase()}`);
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Simple Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Shop by Category
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Browse our fresh produce organized by category to find exactly what you need.
          </p>
        </div>

        {/* Clean Category Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categoryList.slice(0, 8).map((category) => (
            <Card 
              key={category.id} 
              className="group overflow-hidden border border-gray-200 hover:border-green-300 transition-all duration-300 hover:shadow-lg cursor-pointer bg-white"
              onClick={() => handleCategoryClick(category.name)}
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={category.image} 
                  alt={category.name} 
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300"></div>
                
                {/* Category count badge */}
                <div className="absolute top-3 right-3 bg-white/90 rounded-full px-3 py-1">
                  <span className="text-sm font-semibold text-gray-900">{category.count}</span>
                </div>
              </div>
              
              <CardContent className="p-4">
                <div className="space-y-2">
                  <h3 className="font-bold text-lg text-gray-900 group-hover:text-green-600 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {category.description}
                  </p>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-between p-0 h-auto text-green-600 hover:text-green-700 font-medium"
                  >
                    <span>Shop {category.name}</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;