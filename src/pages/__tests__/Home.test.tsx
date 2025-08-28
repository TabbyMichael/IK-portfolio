import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../../contexts/ThemeContext';
import Home from '../Home';

// Mock all child components
jest.mock('../../components/Hero', () => {
  return function MockHero() {
    return (
      <div data-testid="hero-section">
        <h1>Ian Kibugu</h1>
        <p>Self-Taught Developer</p>
        <button>View My Work</button>
      </div>
    );
  };
});

jest.mock('../../components/home/FeaturedSkills', () => {
  return function MockFeaturedSkills() {
    return (
      <div data-testid="featured-skills">
        <h2>Featured Skills</h2>
        <div>React, TypeScript, Node.js</div>
      </div>
    );
  };
});

jest.mock('../../components/home/FeaturedProjects', () => {
  return function MockFeaturedProjects() {
    return (
      <div data-testid="featured-projects">
        <h2>Featured Projects</h2>
        <div>Project showcase</div>
      </div>
    );
  };
});

jest.mock('../../components/home/FeaturedTestimonials', () => {
  return function MockFeaturedTestimonials() {
    return (
      <div data-testid="featured-testimonials">
        <h2>Client Testimonials</h2>
        <div>Testimonial content</div>
      </div>
    );
  };
});

jest.mock('../../components/home/Newsletter', () => {
  return function MockNewsletter() {
    return (
      <div data-testid="newsletter-section">
        <h2>Newsletter Signup</h2>
        <form>
          <input type="email" placeholder="Email" />
          <button type="submit">Subscribe</button>
        </form>
      </div>
    );
  };
});

// Test wrapper component
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <ThemeProvider>
      {children}
    </ThemeProvider>
  </BrowserRouter>
);

describe('Home Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all main sections', () => {
    render(
      <TestWrapper>
        <Home />
      </TestWrapper>
    );

    // Verify all main sections are present
    expect(screen.getByTestId('hero-section')).toBeInTheDocument();
    expect(screen.getByTestId('featured-skills')).toBeInTheDocument();
    expect(screen.getByTestId('featured-projects')).toBeInTheDocument();
    expect(screen.getByTestId('featured-testimonials')).toBeInTheDocument();
    expect(screen.getByTestId('newsletter-section')).toBeInTheDocument();
  });

  it('has proper page structure and spacing', () => {
    const { container } = render(
      <TestWrapper>
        <Home />
      </TestWrapper>
    );

    const mainDiv = container.firstChild as HTMLElement;
    expect(mainDiv).toHaveClass('space-y-20');
    expect(mainDiv).toHaveClass('pb-20');
  });

  it('renders hero section with personal information', () => {
    render(
      <TestWrapper>
        <Home />
      </TestWrapper>
    );

    const heroSection = screen.getByTestId('hero-section');
    expect(heroSection).toBeInTheDocument();
    expect(screen.getByText('Ian Kibugu')).toBeInTheDocument();
    expect(screen.getByText('Self-Taught Developer')).toBeInTheDocument();
  });

  it('renders featured projects section', () => {
    render(
      <TestWrapper>
        <Home />
      </TestWrapper>
    );

    expect(screen.getByTestId('featured-projects')).toBeInTheDocument();
    expect(screen.getByText('Featured Projects')).toBeInTheDocument();
  });

  it('renders call-to-action button in hero', () => {
    render(
      <TestWrapper>
        <Home />
      </TestWrapper>
    );

    expect(screen.getByRole('button', { name: /view my work/i })).toBeInTheDocument();
  });

  it('renders skills showcase section', () => {
    render(
      <TestWrapper>
        <Home />
      </TestWrapper>
    );

    expect(screen.getByTestId('featured-skills')).toBeInTheDocument();
    expect(screen.getByText('Featured Skills')).toBeInTheDocument();
  });

  it('renders testimonials section', () => {
    render(
      <TestWrapper>
        <Home />
      </TestWrapper>
    );

    expect(screen.getByTestId('featured-testimonials')).toBeInTheDocument();
    expect(screen.getByText('Client Testimonials')).toBeInTheDocument();
  });

  it('renders newsletter signup section', () => {
    render(
      <TestWrapper>
        <Home />
      </TestWrapper>
    );

    expect(screen.getByTestId('newsletter-section')).toBeInTheDocument();
    expect(screen.getByText('Newsletter Signup')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /subscribe/i })).toBeInTheDocument();
  });

  it('has proper semantic structure', () => {
    render(
      <TestWrapper>
        <Home />
      </TestWrapper>
    );

    // Check that sections are properly ordered
    const sections = [
      screen.getByTestId('hero-section'),
      screen.getByTestId('featured-skills'),
      screen.getByTestId('featured-projects'),
      screen.getByTestId('featured-testimonials'),
      screen.getByTestId('newsletter-section')
    ];

    sections.forEach(section => {
      expect(section).toBeInTheDocument();
    });
  });

  it('displays email input in newsletter section', () => {
    render(
      <TestWrapper>
        <Home />
      </TestWrapper>
    );

    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
  });
});