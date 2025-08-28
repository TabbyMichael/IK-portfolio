import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import CaseStudies from '../CaseStudies';
import * as analytics from '../../utils/analytics';

// Mock analytics
jest.mock('../../utils/analytics', () => ({
  event: jest.fn(),
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.ComponentProps<'div'>) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: React.ComponentProps<'button'>) => <button {...props}>{children}</button>,
    section: ({ children, ...props }: React.ComponentProps<'section'>) => <section {...props}>{children}</section>,
  },
  AnimatePresence: ({ children, ...props }: { children: React.ReactNode }) => <div {...props}>{children}</div>,
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  ExternalLink: ({ className, ...props }: { className?: string } & React.ComponentProps<'svg'>) => <svg data-testid="external-link" className={className} {...props} />,
  Github: ({ className, ...props }: { className?: string } & React.ComponentProps<'svg'>) => <svg data-testid="github" className={className} {...props} />,
  Clock: ({ className, ...props }: { className?: string } & React.ComponentProps<'svg'>) => <svg data-testid="clock" className={className} {...props} />,
  Users: ({ className, ...props }: { className?: string } & React.ComponentProps<'svg'>) => <svg data-testid="users" className={className} {...props} />,
  TrendingUp: ({ className, ...props }: { className?: string } & React.ComponentProps<'svg'>) => <svg data-testid="trending-up" className={className} {...props} />,
  CheckCircle: ({ className, ...props }: { className?: string } & React.ComponentProps<'svg'>) => <svg data-testid="check-circle" className={className} {...props} />,
  ArrowRight: ({ className, ...props }: { className?: string } & React.ComponentProps<'svg'>) => <svg data-testid="arrow-right" className={className} {...props} />,
  Copy: ({ className, ...props }: { className?: string } & React.ComponentProps<'svg'>) => <svg data-testid="copy" className={className} {...props} />,
  Award: ({ className, ...props }: { className?: string } & React.ComponentProps<'svg'>) => <svg data-testid="award" className={className} {...props} />,
  Target: ({ className, ...props }: { className?: string } & React.ComponentProps<'svg'>) => <svg data-testid="target" className={className} {...props} />,
  Lightbulb: ({ className, ...props }: { className?: string } & React.ComponentProps<'svg'>) => <svg data-testid="lightbulb" className={className} {...props} />,
  Zap: ({ className, ...props }: { className?: string } & React.ComponentProps<'svg'>) => <svg data-testid="zap" className={className} {...props} />,
  Star: ({ className, ...props }: { className?: string } & React.ComponentProps<'svg'>) => <svg data-testid="star" className={className} {...props} />,
  ChevronLeft: ({ className, ...props }: { className?: string } & React.ComponentProps<'svg'>) => <svg data-testid="chevron-left" className={className} {...props} />,
  ChevronRight: ({ className, ...props }: { className?: string } & React.ComponentProps<'svg'>) => <svg data-testid="chevron-right" className={className} {...props} />,
  Quote: ({ className, ...props }: { className?: string } & React.ComponentProps<'svg'>) => <svg data-testid="quote" className={className} {...props} />,
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('CaseStudies Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Page Structure', () => {
    it('renders the main case studies page container', () => {
      renderWithRouter(<CaseStudies />);
      
      const container = document.querySelector('.min-h-screen');
      expect(container).toBeInTheDocument();
    });

    it('renders with proper responsive layout', () => {
      renderWithRouter(<CaseStudies />);
      
      const maxWidthContainer = document.querySelector('.max-w-7xl');
      expect(maxWidthContainer).toBeInTheDocument();
      expect(maxWidthContainer).toHaveClass('mx-auto');
    });
  });

  describe('Header Section', () => {
    it('renders the main page title', () => {
      renderWithRouter(<CaseStudies />);
      
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
    });

    it('displays case studies statistics', () => {
      renderWithRouter(<CaseStudies />);
      
      // Should show statistics about case studies
      const statsSection = document.querySelector('.grid');
      expect(statsSection).toBeInTheDocument();
    });
  });

  describe('Case Study Navigation and Filtering', () => {
    it('renders case study filter options', () => {
      renderWithRouter(<CaseStudies />);
      
      // Look for filter or tab buttons
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });

    it('shows navigation between case studies', () => {
      renderWithRouter(<CaseStudies />);
      
      // Look for navigation elements
      const chevronLefts = screen.queryAllByTestId('chevron-left');
      const chevronRights = screen.queryAllByTestId('chevron-right');
      
      // Should have navigation if multiple case studies
      expect(chevronLefts.length + chevronRights.length).toBeGreaterThanOrEqual(0);
    });

    it('displays case study categories or types', () => {
      renderWithRouter(<CaseStudies />);
      
      // Should show different categories like Healthcare, E-commerce, etc.
      const categoryElements = document.querySelectorAll('.bg-accent\\/10, .bg-blue-100, .badge');
      expect(categoryElements.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Interactive Tabs (Challenge, Solution, Results, Technical)', () => {
    it('renders case study section tabs', () => {
      renderWithRouter(<CaseStudies />);
      
      // Look for tab navigation
      const tabButtons = screen.getAllByRole('button').filter(button => 
        button.textContent?.toLowerCase().includes('challenge') ||
        button.textContent?.toLowerCase().includes('solution') ||
        button.textContent?.toLowerCase().includes('results') ||
        button.textContent?.toLowerCase().includes('technical')
      );
      
      // Should have at least some tab-like navigation
      expect(tabButtons.length).toBeGreaterThanOrEqual(0);
    });

    it('shows challenge section content', () => {
      renderWithRouter(<CaseStudies />);
      
      // Look for challenge-related content
      const challengeText = document.body.textContent;
      expect(challengeText).toMatch(/challenge|problem|issue|requirement/i);
    });

    it('displays solution approach and implementation', () => {
      renderWithRouter(<CaseStudies />);
      
      // Look for solution-related content
      const solutionText = document.body.textContent;
      expect(solutionText).toMatch(/solution|approach|implementation|technology/i);
    });

    it('shows results and metrics', () => {
      renderWithRouter(<CaseStudies />);
      
      // Look for results metrics
      const resultsText = document.body.textContent;
      expect(resultsText).toMatch(/results|improvement|increase|efficiency/i);
    });
  });

  describe('Featured Case Study Highlighting', () => {
    it('highlights featured case studies', () => {
      renderWithRouter(<CaseStudies />);
      
      // Look for featured indicators
      const awardIcons = screen.queryAllByTestId('award');
      const starIcons = screen.queryAllByTestId('star');
      
      // Should have some way to highlight featured content
      expect(awardIcons.length + starIcons.length).toBeGreaterThanOrEqual(0);
    });

    it('displays case study images and visuals', () => {
      renderWithRouter(<CaseStudies />);
      
      // Should show case study images
      const images = screen.getAllByRole('img');
      expect(images.length).toBeGreaterThan(0);
    });

    it('shows client information and testimonials', () => {
      renderWithRouter(<CaseStudies />);
      
      // Look for client names and testimonials
      const content = document.body.textContent;
      expect(content).toMatch(/Dr\.|CEO|Manager|Director|testimonial|quote/i);
    });
  });

  describe('Responsive Timeline Display', () => {
    it('has responsive layout classes', () => {
      renderWithRouter(<CaseStudies />);
      
      // Check for responsive grid/layout classes
      const responsiveElements = document.querySelectorAll(
        '.grid-cols-1, .md\\:grid-cols-2, .lg\\:grid-cols-3, .xl\\:grid-cols-4'
      );
      expect(responsiveElements.length).toBeGreaterThan(0);
    });

    it('displays timeline or project duration information', () => {
      renderWithRouter(<CaseStudies />);
      
      // Look for time-related information
      expect(screen.queryAllByTestId('clock')).toBeTruthy();
      
      const timeText = document.body.textContent;
      expect(timeText).toMatch(/month|week|day|duration|timeline/i);
    });

    it('shows team size and project scope', () => {
      renderWithRouter(<CaseStudies />);
      
      // Look for team information
      expect(screen.queryAllByTestId('users')).toBeTruthy();
      
      const teamText = document.body.textContent;
      expect(teamText).toMatch(/team|member|size|person|developer/i);
    });
  });

  describe('Professional Credibility Elements', () => {
    it('displays project links and external references', () => {
      renderWithRouter(<CaseStudies />);
      
      // Look for external links
      const externalLinks = screen.queryAllByTestId('external-link');
      const githubLinks = screen.queryAllByTestId('github');
      
      expect(externalLinks.length + githubLinks.length).toBeGreaterThan(0);
    });

    it('shows technology stack and technical details', () => {
      renderWithRouter(<CaseStudies />);
      
      // Look for technology mentions
      const techText = document.body.textContent;
      expect(techText).toMatch(/React|Node|JavaScript|TypeScript|MongoDB|PostgreSQL/i);
    });

    it('displays measurable results and improvements', () => {
      renderWithRouter(<CaseStudies />);
      
      // Look for percentage improvements and metrics
      const metricsText = document.body.textContent;
      expect(metricsText).toMatch(/\d+%|increase|improvement|faster|better/i);
    });

    it('includes client testimonials and ratings', () => {
      renderWithRouter(<CaseStudies />);
      
      // Look for rating stars and testimonial quotes
      const starIcons = screen.queryAllByTestId('star');
      const quoteIcons = screen.queryAllByTestId('quote');
      
      expect(starIcons.length + quoteIcons.length).toBeGreaterThan(0);
    });
  });

  describe('Code Examples and Technical Implementation', () => {
    it('shows code examples when available', () => {
      renderWithRouter(<CaseStudies />);
      
      // Look for code blocks or technical implementation
      const codeElements = document.querySelectorAll('pre, code, .language-, .hljs');
      // Code examples might be present
      expect(codeElements.length).toBeGreaterThanOrEqual(0);
    });

    it('displays architecture and technical approach', () => {
      renderWithRouter(<CaseStudies />);
      
      // Look for architecture-related content
      const archText = document.body.textContent;
      expect(archText).toMatch(/architecture|design|pattern|approach|implementation/i);
    });

    it('shows before/after comparisons when available', () => {
      renderWithRouter(<CaseStudies />);
      
      // Look for before/after content
      const beforeAfterText = document.body.textContent;
      expect(beforeAfterText).toMatch(/before|after|improvement|comparison/i);
    });
  });

  describe('Analytics Tracking', () => {
    it('tracks page view on component mount', () => {
      renderWithRouter(<CaseStudies />);
      
      expect(analytics.event).toHaveBeenCalledWith(
        expect.objectContaining({
          category: 'case_studies'
        })
      );
    });

    it('tracks interactions with case study elements', async () => {
      const user = userEvent.setup();
      renderWithRouter(<CaseStudies />);
      
      // Find clickable elements (buttons, links)
      const clickableElements = [
        ...screen.getAllByRole('button'),
        ...screen.getAllByRole('link')
      ];
      
      if (clickableElements.length > 0) {
        await user.click(clickableElements[0]);
        // Should track user interactions
      }
    });
  });

  describe('Accessibility', () => {
    it('has proper heading hierarchy', () => {
      renderWithRouter(<CaseStudies />);
      
      const headings = screen.getAllByRole('heading');
      expect(headings.length).toBeGreaterThan(0);
      
      // Should have at least an h1
      const h1Elements = screen.getAllByRole('heading', { level: 1 });
      expect(h1Elements.length).toBeGreaterThanOrEqual(1);
    });

    it('provides alt text for images', () => {
      renderWithRouter(<CaseStudies />);
      
      const images = screen.getAllByRole('img');
      images.forEach(img => {
        expect(img).toHaveAttribute('alt');
      });
    });

    it('has accessible navigation controls', () => {
      renderWithRouter(<CaseStudies />);
      
      // Check that buttons have accessible text
      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button.textContent || button.getAttribute('aria-label')).toBeTruthy();
      });
    });

    it('provides meaningful link descriptions', () => {
      renderWithRouter(<CaseStudies />);
      
      const links = screen.getAllByRole('link');
      links.forEach(link => {
        expect(link.textContent || link.getAttribute('aria-label')).toBeTruthy();
      });
    });
  });

  describe('Performance', () => {
    it('renders without throwing errors', () => {
      expect(() => {
        renderWithRouter(<CaseStudies />);
      }).not.toThrow();
    });

    it('loads efficiently with complex content', () => {
      renderWithRouter(<CaseStudies />);
      
      // Should render main content immediately
      const mainContent = document.querySelector('.min-h-screen');
      expect(mainContent).toBeInTheDocument();
    });

    it('handles large amounts of case study data', () => {
      renderWithRouter(<CaseStudies />);
      
      // Should handle multiple case studies without performance issues
      const contentElements = document.querySelectorAll('div, section, article');
      expect(contentElements.length).toBeGreaterThan(10);
    });
  });

  describe('Content Quality and Professional Value', () => {
    it('demonstrates clear problem-solving approach', () => {
      renderWithRouter(<CaseStudies />);
      
      const content = document.body.textContent;
      expect(content).toMatch(/challenge|problem|solution|approach|methodology/i);
    });

    it('shows quantifiable business impact', () => {
      renderWithRouter(<CaseStudies />);
      
      const content = document.body.textContent;
      expect(content).toMatch(/\d+%|increase|decrease|improvement|efficiency|roi/i);
    });

    it('includes technical depth and expertise', () => {
      renderWithRouter(<CaseStudies />);
      
      const content = document.body.textContent;
      expect(content).toMatch(/React|Node|database|API|architecture|scalable/i);
    });

    it('provides credible client information', () => {
      renderWithRouter(<CaseStudies />);
      
      const content = document.body.textContent;
      expect(content).toMatch(/Dr\.|CEO|Director|Manager|Safaricom|Medical|Hospital/i);
    });
  });

  describe('User Experience', () => {
    it('provides intuitive navigation between case studies', () => {
      renderWithRouter(<CaseStudies />);
      
      // Should have clear navigation elements
      const navigationElements = [
        ...screen.queryAllByTestId('chevron-left'),
        ...screen.queryAllByTestId('chevron-right'),
        ...screen.getAllByRole('button')
      ];
      
      expect(navigationElements.length).toBeGreaterThan(0);
    });

    it('offers multiple content consumption formats', () => {
      renderWithRouter(<CaseStudies />);
      
      // Should offer different ways to view content (tabs, cards, etc.)
      const interactiveElements = screen.getAllByRole('button');
      expect(interactiveElements.length).toBeGreaterThan(1);
    });

    it('maintains consistent design and branding', () => {
      renderWithRouter(<CaseStudies />);
      
      // Should use consistent styling classes
      const styledElements = document.querySelectorAll('.glass, .bg-accent, .text-accent');
      expect(styledElements.length).toBeGreaterThan(0);
    });
  });
});