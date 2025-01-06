import { motion } from 'framer-motion';
import { Code2, Palette, Terminal, Globe } from 'lucide-react';

const skills = [
  {
    icon: <Code2 size={24} />,
    title: 'Frontend Development',
    description: 'Building responsive and interactive web applications using React, TypeScript, and modern CSS.',
  },
  {
    icon: <Terminal size={24} />,
    title: 'Backend Development',
    description: 'Creating robust server-side applications with Node.js and Express.',
  },
  {
    icon: <Palette size={24} />,
    title: 'UI/UX Design',
    description: 'Designing intuitive user interfaces with a focus on user experience and accessibility.',
  },
  {
    icon: <Globe size={24} />,
    title: 'Web Performance',
    description: 'Optimizing web applications for speed, SEO, and best practices.',
  },
];

export default function FeaturedSkills() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl font-bold text-white mb-4">Featured Skills</h2>
        <p className="text-gray-400">Expertise gained through self-learning and practical experience</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {skills.map((skill, index) => (
          <motion.div
            key={skill.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="glass p-6 rounded-lg hover:border-accent transition-colors duration-300"
          >
            <div className="text-accent mb-4">{skill.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{skill.title}</h3>
            <p className="text-gray-400 text-sm">{skill.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}