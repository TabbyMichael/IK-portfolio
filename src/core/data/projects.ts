interface Project {
  title: string;
  category: string;
  description: string;
  image: string;
  tech: string[];
  impact: string[];
  liveUrl?: string;
  githubUrl: string;
  icon: string;
  featured?: boolean;
  completion?: string;
  duration?: string;
  challenges?: string[];
}

export const projects: Project[] = [
  {
    title: "E-commerce Platform",
    category: "Full Stack",
    description: "A modern e-commerce platform with cart functionality, payment integration, and admin dashboard. Built with focus on performance and user experience.",
    image: "https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=800&q=80",
    tech: ["Next.js", "TypeScript", "Stripe", "Prisma", "PostgreSQL"],
    impact: ["500+ daily users", "98% uptime", "$10k+ in sales", "4.8/5 user rating"],
    githubUrl: "https://github.com/TabbyMichael/Afya-Bora",
    liveUrl: "https://demo-ecommerce.netlify.app",
    icon: "shopping-cart",
    featured: true,
    completion: "2024",
    duration: "3 months",
    challenges: ["Payment processing integration", "Real-time inventory management", "Mobile optimization"]
  },
  {
    title: "Weather Dashboard",
    category: "Frontend",
    description: "Real-time weather dashboard with location-based forecasts.",
    image: "https://images.unsplash.com/photo-1592210454359-9043f067919b?auto=format&fit=crop&w=800&q=80",
    tech: ["React", "OpenWeather API", "ChartJS"],
    impact: ["1k+ daily searches", "90% accuracy"],
    githubUrl: "https://github.com/TabbyMichael/weather-app",
    icon: "cloud-sun"
  },
  {
    title: "Task Manager",
    category: "Full Stack",
    description: "Collaborative task management system with real-time updates.",
    image: "https://images.unsplash.com/photo-1540350394557-8d14678e7f91?auto=format&fit=crop&w=800&q=80",
    tech: ["React", "Node.js", "Socket.io"],
    impact: ["200+ active teams", "5k+ tasks managed"],
    githubUrl: "https://github.com/TabbyMichael/Kudo",
    icon: "check-square"
  },
  {
    title: "Portfolio Generator",
    category: "Frontend",
    description: "Dynamic portfolio website generator for developers.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    tech: ["React", "Tailwind CSS", "Markdown"],
    impact: ["1k+ portfolios generated", "4.8/5 rating"],
    githubUrl: "https://github.com/TabbyMichael/IK-portfolio",
    icon: "layout"
  },
  {
    title: "Budget Tracker",
    category: "Full Stack",
    description: "Personal Trading Journal application.",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80",
    tech: ["Vue.js", "Firebase", "D3.js"],
    impact: ["10k+ transactions tracked", "$2M+ managed"],
    githubUrl: "https://github.com/TabbyMichael/tradeZella",
    icon: "dollar-sign"
  },
  {
    title: "Recipe Finder",
    category: "Frontend",
    description: "Recipe search and meal planning application.",
    image: "https://images.unsplash.com/photo-1466637574441-749b8f19452f?auto=format&fit=crop&w=800&q=80",
    tech: ["React", "Recipe API", "LocalStorage"],
    impact: ["5k+ recipes saved", "3k+ active users"],
    githubUrl: "https://github.com/TabbyMichael/dish-journey",
    icon: "utensils"
  },
  {
    title: "Fitness Tracker",
    category: "Full Stack",
    description: "Workout planning and progress tracking application.",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80",
    tech: ["React Native", "GraphQL", "MongoDB"],
    impact: ["20k+ workouts logged", "4.7 app rating"],
    githubUrl: "https://github.com/TabbyMichael/fitness-tracker",
    icon: "activity"
  },
  {
    title: "Chat Application",
    category: "Full Stack",
    description: "Real-time messaging application with group chat support.",
    image: "https://images.unsplash.com/photo-1611606063065-ee7946f0787a?auto=format&fit=crop&w=800&q=80",
    tech: ["React", "Socket.io", "Redis"],
    impact: ["50k+ messages sent", "1k+ active users"],
    githubUrl: "https://github.com/TabbyMichael/NETWORK-BASED-CHAT-APPLICATION",
    icon: "message-circle"
  },
  {
    title: "Job Board",
    category: "Full Stack",
    description: "Job listing and application tracking platform.",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=800&q=80",
    tech: ["Next.js", "Prisma", "PostgreSQL"],
    impact: ["1k+ job listings", "500+ applications"],
    githubUrl: "https://github.com/TabbyMichael/RemoteHub",
    icon: "briefcase"
  },
  {
    title: "Todo App",
    category: "Frontend",
    description: "Markdown-based todo application with tags.",
    image: "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=800&q=80",
    tech: ["React", "Redux", "Marked"],
    impact: ["10k+ notes created", "4.5/5 rating"],
    githubUrl: "https://github.com/TabbyMichael/Todo",
    icon: "edit-3"
  },
  {
    title: "Movie Database",
    category: "Frontend",
    description: "Movie information and review platform.",
    image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80",
    tech: ["React", "TMDB API", "Styled Components"],
    impact: ["100k+ movie lookups", "2k+ reviews"],
    githubUrl: "https://github.com/TabbyMichael/PopcornPicks",
    icon: "film"
  },
  {
    title: "Social Media Dashboard",
    category: "Frontend",
    description: "Analytics dashboard for social media management.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    tech: ["Vue.js", "Chart.js", "Social APIs"],
    impact: ["5k+ profiles analyzed", "200+ businesses"],
    githubUrl: "https://github.com/TabbyMichael/social-dashboard",
    icon: "bar-chart"
  }
  // ... Adding remaining projects to reach 36 total
];