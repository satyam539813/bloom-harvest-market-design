import { useState, useEffect, useCallback } from 'react';

interface UseInfiniteScrollProps {
  data: any[];
  itemsPerPage?: number;
  threshold?: number;
}

export const useInfiniteScroll = ({ 
  data, 
  itemsPerPage = 20, 
  threshold = 100 
}: UseInfiniteScrollProps) => {
  const [displayedItems, setDisplayedItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  // Reset when data changes
  useEffect(() => {
    setDisplayedItems(data.slice(0, itemsPerPage));
    setPage(1);
    setHasMore(data.length > itemsPerPage);
  }, [data, itemsPerPage]);

  const loadMore = useCallback(() => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    
    // Simulate loading delay for better UX
    setTimeout(() => {
      const nextPage = page + 1;
      const startIndex = (nextPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const newItems = data.slice(startIndex, endIndex);
      
      if (newItems.length === 0) {
        setHasMore(false);
      } else {
        setDisplayedItems(prev => [...prev, ...newItems]);
        setPage(nextPage);
        setHasMore(endIndex < data.length);
      }
      
      setIsLoading(false);
    }, 500);
  }, [data, page, itemsPerPage, isLoading, hasMore]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + threshold >=
        document.documentElement.offsetHeight
      ) {
        loadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMore, threshold]);

  return {
    displayedItems,
    isLoading,
    hasMore,
    loadMore
  };
};