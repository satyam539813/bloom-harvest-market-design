
import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import FeaturedProducts from '@/components/FeaturedProducts';
import Categories from '@/components/Categories';
import FarmStory from '@/components/FarmStory';
import Testimonials from '@/components/Testimonials';
import Newsletter from '@/components/Newsletter';
import Footer from '@/components/Footer';
import Chatbot from '@/components/Chatbot';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <FeaturedProducts />
        <Categories />
        <FarmStory />
        <Testimonials />
        <Newsletter />
      </main>
      <Footer />
      <Chatbot />
    </div>
  );
};

export default Index;
