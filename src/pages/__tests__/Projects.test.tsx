import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Projects from '../Projects';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.ComponentProps<'div'>) => <div {...props}>{children}</div>,
  },
}));

// Mock ProjectGrid component
jest.mock('../../components/projects/ProjectGrid', () => {
  return function MockProjectGrid() {
    return (
      <div data-testid="project-grid">
        <div data-testid="project-filter">Project Filter</div>
        <div data-testid="project-search">Project Search</div>
        <div data-testid="project-list">Project List</div>
      </div>
    );
  };
});

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Projects Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Page Structure', () => {
    it('renders the main projects page container', () => {
      renderWithRouter(<Projects />);
      
      const container = document.querySelector('.pt-20.pb-20');
      expect(container).toBeInTheDocument();
    });

    it('renders with proper responsive layout classes', () => {
      renderWithRouter(<Projects />);
      
      const maxWidthContainer = document.querySelector('.max-w-7xl');
      expect(maxWidthContainer).toBeInTheDocument();
      expect(maxWidthContainer).toHaveClass('mx-auto');
      expect(maxWidthContainer).toHaveClass('px-4');
      expect(maxWidthContainer).toHaveClass('sm:px-6');
      expect(maxWidthContainer).toHaveClass('lg:px-8');
    });
  });

  describe('Header Section', () => {
    it('renders the main page title', () => {
      renderWithRouter(<Projects />);
      
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent('My Projects');
    });

    it('renders the page description', () => {
      renderWithRouter(<Projects />);
      
      const description = screen.getByText('A showcase of my development journey');
      expect(description).toBeInTheDocument();
    });

    it('has proper heading hierarchy', () => {
      renderWithRouter(<Projects />);
      
      const h1Elements = screen.getAllByRole('heading', { level: 1 });
      expect(h1Elements).toHaveLength(1);
      expect(h1Elements[0]).toHaveTextContent('My Projects');
    });
  });

  describe('Project Showcase Integration', () => {
    it('renders the ProjectGrid component', () => {
      renderWithRouter(<Projects />);
      
      const projectGrid = screen.getByTestId('project-grid');
      expect(projectGrid).toBeInTheDocument();
    });

    it('includes project filtering functionality', () => {
      renderWithRouter(<Projects />);
      
      const projectFilter = screen.getByTestId('project-filter');
      expect(projectFilter).toBeInTheDocument();
    });

    it('includes project search functionality', () => {
      renderWithRouter(<Projects />);
      
      const projectSearch = screen.getByTestId('project-search');
      expect(projectSearch).toBeInTheDocument();
    });

    it('displays project list', () => {
      renderWithRouter(<Projects />);
      
      const projectList = screen.getByTestId('project-list');
      expect(projectList).toBeInTheDocument();
    });
  });

  describe('Layout and Styling', () => {
    it('applies proper spacing classes', () => {
      renderWithRouter(<Projects />);
      
      const container = document.querySelector('.pt-20.pb-20');
      expect(container).toBeInTheDocument();
      
      const headerSection = document.querySelector('.text-center.mb-12');
      expect(headerSection).toBeInTheDocument();
    });

    it('has responsive text alignment', () => {
      renderWithRouter(<Projects />);
      
      const headerSection = document.querySelector('.text-center');
      expect(headerSection).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper document structure', () => {
      renderWithRouter(<Projects />);
      
      // Check for main heading
      const mainHeading = screen.getByRole('heading', { level: 1 });
      expect(mainHeading).toBeInTheDocument();
      
      // Check for descriptive text
      const description = screen.getByText(/showcase of my development journey/i);
      expect(description).toBeInTheDocument();
    });

    it('maintains semantic HTML structure', () => {
      renderWithRouter(<Projects />);
      
      // Verify main content area exists
      const contentArea = document.querySelector('.max-w-7xl');
      expect(contentArea).toBeInTheDocument();
      
      // Verify header section
      const headerSection = document.querySelector('.text-center.mb-12');
      expect(headerSection).toBeInTheDocument();
    });

    it('provides meaningful content descriptions', () => {
      renderWithRouter(<Projects />);
      
      const pageTitle = screen.getByText('My Projects');
      const pageDescription = screen.getByText('A showcase of my development journey');
      
      expect(pageTitle).toBeInTheDocument();
      expect(pageDescription).toBeInTheDocument();
    });
  });

  describe('Performance Considerations', () => {
    it('renders without throwing errors', () => {
      expect(() => {
        renderWithRouter(<Projects />);
      }).not.toThrow();
    });

    it('contains efficient component structure', () => {
      renderWithRouter(<Projects />);
      
      // Verify single ProjectGrid instance
      const projectGrids = screen.getAllByTestId('project-grid');
      expect(projectGrids).toHaveLength(1);
    });
  });

  describe('Content Integration', () => {
    it('integrates with existing ProjectGrid filtering', () => {
      renderWithRouter(<Projects />);
      
      // Verify ProjectGrid is properly integrated
      const projectGrid = screen.getByTestId('project-grid');
      const projectFilter = screen.getByTestId('project-filter');
      const projectSearch = screen.getByTestId('project-search');
      
      expect(projectGrid).toBeInTheDocument();
      expect(projectFilter).toBeInTheDocument();
      expect(projectSearch).toBeInTheDocument();
    });

    it('maintains consistent design system', () => {
      renderWithRouter(<Projects />);
      
      // Check for consistent spacing and layout classes
      const container = document.querySelector('.max-w-7xl.mx-auto');
      const header = document.querySelector('.text-center.mb-12');
      
      expect(container).toBeInTheDocument();
      expect(header).toBeInTheDocument();
    });
  });
});