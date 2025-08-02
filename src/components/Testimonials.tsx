
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
    <section className="py-20 bg-gradient-to-br from-farm-green-light/30 to-white">
      <div className="container mx-auto px-4">
        <h2 className="section-title">What Our Customers Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="bg-white shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Avatar className="h-12 w-12 border-2 border-farm-green">
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                    <AvatarFallback className="bg-farm-green text-white">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="ml-4">
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
                <blockquote className="text-gray-700 italic">"{testimonial.quote}"</blockquote>
                <div className="mt-4 flex">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-farm-accent-yellow" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
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
