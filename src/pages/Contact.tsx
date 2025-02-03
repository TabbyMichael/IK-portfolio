import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, MapPin, Phone } from 'lucide-react';
import ContactMap from '../components/contact/ContactMap';

export default function Contact() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted');
  };

  return (
    <div className="min-h-screen pt-20 pb-20 bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4 text-white">Get In Touch</h1>
          <p className="text-gray-400">Let's work together on something great</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="col-span-2 glass rounded-lg p-8"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-accent">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="mt-1 block w-full p-3 bg-primary/50 border border-accent/20 rounded-md focus:outline-none focus:ring-2 focus:ring-accent text-white placeholder-gray-400"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-accent">
                  Your Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="mt-1 block w-full p-3 bg-primary/50 border border-accent/20 rounded-md focus:outline-none focus:ring-2 focus:ring-accent text-white placeholder-gray-400"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-accent">
                  Your Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  className="mt-1 block w-full p-3 bg-primary/50 border border-accent/20 rounded-md focus:outline-none focus:ring-2 focus:ring-accent text-white placeholder-gray-400"
                  placeholder="Your message here..."
                ></textarea>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full py-3 px-4 bg-accent/10 text-accent border border-accent rounded-md hover:bg-accent/20 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-primary transition-colors duration-300"
              >
                Send Message
              </motion.button>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="glass p-8 rounded-lg space-y-8"
          >
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <MapPin className="text-accent w-6 h-6" />
                <span className="text-gray-300">Nairobi, Kenya</span>
              </div>
              <div className="flex items-center space-x-4">
                <Phone className="text-accent w-6 h-6" />
                <span className="text-gray-300">+254 712 345 678</span>
              </div>
              <div className="flex items-center space-x-4">
                <Mail className="text-accent w-6 h-6" />
                <span className="text-gray-300">kibuguzian@gmail.com</span>
              </div>
            </div>
            <div className="flex space-x-6">
              <a 
                href="https://github.com/TabbyMichael" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-accent hover:text-accent/80 transition-colors duration-300"
              >
                <Github className="w-6 h-6" />
              </a>
              <a 
                href="https://www.linkedin.com/in/tabitha-michael-6a9800219/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-accent hover:text-accent/80 transition-colors duration-300"
              >
                <Linkedin className="w-6 h-6" />
              </a>
            </div>
          </motion.div>
        </div>

        <ContactMap />
      </div>
    </div>
  );
}
