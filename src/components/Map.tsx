import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

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

// Imperative Leaflet map (avoids react-leaflet runtime issues)
const Map: React.FC<MapProps> = ({ center, shops }) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  // Initialize map once
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Fix default marker icons
    try {
      // @ts-ignore - private prop used by Leaflet for asset resolution
      delete L.Icon.Default.prototype._getIconUrl;
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

    const map = L.map(mapContainerRef.current, {
      center,
      zoom: 13,
      scrollWheelZoom: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    const markersLayer = L.layerGroup().addTo(map);

    mapRef.current = map;
    markersLayerRef.current = markersLayer;

    return () => {
      map.remove();
      mapRef.current = null;
      markersLayerRef.current = null;
    };
  }, [center]);

  // Update center
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setView(center, mapRef.current.getZoom());
    }
  }, [center]);

  // Update markers when shops or center change
  useEffect(() => {
    const map = mapRef.current;
    const layer = markersLayerRef.current;
    if (!map || !layer) return;

    layer.clearLayers();

    // User location
    L.marker(center).addTo(layer).bindPopup(
      '<div style="text-align:center"><strong>Your Location</strong></div>'
    );

    // Shops
    shops.forEach((shop) => {
      const marker = L.marker([shop.lat, shop.lng]).addTo(layer);
      const popupHtml = `
        <div style="min-width:200px">
          <div style="font-weight:600; font-size:1.125rem; margin-bottom:0.25rem">${shop.name}</div>
          <div style="font-size:0.875rem; opacity:0.7; margin-bottom:0.5rem">${shop.address}</div>
          <div style="font-size:0.875rem; margin-bottom:0.5rem">${shop.description}</div>
          <div style="display:flex; align-items:center; gap:4px; color:var(--primary)">
            <span>${shop.distance.toFixed(1)} km away</span>
          </div>
        </div>`;
      marker.bindPopup(popupHtml);
      marker.bindTooltip(shop.name, { permanent: false, direction: 'top' });
    });
  }, [shops, center]);

  return <div ref={mapContainerRef} style={{ height: '100%', width: '100%' }} />;
};

export default Map;
