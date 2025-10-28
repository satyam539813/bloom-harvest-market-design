import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MapPin, Navigation, Store, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Fix Leaflet default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface Shop {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  distance: number;
  description: string;
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
  const [mapReady, setMapReady] = useState(false);
  const { toast } = useToast();

  // Add a small delay before showing the map to ensure DOM is ready
  useEffect(() => {
    if (userLocation) {
      setMapReady(false);
      const timer = setTimeout(() => {
        setMapReady(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [userLocation]);

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
            description: "Could not get your location. Using default location.",
            variant: "destructive",
          });
          // Default to a sample location
          const defaultCoords: [number, number] = [51.5074, -0.1278]; // London
          setUserLocation(defaultCoords);
          discoverShops(defaultCoords).catch(console.error);
        }
      );
    } else {
      setIsLoadingLocation(false);
      toast({
        title: "Geolocation not supported",
        description: "Your browser doesn't support geolocation.",
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
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Navigation className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">Your Location</h2>
          </div>
          <Button
            onClick={getUserLocation}
            disabled={isLoadingLocation || isLoadingShops}
            className="gap-2"
          >
            {isLoadingLocation || isLoadingShops ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {isLoadingShops ? 'Finding shops...' : 'Getting location...'}
              </>
            ) : (
              <>
                <MapPin className="w-4 h-4" />
                Find Nearby Shops
              </>
            )}
          </Button>
        </div>

        {userLocation && mapReady && (
          <div className="rounded-lg overflow-hidden border border-border" style={{ height: '500px' }}>
            <MapContainer
              center={userLocation}
              zoom={13}
              style={{ height: '100%', width: '100%' }}
              scrollWheelZoom={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              {/* User location marker */}
              <Marker position={userLocation}>
                <Popup>
                  <div className="text-center">
                    <strong>Your Location</strong>
                  </div>
                </Popup>
              </Marker>

              {/* Shop markers */}
              {shops.map((shop) => (
                <Marker key={shop.id} position={[shop.lat, shop.lng]}>
                  <Popup>
                    <div className="min-w-[200px]">
                      <h3 className="font-semibold text-lg mb-1">{shop.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{shop.address}</p>
                      <p className="text-sm mb-2">{shop.description}</p>
                      <div className="flex items-center gap-1 text-primary font-medium">
                        <MapPin className="w-4 h-4" />
                        <span>{shop.distance.toFixed(1)} km away</span>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        )}

        {userLocation && !mapReady && (
          <div className="rounded-lg border border-border p-12 text-center" style={{ height: '500px' }}>
            <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading map...</p>
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
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-primary font-medium">
                    <MapPin className="w-4 h-4" />
                    <span>{shop.distance.toFixed(1)} km</span>
                  </div>
                  <Button size="sm" variant="outline">Get Directions</Button>
                </div>
              </Card>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default NearbyShopsMap;
