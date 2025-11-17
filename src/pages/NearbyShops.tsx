import React from 'react';
import Layout from '@/components/Layout';
import NearbyShopsMap from '@/components/NearbyShopsMap';
import { MapPin } from 'lucide-react';

const NearbyShops = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4">
              <MapPin className="w-8 h-8 text-primary" />
              <h1 className="text-4xl font-bold text-foreground">Nearby Farm Shops</h1>
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover local farm shops near you with live distance tracking
            </p>
          </div>
          <NearbyShopsMap />
        </div>
      </div>
    </Layout>
  );
};

export default NearbyShops;
