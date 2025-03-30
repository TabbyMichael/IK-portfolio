import React from 'react';
import { event } from '../utils/analytics';

interface CaseStudy {
  id: string;
  title: string;
  client: string;
  industry: string;
  challenge: string;
  solution: string;
  impact: string[];
  technologies: string[];
  image: string;
}

const caseStudies: CaseStudy[] = [
  {
    id: '1',
    title: 'Enterprise-Scale E-commerce Platform Migration',
    client: 'Global Retail Solutions',
    industry: 'Retail & E-commerce',
    challenge: 'Migrating a legacy monolithic e-commerce system to a modern microservices architecture while maintaining 24/7 operations and handling peak loads of over 1M daily users.',
    solution: 'Implemented a phased migration strategy using event-driven architecture, containerization with Kubernetes, and a hybrid cloud approach. Developed custom data migration tools and automated testing pipelines.',
    impact: [
      '40% improvement in page load times',
      '99.99% system uptime achieved',
      '60% reduction in infrastructure costs',
      'Zero downtime during migration'
    ],
    technologies: ['React', 'Node.js', 'Kubernetes', 'AWS', 'MongoDB', 'Redis', 'Docker'],
    image: '/assets/case-study-1.svg'
  },
  {
    id: '2',
    title: 'AI-Powered Analytics Dashboard',
    client: 'DataTech Analytics',
    industry: 'Business Intelligence',
    challenge: 'Creating a real-time analytics dashboard capable of processing and visualizing massive amounts of data while providing AI-driven insights.',
    solution: 'Developed a scalable architecture using stream processing, implemented machine learning models for predictive analytics, and created an intuitive UI with real-time updates.',
    impact: [
      'Real-time processing of 1M+ events per second',
      '90% reduction in analysis time',
      '30% increase in user engagement',
      'Successfully predicted trends with 95% accuracy'
    ],
    technologies: ['Python', 'TensorFlow', 'React', 'GraphQL', 'Apache Kafka', 'ElasticSearch'],
    image: '/assets/case-study-2.svg'
  }
];

const CaseStudies: React.FC = () => {
  React.useEffect(() => {
    event({
      action: 'page_view',
      category: 'case_studies',
      label: 'Case Studies Page View',
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Case Studies</h1>
          <p className="text-xl text-gray-600">In-depth analysis of complex technical challenges and their solutions</p>
        </div>

        <div className="space-y-12">
          {caseStudies.map((study) => (
            <article
              key={study.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
              onClick={() => {
                event({
                  action: 'case_study_view',
                  category: 'case_studies',
                  label: study.title,
                });
              }}
            >
              <div className="grid md:grid-cols-2 gap-8">
                <div className="h-64 md:h-full">
                  <img
                    src={study.image}
                    alt={study.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-8">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-blue-600">{study.industry}</span>
                    <span className="text-sm text-gray-500">{study.client}</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">{study.title}</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Challenge</h3>
                      <p className="text-gray-600">{study.challenge}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Solution</h3>
                      <p className="text-gray-600">{study.solution}</p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Impact</h3>
                      <ul className="list-disc list-inside space-y-1 text-gray-600">
                        {study.impact.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Technologies Used</h3>
                      <div className="flex flex-wrap gap-2">
                        {study.technologies.map((tech, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CaseStudies;