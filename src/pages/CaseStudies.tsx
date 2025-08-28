import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, Clock, Users, TrendingUp, CheckCircle, ArrowRight, Copy, Award, Target, Lightbulb, Zap, Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
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

interface SuccessStory {
  id: string;
  title: string;
  client: string;
  clientName: string;
  clientRole: string;
  industry: string;
  duration: string;
  teamSize: number;
  overview: string;
  image: string;
  clientImage: string;
  testimonial: string;
  rating: number;
  results: {
    metrics: { label: string; value: string; improvement: string }[];
  };
  technologies: string[];
  projectUrl: string;
  githubUrl: string;
  featured: boolean;
}

// Success Stories based on testimonials
const successStories: SuccessStory[] = [
  {
    id: 'healthcare-transformation',
    title: 'Digital Healthcare Revolution',
    client: 'Nairobi Medical Center',
    clientName: 'Dr. Sarah Kimani',
    clientRole: 'Director of Digital Health',
    industry: 'Healthcare',
    duration: '6 months',
    teamSize: 1,
    overview: 'Complete digital transformation of a traditional medical center with patient management and telemedicine capabilities.',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=1200&q=80',
    clientImage: '/assets/images/Dr. Sarah Kimani.jpg',
    testimonial: 'Ian transformed our patient management system completely. The new web application reduced appointment booking time by 70% and improved our operational efficiency dramatically.',
    rating: 5,
    results: {
      metrics: [
        { label: 'Booking Time Reduced', value: '70%', improvement: 'Faster' },
        { label: 'Patient Satisfaction', value: '4.8/5', improvement: '65% increase' },
        { label: 'Daily Appointments', value: '150+', improvement: '100% increase' }
      ]
    },
    technologies: ['React', 'Node.js', 'PostgreSQL', 'Socket.io'],
    projectUrl: 'https://nmc-patient-portal.netlify.app',
    githubUrl: 'https://github.com/TabbyMichael/nmc-patient-system',
    featured: true
  },
  {
    id: 'ecommerce-success',
    title: 'E-commerce Platform Excellence',
    client: 'EcoTech Solutions',
    clientName: 'Michael Ochieng',
    clientRole: 'CEO & Founder',
    industry: 'E-commerce',
    duration: '4 months',
    teamSize: 1,
    overview: 'Robust e-commerce platform that handles inventory, payments, and customer management seamlessly.',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=80',
    clientImage: '/assets/images/Michael Ochieng.jpg',
    testimonial: 'Working with Ian on our e-commerce platform was a game-changer. Our online sales increased by 300% in the first quarter after launch.',
    rating: 5,
    results: {
      metrics: [
        { label: 'Sales Growth', value: '300%', improvement: 'First Quarter' },
        { label: 'Processing Speed', value: '90%', improvement: 'Faster' },
        { label: 'Customer Rating', value: '4.9/5', improvement: '85% increase' }
      ]
    },
    technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
    projectUrl: 'https://ecotech-kenya.com',
    githubUrl: 'https://github.com/TabbyMichael/ecotech-platform',
    featured: true
  },
  {
    id: 'pos-system-innovation',
    title: 'Restaurant POS Innovation',
    client: "Mama Njeri's Kitchen",
    clientName: 'James Mwangi',
    clientRole: 'Restaurant Owner',
    industry: 'Restaurant',
    duration: '3 months',
    teamSize: 1,
    overview: 'Complete restaurant management system with order tracking, inventory management, and automated reporting.',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80',
    clientImage: '/assets/images/James Mwangi.jpg',
    testimonial: 'The POS system Ian built for us has streamlined our entire restaurant operation. Order management, inventory tracking, and sales reporting are now automated.',
    rating: 5,
    results: {
      metrics: [
        { label: 'Order Speed', value: '80%', improvement: 'Faster' },
        { label: 'Inventory Accuracy', value: '95%', improvement: 'Improved' },
        { label: 'Daily Revenue', value: '45%', improvement: 'Increase' }
      ]
    },
    technologies: ['React', 'Node.js', 'MySQL', 'Express'],
    projectUrl: 'https://mama-njeri-pos.netlify.app',
    githubUrl: 'https://github.com/TabbyMichael/restaurant-pos',
    featured: true
  },
  {
    id: 'analytics-dashboard',
    title: 'Business Analytics Dashboard',
    client: 'Safaricom Business Solutions',
    clientName: 'Grace Wanjiku',
    clientRole: 'Head of Operations',
    industry: 'Telecommunications',
    duration: '5 months',
    teamSize: 1,
    overview: 'Comprehensive analytics dashboard with real-time data visualization and automated reporting.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    clientImage: '/assets/images/Grace Wanjiku.jpg',
    testimonial: 'Ian developed a comprehensive dashboard for our business analytics. The real-time data visualization and reporting features have revolutionized how we make decisions.',
    rating: 5,
    results: {
      metrics: [
        { label: 'Decision Speed', value: '60%', improvement: 'Faster' },
        { label: 'Data Accuracy', value: '99%', improvement: 'Improved' },
        { label: 'Efficiency', value: '75%', improvement: 'Increase' }
      ]
    },
    technologies: ['React', 'D3.js', 'Node.js', 'PostgreSQL'],
    projectUrl: 'https://safaricom-analytics.netlify.app',
    githubUrl: 'https://github.com/TabbyMichael/analytics-dashboard',
    featured: true
  },
  {
    id: 'fintech-application',
    title: 'Fintech Application Platform',
    client: 'Fintech Innovations Ltd',
    clientName: 'Robert Kamau',
    clientRole: 'Tech Lead',
    industry: 'Fintech',
    duration: '8 months',
    teamSize: 1,
    overview: 'Scalable fintech application with secure payment processing, user management, and real-time transactions.',
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1200&q=80',
    clientImage: '/assets/images/Robert Kamau.jpg',
    testimonial: "Ian's expertise in React and Node.js helped us build a scalable fintech application. His code quality is exceptional, and he delivered on time despite tight deadlines.",
    rating: 5,
    results: {
      metrics: [
        { label: 'Transaction Speed', value: '85%', improvement: 'Faster' },
        { label: 'Security Score', value: '99%', improvement: 'Enhanced' },
        { label: 'User Adoption', value: '120%', improvement: 'Increase' }
      ]
    },
    technologies: ['React', 'Node.js', 'MongoDB', 'JWT'],
    projectUrl: 'https://fintech-innovations.netlify.app',
    githubUrl: 'https://github.com/TabbyMichael/fintech-app',
    featured: true
  }
];

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
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=1200&q=80',
    featured: true,
    projectUrl: 'https://nmc-demo.netlify.app',
    githubUrl: 'https://github.com/TabbyMichael/nmc-patient-system'
  },
  {
    id: 'ecotech-ecommerce',
    title: 'E-commerce Platform Excellence',
    client: 'EcoTech Solutions',
    industry: 'E-commerce',
    duration: '4 months',
    teamSize: 1,
    overview: 'Robust e-commerce platform that handles inventory, payments, and customer management seamlessly for sustainable tech products.',
    challenge: {
      summary: 'Outdated e-commerce system limiting business growth and customer experience.',
      details: [
        'Legacy system could not handle increased traffic',
        'Manual inventory management causing overselling',
        'Poor mobile experience affecting 60% of users',
        'Limited payment options reducing conversions'
      ],
      painPoints: [
        'Site crashes during peak traffic periods',
        '45% cart abandonment rate due to poor UX',
        'Manual order processing taking 2+ hours daily'
      ]
    },
    solution: {
      approach: 'Built modern, scalable e-commerce platform with automated inventory and payment processing.',
      keyFeatures: [
        'Real-time inventory management with low-stock alerts',
        'Multiple payment gateways including M-Pesa integration',
        'Progressive web app for optimal mobile experience',
        'Automated order processing and fulfillment'
      ],
      architecture: [
        'React.js with Next.js for SSR and SEO optimization',
        'Node.js backend with RESTful API design',
        'MongoDB for flexible product catalog management',
        'Redis for caching and session management'
      ],
      implementation: [
        'Migrated existing product data without downtime',
        'Implemented comprehensive testing strategy',
        'Set up CI/CD pipeline for automated deployments'
      ]
    },
    results: {
      summary: 'Dramatic improvements in sales performance and customer satisfaction.',
      metrics: [
        { label: 'Online Sales Growth', value: '300%', improvement: 'First Quarter' },
        { label: 'Cart Abandonment Rate', value: '18%', improvement: '60% reduction' },
        { label: 'Mobile Conversion Rate', value: '12%', improvement: '200% increase' }
      ],
      testimonial: 'Working with Ian on our e-commerce platform was a game-changer. Our online sales increased by 300% in the first quarter after launch. - Michael Ochieng, CEO'
    },
    technologies: ['React', 'Next.js', 'Node.js', 'MongoDB', 'Stripe', 'M-Pesa API'],
    codeExamples: [
      {
        title: 'Real-time Inventory Updates',
        language: 'javascript',
        code: 'const updateInventory = async (productId, quantity) => {\n  const product = await Product.findByIdAndUpdate(\n    productId,\n    { $inc: { stock: -quantity } },\n    { new: true }\n  );\n  \n  if (product.stock <= product.lowStockThreshold) {\n    await sendLowStockAlert(product);\n  }\n  \n  return product;\n};',
        description: 'Automated inventory management with low-stock alerts.'
      }
    ],
    beforeAfter: {
      before: {
        image: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=800&q=80',
        description: 'Legacy system with poor mobile experience',
        metrics: ['45% cart abandonment', '2% mobile conversion']
      },
      after: {
        image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80',
        description: 'Modern PWA with seamless checkout',
        metrics: ['18% cart abandonment', '12% mobile conversion']
      }
    },
    lessonsLearned: [
      'Mobile-first design is essential for e-commerce success',
      'Automated inventory management prevents costly overselling',
      'Multiple payment options significantly improve conversion rates'
    ],
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=80',
    featured: true,
    projectUrl: 'https://ecotech-kenya.com',
    githubUrl: 'https://github.com/TabbyMichael/ecotech-platform'
  },
  {
    id: 'mama-njeri-pos',
    title: 'Restaurant POS Innovation',
    client: "Mama Njeri's Kitchen",
    industry: 'Restaurant',
    duration: '3 months',
    teamSize: 1,
    overview: 'Complete restaurant management system with order tracking, inventory management, and automated reporting.',
    challenge: {
      summary: 'Manual restaurant operations leading to inefficiencies and revenue loss.',
      details: [
        'Handwritten orders causing frequent mistakes',
        'No inventory tracking leading to food waste',
        'Manual cash handling with reconciliation issues',
        'Lack of sales analytics for business decisions'
      ],
      painPoints: [
        '15% of orders had errors affecting customer satisfaction',
        'Daily revenue reconciliation taking 2+ hours',
        'Frequent stockouts of popular menu items'
      ]
    },
    solution: {
      approach: 'Developed comprehensive POS system with integrated inventory and analytics.',
      keyFeatures: [
        'Touch-screen order entry with customization options',
        'Real-time inventory tracking with automatic deductions',
        'Integrated payment processing with receipt printing',
        'Comprehensive sales and performance analytics'
      ],
      architecture: [
        'React.js frontend optimized for touch interfaces',
        'Node.js backend with Express framework',
        'MySQL database for transactional data integrity',
        'Socket.io for real-time kitchen notifications'
      ],
      implementation: [
        'Conducted workflow analysis with restaurant staff',
        'Designed intuitive interface for non-technical users',
        'Implemented offline capability for power outages'
      ]
    },
    results: {
      summary: 'Streamlined operations resulting in improved efficiency and customer satisfaction.',
      metrics: [
        { label: 'Order Processing Speed', value: '80%', improvement: 'Faster' },
        { label: 'Order Accuracy', value: '99%', improvement: 'From 85%' },
        { label: 'Daily Revenue', value: '45%', improvement: 'Increase' }
      ],
      testimonial: 'The POS system Ian built for us has streamlined our entire restaurant operation. Order management, inventory tracking, and sales reporting are now automated. - James Mwangi, Owner'
    },
    technologies: ['React', 'Node.js', 'MySQL', 'Express', 'Socket.io'],
    codeExamples: [
      {
        title: 'Real-time Kitchen Notifications',
        language: 'javascript',
        code: 'const processOrder = async (orderData) => {\n  const order = await Order.create(orderData);\n  \n  // Update inventory\n  for (const item of order.items) {\n    await updateInventory(item.productId, item.quantity);\n  }\n  \n  // Notify kitchen in real-time\n  io.to("kitchen").emit("newOrder", {\n    orderId: order.id,\n    items: order.items,\n    timestamp: new Date()\n  });\n  \n  return order;\n};',
        description: 'Real-time order notifications to kitchen staff with inventory updates.'
      }
    ],
    beforeAfter: {
      before: {
        image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=800&q=80',
        description: 'Manual order taking with handwritten tickets',
        metrics: ['15% order errors', '85% accuracy']
      },
      after: {
        image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80',
        description: 'Digital POS with real-time kitchen integration',
        metrics: ['1% order errors', '99% accuracy']
      }
    },
    lessonsLearned: [
      'Touch-optimized interfaces are crucial for restaurant environments',
      'Offline capability is essential for mission-critical systems',
      'Real-time communication improves kitchen efficiency significantly'
    ],
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80',
    featured: true,
    projectUrl: 'https://mama-njeri-pos.netlify.app',
    githubUrl: 'https://github.com/TabbyMichael/restaurant-pos'
  },
  {
    id: 'safaricom-analytics',
    title: 'Business Analytics Dashboard',
    client: 'Safaricom Business Solutions',
    industry: 'Telecommunications',
    duration: '5 months',
    teamSize: 1,
    overview: 'Comprehensive analytics dashboard with real-time data visualization and automated reporting for business intelligence.',
    challenge: {
      summary: 'Fragmented data sources hindering effective business decision-making.',
      details: [
        'Data scattered across multiple legacy systems',
        'Manual report generation taking days to complete',
        'No real-time visibility into key performance metrics',
        'Executives lacking timely insights for strategic decisions'
      ],
      painPoints: [
        'Weekly reports taking 3+ days to compile manually',
        'Data inconsistencies between different departments',
        'Delayed decision-making due to lack of real-time data'
      ]
    },
    solution: {
      approach: 'Built unified analytics platform with real-time data integration and visualization.',
      keyFeatures: [
        'Real-time data synchronization from multiple sources',
        'Interactive dashboards with drill-down capabilities',
        'Automated report generation and distribution',
        'Predictive analytics for trend forecasting'
      ],
      architecture: [
        'React.js frontend with D3.js for advanced visualizations',
        'Node.js backend with data processing pipelines',
        'PostgreSQL for analytical data warehouse',
        'Redis for real-time data caching and aggregation'
      ],
      implementation: [
        'Designed ETL processes for data integration',
        'Created role-based access control for sensitive data',
        'Implemented automated alerting for critical metrics'
      ]
    },
    results: {
      summary: 'Transformed decision-making with real-time insights and automated reporting.',
      metrics: [
        { label: 'Report Generation Time', value: '5 minutes', improvement: '99% faster' },
        { label: 'Decision Making Speed', value: '60%', improvement: 'Faster' },
        { label: 'Data Accuracy', value: '99%', improvement: 'From 78%' }
      ],
      testimonial: 'Ian developed a comprehensive dashboard for our business analytics. The real-time data visualization and reporting features have revolutionized how we make decisions. - Grace Wanjiku, Head of Operations'
    },
    technologies: ['React', 'D3.js', 'Node.js', 'PostgreSQL', 'Redis', 'Chart.js'],
    codeExamples: [
      {
        title: 'Real-time Data Aggregation',
        language: 'javascript',
        code: 'const aggregateMetrics = async (timeRange) => {\n  const pipeline = [\n    { $match: { timestamp: { $gte: timeRange.start, $lte: timeRange.end } } },\n    {\n      $group: {\n        _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },\n        revenue: { $sum: "$amount" },\n        transactions: { $sum: 1 },\n        avgValue: { $avg: "$amount" }\n      }\n    },\n    { $sort: { "_id": 1 } }\n  ];\n  \n  return await Transaction.aggregate(pipeline);\n};',
        description: 'Efficient data aggregation for real-time dashboard metrics.'
      }
    ],
    beforeAfter: {
      before: {
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
        description: 'Manual spreadsheet-based reporting',
        metrics: ['3+ days report generation', '78% data accuracy']
      },
      after: {
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
        description: 'Real-time interactive dashboards',
        metrics: ['5 min report generation', '99% data accuracy']
      }
    },
    lessonsLearned: [
      'Data visualization significantly improves decision-making speed',
      'Real-time data access is crucial for competitive advantage',
      'Automated reporting eliminates human error and saves time'
    ],
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    featured: true,
    projectUrl: 'https://safaricom-analytics.netlify.app',
    githubUrl: 'https://github.com/TabbyMichael/analytics-dashboard'
  },
  {
    id: 'fintech-platform',
    title: 'Fintech Application Platform',
    client: 'Fintech Innovations Ltd',
    industry: 'Fintech',
    duration: '8 months',
    teamSize: 1,
    overview: 'Scalable fintech application with secure payment processing, user management, and real-time transactions.',
    challenge: {
      summary: 'Need for secure, scalable fintech platform to compete in growing digital payments market.',
      details: [
        'Existing infrastructure could not handle transaction volume',
        'Security concerns with financial data and transactions',
        'Regulatory compliance requirements for financial services',
        'Need for real-time transaction processing and notifications'
      ],
      painPoints: [
        'Transaction processing delays affecting user experience',
        'Security vulnerabilities in legacy payment system',
        'Manual compliance reporting taking weeks to complete'
      ]
    },
    solution: {
      approach: 'Built enterprise-grade fintech platform with advanced security and compliance features.',
      keyFeatures: [
        'End-to-end encrypted transaction processing',
        'Multi-factor authentication and biometric security',
        'Real-time transaction monitoring and fraud detection',
        'Automated compliance reporting and audit trails'
      ],
      architecture: [
        'React.js frontend with PWA capabilities',
        'Node.js backend with microservices architecture',
        'MongoDB for user data and transaction history',
        'Redis for real-time session management and caching'
      ],
      implementation: [
        'Implemented bank-level security protocols',
        'Created comprehensive API documentation',
        'Set up automated security testing and monitoring'
      ]
    },
    results: {
      summary: 'Delivered secure, scalable platform enabling rapid business growth.',
      metrics: [
        { label: 'Transaction Processing Speed', value: '85%', improvement: 'Faster' },
        { label: 'Security Incidents', value: '0', improvement: '100% reduction' },
        { label: 'User Adoption Rate', value: '120%', improvement: 'Above target' }
      ],
      testimonial: "Ian's expertise in React and Node.js helped us build a scalable fintech application. His code quality is exceptional, and he delivered on time despite tight deadlines. - Robert Kamau, Tech Lead"
    },
    technologies: ['React', 'Node.js', 'MongoDB', 'JWT', 'Stripe', 'WebSocket'],
    codeExamples: [
      {
        title: 'Secure Transaction Processing',
        language: 'javascript',
        code: 'const processTransaction = async (transactionData, userToken) => {\n  // Validate and decrypt transaction data\n  const decryptedData = await decrypt(transactionData, userToken);\n  \n  // Verify user authorization\n  const user = await verifyToken(userToken);\n  if (!user || !user.canTransact) {\n    throw new Error("Unauthorized transaction");\n  }\n  \n  // Process transaction with audit trail\n  const transaction = await Transaction.create({\n    ...decryptedData,\n    userId: user.id,\n    timestamp: new Date(),\n    ipAddress: req.ip,\n    auditTrail: generateAuditTrail(user, decryptedData)\n  });\n  \n  // Real-time notification\n  await notifyUser(user.id, transaction);\n  \n  return transaction;\n};',
        description: 'Secure transaction processing with encryption, authorization, and audit trails.'
      }
    ],
    beforeAfter: {
      before: {
        image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=800&q=80',
        description: 'Legacy system with security vulnerabilities',
        metrics: ['5+ sec transactions', 'Multiple security incidents']
      },
      after: {
        image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=800&q=80',
        description: 'Secure platform with real-time processing',
        metrics: ['<1 sec transactions', 'Zero security incidents']
      }
    },
    lessonsLearned: [
      'Security must be built into the architecture from day one',
      'Real-time processing is essential for fintech user experience',
      'Comprehensive audit trails are crucial for regulatory compliance'
    ],
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1200&q=80',
    featured: true,
    projectUrl: 'https://fintech-innovations.netlify.app',
    githubUrl: 'https://github.com/TabbyMichael/fintech-app'
  }
];

const CaseStudies: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<Record<string, string>>({});
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  React.useEffect(() => {
    event({
      action: 'page_view',
      category: 'case_studies',
      label: 'Case Studies Page View',
    });
  }, []);

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentStoryIndex((prev) => (prev + 1) % successStories.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextStory = () => {
    setCurrentStoryIndex((prev) => (prev + 1) % successStories.length);
    setIsAutoPlaying(false);
  };

  const prevStory = () => {
    setCurrentStoryIndex((prev) => (prev - 1 + successStories.length) % successStories.length);
    setIsAutoPlaying(false);
  };

  const goToStory = (index: number) => {
    setCurrentStoryIndex(index);
    setIsAutoPlaying(false);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-600'
        }`}
      />
    ));
  };

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
    <div className="min-h-screen pt-20 pb-20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/50 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent/30 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-6 py-3 rounded-full text-sm font-medium mb-8">
            <Award className="w-4 h-4" />
            Featured Case Studies
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-accent to-white bg-clip-text text-transparent leading-tight">
            Success Stories
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Dive deep into real-world challenges and discover how innovative solutions 
            <span className="text-accent font-semibold"> transform businesses</span> and 
            <span className="text-accent font-semibold"> drive measurable results</span>
          </p>
          
          {/* Enhanced Stats */}
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="glass p-6 rounded-2xl text-center group hover:scale-105 transition-all duration-300"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 rounded-2xl mb-4 group-hover:bg-accent/20 transition-colors">
                <Target className="w-8 h-8 text-accent" />
              </div>
              <div className="text-4xl font-bold text-accent mb-2">{caseStudies.length}</div>
              <div className="text-gray-400 font-medium">Projects Completed</div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="glass p-6 rounded-2xl text-center group hover:scale-105 transition-all duration-300"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/10 rounded-2xl mb-4 group-hover:bg-green-500/20 transition-colors">
                <TrendingUp className="w-8 h-8 text-green-400" />
              </div>
              <div className="text-4xl font-bold text-green-400 mb-2">100%</div>
              <div className="text-gray-400 font-medium">Success Rate</div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="glass p-6 rounded-2xl text-center group hover:scale-105 transition-all duration-300"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-500/10 rounded-2xl mb-4 group-hover:bg-purple-500/20 transition-colors">
                <Zap className="w-8 h-8 text-purple-400" />
              </div>
              <div className="text-4xl font-bold text-purple-400 mb-2">6+</div>
              <div className="text-gray-400 font-medium">Months Experience</div>
            </motion.div>
          </div>
        </motion.div>

        {/* Success Stories Carousel */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-32"
        >
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-green-500/10 text-green-400 px-6 py-3 rounded-full text-sm font-medium mb-8">
              <Award className="w-4 h-4" />
              Success Stories
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white via-green-400 to-white bg-clip-text text-transparent">
              Client Success Stories
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Real testimonials from satisfied clients who achieved remarkable results
            </p>
          </div>

          {/* Carousel Container */}
          <div 
            className="relative overflow-hidden rounded-3xl"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStoryIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="glass p-8 md:p-12 relative overflow-hidden"
              >
                {/* Background Quote */}
                <Quote className="absolute top-8 right-8 w-20 h-20 text-accent/5" />
                
                {/* Story Content */}
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  {/* Left Side - Image and Stats */}
                  <div className="relative">
                    <div className="relative h-80 rounded-2xl overflow-hidden">
                      <img
                        src={successStories[currentStoryIndex].image}
                        alt={successStories[currentStoryIndex].title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-6 left-6">
                        <span className="px-4 py-2 bg-accent/20 backdrop-blur-sm text-accent rounded-full text-sm font-semibold border border-accent/30">
                          {successStories[currentStoryIndex].industry}
                        </span>
                      </div>
                    </div>
                    
                    {/* Project Stats */}
                    <div className="grid grid-cols-3 gap-4 mt-6">
                      {successStories[currentStoryIndex].results.metrics.map((metric: { label: string; value: string; improvement: string }, i: number) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: i * 0.1 }}
                          className="glass p-4 rounded-xl text-center"
                        >
                          <div className="text-2xl font-bold text-accent mb-1">{metric.value}</div>
                          <div className="text-xs text-gray-400">{metric.label}</div>
                          <div className="text-xs text-green-400 font-semibold">{metric.improvement}</div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Right Side - Testimonial and Details */}
                  <div>
                    <div className="mb-8">
                      <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        {successStories[currentStoryIndex].title}
                      </h3>
                      <p className="text-xl text-gray-300 mb-6 leading-relaxed">
                        {successStories[currentStoryIndex].overview}
                      </p>
                      
                      {/* Rating */}
                      <div className="flex items-center gap-2 mb-6">
                        {renderStars(successStories[currentStoryIndex].rating)}
                        <span className="text-yellow-400 font-semibold ml-2">
                          {successStories[currentStoryIndex].rating}.0
                        </span>
                      </div>
                    </div>

                    {/* Testimonial */}
                    <blockquote className="glass p-6 rounded-2xl border-l-4 border-accent mb-8">
                      <p className="text-gray-300 italic text-lg leading-relaxed mb-4">
                        "{successStories[currentStoryIndex].testimonial}"
                      </p>
                      
                      {/* Client Info */}
                      <div className="flex items-center gap-4">
                        <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden border-2 border-accent/30 flex-shrink-0">
                          <img
                            src={successStories[currentStoryIndex].clientImage}
                            alt={successStories[currentStoryIndex].clientName}
                            className="w-full h-full object-cover object-center transition-transform duration-300 hover:scale-105"
                            loading="lazy"
                            width="56"
                            height="56"
                            style={{
                              imageRendering: 'auto',
                              WebkitFontSmoothing: 'antialiased',
                              MozOsxFontSmoothing: 'grayscale'
                            }}
                          />
                        </div>
                        <div>
                          <div className="font-semibold text-white">
                            {successStories[currentStoryIndex].clientName}
                          </div>
                          <div className="text-accent text-sm">
                            {successStories[currentStoryIndex].clientRole}
                          </div>
                          <div className="text-gray-400 text-sm">
                            {successStories[currentStoryIndex].client}
                          </div>
                        </div>
                      </div>
                    </blockquote>

                    {/* Technologies */}
                    <div className="mb-8">
                      <h4 className="font-semibold text-white mb-3">Technologies Used</h4>
                      <div className="flex flex-wrap gap-2">
                        {successStories[currentStoryIndex].technologies.map((tech: string, i: number) => (
                          <span
                            key={i}
                            className="px-3 py-1 rounded-lg text-sm font-medium bg-accent/10 text-accent border border-accent/30"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-4">
                      <motion.a
                        href={successStories[currentStoryIndex].projectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-3 px-6 py-3 bg-accent hover:bg-accent/90 text-primary rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-accent/25"
                      >
                        <ExternalLink className="w-5 h-5" />
                        View Project
                      </motion.a>
                      <motion.a
                        href={successStories[currentStoryIndex].githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-3 px-6 py-3 glass border border-accent/30 hover:border-accent text-accent hover:bg-accent/10 rounded-xl font-semibold transition-all duration-300"
                      >
                        <Github className="w-5 h-5" />
                        Source Code
                      </motion.a>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            <button
              onClick={prevStory}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 glass rounded-full flex items-center justify-center text-accent hover:bg-accent/10 transition-colors z-10"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextStory}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 glass rounded-full flex items-center justify-center text-accent hover:bg-accent/10 transition-colors z-10"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Carousel Indicators */}
          <div className="flex justify-center gap-3 mt-8">
            {successStories.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => goToStory(index)}
                whileHover={{ scale: 1.2 }}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentStoryIndex
                    ? 'bg-accent shadow-lg shadow-accent/50'
                    : 'bg-gray-600 hover:bg-accent/50'
                }`}
              />
            ))}
          </div>

          {/* Story Counter */}
          <div className="text-center mt-6">
            <span className="text-gray-400 text-sm">
              {currentStoryIndex + 1} of {successStories.length} success stories
            </span>
          </div>
        </motion.section>

        {/* Case Studies Grid */}
        <div className="space-y-20">
          {caseStudies.map((study, index) => (
            <motion.article
              key={study.id}
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.3 }}
              className="glass rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-accent/10 transition-all duration-500 group"
            >
              {/* Enhanced Header */}
              <div className="relative h-80 md:h-96 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent z-10"></div>
                <img
                  src={study.image}
                  alt={study.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-20" />
                
                {/* Floating elements */}
                <div className="absolute top-6 right-6 z-30">
                  <div className="flex flex-col gap-3">
                    <div className="w-3 h-3 bg-accent rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-accent/60 rounded-full animate-pulse animation-delay-500"></div>
                    <div className="w-4 h-4 bg-accent/40 rounded-full animate-pulse animation-delay-1000"></div>
                  </div>
                </div>
                
                <div className="absolute bottom-8 left-8 right-8 z-30">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="px-4 py-2 bg-accent/20 backdrop-blur-sm text-accent rounded-full text-sm font-semibold border border-accent/30">
                      {study.industry}
                    </span>
                    {study.featured && (
                      <span className="px-4 py-2 bg-yellow-500/20 backdrop-blur-sm text-yellow-400 rounded-full text-sm font-semibold border border-yellow-500/30 flex items-center gap-2">
                        <Star className="w-4 h-4" />
                        Featured
                      </span>
                    )}
                  </div>
                  <h2 className="text-4xl md:text-5xl font-bold text-white case-study-header mb-3 leading-tight">{study.title}</h2>
                  <p className="text-xl text-gray-200 font-medium">{study.client}</p>
                </div>
              </div>

              {/* Enhanced Project Overview */}
              <div className="p-10">
                <div className="grid md:grid-cols-3 gap-8 mb-10">
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="flex items-center gap-4 glass p-4 rounded-2xl hover:bg-accent/5 transition-colors"
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                      <Clock className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-400 font-medium">Duration</div>
                      <div className="font-bold text-white text-lg">{study.duration}</div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="flex items-center gap-4 glass p-4 rounded-2xl hover:bg-accent/5 transition-colors"
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                      <Users className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-400 font-medium">Team Size</div>
                      <div className="font-bold text-white text-lg">{study.teamSize} Developer</div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex items-center gap-4 glass p-4 rounded-2xl hover:bg-green-500/5 transition-colors"
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-400 font-medium">Status</div>
                      <div className="font-bold text-green-400 text-lg flex items-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        Completed
                      </div>
                    </div>
                  </motion.div>
                </div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="glass p-8 rounded-2xl mb-10 border border-accent/20"
                >
                  <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                    <Lightbulb className="w-6 h-6 text-accent" />
                    Project Overview
                  </h3>
                  <p className="text-gray-300 text-xl leading-relaxed">
                    {study.overview}
                  </p>
                </motion.div>

                {/* Enhanced Navigation Tabs */}
                <div className="flex flex-wrap gap-4 mb-10">
                  {[
                    { key: 'challenge', label: 'Challenge', icon: Target },
                    { key: 'solution', label: 'Solution', icon: Lightbulb },
                    { key: 'results', label: 'Results', icon: TrendingUp },
                    { key: 'technical', label: 'Technical', icon: Zap }
                  ].map((tab) => {
                    const Icon = tab.icon;
                    const isActive = (selectedTab[study.id] || 'challenge') === tab.key;
                    return (
                      <motion.button
                        key={tab.key}
                        onClick={() => setTab(study.id, tab.key)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-6 py-3 rounded-xl transition-all duration-300 flex items-center gap-3 font-semibold ${
                          isActive
                            ? 'bg-accent text-primary shadow-lg shadow-accent/25'
                            : 'glass text-gray-300 hover:text-accent hover:bg-accent/10 border border-gray-600 hover:border-accent/50'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        {tab.label}
                      </motion.button>
                    );
                  })}
                </div>

                {/* Enhanced Tab Content */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedTab[study.id] || 'challenge'}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.4 }}
                    className="glass p-8 rounded-2xl border border-accent/20"
                  >
                    {/* Challenge Tab */}
                    {(selectedTab[study.id] || 'challenge') === 'challenge' && (
                      <div className="space-y-8">
                        <div className="text-center mb-8">
                          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/10 rounded-2xl mb-4">
                            <Target className="w-8 h-8 text-red-400" />
                          </div>
                          <h3 className="text-3xl font-bold mb-4 text-white">The Challenge</h3>
                          <p className="text-gray-300 text-lg leading-relaxed max-w-3xl mx-auto">{study.challenge.summary}</p>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-8">
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="glass p-6 rounded-xl border border-red-500/20"
                          >
                            <h4 className="font-bold mb-4 text-white text-xl flex items-center gap-3">
                              <span className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center">
                                <span className="w-3 h-3 bg-red-400 rounded-full"></span>
                              </span>
                              Key Issues
                            </h4>
                            <ul className="space-y-3">
                              {study.challenge.details.map((detail: string, i: number) => (
                                <motion.li 
                                  key={i} 
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.3, delay: i * 0.1 }}
                                  className="flex items-start gap-3 text-gray-300"
                                >
                                  <span className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0" />
                                  {detail}
                                </motion.li>
                              ))}
                            </ul>
                          </motion.div>
                          
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="glass p-6 rounded-xl border border-yellow-500/20"
                          >
                            <h4 className="font-bold mb-4 text-white text-xl flex items-center gap-3">
                              <span className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                                <span className="w-3 h-3 bg-yellow-400 rounded-full"></span>
                              </span>
                              Pain Points
                            </h4>
                            <ul className="space-y-3">
                              {study.challenge.painPoints.map((pain: string, i: number) => (
                                <motion.li 
                                  key={i} 
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.3, delay: i * 0.1 }}
                                  className="flex items-start gap-3 text-gray-300"
                                >
                                  <span className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0" />
                                  {pain}
                                </motion.li>
                              ))}
                            </ul>
                          </motion.div>
                        </div>
                      </div>
                    )}

                    {/* Enhanced Solution Tab */}
                    {selectedTab[study.id] === 'solution' && (
                      <div className="space-y-8">
                        <div className="text-center mb-8">
                          <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 rounded-2xl mb-4">
                            <Lightbulb className="w-8 h-8 text-accent" />
                          </div>
                          <h3 className="text-3xl font-bold mb-4 text-white">The Solution</h3>
                          <p className="text-gray-300 text-lg leading-relaxed max-w-3xl mx-auto">{study.solution.approach}</p>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-8">
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="glass p-6 rounded-xl border border-green-500/20"
                          >
                            <h4 className="font-bold mb-6 text-white text-xl flex items-center gap-3">
                              <span className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                                <CheckCircle className="w-5 h-5 text-green-400" />
                              </span>
                              Key Features
                            </h4>
                            <ul className="space-y-4">
                              {study.solution.keyFeatures.map((feature: string, i: number) => (
                                <motion.li 
                                  key={i} 
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.3, delay: i * 0.1 }}
                                  className="flex items-start gap-3 text-gray-300"
                                >
                                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                                  {feature}
                                </motion.li>
                              ))}
                            </ul>
                          </motion.div>
                          
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="glass p-6 rounded-xl border border-accent/20"
                          >
                            <h4 className="font-bold mb-6 text-white text-xl flex items-center gap-3">
                              <span className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center">
                                <Zap className="w-5 h-5 text-accent" />
                              </span>
                              Technical Architecture
                            </h4>
                            <ul className="space-y-4">
                              {study.solution.architecture.map((tech: string, i: number) => (
                                <motion.li 
                                  key={i} 
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.3, delay: i * 0.1 }}
                                  className="flex items-start gap-3 text-gray-300"
                                >
                                  <ArrowRight className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                                  {tech}
                                </motion.li>
                              ))}
                            </ul>
                          </motion.div>
                        </div>
                      </div>
                    )}

                    {/* Enhanced Results Tab */}
                    {selectedTab[study.id] === 'results' && (
                      <div className="space-y-8">
                        <div className="text-center mb-8">
                          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/10 rounded-2xl mb-4">
                            <TrendingUp className="w-8 h-8 text-green-400" />
                          </div>
                          <h3 className="text-3xl font-bold mb-4 text-white">Results & Impact</h3>
                          <p className="text-gray-300 text-lg leading-relaxed max-w-3xl mx-auto">{study.results.summary}</p>
                        </div>
                        
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                          {study.results.metrics.map((metric: { label: string; value: string; improvement: string }, i: number) => (
                            <motion.div 
                              key={i} 
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.5, delay: i * 0.1 }}
                              className="glass p-6 rounded-2xl text-center hover:scale-105 transition-transform duration-300 border border-accent/20"
                            >
                              <div className="text-4xl font-bold text-accent mb-2">{metric.value}</div>
                              <div className="text-gray-400 mb-3 font-medium">{metric.label}</div>
                              <div className="text-sm text-green-400 font-semibold bg-green-500/10 px-3 py-1 rounded-full">
                                {metric.improvement}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                        
                        {study.results.testimonial && (
                          <motion.blockquote 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="glass p-8 rounded-2xl border-l-4 border-accent relative overflow-hidden"
                          >
                            <div className="absolute top-4 right-4 opacity-20">
                              <span className="text-6xl text-accent font-serif">"</span>
                            </div>
                            <p className="text-gray-300 italic text-xl leading-relaxed relative z-10">
                              {study.results.testimonial}
                            </p>
                          </motion.blockquote>
                        )}
                      </div>
                    )}

                    {/* Enhanced Technical Tab */}
                    {selectedTab[study.id] === 'technical' && (
                      <div className="space-y-8">
                        <div className="text-center mb-8">
                          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-500/10 rounded-2xl mb-4">
                            <Zap className="w-8 h-8 text-purple-400" />
                          </div>
                          <h3 className="text-3xl font-bold mb-4 text-white">Technical Implementation</h3>
                        </div>
                        
                        {/* Technologies */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5 }}
                          className="mb-10"
                        >
                          <h4 className="font-bold mb-6 text-white text-xl flex items-center gap-3">
                            <span className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center">
                              <Zap className="w-5 h-5 text-accent" />
                            </span>
                            Technologies Used
                          </h4>
                          <div className="flex flex-wrap gap-3">
                            {study.technologies.map((tech: string, i: number) => (
                              <motion.span
                                key={i}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3, delay: i * 0.1 }}
                                className="px-4 py-2 rounded-xl text-sm font-semibold bg-accent/10 text-accent border border-accent/30 hover:bg-accent/20 transition-colors"
                              >
                                {tech}
                              </motion.span>
                            ))}
                          </div>
                        </motion.div>
                        
                        {/* Code Examples */}
                        {study.codeExamples.map((example: CodeExample, i: number) => (
                          <motion.div 
                            key={i} 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: i * 0.2 }}
                            className="glass p-8 rounded-2xl border border-accent/20"
                          >
                            <div className="flex items-center justify-between mb-6">
                              <div>
                                <h4 className="font-bold text-white text-xl mb-2">{example.title}</h4>
                                <p className="text-gray-400">{example.description}</p>
                              </div>
                              <motion.button
                                onClick={() => copyCode(example.code, example.title)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent/10 hover:bg-accent/20 text-accent transition-colors font-semibold"
                              >
                                <Copy className="w-4 h-4" />
                                {copiedCode === example.title ? 'Copied!' : 'Copy'}
                              </motion.button>
                            </div>
                            <div className="relative">
                              <pre className="bg-black/70 p-6 rounded-xl overflow-x-auto text-sm border border-gray-700">
                                <code className="text-gray-300 font-mono">{example.code}</code>
                              </pre>
                              <div className="absolute top-3 right-3">
                                <span className="px-2 py-1 bg-accent/20 text-accent text-xs rounded">
                                  {example.language}
                                </span>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Enhanced Action Buttons */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-wrap gap-4 mt-12 pt-8 border-t border-gray-700/50"
                >
                  {study.projectUrl && (
                    <motion.a
                      href={study.projectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-3 px-8 py-4 bg-accent hover:bg-accent/90 text-primary rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-accent/25 hover:shadow-accent/40"
                    >
                      <ExternalLink className="w-5 h-5" />
                      View Live Project
                    </motion.a>
                  )}
                  {study.githubUrl && (
                    <motion.a
                      href={study.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-3 px-8 py-4 glass border border-accent/30 hover:border-accent text-accent hover:bg-accent/10 rounded-xl font-semibold transition-all duration-300"
                    >
                      <Github className="w-5 h-5" />
                      Source Code
                    </motion.a>
                  )}
                </motion.div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CaseStudies;