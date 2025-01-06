import { TypeAnimation } from 'react-type-animation';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, MapPin } from 'lucide-react';

export default function Hero() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center md:text-left">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <h2 className="text-accent text-xl font-medium">Hello, I'm</h2>
          <h1 className="text-4xl md:text-6xl font-bold font-poppins text-white neon-glow">
            Ian Kibugu
          </h1>
          <div className="text-2xl md:text-4xl text-gray-300 h-[60px]">
            <TypeAnimation
              sequence={[
                'Self-Taught Developer',
                2000,
                'Frontend Engineer',
                2000,
                'UI/UX Enthusiast',
                2000,
              ]}
              wrapper="span"
              speed={50}
              repeat={Infinity}
            />
          </div>
          <div className="flex items-center justify-center md:justify-start space-x-2 text-gray-300">
            <MapPin size={20} className="text-accent" />
            <span>Nairobi, Kenya</span>
          </div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-center md:justify-start space-x-6"
          >
            <a
              href="https://github.com/IanKibugu"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-accent transition-colors duration-300"
            >
              <Github size={24} />
            </a>
            <a
              href="https://linkedin.com/in/iankibugu"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-accent transition-colors duration-300"
            >
              <Linkedin size={24} />
            </a>
            <a
              href="mailto:ian.kibugu@gmail.com"
              className="text-gray-300 hover:text-accent transition-colors duration-300"
            >
              <Mail size={24} />
            </a>
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="glass px-8 py-3 rounded-full text-accent border border-accent hover:bg-accent/10 transition-colors duration-300"
          >
            View My Work
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}