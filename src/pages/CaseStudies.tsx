import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, Clock, Users, TrendingUp, CheckCircle, ArrowRight, Copy } from 'lucide-react';
import { event } from '../utils/analytics';

interface CodeExample {
  title: string;
  language: string;
  code: string;
  description: string;
}

interface BeforeAfter {
  before: {
    image: string;
    description: string;
    metrics?: string[];
  };
  after: {
    image: string;
    description: string;
    metrics?: string[];
  };
}

interface CaseStudy {
  id: string;
  title: string;
  client: string;
  industry: string;
  duration: string;
  teamSize: number;
  overview: string;
  challenge: {
    summary: string;
    details: string[];
    painPoints: string[];
  };
  solution: {
    approach: string;
    keyFeatures: string[];
    architecture: string[];
    implementation: string[];
  };
  results: {
    summary: string;
    metrics: { label: string; value: string; improvement: string }[];
    testimonial?: string;
  };
  technologies: string[];
  codeExamples: CodeExample[];
  beforeAfter?: BeforeAfter;
  lessonsLearned: string[];
  image: string;
  featured?: boolean;
  projectUrl?: string;
  githubUrl?: string;
}

const caseStudies: CaseStudy[] = [
  {
    id: 'nairobi-medical-center',
    title: 'Digital Healthcare Transformation',
    client: 'Nairobi Medical Center',
    industry: 'Healthcare',
    duration: '6 months',
    teamSize: 1,
    overview: 'Complete digital transformation of a traditional medical center with patient management and telemedicine.',
    challenge: {
      summary: 'Manual processes causing long wait times and poor patient experience.',
      details: [
        'Manual patient registration taking 15+ minutes per patient',
        'No digital appointment booking system',
        'Paper-based medical records causing data loss'
      ],
      painPoints: [
        '70% of patients complained about long wait times',
        'Daily loss of 2+ hours due to manual processes'
      ]
    },
    solution: {
      approach: 'Developed comprehensive web-based patient management system with real-time capabilities.',
      keyFeatures: [
        'Online appointment booking with calendar integration',
        'Digital patient registration and check-in',
        'Electronic health records (EHR) system'
      ],
      architecture: [
        'React.js frontend with responsive design',
        'Node.js backend with Express framework',
        'PostgreSQL database for data integrity'
      ],
      implementation: [
        'Conducted requirements analysis with medical staff',
        'Designed user-friendly interfaces for different roles',
        'Implemented secure authentication and authorization'
      ]
    },
    results: {
      summary: 'Significant improvements in operational efficiency and patient satisfaction.',
      metrics: [
        { label: 'Patient Registration Time', value: '3 minutes', improvement: '80% faster' },
        { label: 'Patient Satisfaction', value: '4.8/5', improvement: '65% increase' },
        { label: 'Daily Appointments', value: '150+', improvement: '100% increase' }
      ],
      testimonial: 'The system has completely transformed how we operate. - Dr. Sarah Kimani, Director'
    },
    technologies: ['React', 'Node.js', 'PostgreSQL', 'Redis', 'Socket.io'],
    codeExamples: [
      {
        title: 'Real-time Appointment Updates',
        language: 'javascript',
        code: 'const updateAppointmentStatus = async (appointmentId, status) => {\n  await Appointment.findByIdAndUpdate(appointmentId, { status });\n  io.emit("appointmentUpdate", { appointmentId, status });\n};',
        description: 'Real-time updates keep patients informed about their appointment status.'
      }
    ],
    beforeAfter: {
      before: {
        image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?auto=format&fit=crop&w=800&q=80',
        description: 'Paper-based registration with long queues',
        metrics: ['15+ min registration', '40% no-show rate']
      },
      after: {
        image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=800&q=80',
        description: 'Digital check-in with real-time updates',
        metrics: ['3 min registration', '15% no-show rate']
      }
    },
    lessonsLearned: [
      'User training is crucial for successful digital transformation',
      'Real-time communication significantly improves user experience'
    ],
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?auto=format&fit=crop&w=1200&q=80',
    featured: true,
    projectUrl: 'https://nmc-demo.netlify.app',
    githubUrl: 'https://github.com/TabbyMichael/nmc-patient-system'
  }
];

const CaseStudies: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<Record<string, string>>({});
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  React.useEffect(() => {
    event({
      action: 'page_view',
      category: 'case_studies',
      label: 'Case Studies Page View',
    });
  }, []);

  const setTab = (caseId: string, tab: string) => {
    setSelectedTab(prev => ({ ...prev, [caseId]: tab }));
  };

  const copyCode = async (code: string, title: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(title);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold mb-4">Case Studies</h1>
          <p className="text-xl text-gray-400 mb-8">
            In-depth analysis of complex technical challenges and their solutions
          </p>
          <div className="flex justify-center gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-accent">{caseStudies.length}</div>
              <div className="text-sm text-gray-400">Projects Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent">100%</div>
              <div className="text-sm text-gray-400">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent">6+</div>
              <div className="text-sm text-gray-400">Months Experience</div>
            </div>
          </div>
        </motion.div>

        <div className="space-y-16">
          {caseStudies.map((study, index) => (
            <motion.article
              key={study.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="glass rounded-lg overflow-hidden"
            >
              {/* Header */}
              <div className="relative h-64 md:h-80 overflow-hidden">
                <img
                  src={study.image}
                  alt={study.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="px-3 py-1 bg-accent/20 text-accent rounded-full text-sm font-medium">
                      {study.industry}
                    </span>
                    {study.featured && (
                      <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm font-medium">
                        Featured
                      </span>
                    )}
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-2">{study.title}</h2>
                  <p className="text-gray-300">{study.client}</p>
                </div>
              </div>

              {/* Project Overview */}
              <div className="p-8">
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-accent" />
                    <div>
                      <div className="text-sm text-gray-400">Duration</div>
                      <div className="font-semibold">{study.duration}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-accent" />
                    <div>
                      <div className="text-sm text-gray-400">Team Size</div>
                      <div className="font-semibold">{study.teamSize} Developer</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-accent" />
                    <div>
                      <div className="text-sm text-gray-400">Status</div>
                      <div className="font-semibold text-green-400">Completed</div>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-300 text-lg leading-relaxed mb-8">
                  {study.overview}
                </p>

                {/* Navigation Tabs */}
                <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-700">
                  {['challenge', 'solution', 'results', 'technical'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setTab(study.id, tab)}
                      className={`px-4 py-2 rounded-t-lg transition-all duration-300 capitalize ${
                        (selectedTab[study.id] || 'challenge') === tab
                          ? 'bg-accent/10 text-accent border-b-2 border-accent'
                          : 'text-gray-400 hover:text-accent'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedTab[study.id] || 'challenge'}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Challenge Tab */}
                    {(selectedTab[study.id] || 'challenge') === 'challenge' && (
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-xl font-semibold mb-4 text-accent">The Challenge</h3>
                          <p className="text-gray-300 mb-6">{study.challenge.summary}</p>
                          
                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="font-semibold mb-3 text-white">Key Issues</h4>
                              <ul className="space-y-2">
                                {study.challenge.details.map((detail, i) => (
                                  <li key={i} className="flex items-start gap-2 text-gray-300">
                                    <span className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0" />
                                    {detail}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h4 className="font-semibold mb-3 text-white">Pain Points</h4>
                              <ul className="space-y-2">
                                {study.challenge.painPoints.map((pain, i) => (
                                  <li key={i} className="flex items-start gap-2 text-gray-300">
                                    <span className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0" />
                                    {pain}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Solution Tab */}
                    {selectedTab[study.id] === 'solution' && (
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-xl font-semibold mb-4 text-accent">The Solution</h3>
                          <p className="text-gray-300 mb-6">{study.solution.approach}</p>
                          
                          <div className="grid md:grid-cols-2 gap-8">
                            <div>
                              <h4 className="font-semibold mb-4 text-white">Key Features</h4>
                              <ul className="space-y-3">
                                {study.solution.keyFeatures.map((feature, i) => (
                                  <li key={i} className="flex items-start gap-3 text-gray-300">
                                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                                    {feature}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h4 className="font-semibold mb-4 text-white">Technical Architecture</h4>
                              <ul className="space-y-3">
                                {study.solution.architecture.map((tech, i) => (
                                  <li key={i} className="flex items-start gap-3 text-gray-300">
                                    <ArrowRight className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                                    {tech}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Results Tab */}
                    {selectedTab[study.id] === 'results' && (
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-xl font-semibold mb-4 text-accent">Results & Impact</h3>
                          <p className="text-gray-300 mb-6">{study.results.summary}</p>
                          
                          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            {study.results.metrics.map((metric, i) => (
                              <div key={i} className="glass p-4 rounded-lg text-center">
                                <div className="text-2xl font-bold text-accent mb-1">{metric.value}</div>
                                <div className="text-sm text-gray-400 mb-2">{metric.label}</div>
                                <div className="text-xs text-green-400">{metric.improvement}</div>
                              </div>
                            ))}
                          </div>
                          
                          {study.results.testimonial && (
                            <blockquote className="glass p-6 rounded-lg border-l-4 border-accent">
                              <p className="text-gray-300 italic mb-4">"{study.results.testimonial}"</p>
                            </blockquote>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Technical Tab */}
                    {selectedTab[study.id] === 'technical' && (
                      <div className="space-y-8">
                        <div>
                          <h3 className="text-xl font-semibold mb-4 text-accent">Technical Implementation</h3>
                          
                          {/* Technologies */}
                          <div className="mb-8">
                            <h4 className="font-semibold mb-4 text-white">Technologies Used</h4>
                            <div className="flex flex-wrap gap-2">
                              {study.technologies.map((tech, i) => (
                                <span
                                  key={i}
                                  className="px-3 py-1 rounded-full text-sm font-medium bg-accent/10 text-accent border border-accent/20"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          {/* Code Examples */}
                          {study.codeExamples.map((example, i) => (
                            <div key={i} className="glass p-6 rounded-lg">
                              <div className="flex items-center justify-between mb-4">
                                <div>
                                  <h4 className="font-semibold text-white">{example.title}</h4>
                                  <p className="text-sm text-gray-400 mt-1">{example.description}</p>
                                </div>
                                <button
                                  onClick={() => copyCode(example.code, example.title)}
                                  className="flex items-center gap-2 px-3 py-2 rounded bg-accent/10 hover:bg-accent/20 text-accent transition-colors"
                                >
                                  <Copy className="w-4 h-4" />
                                  {copiedCode === example.title ? 'Copied!' : 'Copy'}
                                </button>
                              </div>
                              <pre className="bg-black/50 p-4 rounded overflow-x-auto text-sm">
                                <code className="text-gray-300">{example.code}</code>
                              </pre>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Action Buttons */}
                <div className="flex gap-4 mt-8 pt-6 border-t border-gray-700">
                  {study.projectUrl && (
                    <a
                      href={study.projectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-6 py-3 bg-accent/10 hover:bg-accent/20 text-accent rounded-lg transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View Live Project
                    </a>
                  )}
                  {study.githubUrl && (
                    <a
                      href={study.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-6 py-3 border border-gray-600 hover:border-accent text-gray-300 hover:text-accent rounded-lg transition-colors"
                    >
                      <Github className="w-4 h-4" />
                      Source Code
                    </a>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CaseStudies;