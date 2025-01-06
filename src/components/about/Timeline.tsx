import { motion } from 'framer-motion';

const timelineEvents = [
  {
    year: '2020',
    title: 'Started Learning Web Development',
    description: 'Began self-learning HTML, CSS, and JavaScript through online resources.',
  },
  {
    year: '2021',
    title: 'First Freelance Project',
    description: 'Completed first client project - a website for a local business.',
  },
  {
    year: '2022',
    title: 'Expanded to Full Stack',
    description: 'Learned Node.js and built several full-stack applications.',
  },
  {
    year: '2023',
    title: 'Professional Developer',
    description: 'Working as a full-time developer on various projects.',
  },
];

export default function Timeline() {
  return (
    <section className="mb-20">
      <h2 className="text-3xl font-bold mb-12 text-center">My Journey</h2>
      <div className="relative">
        <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-accent/30" />
        {timelineEvents.map((event, index) => (
          <motion.div
            key={event.year}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className={`relative mb-12 ${
              index % 2 === 0 ? 'md:ml-auto md:pl-8' : 'md:mr-auto md:pr-8'
            } md:w-1/2`}
          >
            <div className="glass p-6 rounded-lg">
              <div className="absolute top-6 -left-3 md:left-auto md:right-0 w-6 h-6 rounded-full bg-accent" />
              <span className="text-accent font-bold">{event.year}</span>
              <h3 className="text-xl font-semibold mt-2 mb-3">{event.title}</h3>
              <p className="text-gray-400">{event.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}