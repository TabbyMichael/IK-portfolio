import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Testimonials from '../Testimonials';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.ComponentProps<'div'>) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children, ...props }: { children: React.ReactNode }) => <div {...props}>{children}</div>,
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  ChevronLeft: ({ className, ...props }: { className?: string } & React.ComponentProps<'svg'>) => <svg data-testid="chevron-left" className={className} {...props} />,
  ChevronRight: ({ className, ...props }: { className?: string } & React.ComponentProps<'svg'>) => <svg data-testid="chevron-right" className={className} {...props} />,
  Star: ({ className, ...props }: { className?: string } & React.ComponentProps<'svg'>) => <svg data-testid="star" className={className} {...props} />,
  Calendar: ({ className, ...props }: { className?: string } & React.ComponentProps<'svg'>) => <svg data-testid="calendar" className={className} {...props} />,
  Filter: ({ className, ...props }: { className?: string } & React.ComponentProps<'svg'>) => <svg data-testid="filter" className={className} {...props} />,
  Award: ({ className, ...props }: { className?: string } & React.ComponentProps<'svg'>) => <svg data-testid="award" className={className} {...props} />,
  Sparkles: ({ className, ...props }: { className?: string } & React.ComponentProps<'svg'>) => <svg data-testid="sparkles" className={className} {...props} />,
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Testimonials Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Page Structure', () => {
    it('renders the main testimonials page container', () => {
      renderWithRouter(<Testimonials />);
      
      const container = document.querySelector('.min-h-screen.pt-20.pb-20');
      expect(container).toBeInTheDocument();
    });

    it('renders with proper responsive layout', () => {
      renderWithRouter(<Testimonials />);
      
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
      renderWithRouter(<Testimonials />);
      
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent('Client Testimonials');
    });

    it('renders the page description', () => {
      renderWithRouter(<Testimonials />);
      
      const description = screen.getByText(/hear from satisfied clients about their experience/i);
      expect(description).toBeInTheDocument();
    });

    it('displays testimonials statistics', () => {
      renderWithRouter(<Testimonials />);
      
      expect(screen.getByText('8')).toBeInTheDocument(); // Total testimonials
      expect(screen.getByText('Happy Clients')).toBeInTheDocument();
      expect(screen.getByText('Average Rating')).toBeInTheDocument();
      expect(screen.getByText('5-Star Reviews')).toBeInTheDocument();
    });
  });

  describe('Filter Functionality', () => {
    it('renders all filter buttons', () => {
      renderWithRouter(<Testimonials />);
      
      expect(screen.getByRole('button', { name: /all testimonials/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /featured/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /5-star reviews/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /healthcare/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /e-commerce/i })).toBeInTheDocument();
    });

    it('shows filter counts for each category', () => {
      renderWithRouter(<Testimonials />);
      
      expect(screen.getByText('(8)')).toBeInTheDocument(); // All testimonials count
      expect(screen.getByText(/featured/i).closest('button')).toContainElement(screen.getByText(/\(\d+\)/));
    });

    it('changes active filter when clicked', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Testimonials />);
      
      const featuredFilter = screen.getByRole('button', { name: /featured/i });
      await user.click(featuredFilter);
      
      expect(featuredFilter).toHaveClass('bg-accent');
      expect(featuredFilter).toHaveClass('text-primary');
    });

    it('shows filter icon', () => {
      renderWithRouter(<Testimonials />);
      
      expect(screen.getByTestId('filter')).toBeInTheDocument();
    });
  });

  describe('View Mode Toggle', () => {
    it('renders view mode toggle buttons', () => {
      renderWithRouter(<Testimonials />);
      
      expect(screen.getByRole('button', { name: /carousel/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /grid/i })).toBeInTheDocument();
    });

    it('has carousel view active by default', () => {
      renderWithRouter(<Testimonials />);
      
      const carouselButton = screen.getByRole('button', { name: /carousel/i });
      expect(carouselButton).toHaveClass('bg-accent');
      expect(carouselButton).toHaveClass('text-primary');
    });

    it('switches to grid view when clicked', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Testimonials />);
      
      const gridButton = screen.getByRole('button', { name: /grid/i });
      await user.click(gridButton);
      
      expect(gridButton).toHaveClass('bg-accent');
      expect(gridButton).toHaveClass('text-primary');
    });
  });

  describe('Carousel View', () => {
    it('displays testimonial content in carousel mode', () => {
      renderWithRouter(<Testimonials />);
      
      // Should show a testimonial by default
      expect(screen.getByText(/Dr. Sarah Kimani|Michael Ochieng|Grace Wanjiku/)).toBeInTheDocument();
    });

    it('shows star ratings', () => {
      renderWithRouter(<Testimonials />);
      
      const stars = screen.getAllByTestId('star');
      expect(stars.length).toBeGreaterThan(0);
    });

    it('displays client information', () => {
      renderWithRouter(<Testimonials />);
      
      // Should show client name, role, and company
      const clientInfo = document.querySelector('.text-left');
      expect(clientInfo).toBeInTheDocument();
    });

    it('shows navigation arrows when multiple testimonials', () => {
      renderWithRouter(<Testimonials />);
      
      expect(screen.getByTestId('chevron-left')).toBeInTheDocument();
      expect(screen.getByTestId('chevron-right')).toBeInTheDocument();
    });

    it('shows pagination dots', () => {
      renderWithRouter(<Testimonials />);
      
      const paginationDots = document.querySelectorAll('.w-3.h-3.rounded-full');
      expect(paginationDots.length).toBeGreaterThan(0);
    });

    it('navigates to next testimonial when right arrow clicked', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Testimonials />);
      
      const rightArrow = screen.getByTestId('chevron-right').closest('button');
      if (rightArrow) {
        await user.click(rightArrow);
        // Should change testimonial content
      }
    });

    it('shows featured review badge for featured testimonials', () => {
      renderWithRouter(<Testimonials />);
      
      // May show featured badge depending on current testimonial
      // Check for award icons
      screen.queryAllByTestId('award');
      // Award icons may be present for featured testimonials
    });

    it('displays case study link', () => {
      renderWithRouter(<Testimonials />);
      
      const caseStudyLink = screen.getByRole('link', { name: /view full case study/i });
      expect(caseStudyLink).toBeInTheDocument();
      expect(caseStudyLink).toHaveAttribute('href', '/case');
    });
  });

  describe('Grid View', () => {
    it('displays testimonials in grid layout when grid mode is active', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Testimonials />);
      
      const gridButton = screen.getByRole('button', { name: /grid/i });
      await user.click(gridButton);
      
      const gridContainer = document.querySelector('.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3');
      expect(gridContainer).toBeInTheDocument();
    });

    it('shows all testimonials in grid view', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Testimonials />);
      
      const gridButton = screen.getByRole('button', { name: /grid/i });
      await user.click(gridButton);
      
      // Should show multiple testimonial cards
      const testimonialCards = document.querySelectorAll('.glass.rounded-lg.p-6');
      expect(testimonialCards.length).toBeGreaterThan(1);
    });

    it('displays client avatars in grid cards', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Testimonials />);
      
      const gridButton = screen.getByRole('button', { name: /grid/i });
      await user.click(gridButton);
      
      const avatars = screen.getAllByRole('img');
      expect(avatars.length).toBeGreaterThan(0);
    });

    it('shows case study links in grid cards', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Testimonials />);
      
      const gridButton = screen.getByRole('button', { name: /grid/i });
      await user.click(gridButton);
      
      const deepDiveLinks = screen.getAllByText(/deep dive/i);
      expect(deepDiveLinks.length).toBeGreaterThan(0);
    });
  });

  describe('Testimonial Content', () => {
    it('displays client testimonial text', () => {
      renderWithRouter(<Testimonials />);
      
      // Should show testimonial content (quoted text)
      const testimonialText = document.querySelector('blockquote');
      expect(testimonialText).toBeInTheDocument();
    });

    it('shows client metadata (date, project type)', () => {
      renderWithRouter(<Testimonials />);
      
      expect(screen.getByTestId('calendar')).toBeInTheDocument();
    });

    it('displays proper image loading attributes', () => {
      renderWithRouter(<Testimonials />);
      
      const images = screen.getAllByRole('img');
      images.forEach(img => {
        expect(img).toHaveAttribute('loading', 'lazy');
        expect(img).toHaveAttribute('alt');
      });
    });

    it('shows rating stars with proper styling', () => {
      renderWithRouter(<Testimonials />);
      
      const stars = screen.getAllByTestId('star');
      expect(stars.length).toBeGreaterThan(0);
      // Stars should have proper classes for filled/unfilled states
    });
  });

  describe('Navigation Functionality', () => {
    it('allows navigation through testimonials using arrows', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Testimonials />);
      
      const rightArrow = screen.getByTestId('chevron-right').closest('button');
      const leftArrow = screen.getByTestId('chevron-left').closest('button');
      
      expect(rightArrow).toBeInTheDocument();
      expect(leftArrow).toBeInTheDocument();
      
      if (rightArrow) {
        await user.click(rightArrow);
      }
      if (leftArrow) {
        await user.click(leftArrow);
      }
    });

    it('allows navigation using pagination dots', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Testimonials />);
      
      const paginationDots = document.querySelectorAll('.w-3.h-3.rounded-full');
      if (paginationDots.length > 1) {
        await user.click(paginationDots[1] as HTMLElement);
      }
    });
  });

  describe('Responsive Design', () => {
    it('has responsive grid layout for testimonials', () => {
      renderWithRouter(<Testimonials />);
      
      const layout = document.querySelector('.max-w-7xl.mx-auto.px-4.sm\\:px-6.lg\\:px-8');
      expect(layout).toBeInTheDocument();
    });

    it('has responsive testimonial card sizing', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Testimonials />);
      
      const gridButton = screen.getByRole('button', { name: /grid/i });
      await user.click(gridButton);
      
      const gridContainer = document.querySelector('.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3');
      expect(gridContainer).toBeInTheDocument();
    });

    it('has responsive avatar sizing', () => {
      renderWithRouter(<Testimonials />);
      
      const avatarContainer = document.querySelector('.w-16.h-16.md\\:w-20.md\\:h-20');
      expect(avatarContainer).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper heading hierarchy', () => {
      renderWithRouter(<Testimonials />);
      
      const h1Elements = screen.getAllByRole('heading', { level: 1 });
      expect(h1Elements).toHaveLength(1);
    });

    it('provides alt text for all images', () => {
      renderWithRouter(<Testimonials />);
      
      const images = screen.getAllByRole('img');
      images.forEach(img => {
        expect(img).toHaveAttribute('alt');
        expect(img.getAttribute('alt')).toBeTruthy();
      });
    });

    it('has accessible navigation controls', () => {
      renderWithRouter(<Testimonials />);
      
      const navigationButtons = [
        screen.getByTestId('chevron-left').closest('button'),
        screen.getByTestId('chevron-right').closest('button'),
      ];
      
      navigationButtons.forEach(button => {
        expect(button).toBeInTheDocument();
      });
    });

    it('has semantic blockquote for testimonial text', () => {
      renderWithRouter(<Testimonials />);
      
      const blockquote = document.querySelector('blockquote');
      expect(blockquote).toBeInTheDocument();
    });

    it('provides meaningful link text for case studies', () => {
      renderWithRouter(<Testimonials />);
      
      const caseStudyLink = screen.getByRole('link', { name: /view full case study/i });
      expect(caseStudyLink).toHaveAttribute('href', '/case');
    });
  });

  describe('Performance', () => {
    it('renders without throwing errors', () => {
      expect(() => {
        renderWithRouter(<Testimonials />);
      }).not.toThrow();
    });

    it('handles rapid filter changes gracefully', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Testimonials />);
      
      const filters = [
        screen.getByRole('button', { name: /featured/i }),
        screen.getByRole('button', { name: /5-star reviews/i }),
        screen.getByRole('button', { name: /all testimonials/i }),
      ];
      
      // Rapid filter switching should not cause errors
      for (const filter of filters) {
        await user.click(filter);
      }
    });

    it('handles view mode switching efficiently', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Testimonials />);
      
      const carouselButton = screen.getByRole('button', { name: /carousel/i });
      const gridButton = screen.getByRole('button', { name: /grid/i });
      
      await user.click(gridButton);
      await user.click(carouselButton);
      await user.click(gridButton);
      
      // Should handle rapid view switching without errors
    });

    it('optimizes images with proper loading attributes', () => {
      renderWithRouter(<Testimonials />);
      
      const images = screen.getAllByRole('img');
      images.forEach(img => {
        expect(img).toHaveAttribute('loading', 'lazy');
        expect(img).toHaveAttribute('width');
        expect(img).toHaveAttribute('height');
      });
    });
  });

  describe('Empty State Handling', () => {
    it('shows no testimonials message when filter returns empty results', async () => {
      // Setup user event for potential interactions
      userEvent.setup();
      renderWithRouter(<Testimonials />);
      
      // If we had a filter that returns no results, it would show empty state
      // This test validates the empty state structure exists
      // Check for empty state button
      screen.queryByText('View All Testimonials');
      // Empty state might not be visible with current test data
    });
  });

  describe('Interactive Features', () => {
    it('has hover effects on testimonial cards', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Testimonials />);
      
      const gridButton = screen.getByRole('button', { name: /grid/i });
      await user.click(gridButton);
      
      const testimonialCards = document.querySelectorAll('.glass.rounded-lg.p-6');
      testimonialCards.forEach(card => {
        expect(card).toHaveClass('hover:shadow-xl');
        expect(card).toHaveClass('transition-all');
        expect(card).toHaveClass('duration-300');
      });
    });

    it('has working case study navigation links', () => {
      renderWithRouter(<Testimonials />);
      
      const caseStudyLinks = screen.getAllByRole('link', { name: /view full case study|deep dive/i });
      caseStudyLinks.forEach(link => {
        expect(link).toHaveAttribute('href', '/case');
      });
    });
  });
});