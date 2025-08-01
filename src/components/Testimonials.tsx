
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Quote, Star, Users, Award, Sprout } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Home Chef",
    location: "San Francisco, CA",
    rating: 5,
    text: "FarmFresh has completely transformed my cooking! The organic vegetables are incredibly fresh, and I can taste the difference in every dish. My family loves the variety and quality.",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b647?w=150&h=150&fit=crop&crop=face&auto=format",
    badge: "Verified Buyer",
    orderCount: 47
  },
  {
    id: 2,
    name: "Marcus Rodriguez",
    role: "Restaurant Owner",
    location: "Austin, TX",
    rating: 5,
    text: "As a chef, I'm extremely picky about ingredients. FarmFresh consistently delivers restaurant-quality produce. Their farm-to-table approach aligns perfectly with our sustainability values.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face&auto=format",
    badge: "Business Customer",
    orderCount: 124
  },
  {
    id: 3,
    name: "Emily Chen",
    role: "Nutritionist",
    location: "Seattle, WA",
    rating: 5,
    text: "I recommend FarmFresh to all my clients. The nutrient density and freshness of their produce is unmatched. Plus, knowing exactly where my food comes from gives me peace of mind.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face&auto=format",
    badge: "Health Professional",
    orderCount: 89
  },
  {
    id: 4,
    name: "David Thompson",
    role: "Organic Farmer",
    location: "Portland, OR",
    rating: 5,
    text: "Even as a farmer myself, I'm impressed with FarmFresh's quality standards. They truly support sustainable agriculture and make healthy eating accessible to everyone.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face&auto=format",
    badge: "Industry Expert",
    orderCount: 76
  },
  {
    id: 5,
    name: "Lisa Park",
    role: "Wellness Coach",
    location: "Denver, CO",
    rating: 5,
    text: "The convenience and quality combination is unbeatable. Fresh, organic produce delivered to my door saves me time while ensuring my family eats the best. Customer service is exceptional too!",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face&auto=format",
    badge: "Loyal Customer",
    orderCount: 156
  },
  {
    id: 6,
    name: "James Wilson",
    role: "Food Blogger",
    location: "Nashville, TN",
    rating: 5,
    text: "I've featured FarmFresh in multiple articles. Their commitment to quality, transparency, and supporting local farmers makes them stand out in the crowded market.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face&auto=format",
    badge: "Influencer",
    orderCount: 203
  }
];

const stats = [
  { icon: Users, label: "Happy Customers", value: "50K+", color: "text-blue-600" },
  { icon: Star, label: "Average Rating", value: "4.9/5", color: "text-yellow-500" },
  { icon: Award, label: "Awards Won", value: "12", color: "text-purple-600" },
  { icon: Sprout, label: "Partner Farms", value: "200+", color: "text-farm-green" }
];

const Testimonials = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-muted/30 via-background to-muted/30 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-32 left-20 w-48 h-48 bg-farm-green rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-32 right-20 w-56 h-56 bg-farm-accent-yellow rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-farm-accent-orange rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Enhanced Header */}
        <div className="text-center mb-20 space-y-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-farm-green/10 mb-6 animate-bounce">
            <Quote className="h-10 w-10 text-farm-green" />
          </div>
          <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-farm-green-dark via-farm-green to-farm-green-dark bg-clip-text text-transparent">
            What Our Customers Say
          </h2>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Don't just take our word for it. Here's what real customers, chefs, and nutrition experts 
            are saying about their FarmFresh experience.
          </p>
        </div>

        {/* Statistics Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center p-8 bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 animate-fade-in" style={{ animationDelay: `${index * 150}ms` }}>
              <CardContent className="p-0 space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-muted/20 to-muted/40 mb-4">
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
                <div className="space-y-2">
                  <div className={`text-3xl font-bold ${stat.color}`}>
                    {stat.value}
                  </div>
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                    {stat.label}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={testimonial.id} 
              className="group overflow-hidden transition-all duration-700 hover:shadow-2xl hover:shadow-farm-green/20 border-0 bg-white/90 backdrop-blur-sm hover:scale-[1.02] animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-8 space-y-6">
                {/* Rating */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <Badge className={`font-semibold ${
                    testimonial.badge === "Verified Buyer" ? "bg-green-100 text-green-800" :
                    testimonial.badge === "Business Customer" ? "bg-blue-100 text-blue-800" :
                    testimonial.badge === "Health Professional" ? "bg-purple-100 text-purple-800" :
                    testimonial.badge === "Industry Expert" ? "bg-orange-100 text-orange-800" :
                    testimonial.badge === "Loyal Customer" ? "bg-pink-100 text-pink-800" :
                    "bg-indigo-100 text-indigo-800"
                  }`}>
                    {testimonial.badge}
                  </Badge>
                </div>

                {/* Quote */}
                <div className="relative">
                  <Quote className="absolute -top-2 -left-2 h-8 w-8 text-farm-green/20" />
                  <p className="text-gray-700 leading-relaxed italic pl-6">
                    "{testimonial.text}"
                  </p>
                </div>

                {/* Customer Info */}
                <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-14 h-14 rounded-full object-cover border-3 border-farm-green/20 group-hover:border-farm-green/40 transition-colors"
                  />
                  <div className="flex-1 space-y-1">
                    <h4 className="font-bold text-gray-900 group-hover:text-farm-green-dark transition-colors">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-farm-green font-medium">
                      {testimonial.role}
                    </p>
                    <p className="text-xs text-gray-500">
                      {testimonial.location} • {testimonial.orderCount} orders
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Enhanced CTA Section */}
        <div className="text-center">
          <div className="inline-flex flex-col items-center space-y-6 p-12 bg-gradient-to-br from-white/80 to-farm-green/5 backdrop-blur-sm rounded-3xl border border-border/50 shadow-2xl">
            <div className="flex items-center gap-2 text-yellow-500 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-6 w-6 fill-current" />
              ))}
              <span className="text-2xl font-bold text-gray-900 ml-2">4.9/5</span>
            </div>
            <h3 className="text-3xl font-bold text-farm-green-dark">
              Join 50,000+ Satisfied Customers
            </h3>
            <p className="text-gray-600 max-w-2xl leading-relaxed">
              Experience the FarmFresh difference yourself. Fresh, organic produce delivered 
              straight from local farms to your doorstep with our satisfaction guarantee.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
              <button 
                className="flex-1 bg-gradient-to-r from-farm-green to-farm-green-dark hover:from-farm-green-dark hover:to-farm-green text-white rounded-full px-8 py-4 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                onClick={() => window.location.href = '/shop'}
              >
                Start Shopping
              </button>
              <button 
                className="flex-1 bg-white text-farm-green-dark border-2 border-farm-green rounded-full px-8 py-4 font-semibold hover:bg-farm-green hover:text-white transition-all duration-300 hover:scale-105"
                onClick={() => window.location.href = '/about-us'}
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
