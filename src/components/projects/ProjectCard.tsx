import { motion } from 'framer-motion';
import { Code2, ExternalLink } from 'lucide-react';

interface ProjectCardProps {
  project: {
    title: string;
    description: string;
    image: string;
    tech: string[];
    impact: string[];
    githubUrl: string;
    liveUrl?: string;
  };
  index: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="glass rounded-lg overflow-hidden group"
    >
      <div className="relative h-48">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="absolute inset-0 flex items-center justify-center space-x-4">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-accent/20 rounded-full hover:bg-accent/40 transition-colors duration-300"
              >
                <ExternalLink className="w-6 h-6 text-accent" />
              </a>
            )}
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-accent/20 rounded-full hover:bg-accent/40 transition-colors duration-300"
            >
              <Code2 className="w-6 h-6 text-accent" />
            </a>
          </div>
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
        <p className="text-gray-400 text-sm mb-4">{project.description}</p>
        <div className="mb-4">
          {project.impact.map((stat, i) => (
            <div key={i} className="text-sm text-accent mb-1">
              • {stat}
            </div>
          ))}
        </div>
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
  );
}