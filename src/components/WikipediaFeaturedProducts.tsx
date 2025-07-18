import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader, Star, ExternalLink, Sparkles, Apple, Wheat } from "lucide-react";

interface WikipediaPage {
  title: string;
  extract: string;
  thumbnail?: {
    source: string;
  };
  pageurl: string;
}

const WikipediaFeaturedProducts = () => {
  const [fruits, setFruits] = useState<WikipediaPage[]>([]);
  const [grains, setGrains] = useState<WikipediaPage[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fruitsList = [
    'apple', 'banana', 'orange', 'strawberry', 'mango', 'grape', 'pineapple', 
    'watermelon', 'kiwi', 'peach', 'plum', 'cherry', 'blueberry', 'raspberry',
    'blackberry', 'pomegranate', 'papaya', 'avocado', 'lemon', 'lime',
    'grapefruit', 'cantaloupe', 'honeydew', 'passion fruit', 'dragon fruit'
  ];

  const grainsList = [
    'wheat', 'rice', 'oats', 'barley', 'quinoa', 'corn', 'rye', 'millet',
    'buckwheat', 'amaranth', 'sorghum', 'teff', 'wild rice', 'brown rice',
    'bulgur', 'couscous', 'farro', 'spelt', 'kamut', 'freekeh'
  ];

  const fetchWikipediaData = async (query: string): Promise<WikipediaPage | null> => {
    try {
      const response = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`
      );
      
      if (response.ok) {
        const data = await response.json();
        return {
          title: data.title,
          extract: data.extract,
          thumbnail: data.thumbnail,
          pageurl: data.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(query)}`
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching Wikipedia data:', error);
      return null;
    }
  };

  const loadMoreItems = useCallback(async () => {
    if (loading) return;
    
    setLoading(true);
    
    const itemsPerPage = 6;
    const startIndex = (page - 1) * itemsPerPage;
    
    // Get items for current page
    const currentFruits = fruitsList.slice(startIndex, startIndex + itemsPerPage / 2);
    const currentGrains = grainsList.slice(startIndex, startIndex + itemsPerPage / 2);
    
    try {
      // Fetch fruits data
      const fruitPromises = currentFruits.map(fruit => fetchWikipediaData(fruit));
      const grainPromises = currentGrains.map(grain => fetchWikipediaData(grain));
      
      const [newFruits, newGrains] = await Promise.all([
        Promise.all(fruitPromises),
        Promise.all(grainPromises)
      ]);
      
      const validFruits = newFruits.filter(Boolean) as WikipediaPage[];
      const validGrains = newGrains.filter(Boolean) as WikipediaPage[];
      
      setFruits(prev => [...prev, ...validFruits]);
      setGrains(prev => [...prev, ...validGrains]);
      
      // Check if we have more items
      const totalItems = Math.max(fruitsList.length, grainsList.length);
      if (startIndex + itemsPerPage >= totalItems) {
        setHasMore(false);
      }
      
      setPage(prev => prev + 1);
    } catch (error) {
      console.error('Error loading items:', error);
    } finally {
      setLoading(false);
    }
  }, [page, loading]);

  // Initial load
  useEffect(() => {
    loadMoreItems();
  }, []);

  // Infinite scroll handler
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop
        >= document.documentElement.offsetHeight - 1000 && 
        hasMore && 
        !loading
      ) {
        loadMoreItems();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMoreItems, hasMore, loading]);

  const allItems = [...fruits, ...grains].sort(() => Math.random() - 0.5); // Shuffle items

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
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 animate-pulse">
              <Apple className="h-8 w-8 text-primary" />
            </div>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 animate-pulse">
              <Wheat className="h-8 w-8 text-accent" />
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Fresh Fruits & Wholesome Grains
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Discover the nutritional benefits and fascinating facts about nature's finest fruits and grains. 
            Learn about each product's origin, benefits, and uses while you browse our selection.
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {allItems.map((item, index) => {
            const isFruit = fruits.includes(item);
            const category = isFruit ? 'fruit' : 'grain';
            const categoryIcon = isFruit ? Apple : Wheat;
            const CategoryIcon = categoryIcon;
            
            return (
              <Card 
                key={`${item.title}-${index}`}
                className="group overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 border-0 bg-card/80 backdrop-blur-sm hover:scale-[1.02] animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start gap-4">
                    {item.thumbnail && (
                      <img
                        src={item.thumbnail.source}
                        alt={item.title}
                        className="w-16 h-16 object-cover rounded-lg group-hover:scale-110 transition-transform duration-300"
                      />
                    )}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant={isFruit ? "default" : "secondary"} className="text-xs">
                          <CategoryIcon className="h-3 w-3 mr-1" />
                          {category}
                        </Badge>
                        {Math.random() > 0.5 && (
                          <Badge variant="outline" className="text-xs">
                            <Sparkles className="h-3 w-3 mr-1" />
                            Organic
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2">
                        {item.title}
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                    {item.extract}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className="h-4 w-4 fill-yellow-400 text-yellow-400" 
                        />
                      ))}
                      <span className="text-xs text-muted-foreground ml-1">(4.8)</span>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-primary">
                        ${(Math.random() * 5 + 2).toFixed(2)}
                      </span>
                      <span className="text-sm text-muted-foreground ml-1">/ lb</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 hover:shadow-lg"
                      size="sm"
                    >
                      Add to Cart
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                      onClick={() => window.open(item.pageurl, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
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

        {/* Load more button (fallback for manual loading) */}
        {!loading && hasMore && (
          <div className="text-center">
            <Button
              onClick={loadMoreItems}
              className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground rounded-full px-8 py-6 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Load More Fresh Produce
              <Sparkles className="ml-2 h-5 w-5" />
            </Button>
          </div>
        )}

        {/* End message */}
        {!hasMore && !loading && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">You've seen all our amazing fresh produce!</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default WikipediaFeaturedProducts;