import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Navigation, Store, Loader2, TrendingUp, Award, DollarSign, Heart, Leaf, ShoppingBag } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

const Map = lazy(() => import('./Map'));

interface Shop {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  distance: number;
  description: string;
  qualityScore?: number;
  priceCompetitiveness?: number;
  popularityScore?: number;
  environmentalScore?: number;
  varietyScore?: number;
}


// Calculate distance using Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const NearbyShopsMap = () => {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [shops, setShops] = useState<Shop[]>([]);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [isLoadingShops, setIsLoadingShops] = useState(false);
  const [directionsDialog, setDirectionsDialog] = useState<{ open: boolean; url: string; shopName: string }>({
    open: false,
    url: '',
    shopName: ''
  });
  const { toast } = useToast();

  const getUserLocation = () => {
    setIsLoadingLocation(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const coords: [number, number] = [position.coords.latitude, position.coords.longitude];
          setUserLocation(coords);
          setIsLoadingLocation(false);
          toast({
            title: "Location found",
            description: "Finding nearby shops...",
          });
          await discoverShops(coords);
        },
        (error) => {
          console.error('Error getting location:', error);
          setIsLoadingLocation(false);
          toast({
            title: "Location error",
            description: "Could not get your location. Please enable location services.",
            variant: "destructive",
          });
        }
      );
    } else {
      setIsLoadingLocation(false);
      toast({
        title: "Geolocation not supported",
        description: "Your browser does not support geolocation.",
        variant: "destructive",
      });
    }
  };

  const openDirections = (shopLat: number, shopLng: number, shopName: string) => {
    if (userLocation) {
      const url = `https://www.google.com/maps/embed/v1/directions?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&origin=${userLocation[0]},${userLocation[1]}&destination=${shopLat},${shopLng}&mode=driving`;
      setDirectionsDialog({ open: true, url, shopName });
    } else {
      toast({
        title: "Location required",
        description: "Please enable location to get directions.",
        variant: "destructive",
      });
    }
  };

  const discoverShops = async (coords: [number, number]) => {
    setIsLoadingShops(true);
    try {
      console.log('Calling discover-shops function with coords:', coords);
      
      const { data, error } = await supabase.functions.invoke('discover-shops', {
        body: { 
          latitude: coords[0], 
          longitude: coords[1] 
        }
      });

      console.log('Response from discover-shops:', { data, error });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      if (data?.shops && Array.isArray(data.shops)) {
        const shopsWithDistance = data.shops
          .filter((shop: any) => shop && typeof shop === 'object' && shop.lat && shop.lng)
          .map((shop: any) => ({
            id: shop.id || Math.random().toString(),
            name: shop.name || 'Unknown Shop',
            address: shop.address || 'No address',
            lat: Number(shop.lat),
            lng: Number(shop.lng),
            description: shop.description || 'No description',
            distance: calculateDistance(coords[0], coords[1], Number(shop.lat), Number(shop.lng))
          }))
          .sort((a: Shop, b: Shop) => a.distance - b.distance);
        
        console.log('Processed shops:', shopsWithDistance);
        setShops(shopsWithDistance);
        toast({
          title: "Shops discovered",
          description: `Found ${shopsWithDistance.length} nearby farm shops`,
        });
      } else {
        console.warn('No shops in response:', data);
        toast({
          title: "No shops found",
          description: "Could not find nearby shops. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error discovering shops:', error);
      toast({
        title: "Error",
        description: "Could not discover nearby shops. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingShops(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="mb-6 text-center">
          <Button
            onClick={getUserLocation}
            disabled={isLoadingLocation || isLoadingShops}
            size="lg"
            className="gap-2"
          >
            {isLoadingLocation || isLoadingShops ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Finding Location...
              </>
            ) : (
              <>
                <Navigation className="w-4 h-4" />
                Find Nearby Shops
              </>
            )}
          </Button>
        </div>

        {userLocation && (
          <div className="rounded-lg overflow-hidden border border-border" style={{ height: '500px' }}>
            <Suspense fallback={
              <div className="flex items-center justify-center h-full">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            }>
              <Map key={`${userLocation[0]},${userLocation[1]}`} center={userLocation} shops={shops} />
            </Suspense>
          </div>
        )}

        {!userLocation && (
          <div className="text-center py-12 text-muted-foreground">
            <MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Click "Find Nearby Shops" to see farm shops near you</p>
          </div>
        )}
      </Card>

      {shops.length > 0 && (
        <>
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">AI-Powered Shop Analysis</h2>
            </div>
            <Tabs defaultValue="cost" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="cost" className="gap-1">
                  <DollarSign className="w-4 h-4" />
                  Cost
                </TabsTrigger>
                <TabsTrigger value="quality" className="gap-1">
                  <Award className="w-4 h-4" />
                  Quality
                </TabsTrigger>
                <TabsTrigger value="environment" className="gap-1">
                  <Leaf className="w-4 h-4" />
                  Environment
                </TabsTrigger>
                <TabsTrigger value="popularity" className="gap-1">
                  <Heart className="w-4 h-4" />
                  Popularity
                </TabsTrigger>
                <TabsTrigger value="comparison" className="gap-1">
                  <ShoppingBag className="w-4 h-4" />
                  Compare
                </TabsTrigger>
              </TabsList>

              <TabsContent value="cost" className="mt-6">
                <p className="text-sm text-muted-foreground mb-4">
                  Travel cost (₹8/km) and price competitiveness comparison
                </p>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={shops.map(shop => ({
                      name: shop.name.length > 15 ? shop.name.substring(0, 15) + '...' : shop.name,
                      travelCost: Number((shop.distance * 8).toFixed(2)),
                      priceScore: shop.priceCompetitiveness || 0,
                      fullName: shop.name
                    }))}
                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} className="text-xs fill-muted-foreground" />
                    <YAxis className="text-xs fill-muted-foreground" />
                    <Tooltip content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-background border border-border p-3 rounded-lg shadow-lg">
                            <p className="font-semibold mb-1">{data.fullName}</p>
                            <p className="text-sm">Travel Cost: ₹{data.travelCost}</p>
                            <p className="text-sm">Price Score: {data.priceScore}/100</p>
                          </div>
                        );
                      }
                      return null;
                    }} />
                    <Legend />
                    <Bar dataKey="travelCost" fill="hsl(var(--primary))" name="Travel Cost (₹)" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="priceScore" fill="hsl(var(--primary) / 0.6)" name="Price Score" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </TabsContent>

              <TabsContent value="quality" className="mt-6">
                <p className="text-sm text-muted-foreground mb-4">
                  Product quality and variety ratings
                </p>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={shops.map(shop => ({
                      name: shop.name.length > 15 ? shop.name.substring(0, 15) + '...' : shop.name,
                      quality: shop.qualityScore || 0,
                      variety: shop.varietyScore || 0,
                      fullName: shop.name
                    }))}
                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} className="text-xs fill-muted-foreground" />
                    <YAxis className="text-xs fill-muted-foreground" domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="quality" fill="hsl(var(--primary))" name="Quality Score" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="variety" fill="hsl(var(--primary) / 0.6)" name="Variety Score" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </TabsContent>

              <TabsContent value="environment" className="mt-6">
                <p className="text-sm text-muted-foreground mb-4">
                  Environmental sustainability ratings
                </p>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={shops.map(shop => ({
                      name: shop.name.length > 15 ? shop.name.substring(0, 15) + '...' : shop.name,
                      score: shop.environmentalScore || 0,
                      fullName: shop.name
                    }))}
                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} className="text-xs fill-muted-foreground" />
                    <YAxis className="text-xs fill-muted-foreground" domain={[0, 100]} />
                    <Tooltip />
                    <Bar dataKey="score" name="Eco Score" radius={[8, 8, 0, 0]}>
                      {shops.map((shop, index) => {
                        const score = shop.environmentalScore || 0;
                        const color = score >= 80 ? 'hsl(142, 76%, 36%)' : score >= 60 ? 'hsl(47, 96%, 53%)' : 'hsl(0, 84%, 60%)';
                        return <Cell key={`cell-${index}`} fill={color} />;
                      })}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </TabsContent>

              <TabsContent value="popularity" className="mt-6">
                <p className="text-sm text-muted-foreground mb-4">
                  Shop popularity and customer ratings
                </p>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={shops.map(shop => ({
                      name: shop.name.length > 15 ? shop.name.substring(0, 15) + '...' : shop.name,
                      score: shop.popularityScore || 0,
                      fullName: shop.name
                    }))}
                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} className="text-xs fill-muted-foreground" />
                    <YAxis className="text-xs fill-muted-foreground" domain={[0, 100]} />
                    <Tooltip />
                    <Bar dataKey="score" fill="hsl(var(--primary))" name="Popularity Score" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </TabsContent>

              <TabsContent value="comparison" className="mt-6">
                <p className="text-sm text-muted-foreground mb-4">
                  Multi-dimensional comparison of top 5 shops
                </p>
                <ResponsiveContainer width="100%" height={400}>
                  <RadarChart data={[
                    {
                      metric: 'Quality',
                      ...shops.slice(0, 5).reduce((acc, shop, i) => ({
                        ...acc,
                        [`shop${i + 1}`]: shop.qualityScore || 0
                      }), {})
                    },
                    {
                      metric: 'Price',
                      ...shops.slice(0, 5).reduce((acc, shop, i) => ({
                        ...acc,
                        [`shop${i + 1}`]: shop.priceCompetitiveness || 0
                      }), {})
                    },
                    {
                      metric: 'Popularity',
                      ...shops.slice(0, 5).reduce((acc, shop, i) => ({
                        ...acc,
                        [`shop${i + 1}`]: shop.popularityScore || 0
                      }), {})
                    },
                    {
                      metric: 'Eco Score',
                      ...shops.slice(0, 5).reduce((acc, shop, i) => ({
                        ...acc,
                        [`shop${i + 1}`]: shop.environmentalScore || 0
                      }), {})
                    },
                    {
                      metric: 'Variety',
                      ...shops.slice(0, 5).reduce((acc, shop, i) => ({
                        ...acc,
                        [`shop${i + 1}`]: shop.varietyScore || 0
                      }), {})
                    }
                  ]}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="metric" />
                    <PolarRadiusAxis domain={[0, 100]} />
                    {shops.slice(0, 5).map((shop, i) => (
                      <Radar
                        key={shop.id}
                        name={shop.name.length > 20 ? shop.name.substring(0, 20) + '...' : shop.name}
                        dataKey={`shop${i + 1}`}
                        stroke={`hsl(var(--primary) / ${1 - (i * 0.15)})`}
                        fill={`hsl(var(--primary) / ${0.3 - (i * 0.05)})`}
                      />
                    ))}
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </TabsContent>
            </Tabs>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Store className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">Nearby Shops ({shops.length})</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {shops.map((shop) => (
                <Card key={shop.id} className="p-4 hover:shadow-lg transition-all duration-300">
                  <h3 className="font-semibold text-lg mb-2">{shop.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{shop.address}</p>
                  <p className="text-sm mb-3">{shop.description}</p>
                  {(shop.qualityScore || shop.environmentalScore) && (
                    <div className="flex gap-2 mb-3">
                      {shop.qualityScore && (
                        <div className="flex items-center gap-1 text-xs">
                          <Award className="w-3 h-3 text-primary" />
                          <span>Quality: {shop.qualityScore}/100</span>
                        </div>
                      )}
                      {shop.environmentalScore && (
                        <div className="flex items-center gap-1 text-xs">
                          <Leaf className="w-3 h-3 text-green-600" />
                          <span>Eco: {shop.environmentalScore}/100</span>
                        </div>
                      )}
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1 text-primary font-medium">
                        <MapPin className="w-4 h-4" />
                        <span>{shop.distance.toFixed(1)} km</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Est. travel cost: ₹{(shop.distance * 8).toFixed(2)}
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => openDirections(shop.lat, shop.lng, shop.name)}
                    >
                      Get Directions
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </>
      )}

      <Dialog open={directionsDialog.open} onOpenChange={(open) => setDirectionsDialog({ ...directionsDialog, open })}>
        <DialogContent className="max-w-4xl h-[80vh]">
          <DialogHeader>
            <DialogTitle>Directions to {directionsDialog.shopName}</DialogTitle>
          </DialogHeader>
          <div className="flex-1 h-full">
            <iframe
              src={directionsDialog.url}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="rounded-lg"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NearbyShopsMap;
