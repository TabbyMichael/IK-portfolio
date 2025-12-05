import { motion } from 'framer-motion';
import { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function ContactMap() {
  useEffect(() => {
    // Initialize the map
    const map = L.map('map').setView([-1.2921, 36.8219], 13);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Add a marker for Nairobi location
L.marker([-1.2921, 36.8219])
      .addTo(map)
      .bindPopup('Nairobi, Kenya');

    // Cleanup on component unmount
    return () => {
      map.remove();
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full mt-12"
    >
      <div 
        id="map" 
        className="w-full h-[400px] rounded-lg overflow-hidden glass relative bg-primary/30"
        style={{ border: '2px solid rgba(255, 215, 0, 0.2)' }}
      />
    </motion.div>
  );
}