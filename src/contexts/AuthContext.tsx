
import React, { createContext, useContext, useState, useEffect } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  getUserOrders: () => Promise<any[]>;
  createOrder: (items: { productId: number; quantity: number; price: number }[]) => Promise<string | null>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (event === 'SIGNED_IN') {
          toast({
            title: "Signed in successfully",
            description: "Welcome back to agroconnect!",
          });
        }
        if (event === 'SIGNED_OUT') {
          toast({
            title: "Signed out successfully",
            description: "You have been signed out.",
          });
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [toast]);

  const signUp = async (email: string, password: string) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: redirectUrl
        }
      });
      if (error) throw error;
      toast({
        title: "Account created successfully",
        description: "Please check your email to verify your account.",
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
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Error signing in",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  // Function to get user's orders
  const getUserOrders = async () => {
    if (!user) return [];
    
    try {
      const { data: orders, error } = await supabase
        .from('orders')
        .select(`
          id,
          status,
          created_at,
          updated_at,
          order_items (
            id,
            product_id,
            quantity,
            price_at_purchase,
            created_at
          )
        `)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return orders || [];
    } catch (error: any) {
      toast({
        title: "Error fetching orders",
        description: error.message,
        variant: "destructive",
      });
      return [];
    }
  };

  // Function to create a new order
  const createOrder = async (items: { productId: number; quantity: number; price: number }[]) => {
    if (!user) return null;
    
    try {
      // For demo purposes, simulate order creation
      const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return orderId;
    } catch (error: any) {
      console.error("Order creation error:", error);
      return null;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      session, 
      user, 
      isLoading, 
      signUp, 
      signIn, 
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
