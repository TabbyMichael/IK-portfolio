import { motion } from 'framer-motion';

export default function GithubActivity() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="glass p-8 rounded-lg"
      >
        <h2 className="text-3xl font-bold text-white mb-8 text-center">GitHub Activity</h2>
        <img
          src={`https://ghchart.rshah.org/64FFDA/IanKibugu`}
          alt="Ian Kibugu's GitHub Activity Graph"
          className="w-full"
        />
      </motion.div>
    </section>
  );
}