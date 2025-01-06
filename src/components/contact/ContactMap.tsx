import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

export default function ContactMap() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full mt-12"
    >
      <div className="w-full h-[400px] rounded-lg overflow-hidden glass flex items-center justify-center bg-primary/30">
        <div className="text-center">
          <MapPin className="w-12 h-12 text-accent mx-auto mb-4" />
          <p className="text-lg font-semibold">Nairobi, Kenya</p>
          <p className="text-gray-400 mt-2">Contact me for the exact location</p>
        </div>
      </div>
    </motion.div>
  );
}