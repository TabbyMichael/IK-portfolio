import { useState } from 'react';
import { allProjects } from '../../data';
import ProjectCard from './ProjectCard';
import Pagination from '../common/Pagination';

const ITEMS_PER_PAGE = 12;

export default function ProjectGrid() {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredProjects = allProjects.filter(
    project => activeCategory === 'All' || project.category === activeCategory
  );

  const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE);
  const currentProjects = filteredProjects.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const categories = ['All', 'Frontend', 'Backend', 'Full Stack'];

  return (
    <div className="space-y-8">
      <div className="flex justify-center gap-4 mb-12">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => {
              setActiveCategory(category);
              setCurrentPage(1); // Reset to first page when changing category
            }}
            className={`px-4 py-2 rounded-full transition-all duration-300 ${
              activeCategory === category
                ? 'bg-accent text-primary font-semibold'
                : 'text-gray-400 hover:text-accent border border-gray-700 hover:border-accent'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {currentProjects.map((project, index) => (
          <ProjectCard key={project.title} project={project} index={index} />
        ))}
      </div>
      
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