import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Menu, X, User, LogOut, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Navbar = () => {
  const { user, signOut } = useAuth();
  const { cartItems } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const isActive = (path: string) => location.pathname === path;

  const navigationLinks = [
    { path: "/", label: "Home" },
    { path: "/shop", label: "Shop" },
    { path: "/image-analysis", label: "AI Vision", icon: Eye },
    { path: "/about", label: "About" },
    { path: "/contact", label: "Contact" },
  ];

  return (
    <nav className="bg-gradient-to-r from-background via-background to-farm-green-light/5 backdrop-blur-lg border-b border-farm-green/10 sticky top-0 z-50 shadow-soft">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="bg-gradient-to-br from-farm-green to-farm-green-dark text-primary-foreground p-3 rounded-2xl shadow-soft group-hover:shadow-glow transition-all duration-300 group-hover:scale-110">
              <span className="font-bold text-xl">🌱</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold bg-gradient-to-r from-farm-green to-farm-green-dark bg-clip-text text-transparent">FarmFresh</span>
              <span className="text-xs text-muted-foreground -mt-1">Organic Marketplace</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navigationLinks.map((link) => {
              const IconComponent = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 ${
                    isActive(link.path)
                      ? "bg-gradient-to-r from-farm-green/20 to-farm-green-light/30 text-farm-green shadow-soft border border-farm-green/20"
                      : "text-foreground/80 hover:text-farm-green hover:bg-gradient-to-r hover:from-farm-green/10 hover:to-farm-green-light/20 hover:shadow-soft"
                  }`}
                >
                  {IconComponent && <IconComponent className="h-4 w-4" />}
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Right side buttons */}
          <div className="flex items-center space-x-3">
            {user ? (
              <>
                <Link to="/orders" className="hidden md:flex">
                  <Button variant="ghost" size="sm" className="text-foreground/80 hover:text-farm-green hover:bg-farm-green/10 rounded-xl transition-all duration-300">
                    <User className="h-4 w-4 mr-2" />
                    Orders
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className="hidden md:flex text-foreground/80 hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all duration-300"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <Link to="/auth" className="hidden md:flex">
                <Button variant="ghost" size="sm" className="text-foreground/80 hover:text-farm-green hover:bg-farm-green/10 rounded-xl transition-all duration-300">
                  <User className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
              </Link>
            )}

            {/* Cart button */}
            <Link to="/shop" className="relative group">
              <Button variant="ghost" size="sm" className="text-foreground/80 hover:text-farm-green hover:bg-farm-green/10 rounded-xl transition-all duration-300 group-hover:scale-105">
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-farm-green to-farm-green-dark text-primary-foreground text-xs px-2 py-1 rounded-full min-w-[1.25rem] h-6 flex items-center justify-center shadow-soft animate-pulse">
                    {itemCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden text-foreground/80 hover:text-farm-green hover:bg-farm-green/10 rounded-xl transition-all duration-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-farm-green/10 bg-gradient-to-br from-background to-farm-green-light/5 backdrop-blur-lg pb-4 animate-fade-in">
            <div className="flex flex-col space-y-3 pt-6">
              {navigationLinks.map((link) => {
                const IconComponent = link.icon;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center space-x-3 mx-4 px-4 py-4 text-sm font-medium rounded-xl transition-all duration-300 ${
                      isActive(link.path) 
                        ? "text-farm-green bg-gradient-to-r from-farm-green/20 to-farm-green-light/30 shadow-soft border border-farm-green/20" 
                        : "text-foreground/80 hover:text-farm-green hover:bg-gradient-to-r hover:from-farm-green/10 hover:to-farm-green-light/20"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {IconComponent && <IconComponent className="h-5 w-5" />}
                    <span>{link.label}</span>
                  </Link>
                );
              })}
              
              {user ? (
                <>
                  <Link
                    to="/orders"
                    className="flex items-center space-x-3 mx-4 px-4 py-4 text-sm font-medium text-foreground/80 hover:text-farm-green hover:bg-gradient-to-r hover:from-farm-green/10 hover:to-farm-green-light/20 rounded-xl transition-all duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="h-5 w-5" />
                    <span>Orders</span>
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center space-x-3 mx-4 px-4 py-4 text-sm font-medium text-foreground/80 hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all duration-300 w-full text-left"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <Link
                  to="/auth"
                  className="flex items-center space-x-3 mx-4 px-4 py-4 text-sm font-medium text-foreground/80 hover:text-farm-green hover:bg-gradient-to-r hover:from-farm-green/10 hover:to-farm-green-light/20 rounded-xl transition-all duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="h-5 w-5" />
                  <span>Sign In</span>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
