
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <div className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-farm-green-light/10 via-background to-farm-green-light/5 pt-20">
      <div className="container mx-auto px-4 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="space-y-4">
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-farm-green/10 to-farm-green-light/20 rounded-full border border-farm-green/20">
                <span className="text-sm font-medium text-farm-green">🌱 100% Organic & Fresh</span>
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-farm-green via-farm-green-dark to-farm-green bg-clip-text text-transparent">
                  Farm Fresh
                </span>
                <br/>
                <span className="bg-gradient-to-r from-farm-accent-yellow to-farm-accent-red bg-clip-text text-transparent">
                  Organic Produce
                </span>
                <br/>
                <span className="text-foreground">Delivered to You</span>
              </h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-lg leading-relaxed">
              Farm to table, sustainably grown fresh produce from local farms. 
              Support local farmers and enjoy the freshest seasonal offerings delivered right to your door.
            </p>
            <div className="flex flex-wrap gap-6">
              <Button className="btn-primary group">
                Shop Now 
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" className="btn-secondary">
                Learn More
              </Button>
            </div>
            <div className="flex items-center space-x-8 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-farm-green">500+</div>
                <div className="text-sm text-muted-foreground">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-farm-green">50+</div>
                <div className="text-sm text-muted-foreground">Local Farms</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-farm-green">24h</div>
                <div className="text-sm text-muted-foreground">Fresh Delivery</div>
              </div>
            </div>
          </div>
          <div className="relative group animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <div className="relative rounded-3xl overflow-hidden shadow-elegant hover:shadow-glow transition-all duration-700 group-hover:scale-105">
              <img 
                src="https://images.unsplash.com/photo-1517022812141-23620dba5c23?auto=format&fit=crop&w=800&q=80" 
                alt="Fresh farm produce" 
                className="w-full object-cover h-[600px] group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-300"></div>
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="bg-gradient-to-r from-background/95 to-background/90 backdrop-blur-lg rounded-2xl p-6 border border-farm-green/20 shadow-soft">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-farm-accent-yellow text-sm mb-1">🎉 Limited Time Offer</p>
                      <h3 className="text-2xl font-bold text-foreground mb-1">20% Off First Order</h3>
                      <p className="text-muted-foreground">Use code: <span className="font-mono font-bold text-farm-green">FARM20</span></p>
                    </div>
                    <div className="bg-gradient-to-r from-farm-green to-farm-green-dark text-primary-foreground px-4 py-2 rounded-xl font-bold text-lg">
                      20%
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 bg-gradient-to-r from-farm-accent-yellow to-farm-accent-red text-white px-4 py-2 rounded-full text-sm font-bold animate-bounce">
              Fresh Today!
            </div>
            <div className="absolute -bottom-4 -left-4 bg-gradient-to-r from-farm-green to-farm-green-dark text-primary-foreground px-4 py-2 rounded-full text-sm font-bold shadow-soft">
              🚚 Free Delivery
            </div>
          </div>
        </div>
      </div>
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-farm-green/20 to-farm-green-light/30 rounded-full blur-xl animate-float"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-gradient-to-r from-farm-accent-yellow/20 to-farm-accent-red/20 rounded-full blur-xl animate-float" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent"></div>
    </div>
  );
};

export default Hero;
