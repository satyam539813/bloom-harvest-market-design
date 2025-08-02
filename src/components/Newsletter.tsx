
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Newsletter = () => {
  return (
    <section className="py-20 bg-farm-green-dark text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Join Our Farm Community</h2>
          <p className="text-lg mb-8 text-gray-200">
            Subscribe to our newsletter for seasonal recipes, farm updates, and exclusive offers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Input 
              type="email" 
              placeholder="Your email address" 
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-300"
            />
            <Button className="bg-farm-accent-yellow hover:bg-farm-accent-yellow/80 text-farm-green-dark font-semibold">
              Subscribe
            </Button>
          </div>
          <p className="mt-4 text-sm text-gray-300">
            By subscribing, you agree to receive marketing emails from us.
            You can unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
