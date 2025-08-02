
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const testimonials = [
  {
    id: 1,
    name: 'Emma Johnson',
    role: 'Food Blogger',
    avatar: 'https://i.pravatar.cc/150?img=32',
    quote: 'The quality of the produce is exceptional! Everything arrives fresh and tastes amazing. I\'ve been a weekly customer for over a year now.',
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Home Cook',
    avatar: 'https://i.pravatar.cc/150?img=11',
    quote: 'FarmFresh has transformed my cooking experience. The seasonal variety keeps my meals exciting and the delivery is always on time.',
  },
  {
    id: 3,
    name: 'Sarah Williams',
    role: 'Health Coach',
    avatar: 'https://i.pravatar.cc/150?img=20',
    quote: 'I recommend FarmFresh to all my clients. Supporting local farmers while getting nutrient-dense, fresh produce is a win-win!',
  },
];

const Testimonials = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-farm-green-light/10 via-background to-farm-green-light/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-farm-green/10 to-farm-green-light/20 rounded-full border border-farm-green/20 mb-6">
            <span className="text-sm font-medium text-farm-green">💬 Customer Reviews</span>
          </div>
          <h2 className="section-title">What Our Customers Say</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Hear from real customers who've experienced the freshness and quality of our organic produce
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={testimonial.id} 
              className="card-elegant group animate-fade-in" 
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <Avatar className="h-16 w-16 border-3 border-farm-green/20 group-hover:border-farm-green transition-all duration-300 shadow-soft">
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                    <AvatarFallback className="bg-gradient-to-r from-farm-green to-farm-green-dark text-primary-foreground text-lg font-bold">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="ml-4">
                    <p className="font-bold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-farm-green font-medium">{testimonial.role}</p>
                  </div>
                </div>
                <blockquote className="text-muted-foreground italic text-lg leading-relaxed mb-6">
                  "{testimonial.quote}"
                </blockquote>
                <div className="flex items-center justify-between">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg 
                        key={i} 
                        className="w-5 h-5 text-farm-accent-yellow" 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground bg-farm-green/10 px-2 py-1 rounded-full">
                    Verified Customer
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
