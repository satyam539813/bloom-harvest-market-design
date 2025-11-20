
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center mb-8">
            <Info className="h-8 w-8 text-farm-green mr-3" />
            <h1 className="text-4xl font-bold text-farm-green-dark">About Us</h1>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-farm-green-dark">Our Story</h2>
              <p className="text-lg text-gray-700">
                agroconnect began as a small family farm in 2008, dedicated to growing organic produce using sustainable methods.
                What started as a roadside farm stand has grown into a trusted source of quality produce for our community.
              </p>
              <p className="text-lg text-gray-700">
                We work with a network of local family farms who share our commitment to sustainable agriculture, biodiversity, 
                and ethical farming practices. Every product in our store is carefully selected to ensure the highest quality and freshness.
              </p>
              
              <h3 className="text-2xl font-semibold text-farm-green-dark mt-8">Our Mission</h3>
              <p className="text-lg text-gray-700">
                Our mission is to provide our customers with the freshest, most nutritious produce while supporting sustainable farming practices
                that protect and heal our environment. We believe that good food comes from healthy soil, clean water, and careful stewardship of the land.
              </p>
            </div>
            
            <div className="space-y-8">
              <div className="rounded-2xl overflow-hidden shadow-lg">
                <img 
                  src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=900&q=80" 
                  alt="Our Farm" 
                  className="w-full h-auto"
                />
              </div>
              
              <div className="bg-muted rounded-2xl p-8">
                <h3 className="text-2xl font-semibold text-farm-green-dark mb-4">Our Values</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-farm-green/10 flex items-center justify-center mr-3 mt-1">
                      <div className="h-3 w-3 bg-farm-green rounded-full"></div>
                    </div>
                    <span className="text-gray-700"><span className="font-semibold">Sustainability:</span> We use farming practices that regenerate the soil and protect biodiversity.</span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-farm-green/10 flex items-center justify-center mr-3 mt-1">
                      <div className="h-3 w-3 bg-farm-green rounded-full"></div>
                    </div>
                    <span className="text-gray-700"><span className="font-semibold">Community:</span> We support local farmers and create meaningful relationships with our customers.</span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-farm-green/10 flex items-center justify-center mr-3 mt-1">
                      <div className="h-3 w-3 bg-farm-green rounded-full"></div>
                    </div>
                    <span className="text-gray-700"><span className="font-semibold">Transparency:</span> We are open about our growing practices and the origins of our products.</span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-farm-green/10 flex items-center justify-center mr-3 mt-1">
                      <div className="h-3 w-3 bg-farm-green rounded-full"></div>
                    </div>
                    <span className="text-gray-700"><span className="font-semibold">Quality:</span> We never compromise on the quality and freshness of our products.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="bg-farm-green/5 rounded-2xl p-8 mb-16">
            <h2 className="text-3xl font-bold text-farm-green-dark mb-6 text-center">Meet Our Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="rounded-full overflow-hidden w-40 h-40 mx-auto mb-4">
                  <img 
                    src="https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=300&q=80" 
                    alt="Sarah Johnson" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-farm-green-dark">Sarah Johnson</h3>
                <p className="text-gray-600">Founder & Head Farmer</p>
              </div>
              
              <div className="text-center">
                <div className="rounded-full overflow-hidden w-40 h-40 mx-auto mb-4">
                  <img 
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80" 
                    alt="Michael Wilson" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-farm-green-dark">Michael Wilson</h3>
                <p className="text-gray-600">Operations Manager</p>
              </div>
              
              <div className="text-center">
                <div className="rounded-full overflow-hidden w-40 h-40 mx-auto mb-4">
                  <img 
                    src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80" 
                    alt="Emily Rodriguez" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-farm-green-dark">Emily Rodriguez</h3>
                <p className="text-gray-600">Customer Relations</p>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <Button 
              className="bg-farm-green hover:bg-farm-green-dark text-white rounded-full px-8 py-6"
              onClick={() => window.location.href = '/contact'}
            >
              Get In Touch With Us
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AboutUs;
