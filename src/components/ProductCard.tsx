import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Heart, Info, Star } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/contexts/CartContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import LazyImage from './LazyImage';

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

interface ProductCardProps {
  product: Product;
  onProductInfo?: (product: Product) => void;
  index?: number;
}

const ProductCard = ({ product, onProductInfo, index = 0 }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const { toast } = useToast();
  const { addToCart } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFavorite(product.id)) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product);
    }
  };

  const handleProductInfo = (e: React.MouseEvent) => {
    e.stopPropagation();
    onProductInfo?.(product);
  };

  return (
    <Card 
      className="group overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-farm-green/20 border-0 bg-white/80 backdrop-blur-sm hover:scale-[1.02] animate-fade-in cursor-pointer"
      style={{ animationDelay: `${index * 100}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-square overflow-hidden">
        <LazyImage
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          className="w-full h-full transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Overlay with quick actions */}
        <div className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <Button
              size="icon"
              variant="secondary"
              className={`w-10 h-10 rounded-full shadow-lg transition-all duration-300 ${
                isFavorite(product.id) 
                  ? 'bg-red-500 hover:bg-red-600 text-white' 
                  : 'bg-white/90 hover:bg-white text-gray-700'
              }`}
              onClick={handleToggleFavorite}
            >
              <Heart className={`h-4 w-4 transition-all duration-300 ${
                isFavorite(product.id) ? 'fill-current scale-110' : ''
              }`} />
            </Button>
            {onProductInfo && (
              <Button
                size="icon"
                variant="secondary"
                className="w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow-lg"
                onClick={handleProductInfo}
              >
                <Info className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {product.organic && (
            <Badge className="bg-farm-green text-white font-semibold shadow-lg">
              Organic
            </Badge>
          )}
          {product.badge && (
            <Badge className={`font-semibold shadow-lg ${
              product.badge === "Sale" 
                ? "bg-red-500 text-white" 
                : product.badge === "New"
                ? "bg-blue-500 text-white"
                : "bg-purple-500 text-white"
            }`}>
              {product.badge}
            </Badge>
          )}
        </div>

        {/* Discount percentage */}
        {product.discount && product.oldPrice && (
          <div className="absolute bottom-4 left-4">
            <Badge className="bg-red-500 text-white font-bold">
              -{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
            </Badge>
          </div>
        )}
      </div>
      
      <CardContent className="p-4 space-y-3">
        <div className="space-y-1">
          <p className="text-xs font-medium text-farm-green uppercase tracking-wide">
            {product.category}
          </p>
          <h3 className="font-bold text-sm text-gray-900 line-clamp-2 group-hover:text-farm-green-dark transition-colors">
            {product.name}
          </h3>
        </div>
        
        <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <span className="text-lg font-bold text-farm-green-dark">
                ${product.price.toFixed(2)}
              </span>
              <span className="text-xs text-gray-500">/ {product.unit}</span>
            </div>
            {product.discount && product.oldPrice && (
              <span className="text-xs line-through text-gray-400">
                ${product.oldPrice.toFixed(2)}
              </span>
            )}
          </div>
          
          {/* Rating stars */}
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className="h-3 w-3 fill-yellow-400 text-yellow-400" 
              />
            ))}
            <span className="text-xs text-gray-500 ml-1">(4.8)</span>
          </div>
        </div>
        
        <Button 
          className="w-full bg-farm-green hover:bg-farm-green-dark text-white rounded-xl py-4 font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-farm-green/30 group text-sm"
          onClick={handleAddToCart}
        >
          <ShoppingCart className="h-4 w-4 mr-2 transition-transform group-hover:scale-110" />
          Add to Cart
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProductCard;