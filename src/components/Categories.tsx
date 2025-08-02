import React from 'react';
import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { categoryList } from '@/data/categories';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Leaf, Star, Sparkles, TrendingUp, Award, Heart, ShoppingCart, Package } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useAuth } from '@/contexts/AuthContext';
import { products } from '@/data/products';

const Categories = () => {
  const navigate = useNavigate();
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null);
  const [activeView, setActiveView] = useState<'categories' | 'favorites' | 'cart' | 'orders'>('categories');
  const { cartItems } = useCart();
  const { favoriteItems } = useFavorites();
  const { user } = useAuth();

  const handleCategoryClick = (categoryName: string) => {
    navigate(`/shop?category=${categoryName.toLowerCase()}`);
  };

  const getCategoryProducts = (categoryName: string) => {
    return products.filter(product => product.category.toLowerCase() === categoryName.toLowerCase());
  };

  const renderViewToggle = () => (
    <div className="flex justify-center mb-12">
      <div className="inline-flex bg-white/80 backdrop-blur-md rounded-2xl p-2 shadow-xl border border-farm-green/20">
        <Button
          variant={activeView === 'categories' ? 'default' : 'ghost'}
          onClick={() => setActiveView('categories')}
          className={`rounded-xl px-6 py-3 font-semibold transition-all duration-300 ${
            activeView === 'categories' 
              ? 'bg-gradient-to-r from-farm-green to-farm-green-dark text-white shadow-lg' 
              : 'text-farm-green hover:bg-farm-green/10'
          }`}
        >
          <Leaf className="h-4 w-4 mr-2" />
          Categories
        </Button>
        <Button
          variant={activeView === 'favorites' ? 'default' : 'ghost'}
          onClick={() => setActiveView('favorites')}
          className={`rounded-xl px-6 py-3 font-semibold transition-all duration-300 relative ${
            activeView === 'favorites' 
              ? 'bg-gradient-to-r from-farm-accent-red to-red-600 text-white shadow-lg' 
              : 'text-farm-green hover:bg-farm-green/10'
          }`}
        >
          <Heart className="h-4 w-4 mr-2" />
          Favorites
          {favoriteItems.length > 0 && (
            <Badge className="absolute -top-2 -right-2 bg-farm-accent-yellow text-farm-green-dark text-xs px-2 py-1 rounded-full min-w-[1.25rem] h-6 flex items-center justify-center animate-pulse">
              {favoriteItems.length}
            </Badge>
          )}
        </Button>
        <Button
          variant={activeView === 'cart' ? 'default' : 'ghost'}
          onClick={() => setActiveView('cart')}
          className={`rounded-xl px-6 py-3 font-semibold transition-all duration-300 relative ${
            activeView === 'cart' 
              ? 'bg-gradient-to-r from-farm-accent-yellow to-orange-500 text-white shadow-lg' 
              : 'text-farm-green hover:bg-farm-green/10'
          }`}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Cart
          {cartItems.length > 0 && (
            <Badge className="absolute -top-2 -right-2 bg-farm-accent-red text-white text-xs px-2 py-1 rounded-full min-w-[1.25rem] h-6 flex items-center justify-center animate-bounce">
              {cartItems.length}
            </Badge>
          )}
        </Button>
        {user && (
          <Button
            variant={activeView === 'orders' ? 'default' : 'ghost'}
            onClick={() => setActiveView('orders')}
            className={`rounded-xl px-6 py-3 font-semibold transition-all duration-300 ${
              activeView === 'orders' 
                ? 'bg-gradient-to-r from-farm-green-dark to-farm-green text-white shadow-lg' 
                : 'text-farm-green hover:bg-farm-green/10'
            }`}
          >
            <Package className="h-4 w-4 mr-2" />
            Orders
          </Button>
        )}
      </div>
    </div>
  );

  const renderFavorites = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-3xl font-bold text-farm-green-dark mb-4">Your Favorite Products</h3>
        <p className="text-gray-600 max-w-2xl mx-auto">
          {favoriteItems.length === 0 
            ? "You haven't added any favorites yet. Start exploring our products!" 
            : `You have ${favoriteItems.length} favorite product${favoriteItems.length === 1 ? '' : 's'}`
          }
        </p>
      </div>
      
      {favoriteItems.length === 0 ? (
        <div className="text-center py-16">
          <Heart className="h-24 w-24 text-gray-300 mx-auto mb-6" />
          <Button 
            onClick={() => navigate('/shop')}
            className="bg-gradient-to-r from-farm-green to-farm-green-dark text-white rounded-full px-8 py-4 font-semibold hover:scale-105 transition-all duration-300"
          >
            Browse Products
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favoriteItems.map((item, index) => (
            <Card 
              key={item.id}
              className="group overflow-hidden border-0 bg-white/90 backdrop-blur-md shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 animate-fade-in rounded-2xl"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="aspect-square relative overflow-hidden rounded-t-2xl">
                <img 
                  src={item.product.image_url || "/placeholder.svg"} 
                  alt={item.product.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute top-4 right-4">
                  <div className="bg-red-500 text-white p-2 rounded-full shadow-lg animate-pulse">
                    <Heart className="h-4 w-4 fill-current" />
                  </div>
                </div>
              </div>
              <CardContent className="p-6">
                <h4 className="font-bold text-lg text-farm-green-dark mb-2">{item.product.name}</h4>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-farm-green">${item.product.price}</span>
                  <span className="text-sm text-gray-500">/ {item.product.unit}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  const renderCart = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-3xl font-bold text-farm-green-dark mb-4">Your Shopping Cart</h3>
        <p className="text-gray-600 max-w-2xl mx-auto">
          {cartItems.length === 0 
            ? "Your cart is empty. Add some fresh products!" 
            : `You have ${cartItems.length} item${cartItems.length === 1 ? '' : 's'} in your cart`
          }
        </p>
      </div>
      
      {cartItems.length === 0 ? (
        <div className="text-center py-16">
          <ShoppingCart className="h-24 w-24 text-gray-300 mx-auto mb-6" />
          <Button 
            onClick={() => navigate('/shop')}
            className="bg-gradient-to-r from-farm-green to-farm-green-dark text-white rounded-full px-8 py-4 font-semibold hover:scale-105 transition-all duration-300"
          >
            Start Shopping
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {cartItems.map((item, index) => (
            <Card 
              key={item.id}
              className="group overflow-hidden border-0 bg-white/90 backdrop-blur-md shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 animate-fade-in rounded-2xl"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="aspect-square relative overflow-hidden rounded-t-2xl">
                <img 
                  src={item.product.image_url || "/placeholder.svg"} 
                  alt={item.product.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute top-4 right-4">
                  <div className="bg-farm-accent-yellow text-farm-green-dark p-2 rounded-full shadow-lg font-bold text-sm animate-bounce">
                    {item.quantity}
                  </div>
                </div>
              </div>
              <CardContent className="p-6">
                <h4 className="font-bold text-lg text-farm-green-dark mb-2">{item.product.name}</h4>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-farm-green">${item.product.price}</span>
                  <span className="text-sm text-gray-500">× {item.quantity}</span>
                </div>
                <div className="mt-2 text-right">
                  <span className="text-lg font-semibold text-farm-green-dark">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-3xl font-bold text-farm-green-dark mb-4">Your Orders</h3>
        <p className="text-gray-600 max-w-2xl mx-auto">
          View your order history and track your deliveries
        </p>
      </div>
      
      <div className="text-center py-16">
        <Package className="h-24 w-24 text-gray-300 mx-auto mb-6" />
        <p className="text-gray-600 mb-6">View detailed order history</p>
        <Button 
          onClick={() => navigate('/orders')}
          className="bg-gradient-to-r from-farm-green to-farm-green-dark text-white rounded-full px-8 py-4 font-semibold hover:scale-105 transition-all duration-300"
        >
          View Order History
        </Button>
      </div>
    </div>
  );

  const renderCategories = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
      {categoryList.map((category, index) => (
        <Card 
          key={category.id} 
          className="group overflow-hidden border-0 bg-white/90 backdrop-blur-md shadow-xl hover:shadow-3xl transition-all duration-700 hover:scale-110 cursor-pointer animate-fade-in rounded-3xl relative"
          style={{ animationDelay: `${index * 150}ms` }}
          onClick={() => handleCategoryClick(category.name)}
          onMouseEnter={() => setHoveredCategory(category.id)}
          onMouseLeave={() => setHoveredCategory(null)}
        >
          {/* Glowing border effect */}
          <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r from-farm-green via-farm-accent-yellow to-farm-accent-red opacity-0 group-hover:opacity-20 transition-opacity duration-700 blur-sm`}></div>
          
          <div className="relative h-96 overflow-hidden rounded-3xl">
            {/* Image with overlay gradient */}
            <div className="absolute inset-0">
              <img 
                src={category.image} 
                alt={category.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-125 group-hover:rotate-2"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent group-hover:from-farm-green/80 transition-all duration-700"></div>
            </div>

            {/* Floating badge with micro-animation */}
            <div className="absolute top-8 right-8 bg-white/95 backdrop-blur-md rounded-full px-6 py-3 shadow-2xl transform transition-all duration-500 group-hover:scale-125 group-hover:rotate-12 animate-pulse">
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-farm-accent-yellow fill-current animate-spin" style={{ animationDuration: '3s' }} />
                <span className="text-lg font-bold text-farm-green-dark">{category.count}</span>
              </div>
            </div>

            {/* Floating sparkles with staggered animations */}
            <div className={`absolute top-12 left-12 transition-all duration-700 ${hoveredCategory === category.id ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
              <Sparkles className="h-6 w-6 text-farm-accent-yellow animate-spin" style={{ animationDuration: '2s' }} />
            </div>
            <div className={`absolute bottom-12 right-12 transition-all duration-700 ${hoveredCategory === category.id ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`} style={{ animationDelay: '0.3s' }}>
              <Sparkles className="h-4 w-4 text-farm-accent-red animate-bounce" />
            </div>
            <div className={`absolute top-1/2 left-8 transition-all duration-700 ${hoveredCategory === category.id ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`} style={{ animationDelay: '0.6s' }}>
              <div className="w-3 h-3 bg-farm-accent-yellow rounded-full animate-ping"></div>
            </div>

            {/* Content overlay */}
            <div className="absolute inset-0 flex flex-col justify-end p-10">
              <CardContent className="text-white p-0 space-y-6">
                {/* Category name with enhanced styling */}
                <div className="space-y-3">
                  <h3 className="text-3xl font-bold text-white group-hover:text-farm-accent-yellow transition-all duration-500 transform group-hover:scale-105 animate-pulse">
                    {category.name}
                  </h3>
                  <div className="w-16 h-1.5 bg-farm-green rounded-full transition-all duration-700 group-hover:w-32 group-hover:bg-gradient-to-r group-hover:from-farm-accent-yellow group-hover:to-farm-accent-red animate-pulse"></div>
                </div>
                
                {/* Description */}
                <p className="text-white/90 text-base leading-relaxed line-clamp-2 transition-all duration-500 group-hover:text-white font-medium">
                  {category.description}
                </p>
                
                {/* Enhanced button with micro-animations */}
                <Button 
                  variant="secondary" 
                  className="w-full bg-white/25 backdrop-blur-md border-white/40 text-white hover:bg-white hover:text-farm-green-dark rounded-full py-8 font-bold text-lg transition-all duration-700 group-hover:scale-110 group-hover:shadow-2xl group-hover:bg-gradient-to-r group-hover:from-farm-accent-yellow group-hover:to-farm-accent-red relative overflow-hidden"
                >
                  {/* Button shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  
                  <span className="flex items-center justify-center space-x-2 relative z-10">
                    <span>Explore {category.name}</span>
                    <ArrowRight className="h-6 w-6 transition-transform duration-500 group-hover:translate-x-2 group-hover:scale-125 animate-pulse" />
                  </span>
                </Button>
              </CardContent>
            </div>

            {/* Hover effect overlay with animated gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-farm-green/30 via-farm-accent-yellow/20 to-farm-accent-red/30 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl"></div>
            
            {/* Animated border on hover */}
            <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-farm-accent-yellow transition-all duration-700 animate-pulse"></div>
          </div>
        </Card>
      ))}
    </div>
  );

  return (
    <section id="categories" className="py-32 bg-gradient-to-br from-farm-green/5 via-farm-accent-yellow/5 to-farm-green/10 relative overflow-hidden">
      {/* Background decorative elements with enhanced animations */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-farm-green to-farm-accent-yellow rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-r from-farm-accent-red to-farm-green rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-farm-accent-yellow to-farm-accent-red rounded-full blur-2xl animate-float" style={{ animationDelay: '4s' }}></div>
        <div className="absolute top-10 right-1/4 w-32 h-32 bg-farm-green/30 rounded-full blur-2xl animate-ping" style={{ animationDuration: '4s' }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Enhanced Header with micro-animations */}
        <div className="text-center mb-24 space-y-8">
          <div className="relative inline-block">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-farm-green/30 to-farm-accent-yellow/20 mb-8 animate-float shadow-2xl">
              <Leaf className="h-12 w-12 text-farm-green animate-pulse" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-farm-accent-yellow animate-ping"></div>
            <div className="absolute -bottom-2 -left-2 w-6 h-6 rounded-full bg-farm-accent-red animate-bounce"></div>
            <div className="absolute top-0 left-0 w-4 h-4 rounded-full bg-farm-green animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>
          
          <h2 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-farm-green via-farm-green-dark to-farm-accent-yellow bg-clip-text text-transparent animate-gradient leading-tight">
            {activeView === 'categories' && 'Shop by Category'}
            {activeView === 'favorites' && 'Your Favorites'}
            {activeView === 'cart' && 'Shopping Cart'}
            {activeView === 'orders' && 'Order History'}
          </h2>
          
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-medium">
            {activeView === 'categories' && 'Explore our carefully curated selection of fresh, organic produce organized by category. Each category features the finest seasonal offerings from our trusted local farmers.'}
            {activeView === 'favorites' && 'Your handpicked selection of favorite products, ready for easy reordering.'}
            {activeView === 'cart' && 'Review your selected items before checkout and enjoy fresh delivery.'}
            {activeView === 'orders' && 'Track your past orders and reorder your favorite items with ease.'}
          </p>
          
          {/* Enhanced Stats Section with micro-animations */}
          <div className="flex justify-center items-center space-x-12 mt-12">
            <div className="text-center group cursor-pointer">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-farm-green to-farm-green-dark mb-3 shadow-lg group-hover:scale-110 transition-all duration-300 animate-pulse">
                <Award className="h-8 w-8 text-white" />
              </div>
              <p className="text-3xl font-bold text-farm-green-dark animate-bounce" style={{ animationDuration: '2s' }}>8</p>
              <p className="text-sm text-gray-600 font-medium">Categories</p>
            </div>
            <div className="text-center group cursor-pointer">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-farm-accent-yellow to-farm-accent-red mb-3 shadow-lg group-hover:scale-110 transition-all duration-300 animate-pulse" style={{ animationDelay: '0.5s' }}>
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <p className="text-3xl font-bold text-farm-green-dark animate-bounce" style={{ animationDuration: '2s', animationDelay: '0.5s' }}>200+</p>
              <p className="text-sm text-gray-600 font-medium">Products</p>
            </div>
            <div className="text-center group cursor-pointer">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-farm-accent-red to-farm-green mb-3 shadow-lg group-hover:scale-110 transition-all duration-300 animate-pulse" style={{ animationDelay: '1s' }}>
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <p className="text-3xl font-bold text-farm-green-dark animate-bounce" style={{ animationDuration: '2s', animationDelay: '1s' }}>100%</p>
              <p className="text-sm text-gray-600 font-medium">Organic</p>
            </div>
          </div>
        </div>

        {/* View Toggle */}
        {renderViewToggle()}

        {/* Content based on active view */}
        <div className="mb-20">
          {activeView === 'categories' && renderCategories()}
          {activeView === 'favorites' && renderFavorites()}
          {activeView === 'cart' && renderCart()}
          {activeView === 'orders' && renderOrders()}
        </div>
      </div>
    </section>
  );
};

export default Categories;