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
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-farm-green text-white p-2 rounded-lg">
              <span className="font-bold text-lg">F</span>
            </div>
            <span className="text-xl font-bold text-farm-green-dark">FarmFresh</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationLinks.map((link) => {
              const IconComponent = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center space-x-1 text-sm font-medium transition-colors hover:text-farm-green ${
                    isActive(link.path)
                      ? "text-farm-green border-b-2 border-farm-green pb-1"
                      : "text-gray-700"
                  }`}
                >
                  {IconComponent && <IconComponent className="h-4 w-4" />}
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Right side buttons */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/orders" className="hidden md:flex">
                  <Button variant="ghost" size="sm" className="text-gray-700 hover:text-farm-green">
                    <User className="h-4 w-4 mr-2" />
                    Orders
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className="hidden md:flex text-gray-700 hover:text-farm-green"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <Link to="/auth" className="hidden md:flex">
                <Button variant="ghost" size="sm" className="text-gray-700 hover:text-farm-green">
                  <User className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
              </Link>
            )}

            {/* Cart button */}
            <Link to="/shop" className="relative">
              <Button variant="ghost" size="sm" className="text-gray-700 hover:text-farm-green">
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-farm-green text-white text-xs px-1.5 py-0.5 rounded-full min-w-[1.25rem] h-5 flex items-center justify-center">
                    {itemCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t bg-white pb-4">
            <div className="flex flex-col space-y-2 pt-4">
              {navigationLinks.map((link) => {
                const IconComponent = link.icon;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium transition-colors hover:text-farm-green hover:bg-gray-50 ${
                      isActive(link.path) ? "text-farm-green bg-farm-green/5" : "text-gray-700"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {IconComponent && <IconComponent className="h-4 w-4" />}
                    <span>{link.label}</span>
                  </Link>
                );
              })}
              
              {user ? (
                <>
                  <Link
                    to="/orders"
                    className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-farm-green hover:bg-gray-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="h-4 w-4" />
                    <span>Orders</span>
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-farm-green hover:bg-gray-50 w-full text-left"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <Link
                  to="/auth"
                  className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-farm-green hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="h-4 w-4" />
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
