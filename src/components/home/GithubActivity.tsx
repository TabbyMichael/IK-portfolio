import { motion } from 'framer-motion';

export default function GithubActivity() {
  return (
    <section className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        viewport={{ once: true }}
        className="glass p-6 sm:p-8 lg:p-10 rounded-lg border border-[#FFD700]/20 shadow-[0_0_15px_rgba(255,215,0,0.1)] hover:shadow-[0_0_25px_rgba(255,215,0,0.2)] transition-shadow duration-300"
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-[#FFD700] mb-6 sm:mb-8 text-center glow-gold">GitHub Activity</h2>
        <div className="relative w-full h-[200px] sm:h-[250px] md:h-[300px]">
          <div className="absolute inset-0 overflow-hidden rounded-lg p-2 sm:p-3 lg:p-4 bg-black/40">
            <motion.img
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              src={"https://ghchart.rshah.org/FFD700/TabbyMichael"}
              alt="Ian Kibugu's GitHub Activity Graph"
              className="w-full h-full object-contain rounded-lg shadow-lg"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 pointer-events-none" />
          </div>
        </div>
      </motion.div>
    </section>
  );
}