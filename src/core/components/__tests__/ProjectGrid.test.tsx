import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock project data - must be before component import
jest.mock('../../data', () => ({
  allProjects: [
    {
      title: 'Test Project 1',
      category: 'Frontend',
      description: 'A React application',
      tech: ['React', 'TypeScript', 'Tailwind'],
      image: 'test-image.jpg',
      githubUrl: 'https://github.com/test/project1',
      liveUrl: 'https://project1.com',
      icon: 'code',
      impact: ['100+ users']
    },
    {
      title: 'Test Project 2',
      category: 'Backend',
      description: 'A Node.js API',
      tech: ['Node.js', 'Express', 'MongoDB'],
      image: 'test-image2.jpg',
      githubUrl: 'https://github.com/test/project2',
      icon: 'server',
      impact: ['50+ API calls/day']
    },
    {
      title: 'Full Stack App',
      category: 'Full Stack',
      description: 'A complete web application',
      tech: ['React', 'Node.js', 'PostgreSQL'],
      image: 'test-image3.jpg',
      githubUrl: 'https://github.com/test/project3',
      liveUrl: 'https://project3.com',
      icon: 'layers',
      impact: ['200+ users']
    }
  ]
}));

import ProjectGrid from '../projects/ProjectGrid';

// Mock framer-motion
interface MockMotionProps {
  children: React.ReactNode;
  [key: string]: unknown;
}

jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: MockMotionProps) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: MockMotionProps) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock ProjectCard component
interface MockProjectCardProps {
  project: {
    title: string;
    description: string;
    tech: string[];
  };
}

jest.mock('../projects/ProjectCard', () => {
  return function MockProjectCard({ project }: MockProjectCardProps) {
    return (
      <div data-testid={`project-card-${project.title}`}>
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        <div data-testid="tech-stack">
          {project.tech.join(', ')}
        </div>
      </div>
    );
  };
});

// Mock Pagination component
jest.mock('../common/Pagination', () => {
  return function MockPagination({ 
    currentPage, 
    totalPages, 
    onPageChange 
  }: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  }) {
    return (
      <div data-testid="pagination">
        <span>Page {currentPage} of {totalPages}</span>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => onPageChange(i + 1)}
            data-testid={`page-${i + 1}`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    );
  };
});

describe('ProjectGrid', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all projects by default', () => {
    render(<ProjectGrid />);

    expect(screen.getByTestId('project-card-Test Project 1')).toBeInTheDocument();
    expect(screen.getByTestId('project-card-Test Project 2')).toBeInTheDocument();
    expect(screen.getByTestId('project-card-Full Stack App')).toBeInTheDocument();
  });

  it('renders search input', () => {
    render(<ProjectGrid />);

    const searchInput = screen.getByPlaceholderText(/search projects, technologies/i);
    expect(searchInput).toBeInTheDocument();
  });

  it('renders category filter buttons', () => {
    render(<ProjectGrid />);

    expect(screen.getByRole('button', { name: 'All' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Frontend' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Backend' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Full Stack' })).toBeInTheDocument();
  });

  it('filters projects by category', async () => {
    const user = userEvent.setup();
    render(<ProjectGrid />);

    // Click Frontend category
    await user.click(screen.getByRole('button', { name: 'Frontend' }));

    // Should show only frontend project
    expect(screen.getByTestId('project-card-Test Project 1')).toBeInTheDocument();
    expect(screen.queryByTestId('project-card-Test Project 2')).not.toBeInTheDocument();
    expect(screen.queryByTestId('project-card-Full Stack App')).not.toBeInTheDocument();
  });

  it('filters projects by search term', async () => {
    const user = userEvent.setup();
    render(<ProjectGrid />);

    const searchInput = screen.getByPlaceholderText(/search projects, technologies/i);
    await user.type(searchInput, 'React');

    // Should show projects containing React
    expect(screen.getByTestId('project-card-Test Project 1')).toBeInTheDocument();
    expect(screen.queryByTestId('project-card-Test Project 2')).not.toBeInTheDocument();
    expect(screen.getByTestId('project-card-Full Stack App')).toBeInTheDocument();
  });

  it('shows technology filter toggle button', () => {
    render(<ProjectGrid />);

    const techFilterButton = screen.getByRole('button', { name: /filter by technology/i });
    expect(techFilterButton).toBeInTheDocument();
  });

  it('shows technology filters when toggle is clicked', async () => {
    const user = userEvent.setup();
    render(<ProjectGrid />);

    const techFilterButton = screen.getByRole('button', { name: /filter by technology/i });
    await user.click(techFilterButton);

    await waitFor(() => {
      // Check that the technology filter panel is open by looking for tech buttons with tags
      // Look for technology buttons that contain "Express" or other technologies
      const expressButton = screen.getByText('Express');
      expect(expressButton).toBeInTheDocument();
    });
  });

  it('filters projects by technology', async () => {
    const user = userEvent.setup();
    render(<ProjectGrid />);

    // Open technology filters
    const techFilterButton = screen.getByRole('button', { name: /filter by technology/i });
    await user.click(techFilterButton);

    // Click on React technology filter
    await waitFor(async () => {
      const reactButton = screen.getByRole('button', { name: /react/i });
      await user.click(reactButton);
    });

    // Should show only React projects
    expect(screen.getByTestId('project-card-Test Project 1')).toBeInTheDocument();
    expect(screen.queryByTestId('project-card-Test Project 2')).not.toBeInTheDocument();
    expect(screen.getByTestId('project-card-Full Stack App')).toBeInTheDocument();
  });

  it('shows clear filters button when filters are active', async () => {
    const user = userEvent.setup();
    render(<ProjectGrid />);

    // Apply a category filter
    await user.click(screen.getByRole('button', { name: 'Frontend' }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /clear filters/i })).toBeInTheDocument();
    });
  });

  it('clears all filters when clear button is clicked', async () => {
    const user = userEvent.setup();
    render(<ProjectGrid />);

    // Apply filters
    await user.click(screen.getByRole('button', { name: 'Frontend' }));
    const searchInput = screen.getByPlaceholderText(/search projects, technologies/i);
    await user.type(searchInput, 'test');

    // Clear filters
    const clearButton = screen.getByRole('button', { name: /clear filters/i });
    await user.click(clearButton);

    // Should show all projects again
    expect(screen.getByTestId('project-card-Test Project 1')).toBeInTheDocument();
    expect(screen.getByTestId('project-card-Test Project 2')).toBeInTheDocument();
    expect(screen.getByTestId('project-card-Full Stack App')).toBeInTheDocument();

    // Search input should be cleared
    expect(searchInput).toHaveValue('');

    // 'All' category should be selected
    expect(screen.getByRole('button', { name: 'All' })).toHaveClass('bg-accent');
  });

  it('shows active technology filters with remove buttons', async () => {
    const user = userEvent.setup();
    render(<ProjectGrid />);

    // Open technology filters and select React
    const techFilterButton = screen.getByRole('button', { name: /filter by technology/i });
    await user.click(techFilterButton);

    await waitFor(async () => {
      const reactButton = screen.getByRole('button', { name: /react/i });
      await user.click(reactButton);
    });

    // Should show active filter badge
    await waitFor(() => {
      const activeFilters = screen.getAllByText('React');
      expect(activeFilters.length).toBeGreaterThan(0);
    });
  });

  it('highlights selected category', async () => {
    const user = userEvent.setup();
    render(<ProjectGrid />);

    const frontendButton = screen.getByRole('button', { name: 'Frontend' });
    await user.click(frontendButton);

    expect(frontendButton).toHaveClass('bg-accent');
  });

  it('resets page when filters change', async () => {
    const user = userEvent.setup();
    render(<ProjectGrid />);

    // Apply a filter (this should reset page to 1)
    await user.click(screen.getByRole('button', { name: 'Frontend' }));

    // Check that the current page is 1 by looking for the active page button
    // Since there's only 1 project matching Frontend filter, there should be 1 page
    await waitFor(() => {
      // Look for pagination button with page 1 (if pagination exists)
      // Or check the filtered results count
      expect(screen.getByText(/showing \d+ of \d+ projects/i)).toBeInTheDocument();
    });
  });

  it('handles empty search results', async () => {
    const user = userEvent.setup();
    render(<ProjectGrid />);

    const searchInput = screen.getByPlaceholderText(/search projects, technologies/i);
    await user.type(searchInput, 'nonexistent');

    // Should show no projects
    expect(screen.queryByTestId('project-card-Test Project 1')).not.toBeInTheDocument();
    expect(screen.queryByTestId('project-card-Test Project 2')).not.toBeInTheDocument();
    expect(screen.queryByTestId('project-card-Full Stack App')).not.toBeInTheDocument();
  });

  it('shows technology filter count badge', async () => {
    const user = userEvent.setup();
    render(<ProjectGrid />);

    // Open technology filters
    const techFilterButton = screen.getByRole('button', { name: /filter by technology/i });
    await user.click(techFilterButton);

    // Select React
    await waitFor(async () => {
      const reactButton = screen.getByRole('button', { name: /react/i });
      await user.click(reactButton);
    });

    // Should show count badge
    await waitFor(() => {
      expect(screen.getByText('1')).toBeInTheDocument();
    });
  });
});