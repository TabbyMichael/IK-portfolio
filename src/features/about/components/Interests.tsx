import { motion } from 'framer-motion';
import { Code2, Book, Gamepad2, Plane } from 'lucide-react';

const interests = [
  {
    icon: <Code2 className="w-6 h-6" />,
    title: 'Coding',
    description: 'Building side projects and learning new technologies',
  },
  {
    icon: <Book className="w-6 h-6" />,
    title: 'Reading',
    description: 'Technical books and sci-fi novels',
  },
  {
    icon: <Gamepad2 className="w-6 h-6" />,
    title: 'Gaming',
    description: 'Strategy and RPG games',
  },
  {
    icon: <Plane className="w-6 h-6" />,
    title: 'Travel',
    description: 'Exploring new places and cultures',
  },
];

export default function Interests() {
  return (
    <section className="mb-20">
      <h2 className="text-3xl font-bold mb-12 text-center">Personal Interests</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {interests.map((interest, index) => (
          <motion.div
            key={interest.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="glass p-6 rounded-lg hover:border-accent transition-colors duration-300"
          >
            <div className="text-accent mb-4">{interest.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{interest.title}</h3>
            <p className="text-gray-400 text-sm">{interest.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}