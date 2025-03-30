import React from 'react';
import { event } from '../../utils/analytics';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  image: string;
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    role: 'Project Manager',
    company: 'TechCorp Solutions',
    content: 'Working with this developer was an exceptional experience. Their technical expertise, attention to detail, and ability to deliver complex solutions on time made our project a great success.',
    image: '/assets/testimonial-1.svg'
  },
  {
    id: '2',
    name: 'Michael Chen',
    role: 'CTO',
    company: 'InnovateTech',
    content: 'Outstanding technical skills combined with excellent communication and problem-solving abilities. Consistently delivered high-quality code and innovative solutions to challenging problems.',
    image: '/assets/testimonial-2.svg'
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    role: 'Lead Developer',
    company: 'WebScale Inc',
    content: 'A true professional who brings both technical excellence and creative thinking to every project. Their commitment to best practices and clean code architecture is impressive.',
    image: '/assets/testimonial-3.svg'
  }
];

const Testimonials: React.FC = () => {
  React.useEffect(() => {
    event({
      action: 'view',
      category: 'testimonials',
      label: 'Testimonials Section View',
    });
  }, []);

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Client Testimonials</h2>
          <p className="mt-4 text-xl text-gray-600">What others say about my work and collaboration</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3 md:grid-cols-2">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-xl shadow-md p-8 transition-all duration-300 hover:shadow-xl"
              onClick={() => {
                event({
                  action: 'testimonial_view',
                  category: 'testimonials',
                  label: `${testimonial.name} - ${testimonial.company}`,
                });
              }}
            >
              <div className="flex items-center mb-6">
                <img
                  className="h-12 w-12 rounded-full object-cover"
                  src={testimonial.image}
                  alt={testimonial.name}
                />
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">{testimonial.name}</h3>
                  <div className="text-sm text-gray-600">
                    {testimonial.role} at {testimonial.company}
                  </div>
                </div>
              </div>
              <blockquote>
                <p className="text-gray-800 leading-relaxed">"{testimonial.content}"</p>
              </blockquote>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;