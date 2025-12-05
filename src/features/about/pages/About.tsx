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
                src="/assets/images/Leonardo_Phoenix_10_Ian_28yearold_confident_African_male_devel_0.jpg"
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
              <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 items-center">
                <select
                  className="bg-transparent text-accent border border-accent rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent/50"
                  onChange={(e) => {
                    const link = document.createElement('a');
                    link.href = e.target.value;
                    link.download = e.target.value.split('/').pop() || '';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  defaultValue=""
                >
                  <option value="" disabled>Select Resume</option>
                  <option value="/Data Specialist.pdf">Data Specialist</option>
                  <option value="/UXUI.pdf">UX/UI Designer</option>
                  <option value="/Kibugu ian (1).pdf">General Resume</option>
                </select>
              </div>
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