import { motion } from 'framer-motion';
import Timeline from '../components/about/Timeline';
import SkillBars from '../components/about/SkillBars';
import Interests from '../components/about/Interests';

export default function About() {
  return (
    <div className="pt-20 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass p-8 rounded-lg mb-20"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80"
                alt="Ian Kibugu"
                className="rounded-lg w-full"
              />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-6">About Me</h1>
              <p className="text-gray-300 mb-6">
                I'm a self-taught developer based in Nairobi, Kenya, with a passion for creating
                beautiful and functional web applications. My journey in tech started with curiosity
                and has evolved into a professional career through dedication and continuous learning.
              </p>
              <a
                href="/resume.pdf"
                className="inline-block px-6 py-3 rounded-full text-accent border border-accent hover:bg-accent/10 transition-colors duration-300"
              >
                Download Resume
              </a>
            </div>
          </div>
        </motion.div>

        <Timeline />
        <SkillBars />
        <Interests />
      </div>
    </div>
  );
}