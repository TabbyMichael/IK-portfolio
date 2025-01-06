import { motion } from 'framer-motion';

const skills = [
  { name: 'Frontend Development', level: 90 },
  { name: 'React & React Native', level: 85 },
  { name: 'Node.js & Express', level: 80 },
  { name: 'Database Management', level: 75 },
  { name: 'UI/UX Design', level: 70 },
];

export default function SkillBars() {
  return (
    <section className="mb-20">
      <h2 className="text-3xl font-bold mb-12 text-center">Technical Skills</h2>
      <div className="space-y-6">
        {skills.map((skill, index) => (
          <motion.div
            key={skill.name}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <div className="flex justify-between mb-2">
              <span className="text-white">{skill.name}</span>
              <span className="text-accent">{skill.level}%</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-accent"
                initial={{ width: 0 }}
                whileInView={{ width: `${skill.level}%` }}
                transition={{ duration: 1, delay: index * 0.1 }}
                viewport={{ once: true }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}