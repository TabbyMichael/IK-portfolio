import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X, Tag } from 'lucide-react';
import { allProjects } from '../../data';
import ProjectCard from './ProjectCard';
import Pagination from '../common/Pagination';

const ITEMS_PER_PAGE = 12;

interface FilterState {
  category: string;
  technologies: string[];
  search: string;
}

export default function ProjectGrid() {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<FilterState>({
    category: 'All',
    technologies: [],
    search: ''
  });
  const [showTechFilters, setShowTechFilters] = useState(false);

  // Get all unique technologies from projects
  const allTechnologies = useMemo(() => {
    const techs = new Set<string>();
    allProjects.forEach(project => {
      project.tech.forEach(tech => techs.add(tech));
    });
    return Array.from(techs).sort();
  }, []);

  const filteredProjects = useMemo(() => {
    return allProjects.filter(project => {
      // Category filter
      const categoryMatch = filters.category === 'All' || project.category === filters.category;
      
      // Technology filter
      const techMatch = filters.technologies.length === 0 || 
        filters.technologies.some(tech => project.tech.includes(tech));
      
      // Search filter
      const searchMatch = filters.search === '' || 
        project.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        project.description.toLowerCase().includes(filters.search.toLowerCase()) ||
        project.tech.some(tech => tech.toLowerCase().includes(filters.search.toLowerCase()));
      
      return categoryMatch && techMatch && searchMatch;
    });
  }, [filters]);

  const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE);
  const currentProjects = filteredProjects.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const categories = ['All', 'Frontend', 'Backend', 'Full Stack'];

  const handleCategoryChange = (category: string) => {
    setFilters(prev => ({ ...prev, category }));
    setCurrentPage(1);
  };

  const handleTechnologyToggle = (tech: string) => {
    setFilters(prev => ({
      ...prev,
      technologies: prev.technologies.includes(tech)
        ? prev.technologies.filter(t => t !== tech)
        : [...prev.technologies, tech]
    }));
    setCurrentPage(1);
  };

  const handleSearchChange = (search: string) => {
    setFilters(prev => ({ ...prev, search }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({ category: 'All', technologies: [], search: '' });
    setCurrentPage(1);
  };

  const hasActiveFilters = filters.category !== 'All' || filters.technologies.length > 0 || filters.search !== '';

  return (
    <div className="space-y-8">
      {/* Search Bar */}
      <div className="relative max-w-md mx-auto mb-8">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search projects, technologies..."
          value={filters.search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-primary/50 border border-accent/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-white placeholder-gray-400"
        />
      </div>

      {/* Filter Controls */}
      <div className="space-y-4">
        {/* Category Filters */}
        <div className="flex justify-center gap-4 mb-6 flex-wrap">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`px-4 py-2 rounded-full transition-all duration-300 ${
                filters.category === category
                  ? 'bg-accent text-primary font-semibold'
                  : 'text-gray-400 hover:text-accent border border-gray-700 hover:border-accent'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Technology Filters Toggle */}
        <div className="flex justify-center items-center gap-4 mb-6">
          <button
            onClick={() => setShowTechFilters(!showTechFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
              showTechFilters || filters.technologies.length > 0
                ? 'bg-accent/10 text-accent border border-accent'
                : 'text-gray-400 hover:text-accent border border-gray-700 hover:border-accent'
            }`}
          >
            <Filter className="w-4 h-4" />
            Filter by Technology
            {filters.technologies.length > 0 && (
              <span className="bg-accent text-primary rounded-full px-2 py-1 text-xs font-semibold">
                {filters.technologies.length}
              </span>
            )}
          </button>
          
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-red-400 hover:text-red-300 border border-red-400/20 hover:border-red-400 transition-all duration-300"
            >
              <X className="w-4 h-4" />
              Clear Filters
            </button>
          )}
        </div>

        {/* Technology Filter Options */}
        <AnimatePresence>
          {showTechFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="glass p-6 rounded-lg mb-6">
                <h3 className="text-lg font-semibold mb-4 text-center text-white">Filter by Technology</h3>
                <div className="flex flex-wrap gap-2 justify-center max-w-4xl mx-auto">
                  {allTechnologies.map((tech) => (
                    <button
                      key={tech}
                      onClick={() => handleTechnologyToggle(tech)}
                      className={`flex items-center gap-1 px-3 py-2 rounded-full transition-all duration-300 text-sm ${
                        filters.technologies.includes(tech)
                          ? 'bg-accent text-primary font-semibold'
                          : 'bg-primary/30 text-gray-300 hover:text-accent border border-gray-700 hover:border-accent'
                      }`}
                    >
                      <Tag className="w-3 h-3" />
                      {tech}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Active Filters Display */}
        {filters.technologies.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center mb-4">
            {filters.technologies.map((tech) => (
              <div
                key={tech}
                className="flex items-center gap-2 bg-accent/10 text-accent px-3 py-1 rounded-full text-sm border border-accent/20"
              >
                <Tag className="w-3 h-3" />
                {tech}
                <button
                  onClick={() => handleTechnologyToggle(tech)}
                  className="hover:text-accent/80 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Results Summary */}
      <div className="text-center text-gray-400 mb-6">
        Showing {currentProjects.length} of {filteredProjects.length} projects
      </div>

      {/* Projects Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${filters.category}-${filters.technologies.join('-')}-${filters.search}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {currentProjects.map((project, index) => (
            <ProjectCard key={project.title} project={project} index={index} />
          ))}
        </motion.div>
      </AnimatePresence>
      
      {/* No Results Message */}
      {filteredProjects.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="glass p-8 rounded-lg max-w-md mx-auto">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No projects found</h3>
            <p className="text-gray-400 mb-4">Try adjusting your filters or search terms.</p>
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-accent/10 text-accent border border-accent rounded-lg hover:bg-accent/20 transition-all duration-300"
            >
              Clear all filters
            </button>
          </div>
        </motion.div>
      )}
      
      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}