import React, { useState, useEffect } from 'react';
import { Search, Book, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Layout from '@/components/Layout';

interface WikipediaPage {
  title: string;
  extract: string;
  thumbnail?: {
    source: string;
  };
  pageurl: string;
}

interface WikipediaResponse {
  query: {
    pages: Record<string, WikipediaPage>;
  };
}

const WikipediaInfo = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<WikipediaPage[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('fruits');

  const categories = [
    { id: 'fruits', name: 'Fruits', queries: ['apple', 'banana', 'orange', 'strawberry', 'mango', 'grape'] },
    { id: 'grains', name: 'Grains', queries: ['wheat', 'rice', 'oats', 'barley', 'quinoa', 'corn'] },
    { id: 'vegetables', name: 'Vegetables', queries: ['tomato', 'carrot', 'broccoli', 'spinach', 'potato', 'onion'] }
  ];

  const fetchWikipediaData = async (query: string) => {
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

  const searchWikipedia = async (term: string) => {
    setLoading(true);
    try {
      const data = await fetchWikipediaData(term);
      if (data) {
        setResults([data]);
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error('Error searching Wikipedia:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const loadCategoryData = async (categoryId: string) => {
    setLoading(true);
    const category = categories.find(cat => cat.id === categoryId);
    if (!category) return;

    try {
      const promises = category.queries.map(query => fetchWikipediaData(query));
      const results = await Promise.all(promises);
      const validResults = results.filter(result => result !== null) as WikipediaPage[];
      setResults(validResults);
    } catch (error) {
      console.error('Error loading category data:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategoryData(selectedCategory);
  }, [selectedCategory]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      searchWikipedia(searchTerm.trim());
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-primary/10 via-accent/5 to-background py-16">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Learn About Fresh Produce
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Discover interesting facts and information about fruits, grains, and vegetables from Wikipedia
              </p>
              
              {/* Search Form */}
              <form onSubmit={handleSearch} className="flex gap-2 max-w-md mx-auto mb-8">
                <Input
                  type="text"
                  placeholder="Search for any produce..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" disabled={loading}>
                  <Search className="h-4 w-4" />
                </Button>
              </form>

              {/* Category Filters */}
              <div className="flex flex-wrap justify-center gap-2">
                {categories.map((category) => (
                  <Badge
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    className="cursor-pointer hover:bg-primary/10 transition-colors"
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    {category.name}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="container mx-auto px-4 py-12">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Loading information...</span>
            </div>
          ) : results.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((page, index) => (
                <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardHeader className="pb-4">
                    <div className="flex items-start gap-4">
                      {page.thumbnail && (
                        <img
                          src={page.thumbnail.source}
                          alt={page.title}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1">
                        <CardTitle className="text-lg group-hover:text-primary transition-colors">
                          {page.title}
                        </CardTitle>
                        <div className="flex items-center gap-1 mt-2 text-muted-foreground">
                          <Book className="h-3 w-3" />
                          <span className="text-xs">Wikipedia</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm leading-relaxed mb-4">
                      {page.extract.length > 200 
                        ? `${page.extract.substring(0, 200)}...` 
                        : page.extract}
                    </CardDescription>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(page.pageurl, '_blank')}
                      className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                    >
                      Read More on Wikipedia
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Book className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No results found</h3>
              <p className="text-muted-foreground">
                Try searching for a different term or select a category above.
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default WikipediaInfo;