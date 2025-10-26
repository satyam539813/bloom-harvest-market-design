import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  ShoppingCart, 
  Menu, 
  X, 
  User, 
  LogOut, 
  Eye, 
  Home,
  Store,
  Phone,
  Info,
  Package,
  MapPin
} from "lucide-react";

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
    { path: "/", label: "Home", icon: Home },
    { path: "/shop", label: "Shop", icon: Store },
    { path: "/image-analysis", label: "AI Vision", icon: Eye },
    { path: "/nearby-shops", label: "Near Me", icon: MapPin },
    { path: "/about", label: "About", icon: Info },
    { path: "/contact", label: "Contact", icon: Phone },
  ];

  return (
    <>
      {/* Main Navigation */}
      <nav className="bg-background/95 backdrop-blur-md border-b border-border/50 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-2.5 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  <span className="font-bold text-lg">F</span>
                </div>
                <div className="absolute inset-0 bg-primary/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                  FarmFresh
                </span>
                <span className="text-xs text-muted-foreground -mt-1">
                  Fresh • Organic • Local
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navigationLinks.map((link) => {
                const IconComponent = link.icon;
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`relative flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 group ${
                      active
                        ? "text-primary bg-primary/10 shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                  >
                    <IconComponent className={`h-4 w-4 transition-transform group-hover:scale-110 ${
                      active ? "text-primary" : ""
                    }`} />
                    <span>{link.label}</span>
                    {active && (
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl"></div>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Right side actions */}
            <div className="flex items-center space-x-2">
              {/* User Menu */}
              {user ? (
                <div className="hidden md:flex items-center space-x-2">
                  <Link to="/orders">
                    <Button variant="ghost" size="sm" className="space-x-2">
                      <Package className="h-4 w-4" />
                      <span>Orders</span>
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSignOut}
                    className="space-x-2 text-muted-foreground hover:text-destructive"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </Button>
                </div>
              ) : (
                <Link to="/auth" className="hidden md:flex">
                  <Button variant="ghost" size="sm" className="space-x-2">
                    <User className="h-4 w-4" />
                    <span>Sign In</span>
                  </Button>
                </Link>
              )}

              {/* Cart Button */}
              <Link to="/shop">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="relative p-2.5 hover:bg-primary/10 hover:text-primary transition-all duration-300 group"
                >
                  <ShoppingCart className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  {itemCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full min-w-[1.25rem] h-5 flex items-center justify-center shadow-lg animate-pulse">
                      {itemCount}
                    </Badge>
                  )}
                </Button>
              </Link>

              {/* Mobile Menu */}
              <div className="md:hidden">
                <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="sm" className="p-2">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[85%] sm:w-[350px]">
                    <div className="flex flex-col space-y-6 mt-8">
                      {/* Mobile Logo */}
                      <div className="flex items-center space-x-3 pb-4 border-b border-border">
                        <div className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-2 rounded-xl">
                          <span className="font-bold text-lg">F</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-lg font-bold text-foreground">FarmFresh</span>
                          <span className="text-xs text-muted-foreground">Fresh • Organic • Local</span>
                        </div>
                      </div>

                      {/* Mobile Navigation Links */}
                      <div className="space-y-2">
                        {navigationLinks.map((link) => {
                          const IconComponent = link.icon;
                          const active = isActive(link.path);
                          return (
                            <Link
                              key={link.path}
                              to={link.path}
                              className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                                active
                                  ? "text-primary bg-primary/10"
                                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                              }`}
                              onClick={() => setIsMenuOpen(false)}
                            >
                              <IconComponent className="h-5 w-5" />
                              <span>{link.label}</span>
                            </Link>
                          );
                        })}
                      </div>

                      {/* Mobile User Actions */}
                      <div className="space-y-2 pt-4 border-t border-border">
                        {user ? (
                          <>
                            <Link
                              to="/orders"
                              className="flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-300"
                              onClick={() => setIsMenuOpen(false)}
                            >
                              <Package className="h-5 w-5" />
                              <span>Orders</span>
                            </Link>
                            <button
                              onClick={() => {
                                handleSignOut();
                                setIsMenuOpen(false);
                              }}
                              className="flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-300 w-full text-left"
                            >
                              <LogOut className="h-5 w-5" />
                              <span>Sign Out</span>
                            </button>
                          </>
                        ) : (
                          <Link
                            to="/auth"
                            className="flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-300"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <User className="h-5 w-5" />
                            <span>Sign In</span>
                          </Link>
                        )}
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
