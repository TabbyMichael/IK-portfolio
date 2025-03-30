import { motion } from 'framer-motion';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  content: string;
  image: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'John Smith',
    role: 'CTO',
    company: 'Tech Solutions Inc.',
    content: 'Working with this team has been an absolute pleasure. Their attention to detail and technical expertise is outstanding.',
    image: '/assets/1.png'
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    role: 'Product Manager',
    company: 'Innovation Labs',
    content: 'The level of professionalism and quality of work delivered exceeded our expectations. Highly recommended!',
    image: '/assets/2.png'
  },
  {
    id: 3,
    name: 'Michael Chen',
    role: 'Founder',
    company: 'StartUp Hub',
    content: 'Their innovative approach to problem-solving and commitment to delivering results made our project a huge success.',
    image: '/assets/3.png'
  },
  {
    id: 4,
    name: 'Emily Davis',
    role: 'Marketing Director',
    company: 'Creative Solutions',
    content: "The team's ability to understand our vision and translate it into reality was impressive. Great communication throughout.",
    image: '/assets/4.png'
  },
  {
    id: 5,
    name: 'David Wilson',
    role: 'CEO',
    company: 'Digital Ventures',
    content: "A truly talented team that delivers exceptional results. They've become our go-to partner for all development needs.",
    image: '/assets/5.png'
  },
  {
    id: 6,
    name: 'Lisa Thompson',
    role: 'Project Lead',
    company: 'Web Dynamics',
    content: 'Their technical expertise and collaborative approach made the development process smooth and efficient.',
    image: '/assets/6.png'
  }
];

const Testimonials: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white py-16 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Client Testimonials</h1>
          <p className="text-xl text-gray-300">
            Hear what our clients have to say about working with us
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-center mb-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="ml-4">
                  <h3 className="font-semibold text-lg">{testimonial.name}</h3>
                  <p className="text-gray-400 text-sm">
                    {testimonial.role} at {testimonial.company}
                  </p>
                </div>
              </div>
              <p className="text-gray-300 italic">"{testimonial.content}"</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Testimonials;