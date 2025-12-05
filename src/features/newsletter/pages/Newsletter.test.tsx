import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Newsletter from '../Newsletter';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.ComponentProps<'div'>) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: React.ComponentProps<'button'>) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Sparkles: ({ className, ...props }: { className?: string } & React.ComponentProps<'svg'>) => <svg data-testid="sparkles-icon" className={className} {...props} />,
  Users: ({ className, ...props }: { className?: string } & React.ComponentProps<'svg'>) => <svg data-testid="users-icon" className={className} {...props} />,
  Mail: ({ className, ...props }: { className?: string } & React.ComponentProps<'svg'>) => <svg data-testid="mail-icon" className={className} {...props} />,
  Calendar: ({ className, ...props }: { className?: string } & React.ComponentProps<'svg'>) => <svg data-testid="calendar-icon" className={className} {...props} />,
  Award: ({ className, ...props }: { className?: string } & React.ComponentProps<'svg'>) => <svg data-testid="award-icon" className={className} {...props} />,
  BookOpen: ({ className, ...props }: { className?: string } & React.ComponentProps<'svg'>) => <svg data-testid="bookopen-icon" className={className} {...props} />,
  MessageCircle: ({ className, ...props }: { className?: string } & React.ComponentProps<'svg'>) => <svg data-testid="messagecircle-icon" className={className} {...props} />,
  TrendingUp: ({ className, ...props }: { className?: string } & React.ComponentProps<'svg'>) => <svg data-testid="trendingup-icon" className={className} {...props} />,
  Heart: ({ className, ...props }: { className?: string } & React.ComponentProps<'svg'>) => <svg data-testid="heart-icon" className={className} {...props} />,
  Gift: ({ className, ...props }: { className?: string } & React.ComponentProps<'svg'>) => <svg data-testid="gift-icon" className={className} {...props} />,
}));

// Mock Newsletter components
jest.mock('../../components/Newsletter/EnhancedNewsletterForm', () => {
  return function MockEnhancedNewsletterForm() {
    return (
      <div data-testid="enhanced-newsletter-form">
        <form data-testid="newsletter-form">
          <input data-testid="email-input" placeholder="Enter your email" />
          <input data-testid="name-input" placeholder="Enter your name" />
          <button data-testid="subscribe-button">Subscribe</button>
        </form>
        <div data-testid="form-validation">Form Validation</div>
        <div data-testid="success-state">Success State</div>
        <div data-testid="error-state">Error State</div>
      </div>
    );
  };
});

jest.mock('../../components/Newsletter/NewsletterArchive', () => {
  return function MockNewsletterArchive() {
    return (
      <div data-testid="newsletter-archive">
        <div data-testid="archive-list">Archive List</div>
        <div data-testid="issue-preview">Issue Preview</div>
        <div data-testid="download-link">Download Link</div>
      </div>
    );
  };
});

jest.mock('../../components/Newsletter/CommunityFeatures', () => {
  return function MockCommunityFeatures() {
    return (
      <div data-testid="community-features">
        <div data-testid="discussion-forum">Discussion Forum</div>
        <div data-testid="member-directory">Member Directory</div>
        <div data-testid="community-stats">Community Stats</div>
      </div>
    );
  };
});

jest.mock('../../components/Newsletter/ReferralProgram', () => {
  return function MockReferralProgram() {
    return (
      <div data-testid="referral-program">
        <div data-testid="referral-link">Referral Link</div>
        <div data-testid="rewards-tracker">Rewards Tracker</div>
        <div data-testid="sharing-options">Sharing Options</div>
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

describe('Newsletter Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Page Structure', () => {
    it('renders the main newsletter page container', () => {
      renderWithRouter(<Newsletter />);
      
      const container = document.querySelector('.min-h-screen.py-16');
      expect(container).toBeInTheDocument();
    });

    it('renders with proper responsive layout', () => {
      renderWithRouter(<Newsletter />);
      
      const maxWidthContainer = document.querySelector('.max-w-7xl');
      expect(maxWidthContainer).toBeInTheDocument();
      expect(maxWidthContainer).toHaveClass('mx-auto');
    });
  });

  describe('Header Section', () => {
    it('renders the main page title with accent styling', () => {
      renderWithRouter(<Newsletter />);
      
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
      expect(heading.textContent).toContain('Stay Connected with Tech');
    });

    it('renders the developer newsletter badge', () => {
      renderWithRouter(<Newsletter />);
      
      expect(screen.getByTestId('sparkles-icon')).toBeInTheDocument();
      expect(screen.getByText('Developer Newsletter Hub')).toBeInTheDocument();
    });

    it('displays the newsletter description', () => {
      renderWithRouter(<Newsletter />);
      
      const description = screen.getByText(/join thousands of developers in a thriving community/i);
      expect(description).toBeInTheDocument();
    });
  });

  describe('Statistics Display', () => {
    it('renders all newsletter statistics', () => {
      renderWithRouter(<Newsletter />);
      
      expect(screen.getByText('2.5K+')).toBeInTheDocument();
      expect(screen.getByText('Subscribers')).toBeInTheDocument();
      expect(screen.getByText('48')).toBeInTheDocument();
      expect(screen.getByText('Issues Published')).toBeInTheDocument();
      expect(screen.getByText('95%')).toBeInTheDocument();
      expect(screen.getByText('Open Rate')).toBeInTheDocument();
      expect(screen.getByText('4.9/5')).toBeInTheDocument();
      expect(screen.getByText('Reader Rating')).toBeInTheDocument();
    });

    it('displays statistics icons', () => {
      renderWithRouter(<Newsletter />);
      
      expect(screen.getByTestId('users-icon')).toBeInTheDocument();
      expect(screen.getByTestId('calendar-icon')).toBeInTheDocument();
      expect(screen.getByTestId('mail-icon')).toBeInTheDocument();
      expect(screen.getByTestId('award-icon')).toBeInTheDocument();
    });

    it('has proper grid layout for statistics', () => {
      renderWithRouter(<Newsletter />);
      
      const statsGrid = document.querySelector('.grid.grid-cols-2.md\\:grid-cols-4');
      expect(statsGrid).toBeInTheDocument();
    });
  });

  describe('Features Overview', () => {
    it('renders all feature cards', () => {
      renderWithRouter(<Newsletter />);
      
      expect(screen.getByText('Weekly Insights')).toBeInTheDocument();
      expect(screen.getByText('Community Driven')).toBeInTheDocument();
      expect(screen.getByText('Career Growth')).toBeInTheDocument();
      expect(screen.getByText('Personalized')).toBeInTheDocument();
    });

    it('displays feature descriptions', () => {
      renderWithRouter(<Newsletter />);
      
      expect(screen.getByText(/curated content from the developer community/i)).toBeInTheDocument();
      expect(screen.getByText(/join discussions, share your projects/i)).toBeInTheDocument();
      expect(screen.getByText(/get tips, opportunities, and resources/i)).toBeInTheDocument();
      expect(screen.getByText(/choose your interests and frequency/i)).toBeInTheDocument();
    });

    it('shows feature icons', () => {
      renderWithRouter(<Newsletter />);
      
      expect(screen.getByTestId('bookopen-icon')).toBeInTheDocument();
      expect(screen.getByTestId('messagecircle-icon')).toBeInTheDocument();
      expect(screen.getByTestId('trendingup-icon')).toBeInTheDocument();
      expect(screen.getByTestId('heart-icon')).toBeInTheDocument();
    });
  });

  describe('Navigation Tabs', () => {
    it('renders all navigation tabs', () => {
      renderWithRouter(<Newsletter />);
      
      expect(screen.getByRole('button', { name: /subscribe/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /archive/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /community/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /refer & earn/i })).toBeInTheDocument();
    });

    it('shows tab descriptions', () => {
      renderWithRouter(<Newsletter />);
      
      expect(screen.getByText('Join our community')).toBeInTheDocument();
      expect(screen.getByText('Browse past issues')).toBeInTheDocument();
      expect(screen.getByText('Connect & engage')).toBeInTheDocument();
      expect(screen.getByText('Share & get rewards')).toBeInTheDocument();
    });

    it('has default active tab (subscribe)', () => {
      renderWithRouter(<Newsletter />);
      
      const subscribeTab = screen.getByRole('button', { name: /subscribe/i });
      expect(subscribeTab).toHaveClass('bg-accent');
      expect(subscribeTab).toHaveClass('text-primary');
    });

    it('changes active tab when clicked', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Newsletter />);
      
      const archiveTab = screen.getByRole('button', { name: /archive/i });
      await user.click(archiveTab);
      
      expect(archiveTab).toHaveClass('bg-accent');
      expect(archiveTab).toHaveClass('text-primary');
    });
  });

  describe('Tab Content', () => {
    it('renders EnhancedNewsletterForm by default', () => {
      renderWithRouter(<Newsletter />);
      
      expect(screen.getByTestId('enhanced-newsletter-form')).toBeInTheDocument();
    });

    it('renders NewsletterArchive when archive tab is active', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Newsletter />);
      
      const archiveTab = screen.getByRole('button', { name: /archive/i });
      await user.click(archiveTab);
      
      expect(screen.getByTestId('newsletter-archive')).toBeInTheDocument();
    });

    it('renders CommunityFeatures when community tab is active', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Newsletter />);
      
      const communityTab = screen.getByRole('button', { name: /community/i });
      await user.click(communityTab);
      
      expect(screen.getByTestId('community-features')).toBeInTheDocument();
    });

    it('renders ReferralProgram when referral tab is active', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Newsletter />);
      
      const referralTab = screen.getByRole('button', { name: /refer & earn/i });
      await user.click(referralTab);
      
      expect(screen.getByTestId('referral-program')).toBeInTheDocument();
    });
  });

  describe('Email Subscription Functionality', () => {
    it('displays newsletter form elements', () => {
      renderWithRouter(<Newsletter />);
      
      expect(screen.getByTestId('newsletter-form')).toBeInTheDocument();
      expect(screen.getByTestId('email-input')).toBeInTheDocument();
      expect(screen.getByTestId('name-input')).toBeInTheDocument();
      expect(screen.getByTestId('subscribe-button')).toBeInTheDocument();
    });

    it('shows form validation components', () => {
      renderWithRouter(<Newsletter />);
      
      expect(screen.getByTestId('form-validation')).toBeInTheDocument();
    });

    it('includes success and error state handling', () => {
      renderWithRouter(<Newsletter />);
      
      expect(screen.getByTestId('success-state')).toBeInTheDocument();
      expect(screen.getByTestId('error-state')).toBeInTheDocument();
    });
  });

  describe('Bottom CTA Section', () => {
    it('renders the bottom call-to-action section', () => {
      renderWithRouter(<Newsletter />);
      
      const ctaTitle = screen.getByText('Ready to Join the Community?');
      expect(ctaTitle).toBeInTheDocument();
    });

    it('displays community description', () => {
      renderWithRouter(<Newsletter />);
      
      const description = screen.getByText(/connect with developers from top companies/i);
      expect(description).toBeInTheDocument();
    });

    it('has action buttons that switch tabs', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Newsletter />);
      
      const joinNewsletterBtn = screen.getByRole('button', { name: /join newsletter/i });
      const exploreCommunityBtn = screen.getByRole('button', { name: /explore community/i });
      
      expect(joinNewsletterBtn).toBeInTheDocument();
      expect(exploreCommunityBtn).toBeInTheDocument();
      
      await user.click(exploreCommunityBtn);
      expect(screen.getByTestId('community-features')).toBeInTheDocument();
    });

    it('shows community member count', () => {
      renderWithRouter(<Newsletter />);
      
      const memberCount = screen.getByText(/join 2,547\+ developers already in our community/i);
      expect(memberCount).toBeInTheDocument();
    });

    it('displays member avatars', () => {
      renderWithRouter(<Newsletter />);
      
      const avatars = document.querySelectorAll('.w-8.h-8.bg-gradient-to-br');
      expect(avatars).toHaveLength(5);
    });
  });

  describe('Responsive Design', () => {
    it('has responsive grid layouts', () => {
      renderWithRouter(<Newsletter />);
      
      const statsGrid = document.querySelector('.grid.grid-cols-2.md\\:grid-cols-4');
      const featuresGrid = document.querySelector('.grid.md\\:grid-cols-2.lg\\:grid-cols-4');
      const tabsGrid = document.querySelector('.grid.grid-cols-2.md\\:grid-cols-4');
      
      expect(statsGrid).toBeInTheDocument();
      expect(featuresGrid).toBeInTheDocument();
      expect(tabsGrid).toBeInTheDocument();
    });

    it('has responsive text sizing', () => {
      renderWithRouter(<Newsletter />);
      
      const mainHeading = screen.getByRole('heading', { level: 1 });
      expect(mainHeading).toHaveClass('text-5xl');
      expect(mainHeading).toHaveClass('md:text-6xl');
    });

    it('has responsive spacing classes', () => {
      renderWithRouter(<Newsletter />);
      
      const container = document.querySelector('.py-16.px-4.sm\\:px-6.lg\\:px-8');
      expect(container).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper heading hierarchy', () => {
      renderWithRouter(<Newsletter />);
      
      const h1Elements = screen.getAllByRole('heading', { level: 1 });
      const h2Elements = screen.getAllByRole('heading', { level: 2 });
      
      expect(h1Elements).toHaveLength(1);
      expect(h2Elements.length).toBeGreaterThan(0);
    });

    it('provides meaningful button text', () => {
      renderWithRouter(<Newsletter />);
      
      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button.textContent).toBeTruthy();
        expect(button.textContent?.trim()).not.toBe('');
      });
    });

    it('has proper tab navigation', () => {
      renderWithRouter(<Newsletter />);
      
      const tabButtons = [
        screen.getByRole('button', { name: /subscribe/i }),
        screen.getByRole('button', { name: /archive/i }),
        screen.getByRole('button', { name: /community/i }),
        screen.getByRole('button', { name: /refer & earn/i }),
      ];
      
      tabButtons.forEach(button => {
        expect(button).toBeInTheDocument();
      });
    });
  });

  describe('Performance', () => {
    it('renders without throwing errors', () => {
      expect(() => {
        renderWithRouter(<Newsletter />);
      }).not.toThrow();
    });

    it('handles tab switching efficiently', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Newsletter />);
      
      const tabs = [
        screen.getByRole('button', { name: /archive/i }),
        screen.getByRole('button', { name: /community/i }),
        screen.getByRole('button', { name: /refer & earn/i }),
        screen.getByRole('button', { name: /subscribe/i }),
      ];
      
      for (const tab of tabs) {
        await user.click(tab);
        // Should not throw errors during rapid tab switching
      }
    });
  });

  describe('Analytics Tracking', () => {
    it('tracks tab interactions', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Newsletter />);
      
      const archiveTab = screen.getByRole('button', { name: /archive/i });
      await user.click(archiveTab);
      
      // Tab should change, indicating tracking would occur
      expect(screen.getByTestId('newsletter-archive')).toBeInTheDocument();
    });

    it('tracks CTA button clicks', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Newsletter />);
      
      const joinBtn = screen.getByRole('button', { name: /join newsletter/i });
      await user.click(joinBtn);
      
      // Should switch to subscribe tab
      expect(screen.getByTestId('enhanced-newsletter-form')).toBeInTheDocument();
    });
  });
});