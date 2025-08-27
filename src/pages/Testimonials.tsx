import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Star, Calendar, Filter, Award, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  content: string;
  image: string;
  rating: number;
  date: string;
  projectType: string;
  projectUrl?: string;
  featured?: boolean;
  location?: string;
  companySize?: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Dr. Sarah Kimani',
    role: 'Director of Digital Health',
    company: 'Nairobi Medical Center',
    content: 'Ian transformed our patient management system completely. The new web application reduced appointment booking time by 70% and improved our operational efficiency dramatically. His attention to detail and understanding of healthcare workflows was exceptional.',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    date: '2024-01-15',
    projectType: 'Healthcare Web App',
    projectUrl: 'https://nmc-patient-portal.netlify.app',
    featured: true,
    location: 'Nairobi, Kenya',
    companySize: '500+ employees'
  },
  {
    id: 2,
    name: 'Michael Ochieng',
    role: 'CEO & Founder',
    company: 'EcoTech Solutions',
    content: 'Working with Ian on our e-commerce platform was a game-changer. He delivered a robust system that handles our inventory, payments, and customer management seamlessly. Our online sales increased by 300% in the first quarter after launch.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    date: '2023-11-20',
    projectType: 'E-commerce Platform',
    projectUrl: 'https://ecotech-kenya.com',
    featured: true,
    location: 'Mombasa, Kenya',
    companySize: '50-100 employees'
  },
  {
    id: 3,
    name: 'Grace Wanjiku',
    role: 'Head of Operations',
    company: 'Safaricom Business Solutions',
    content: 'Ian developed a comprehensive dashboard for our business analytics. The real-time data visualization and reporting features have revolutionized how we make decisions. Exceptional technical skills combined with great communication.',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    date: '2024-02-10',
    projectType: 'Analytics Dashboard',
    location: 'Nairobi, Kenya',
    companySize: '1000+ employees'
  },
  {
    id: 4,
    name: 'James Mwangi',
    role: 'Restaurant Owner',
    company: "Mama Njeri's Kitchen",
    content: "The POS system Ian built for us has streamlined our entire restaurant operation. Order management, inventory tracking, and sales reporting are now automated. He understood our needs perfectly and delivered beyond expectations.",
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    date: '2023-10-05',
    projectType: 'POS System',
    featured: true,
    location: 'Nakuru, Kenya',
    companySize: '10-50 employees'
  },
  {
    id: 5,
    name: 'Dr. Peter Kinyanjui',
    role: 'Pharmacy Director',
    company: 'Goodlife Pharmacy',
    content: 'Ian created a modern pharmacy management system that handles prescriptions, inventory, and customer data efficiently. The system has improved our service delivery and reduced medication errors significantly.',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=200&q=80',
    rating: 4,
    date: '2023-12-18',
    projectType: 'Pharmacy Management',
    projectUrl: 'https://goodlife-pharmacy-system.netlify.app',
    location: 'Eldoret, Kenya',
    companySize: '100-500 employees'
  },
  {
    id: 6,
    name: 'Catherine Njeri',
    role: 'IT Manager',
    company: 'Kenya Commercial Bank',
    content: 'The internal dashboard Ian developed for our branch operations has enhanced our efficiency tremendously. Real-time monitoring, automated reports, and intuitive design made it an instant success across all branches.',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    date: '2024-01-30',
    projectType: 'Internal Dashboard',
    location: 'Nairobi, Kenya',
    companySize: '1000+ employees'
  },
  {
    id: 7,
    name: 'Robert Kamau',
    role: 'Tech Lead',
    company: 'Fintech Innovations Ltd',
    content: "Ian's expertise in React and Node.js helped us build a scalable fintech application. His code quality is exceptional, and he delivered the project on time despite tight deadlines. Highly recommend for complex projects.",
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    date: '2023-09-12',
    projectType: 'Fintech Application',
    featured: true,
    location: 'Nairobi, Kenya',
    companySize: '100-500 employees'
  },
  {
    id: 8,
    name: 'Mary Akinyi',
    role: 'Digital Marketing Manager',
    company: 'Tuko Digital Agency',
    content: 'The portfolio websites Ian created for our clients are stunning and performant. His eye for design and technical implementation skills resulted in websites that not only look great but convert visitors to customers.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    rating: 4,
    date: '2023-08-20',
    projectType: 'Portfolio Websites',
    location: 'Kisumu, Kenya',
    companySize: '10-50 employees'
  }
];

const Testimonials: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [filter, setFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'carousel'>('carousel');

  const filteredTestimonials = testimonials.filter(testimonial => {
    if (filter === 'all') return true;
    if (filter === 'featured') return testimonial.featured;
    if (filter === '5-star') return testimonial.rating === 5;
    return testimonial.projectType.toLowerCase().includes(filter.toLowerCase());
  });

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % filteredTestimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + filteredTestimonials.length) % filteredTestimonials.length);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-600'
        }`}
      />
    ));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const filters = [
    { value: 'all', label: 'All Testimonials', count: testimonials.length },
    { value: 'featured', label: 'Featured', count: testimonials.filter(t => t.featured).length },
    { value: '5-star', label: '5-Star Reviews', count: testimonials.filter(t => t.rating === 5).length },
    { value: 'healthcare', label: 'Healthcare', count: testimonials.filter(t => t.projectType.toLowerCase().includes('healthcare')).length },
    { value: 'ecommerce', label: 'E-commerce', count: testimonials.filter(t => t.projectType.toLowerCase().includes('commerce')).length }
  ];

  return (
    <div className="min-h-screen pt-20 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold mb-4">Client Testimonials</h1>
          <p className="text-xl text-gray-400 mb-8">
            Hear from satisfied clients about their experience working with Ian
          </p>
          
          {/* Statistics */}
          <div className="flex justify-center gap-8 mb-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-accent">{testimonials.length}</div>
              <div className="text-sm text-gray-400">Happy Clients</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent">
                {(testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length).toFixed(1)}
              </div>
              <div className="text-sm text-gray-400">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent">
                {testimonials.filter(t => t.rating === 5).length}
              </div>
              <div className="text-sm text-gray-400">5-Star Reviews</div>
            </div>
          </div>
        </motion.div>

        {/* Filter Buttons */}
        <div className="flex justify-center mb-8">
          <div className="glass p-4 rounded-lg">
            <div className="flex flex-wrap gap-2 justify-center items-center mb-4">
              <Filter className="w-4 h-4 text-accent" />
              {filters.map((filterOption) => (
                <button
                  key={filterOption.value}
                  onClick={() => {
                    setFilter(filterOption.value);
                    setCurrentIndex(0);
                  }}
                  className={`px-3 py-2 rounded-full text-sm transition-all duration-300 ${
                    filter === filterOption.value
                      ? 'bg-accent text-primary font-semibold'
                      : 'text-gray-400 hover:text-accent border border-gray-700 hover:border-accent'
                  }`}
                >
                  {filterOption.label}
                  <span className="ml-1 text-xs opacity-75">({filterOption.count})</span>
                </button>
              ))}
            </div>
            
            {/* View Mode Toggle */}
            <div className="flex justify-center gap-2">
              <button
                onClick={() => setViewMode('carousel')}
                className={`px-3 py-1 rounded text-sm ${
                  viewMode === 'carousel'
                    ? 'bg-accent text-primary'
                    : 'text-gray-400 hover:text-accent'
                }`}
              >
                Carousel
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1 rounded text-sm ${
                  viewMode === 'grid'
                    ? 'bg-accent text-primary'
                    : 'text-gray-400 hover:text-accent'
                }`}
              >
                Grid
              </button>
            </div>
          </div>
        </div>

        {/* Carousel View */}
        {viewMode === 'carousel' && filteredTestimonials.length > 0 && (
          <div className="relative max-w-4xl mx-auto mb-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${filter}-${currentIndex}`}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3 }}
                className="glass p-8 rounded-lg"
              >
                {/* Testimonial Content */}
                <div className="text-center mb-8">
                  {filteredTestimonials[currentIndex]?.featured && (
                    <div className="flex justify-center mb-4">
                      <div className="flex items-center gap-2 bg-accent/10 text-accent px-3 py-1 rounded-full text-sm">
                        <Award className="w-4 h-4" />
                        Featured Review
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-center mb-4">
                    {renderStars(filteredTestimonials[currentIndex]?.rating || 0)}
                  </div>
                  
                  <blockquote className="text-lg italic text-gray-300 mb-6 leading-relaxed">
                    "{filteredTestimonials[currentIndex]?.content}"
                  </blockquote>
                  
                  <div className="flex items-center justify-center gap-4">
                    <img
                      src={filteredTestimonials[currentIndex]?.image}
                      alt={filteredTestimonials[currentIndex]?.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-accent/20"
                    />
                    <div className="text-left">
                      <h3 className="font-semibold text-lg text-white">
                        {filteredTestimonials[currentIndex]?.name}
                      </h3>
                      <p className="text-accent text-sm">
                        {filteredTestimonials[currentIndex]?.role}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {filteredTestimonials[currentIndex]?.company}
                      </p>
                      {filteredTestimonials[currentIndex]?.location && (
                        <p className="text-gray-500 text-xs">
                          {filteredTestimonials[currentIndex]?.location}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-center gap-6 mt-6 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDate(filteredTestimonials[currentIndex]?.date || '')}
                    </div>
                    <div className="text-accent">
                      {filteredTestimonials[currentIndex]?.projectType}
                    </div>
                    {filteredTestimonials[currentIndex]?.companySize && (
                      <div>{filteredTestimonials[currentIndex]?.companySize}</div>
                    )}
                  </div>
                  
                  {/* Case Study Button */}
                  <div className="flex justify-center mt-6">
                    <Link
                      to="/case"
                      className="group inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-accent/10 to-blue-500/10 border border-accent/40 rounded-full text-accent hover:from-accent/20 hover:to-blue-500/20 hover:border-accent/60 transition-all duration-300 hover:scale-105 backdrop-blur-sm shadow-lg hover:shadow-accent/20"
                    >
                      <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                      <span className="font-semibold text-base">View Full Case Study</span>
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
            
            {/* Navigation */}
            {filteredTestimonials.length > 1 && (
              <div className="flex justify-between items-center mt-6">
                <button
                  onClick={prevTestimonial}
                  className="p-3 glass rounded-full hover:bg-accent/10 transition-all duration-300 group"
                >
                  <ChevronLeft className="w-6 h-6 text-gray-400 group-hover:text-accent" />
                </button>
                
                <div className="flex gap-2">
                  {filteredTestimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentIndex ? 'bg-accent' : 'bg-gray-600 hover:bg-gray-500'
                      }`}
                    />
                  ))}
                </div>
                
                <button
                  onClick={nextTestimonial}
                  className="p-3 glass rounded-full hover:bg-accent/10 transition-all duration-300 group"
                >
                  <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-accent" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Grid View */}
        {viewMode === 'grid' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredTestimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass rounded-lg p-6 hover:shadow-xl transition-all duration-300 relative"
              >
                {testimonial.featured && (
                  <div className="absolute top-4 right-4">
                    <Award className="w-5 h-5 text-accent" />
                  </div>
                )}
                
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-accent/20"
                  />
                  <div className="ml-4 flex-1">
                    <h3 className="font-semibold text-lg text-white">{testimonial.name}</h3>
                    <p className="text-accent text-sm">{testimonial.role}</p>
                    <p className="text-gray-400 text-sm">{testimonial.company}</p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center mb-3">
                  <div className="flex">{renderStars(testimonial.rating)}</div>
                  <span className="text-xs text-gray-500">{formatDate(testimonial.date)}</span>
                </div>
                
                <p className="text-gray-300 text-sm italic mb-4 leading-relaxed">
                  "{testimonial.content}"
                </p>
                
                <div className="flex justify-between items-center text-xs text-gray-500 mb-4">
                  <span className="text-accent">{testimonial.projectType}</span>
                </div>
                
                {/* Case Study Button */}
                <div className="flex justify-center mt-4">
                  <Link
                    to="/case"
                    className="group inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-accent/10 to-purple-500/10 border border-accent/30 rounded-full text-accent hover:from-accent/20 hover:to-purple-500/20 hover:border-accent/50 transition-all duration-300 hover:scale-105 backdrop-blur-sm text-sm"
                  >
                    <Sparkles className="w-3 h-3 group-hover:rotate-12 transition-transform duration-300" />
                    <span className="font-medium">Deep Dive</span>
                    <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {filteredTestimonials.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="glass p-8 rounded-lg max-w-md mx-auto">
              <Filter className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No testimonials found</h3>
              <p className="text-gray-400 mb-4">Try selecting a different filter.</p>
              <button
                onClick={() => setFilter('all')}
                className="px-4 py-2 bg-accent/10 text-accent border border-accent rounded-lg hover:bg-accent/20 transition-all duration-300"
              >
                View All Testimonials
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Testimonials;