import { motion } from 'framer-motion';
import ProjectGrid from '../components/projects/ProjectGrid';

export default function Projects() {
  return (
    <div className="pt-20 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">My Projects</h1>
          <p className="text-gray-400">A showcase of my development journey</p>
        </motion.div>

        <ProjectGrid />
      </div>
    </div>
  );
}