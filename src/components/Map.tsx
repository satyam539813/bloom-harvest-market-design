import React, { useEffect, useState } from 'react';

interface Shop {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  distance: number;
  description: string;
}

interface MapProps {
  center: [number, number];
  shops: Shop[];
}

// Client-only dynamic loader for Leaflet/react-leaflet to avoid bundling/runtime issues
const Map: React.FC<MapProps> = ({ center, shops }) => {
  const [leafletComponents, setLeafletComponents] = useState<any>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // Load CSS and libs only on client
        await import('leaflet/dist/leaflet.css');
        const [leafletModule, reactLeaflet] = await Promise.all([
          import('leaflet'),
          import('react-leaflet'),
        ]);
        const L = leafletModule.default || (leafletModule as any);

        // Fix default marker icons
        try {
          delete (L.Icon.Default.prototype as any)._getIconUrl;
          L.Icon.Default.mergeOptions({
            iconRetinaUrl:
              'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
            iconUrl:
              'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
            shadowUrl:
              'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
          });
        } catch (e) {
          console.warn('Leaflet icon setup warning:', e);
        }

        if (mounted) setLeafletComponents(reactLeaflet);
      } catch (e) {
        console.error('Failed to load map libraries:', e);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  if (!leafletComponents) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        Loading map...
      </div>
    );
  }

  const { MapContainer, TileLayer, Marker, Popup } = leafletComponents;

  return (
    <MapContainer
      key={`${center[0]},${center[1]}`}
      center={center}
      zoom={13}
      style={{ height: '100%', width: '100%' }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* User location marker */}
      <Marker position={center}>
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
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{shop.distance.toFixed(1)} km away</span>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Map;
