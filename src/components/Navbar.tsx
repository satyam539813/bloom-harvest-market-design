import { useState } from "react";
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
    <nav className="bg-white/95 backdrop-blur-md shadow-lg border-b border-green-100 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-18">
          {/* Enhanced Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="bg-gradient-to-br from-green-600 to-green-700 text-white p-3 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <span className="font-bold text-xl">🌱</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold bg-gradient-to-r from-green-700 to-green-600 bg-clip-text text-transparent">
                FarmFresh
              </span>
              <span className="text-xs text-green-600 font-medium -mt-1">Organic & Fresh</span>
            </div>
          </Link>

          {/* Enhanced Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navigationLinks.map((link) => {
              const IconComponent = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-green-50 ${
                    isActive(link.path)
                      ? "text-white bg-gradient-to-r from-green-600 to-green-700 shadow-md"
                      : "text-gray-700 hover:text-green-700"
                  }`}
                >
                  {IconComponent && <IconComponent className="h-4 w-4" />}
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Enhanced Right side buttons */}
          <div className="flex items-center space-x-3">
            {user ? (
              <>
                <Link to="/orders" className="hidden md:flex">
                  <Button variant="ghost" size="sm" className="text-gray-700 hover:text-green-700 hover:bg-green-50 rounded-lg transition-all duration-300">
                    <User className="h-4 w-4 mr-2" />
                    Orders
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className="hidden md:flex text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-300"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <Link to="/auth" className="hidden md:flex">
                <Button variant="ghost" size="sm" className="text-gray-700 hover:text-green-700 hover:bg-green-50 rounded-lg transition-all duration-300">
                  <User className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
              </Link>
            )}

            {/* Enhanced Cart button */}
            <Link to="/shop" className="relative">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-gray-700 hover:text-green-700 hover:bg-green-50 rounded-lg transition-all duration-300 p-3"
              >
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 bg-gradient-to-r from-green-600 to-green-700 text-white text-xs px-2 py-1 rounded-full min-w-[1.5rem] h-6 flex items-center justify-center shadow-lg animate-pulse">
                    {itemCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Enhanced Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden text-gray-700 hover:text-green-700 hover:bg-green-50 rounded-lg transition-all duration-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Enhanced Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t bg-white pb-4">
            <div className="flex flex-col space-y-2 pt-4">
              {navigationLinks.map((link) => {
                const IconComponent = link.icon;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium transition-colors hover:text-green-700 hover:bg-green-50 rounded-lg mx-2 ${
                      isActive(link.path) ? "text-white bg-gradient-to-r from-green-600 to-green-700" : "text-gray-700"
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
                    className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-green-700 hover:bg-green-50 rounded-lg mx-2"
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
                    className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg mx-2 w-full text-left"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <Link
                  to="/auth"
                  className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-green-700 hover:bg-green-50 rounded-lg mx-2"
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
