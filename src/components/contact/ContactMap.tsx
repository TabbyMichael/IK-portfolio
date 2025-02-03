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
      <div className="w-full h-[400px] rounded-lg overflow-hidden glass relative bg-primary/30 flex items-center justify-center">
        <div className="absolute inset-0 border-2 border-accent/20 rounded-lg">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="relative">
              <MapPin size={40} className="text-accent animate-bounce" />
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                <span className="text-accent font-medium">Nairobi, Kenya</span>
              </div>
            </div>
          </div>
          <div className="absolute bottom-4 right-4 text-accent/60 text-sm">
            <span>-1.2921° S, 36.8219° E</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}