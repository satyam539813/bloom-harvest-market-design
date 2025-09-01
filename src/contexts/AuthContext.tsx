import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  signInWithPopup,
  onAuthStateChanged
} from "firebase/auth";
import { auth, googleProvider, facebookProvider } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithFacebook: () => Promise<void>;
  signOut: () => Promise<void>;
  getUserOrders: () => Promise<any[]>;
  createOrder: (items: { productId: number; quantity: number; price: number }[]) => Promise<string | null>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsLoading(false);
      
      if (user) {
        toast({
          title: "Signed in successfully",
          description: "Welcome back to FarmFresh!",
        });
      }
    });

    return () => unsubscribe();
  }, [toast]);

  const signUp = async (email: string, password: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      toast({
        title: "Account created successfully",
        description: "Welcome to FarmFresh!",
      });
    } catch (error: any) {
      toast({
        title: "Error signing up",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      toast({
        title: "Error signing in",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      toast({
        title: "Error signing in with Google",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const signInWithFacebook = async () => {
    try {
      await signInWithPopup(auth, facebookProvider);
    } catch (error: any) {
      toast({
        title: "Error signing in with Facebook",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      toast({
        title: "Signed out successfully",
        description: "You have been signed out.",
      });
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  // Mock functions for orders (you can integrate with Firebase Firestore later)
  const getUserOrders = async () => {
    if (!user) return [];
    
    // Mock orders data - replace with Firestore integration
    return [
      {
        id: "order-1",
        status: "completed",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        order_items: [
          {
            id: "item-1",
            product_id: 1,
            quantity: 2,
            price_at_purchase: 4.99,
            created_at: new Date().toISOString()
          }
        ]
      }
    ];
  };

  const createOrder = async (items: { productId: number; quantity: number; price: number }[]) => {
    if (!user) return null;
    
    try {
      // Mock order creation - replace with Firestore integration
      const orderId = `order-${Date.now()}`;
      
      toast({
        title: "Order created successfully",
        description: "Your order has been placed!",
      });
      
      return orderId;
    } catch (error: any) {
      toast({
        title: "Error creating order",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      signUp, 
      signIn, 
      signInWithGoogle,
      signInWithFacebook,
      signOut, 
      getUserOrders, 
      createOrder 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}