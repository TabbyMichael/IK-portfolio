import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight, Award, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  content: string;
  image: string;
  rating: number;
  projectType: string;
  projectUrl?: string;
  featured?: boolean;
  location?: string;
}

const featuredTestimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Dr. Sarah Kimani',
    role: 'Director of Digital Health',
    company: 'Nairobi Medical Center',
    content: 'Ian transformed our patient management system completely. The new web application reduced appointment booking time by 70% and improved our operational efficiency dramatically.',
    image: '/assets/webp/dr-sarah-kimani.webp',
    rating: 5,
    projectType: 'Healthcare Web App',
    projectUrl: 'https://nmc-patient-portal.netlify.app',
    featured: true,
    location: 'Nairobi, Kenya'
  },
  {
    id: 2,
    name: 'Michael Ochieng',
    role: 'CEO & Founder',
    company: 'EcoTech Solutions',
    content: 'Working with Ian on our e-commerce platform was a game-changer. He delivered a robust system that handles our inventory, payments, and customer management seamlessly.',
    image: '/assets/webp/michael-ochieng.webp',
    rating: 5,
    projectType: 'E-commerce Platform',
    projectUrl: 'https://ecotech-kenya.com',
    featured: true,
    location: 'Mombasa, Kenya'
  },
  {
    id: 3,
    name: 'James Mwangi',
    role: 'Restaurant Owner',
    company: "Mama Njeri's Kitchen",
    content: "The POS system Ian built for us has streamlined our entire restaurant operation. Order management, inventory tracking, and sales reporting are now automated.",
    image: '/assets/webp/james-mwangi.webp',
    rating: 5,
    projectType: 'POS System',
    featured: true,
    location: 'Nakuru, Kenya'
  }
];

export default function FeaturedTestimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredTestimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredTestimonials.length);
    setIsAutoPlaying(false);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + featuredTestimonials.length) % featuredTestimonials.length);
    setIsAutoPlaying(false);
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

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl font-bold text-white mb-4">What Clients Say</h2>
        <p className="text-gray-400">Trusted by businesses across Kenya</p>
      </motion.div>

      <div className="relative">
        {/* Main Testimonial Display */}
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="glass p-8 md:p-12 rounded-2xl relative overflow-hidden"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          {/* Background Quote Icon */}
          <Quote className="absolute top-6 right-6 w-16 h-16 text-accent/10" />
          
          {/* Featured Badge */}
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium">
              <Award className="w-4 h-4" />
              Featured Review
            </div>
          </div>

          {/* Rating */}
          <div className="flex justify-center mb-6">
            {renderStars(featuredTestimonials[currentIndex].rating)}
          </div>

          {/* Testimonial Content */}
          <blockquote className="text-xl md:text-2xl text-gray-300 text-center mb-8 leading-relaxed font-light italic max-w-4xl mx-auto">
            "{featuredTestimonials[currentIndex].content}"
          </blockquote>

          {/* Client Info */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <div className="relative w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-full overflow-hidden border-3 border-accent/30 flex-shrink-0 image-container testimonial-lg">
              <img
                src={featuredTestimonials[currentIndex].image}
                alt={featuredTestimonials[currentIndex].name}
                className="w-full h-full object-cover object-center transition-transform duration-300 hover:scale-105"
                loading="eager"
                width="112"
                height="112"
                onError={(e) => {
                  console.error('Failed to load image:', featuredTestimonials[currentIndex].image);
                  e.currentTarget.style.display = 'none';
                }}
                style={{
                  imageRendering: 'auto',
                  WebkitFontSmoothing: 'antialiased',
                  MozOsxFontSmoothing: 'grayscale'
                }}
              />
            </div>
            <div className="text-center md:text-left">
              <h4 className="text-xl font-semibold text-white mb-1">
                {featuredTestimonials[currentIndex].name}
              </h4>
              <p className="text-accent text-lg mb-1">
                {featuredTestimonials[currentIndex].role}
              </p>
              <p className="text-gray-400 mb-2">
                {featuredTestimonials[currentIndex].company}
              </p>
              <div className="flex items-center justify-center md:justify-start gap-4 text-sm">
                <span className="text-gray-500">{featuredTestimonials[currentIndex].location}</span>
                <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
                <span className="text-accent">{featuredTestimonials[currentIndex].projectType}</span>
              </div>
              
              {/* Case Study Button */}
              <div className="flex justify-center md:justify-start mt-4">
                <Link
                  to="/case"
                  className="group inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-accent/20 to-purple-500/20 border border-accent/30 rounded-full text-accent hover:from-accent/30 hover:to-purple-500/30 hover:border-accent/50 transition-all duration-300 hover:scale-105 backdrop-blur-sm shadow-lg hover:shadow-accent/25"
                >
                  <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                  <span className="font-semibold">Explore Success Story</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-between mt-8">
          <button
            onClick={prevTestimonial}
            className="p-3 glass rounded-full hover:bg-accent/10 transition-all duration-300 group"
          >
            <ChevronLeft className="w-6 h-6 text-gray-400 group-hover:text-accent" />
          </button>

          {/* Dots Indicator */}
          <div className="flex gap-3">
            {featuredTestimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentIndex(index);
                  setIsAutoPlaying(false);
                }}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-accent scale-125' 
                    : 'bg-gray-600 hover:bg-gray-500'
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

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <a
            href="/testimonials"
            className="inline-flex items-center gap-2 px-6 py-3 glass rounded-full text-accent hover:bg-accent/10 transition-all duration-300 group"
          >
            View All Testimonials
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}