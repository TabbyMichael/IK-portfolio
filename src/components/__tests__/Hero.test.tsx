import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Hero from '../Hero';

// Mock react-type-animation
jest.mock('react-type-animation', () => ({
  TypeAnimation: ({ wrapper: Wrapper = 'span' }: { 
    wrapper?: keyof JSX.IntrinsicElements;
  }) => {
    const WrapperComponent = Wrapper as React.ElementType;
    return (
      <WrapperComponent data-testid="type-animation">
        Self-Taught Developer
      </WrapperComponent>
    );
  },
}));

// Mock framer-motion
interface MockMotionProps {
  children: React.ReactNode;
  whileHover?: unknown;
  whileTap?: unknown;
  initial?: unknown;
  animate?: unknown;
  transition?: unknown;
  onClick?: () => void;
  className?: string;
}

jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: MockMotionProps) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: MockMotionProps) => <button {...props}>{children}</button>,
  },
}));

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Test wrapper component
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    {children}
  </BrowserRouter>
);

describe('Hero Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders personal information correctly', () => {
    render(
      <TestWrapper>
        <Hero />
      </TestWrapper>
    );

    expect(screen.getByText("Hello, I'm")).toBeInTheDocument();
    expect(screen.getByText('Ian Kibugu')).toBeInTheDocument();
    expect(screen.getByTestId('type-animation')).toBeInTheDocument();
    expect(screen.getByText('Nairobi, Kenya')).toBeInTheDocument();
  });

  it('displays animated typing text', () => {
    render(
      <TestWrapper>
        <Hero />
      </TestWrapper>
    );

    const typeAnimation = screen.getByTestId('type-animation');
    expect(typeAnimation).toBeInTheDocument();
    expect(typeAnimation).toHaveTextContent('Self-Taught Developer');
  });

  it('renders social media links with correct URLs', () => {
    render(
      <TestWrapper>
        <Hero />
      </TestWrapper>
    );

    const githubLink = screen.getByLabelText(/github/i);
    expect(githubLink).toHaveAttribute('href', 'https://github.com/TabbyMichael');
    expect(githubLink).toHaveAttribute('target', '_blank');
    expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');

    const linkedinLink = screen.getByLabelText(/linkedin/i);
    expect(linkedinLink).toHaveAttribute('href', expect.stringContaining('linkedin.com'));
    expect(linkedinLink).toHaveAttribute('target', '_blank');

    const emailLink = screen.getByLabelText(/mail/i);
    expect(emailLink).toHaveAttribute('href', 'mailto:kibuguzian@gmail.com');
  });

  it('renders call-to-action button', () => {
    render(
      <TestWrapper>
        <Hero />
      </TestWrapper>
    );

    const ctaButton = screen.getByRole('button', { name: /view my work/i });
    expect(ctaButton).toBeInTheDocument();
    expect(ctaButton).toHaveClass('glass');
  });

  it('navigates to projects page when CTA button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <TestWrapper>
        <Hero />
      </TestWrapper>
    );

    const ctaButton = screen.getByRole('button', { name: /view my work/i });
    await user.click(ctaButton);

    expect(mockNavigate).toHaveBeenCalledWith('/projects');
  });

  it('has proper accessibility attributes', () => {
    render(
      <TestWrapper>
        <Hero />
      </TestWrapper>
    );

    // Check for proper heading hierarchy
    const mainHeading = screen.getByRole('heading', { level: 1 });
    expect(mainHeading).toHaveTextContent('Ian Kibugu');

    const subHeading = screen.getByRole('heading', { level: 2 });
    expect(subHeading).toHaveTextContent("Hello, I'm");

    // Check for proper link labels
    const links = screen.getAllByRole('link');
    links.forEach(link => {
      expect(link).toHaveAttribute('href');
    });
  });

  it('displays location with map pin icon', () => {
    render(
      <TestWrapper>
        <Hero />
      </TestWrapper>
    );

    expect(screen.getByText('Nairobi, Kenya')).toBeInTheDocument();
    // The MapPin icon should be rendered alongside the location
  });

  it('has responsive design classes', () => {
    const { container } = render(
      <TestWrapper>
        <Hero />
      </TestWrapper>
    );

    // Check for responsive text sizes
    const heading = screen.getByText('Ian Kibugu');
    expect(heading).toHaveClass('text-4xl');
    expect(heading).toHaveClass('md:text-6xl');

    // Check for responsive layout classes
    const mainContainer = container.querySelector('.max-w-7xl');
    expect(mainContainer).toHaveClass('px-4');
    expect(mainContainer).toHaveClass('sm:px-6');
    expect(mainContainer).toHaveClass('lg:px-8');
  });

  it('renders with proper styling classes', () => {
    render(
      <TestWrapper>
        <Hero />
      </TestWrapper>
    );

    const ctaButton = screen.getByRole('button', { name: /view my work/i });
    expect(ctaButton).toHaveClass('glass');
    expect(ctaButton).toHaveClass('px-8');
    expect(ctaButton).toHaveClass('py-3');
    expect(ctaButton).toHaveClass('rounded-full');
    expect(ctaButton).toHaveClass('text-accent');
    expect(ctaButton).toHaveClass('border');
    expect(ctaButton).toHaveClass('border-accent');
  });

  it('has proper semantic structure', () => {
    const { container } = render(
      <TestWrapper>
        <Hero />
      </TestWrapper>
    );

    // Check main container structure
    const heroContainer = container.querySelector('.min-h-screen');
    expect(heroContainer).toBeInTheDocument();
    expect(heroContainer).toHaveClass('flex');
    expect(heroContainer).toHaveClass('items-center');
    expect(heroContainer).toHaveClass('justify-center');
  });

  it('displays social links in correct order', () => {
    render(
      <TestWrapper>
        <Hero />
      </TestWrapper>
    );

    const socialLinks = screen.getAllByRole('link');
    expect(socialLinks).toHaveLength(3);
    
    // Check that GitHub, LinkedIn, and Email links are present
    expect(socialLinks[0]).toHaveAttribute('href', expect.stringContaining('github.com'));
    expect(socialLinks[1]).toHaveAttribute('href', expect.stringContaining('linkedin.com'));
    expect(socialLinks[2]).toHaveAttribute('href', expect.stringContaining('mailto:'));
  });
});