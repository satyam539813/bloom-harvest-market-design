
import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useToast } from "@/hooks/use-toast";

type Product = {
  id: number;
  name: string;
  price: number;
  image_url?: string;
  unit: string;
};

type CartItem = {
  id: string;
  product: Product;
  quantity: number;
};

type CartContextType = {
  cartItems: CartItem[];
  cartCount: number;
  cartTotal: number;
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  checkout: () => Promise<string | null>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { user, createOrder } = useAuth();
  const { toast } = useToast();
  
  // Calculate totals
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);

  // Fetch cart items from Supabase when user changes
  useEffect(() => {
    const fetchCartItems = async () => {
      // Load cart from localStorage for all users
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        try {
          setCartItems(JSON.parse(savedCart));
        } catch (error) {
          console.error("Error parsing saved cart:", error);
          localStorage.removeItem("cart");
        }
      }
    };

    fetchCartItems();
  }, [user]);

  // Save cart to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems, user]);

  const addToCart = async (product: Product, quantity = 1) => {
    // Use localStorage for all users (can be enhanced with Firestore later)
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.product.id === product.id);
      
      if (existingItem) {
        return prevItems.map(item => 
          item.id === existingItem.id 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prevItems, { 
          id: `${product.id}-${Date.now()}`,
          product, 
          quantity 
        }];
      }
    });
  };

  const removeFromCart = async (id: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const updateQuantity = async (id: string, quantity: number) => {
    if (quantity < 1) {
      await removeFromCart(id);
      return;
    }
    
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = async () => {
    setCartItems([]);
  };

  // Process checkout and create order in Supabase
  const checkout = async () => {
    if (!user) return null;
    
    try {
      // Transform cart items to order items for Firebase/Firestore
      const orderItems = cartItems.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
        price: item.product.price
      }));
      
      const orderId = await createOrder(orderItems);
      
      if (orderId) {
        await clearCart();
      }
      
      return orderId;
    } catch (error) {
      console.error("Checkout error:", error);
      return null;
    }
  };

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      cartCount, 
      cartTotal, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart,
      checkout
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
