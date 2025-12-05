import { motion } from 'framer-motion';
import { ExternalLink, Github, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const projects = [
  {
    title: 'Kuza POS System',
    description: 'A modern point of sale system built for small businesses in Kenya.',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80',
    tech: ['React', 'Node.js', 'PostgreSQL'],
    liveUrl: '#',
    githubUrl: 'https://github.com/TabbyMichael/kuza ',
  },
  {
    title: 'Pharmacy Website',
    description: 'E-commerce platform for a local pharmacy with inventory management.',
    image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=800&q=80',
    tech: ['Next.js', 'Tailwind CSS', 'Supabase'],
    liveUrl: 'https://afya-bora.netlify.app',
    githubUrl: 'https://github.com/TabbyMichael/Afya-Bora',
  },
  {
    title: 'DatingApp',
    description: 'Modern dating application with real-time chat and matching.',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
    tech: ['React Native', 'Firebase', 'TypeScript'],
    liveUrl: '#',
    githubUrl: 'https://github.com/TabbyMichael/Soul-Mate',
  },
];

export default function FeaturedProjects() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl font-bold text-white mb-4">Featured Projects</h2>
        <p className="text-gray-400">Some of my recent work</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, index) => (
          <motion.div
            key={project.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="glass rounded-lg overflow-hidden group"
          >
            <div className="relative h-48">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-4">
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:text-white transition-colors duration-300"
                >
                  <ExternalLink size={24} />
                </a>
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:text-white transition-colors duration-300"
                >
                  <Github size={24} />
                </a>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
              <p className="text-gray-400 text-sm mb-4">{project.description}</p>
              <div className="flex flex-wrap gap-2">
                {project.tech.map((tech) => (
                  <span
                    key={tech}
                    className="text-xs px-2 py-1 rounded-full border border-accent text-accent"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* View All Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        viewport={{ once: true }}
        className="text-center mt-12"
      >
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 px-8 py-4 glass rounded-full text-accent hover:bg-accent/10 transition-all duration-300 group font-medium"
        >
          View All Projects
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
        </Link>
      </motion.div>
    </section>
  );
}