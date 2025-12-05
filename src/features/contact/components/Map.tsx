import { useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

export default function Map() {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: 'YOUR_GOOGLE_MAPS_API_KEY',
        version: 'weekly',
      });

      const google = await loader.load();
      const location = { lat: -1.2921, lng: 36.8219 }; // Nairobi coordinates

      const map = new google.maps.Map(mapRef.current!, {
        center: location,
        zoom: 12,
        styles: [
          {
            featureType: 'all',
            elementType: 'geometry',
            stylers: [{ color: '#0A192F' }]
          },
          {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{ color: '#64FFDA' }]
          },
          // Add more custom styles to match the theme
        ]
      });

      new google.maps.Marker({
        position: location,
        map,
        title: 'Ian Kibugu'
      });
    };

    initMap();
  }, []);

  return (
    <div 
      ref={mapRef}
      className="w-full h-[400px] rounded-lg overflow-hidden glass"
    />
  );
}