import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  Tag, 
  ExternalLink, 
  Star,
  TrendingUp,
  Eye,
  MessageCircle
} from 'lucide-react';

interface NewsletterIssue {
  id: number;
  title: string;
  date: string;
  excerpt: string;
  readTime: string;
  tags: string[];
  featured?: boolean;
  views: number;
  rating: number;
  comments: number;
  category: string;
  content?: string;
}

const mockIssues: NewsletterIssue[] = [
  {
    id: 1,
    title: 'Building Scalable React Applications: A Deep Dive',
    date: '2024-01-15',
    excerpt: 'Learn advanced patterns and techniques for creating maintainable React applications that scale with your team and business needs.',
    readTime: '8 min read',
    tags: ['React', 'Architecture', 'Best Practices'],
    featured: true,
    views: 2547,
    rating: 4.9,
    comments: 23,
    category: 'Web Development'
  },
  {
    id: 2,
    title: 'The Rise of AI in Web Development',
    date: '2024-01-08',
    excerpt: 'Exploring how artificial intelligence is transforming the way we build websites and applications in 2024.',
    readTime: '6 min read',
    tags: ['AI', 'Web Development', 'Future Tech'],
    views: 1832,
    rating: 4.7,
    comments: 18,
    category: 'Industry Trends'
  },
  {
    id: 3,
    title: 'Optimizing Database Performance for High-Traffic Apps',
    date: '2024-01-01',
    excerpt: 'Database optimization techniques that can handle millions of users without breaking a sweat.',
    readTime: '10 min read',
    tags: ['Database', 'Performance', 'Backend'],
    views: 1456,
    rating: 4.8,
    comments: 15,
    category: 'Backend Development'
  },
  {
    id: 4,
    title: 'TypeScript Best Practices for Large Teams',
    date: '2023-12-25',
    excerpt: 'How to establish TypeScript conventions that improve code quality and developer productivity.',
    readTime: '7 min read',
    tags: ['TypeScript', 'Team', 'Best Practices'],
    views: 2156,
    rating: 4.6,
    comments: 31,
    category: 'Web Development'
  },
  {
    id: 5,
    title: 'Mobile-First Design Strategies for 2024',
    date: '2023-12-18',
    excerpt: 'Essential strategies for creating mobile-first experiences that convert users into customers.',
    readTime: '5 min read',
    tags: ['Mobile', 'Design', 'UX'],
    views: 1743,
    rating: 4.5,
    comments: 12,
    category: 'Design'
  }
];

const categories = ['All', 'Web Development', 'Backend Development', 'Industry Trends', 'Design', 'Career'];

export default function NewsletterArchive() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'date' | 'views' | 'rating'>('date');

  const filteredAndSortedIssues = useMemo(() => {
    const filtered = mockIssues.filter(issue => {
      const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           issue.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           issue.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'All' || issue.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });

    // Sort issues
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'views':
          return b.views - a.views;
        case 'rating':
          return b.rating - a.rating;
        case 'date':
        default:
          return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });

    return filtered;
  }, [searchTerm, selectedCategory, sortBy]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-white mb-4"
        >
          Newsletter Archive
        </motion.h2>
        <p className="text-gray-400 mb-6">
          Browse through our collection of {mockIssues.length} newsletter issues
        </p>

        {/* Search and Filters */}
        <div className="space-y-4 md:space-y-0 md:flex md:items-center md:gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-primary/50 border border-accent/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent text-white placeholder-gray-400"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="appearance-none bg-primary/50 border border-accent/20 rounded-xl px-4 py-3 pr-10 text-white focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>

          {/* Sort By */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'views' | 'rating')}
              className="appearance-none bg-primary/50 border border-accent/20 rounded-xl px-4 py-3 pr-10 text-white focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
            >
              <option value="date">Latest</option>
              <option value="views">Most Viewed</option>
              <option value="rating">Highest Rated</option>
            </select>
            <TrendingUp className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Results */}
      {filteredAndSortedIssues.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg">No articles found matching your criteria.</div>
          <button 
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('All');
            }}
            className="mt-4 text-accent hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredAndSortedIssues.map((issue, index) => (
            <motion.article
              key={issue.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className={`glass p-6 rounded-2xl hover:border-accent/30 transition-all duration-300 cursor-pointer ${
                issue.featured ? 'border-accent/20' : 'border-gray-700/50'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-start gap-4">
                <div className="flex-1">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      {issue.featured && (
                        <div className="flex items-center gap-1 text-accent text-sm font-medium mb-2">
                          <Star className="w-4 h-4" />
                          FEATURED
                        </div>
                      )}
                      <h3 className="text-xl font-bold text-white mb-2 hover:text-accent transition-colors">
                        {issue.title}
                      </h3>
                    </div>
                    <ExternalLink className="w-5 h-5 text-gray-400 hover:text-accent transition-colors" />
                  </div>

                  {/* Excerpt */}
                  <p className="text-gray-300 mb-4 line-clamp-2">
                    {issue.excerpt}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {issue.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-accent/10 text-accent text-sm rounded-full flex items-center gap-1"
                      >
                        <Tag className="w-3 h-3" />
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Meta Info */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(issue.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {issue.readTime}
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {issue.views.toLocaleString()} views
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      {issue.rating}/5
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                      {issue.comments} comments
                    </div>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      )}
    </div>
  );
}