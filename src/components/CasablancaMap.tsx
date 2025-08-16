import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Button } from '@/components/ui/button';
import { MapPin, Search } from 'lucide-react';

interface MapLocation {
  latitude: number;
  longitude: number;
  address?: string;
}

interface CasablancaMapProps {
  onLocationSelect: (location: MapLocation) => void;
  selectedLocation?: MapLocation | null;
}

const CasablancaMap: React.FC<CasablancaMapProps> = ({ onLocationSelect, selectedLocation }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const [searchValue, setSearchValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Note: In production, you would set the actual Mapbox token
    // For now, we'll use a placeholder - the user needs to add their token
    mapboxgl.accessToken = 'YOUR_MAPBOX_TOKEN_HERE';
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [-7.5898, 33.5731], // Casablanca coordinates
      zoom: 11,
      pitch: 30,
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      'top-right'
    );

    // Handle map clicks
    map.current.on('click', (e) => {
      const { lng, lat } = e.lngLat;
      
      // Remove existing marker
      if (marker.current) {
        marker.current.remove();
      }
      
      // Add new marker
      marker.current = new mapboxgl.Marker({
        color: '#1e40af',
        scale: 1.2
      })
        .setLngLat([lng, lat])
        .addTo(map.current!);

      // Call the location select handler
      onLocationSelect({
        latitude: lat,
        longitude: lng,
      });
    });

    // Cleanup
    return () => {
      map.current?.remove();
    };
  }, [onLocationSelect]);

  // Update marker when selectedLocation changes
  useEffect(() => {
    if (selectedLocation && map.current) {
      // Remove existing marker
      if (marker.current) {
        marker.current.remove();
      }
      
      // Add new marker
      marker.current = new mapboxgl.Marker({
        color: '#1e40af',
        scale: 1.2
      })
        .setLngLat([selectedLocation.longitude, selectedLocation.latitude])
        .addTo(map.current);

      // Center map on the location
      map.current.flyTo({
        center: [selectedLocation.longitude, selectedLocation.latitude],
        zoom: 15,
        duration: 1000
      });
    }
  }, [selectedLocation]);

  const handleSearch = async () => {
    if (!searchValue.trim()) return;
    
    setIsLoading(true);
    try {
      // Note: In production, you would use actual Mapbox Geocoding API
      // For now, we'll simulate the search functionality
      console.log('Searching for:', searchValue);
      
      // Mock geocoding - in real implementation, use Mapbox Geocoding API
      // const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchValue)}.json?access_token=${mapboxgl.accessToken}&proximity=-7.5898,33.5731&country=ma`);
      
      // For demo purposes, we'll just center on a mock location
      const mockLocation = {
        latitude: 33.5731 + (Math.random() - 0.5) * 0.1,
        longitude: -7.5898 + (Math.random() - 0.5) * 0.1,
        address: searchValue
      };
      
      onLocationSelect(mockLocation);
      
    } catch (error) {
      console.error('Geocoding error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-full h-full">
      {/* Search Bar */}
      <div className="absolute top-4 left-4 right-4 z-10">
        <div className="flex gap-2 bg-white rounded-lg shadow-card p-2 max-w-md">
          <div className="flex-1 flex items-center gap-2 bg-gray-50 rounded px-3 py-2">
            <Search size={18} className="text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une adresse à Casablanca..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1 bg-transparent border-none outline-none text-sm"
            />
          </div>
          <Button 
            variant="civic" 
            size="sm" 
            onClick={handleSearch}
            disabled={isLoading}
            className="px-4"
          >
            {isLoading ? '...' : 'Chercher'}
          </Button>
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10">
        <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-card px-4 py-2 flex items-center gap-2 text-sm text-gray-600">
          <MapPin size={16} className="text-civic-primary" />
          <span>Cliquez sur la carte pour signaler un problème</span>
        </div>
      </div>

      {/* Map Container */}
      <div ref={mapContainer} className="absolute inset-0 rounded-lg overflow-hidden" />
      
      {/* Mapbox Token Notice */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 bg-white p-6 rounded-lg shadow-floating max-w-md text-center">
        <div className="mb-4">
          <MapPin size={48} className="mx-auto text-civic-primary" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Configuration requise</h3>
        <p className="text-sm text-gray-600 mb-4">
          Pour utiliser la carte interactive, vous devez ajouter votre token Mapbox.
        </p>
        <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
          Obtenez votre token sur <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="text-civic-primary hover:underline">mapbox.com</a>
        </div>
      </div>
    </div>
  );
};

export default CasablancaMap;