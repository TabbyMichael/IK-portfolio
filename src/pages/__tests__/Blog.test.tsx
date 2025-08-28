import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Blog from '../Blog';
import * as analytics from '../../utils/analytics';

// Mock analytics
jest.mock('../../utils/analytics', () => ({
  event: jest.fn(),
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Blog Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Page Structure', () => {
    it('renders the main blog page container', () => {
      renderWithRouter(<Blog />);
      
      const container = document.querySelector('.min-h-screen.bg-gray-50');
      expect(container).toBeInTheDocument();
    });

    it('renders with proper responsive layout', () => {
      renderWithRouter(<Blog />);
      
      const maxWidthContainer = document.querySelector('.max-w-7xl');
      expect(maxWidthContainer).toBeInTheDocument();
      expect(maxWidthContainer).toHaveClass('mx-auto');
    });

    it('has proper responsive padding', () => {
      renderWithRouter(<Blog />);
      
      const container = document.querySelector('.py-12.px-4.sm\\:px-6.lg\\:px-8');
      expect(container).toBeInTheDocument();
    });
  });

  describe('Header Section', () => {
    it('renders the main page title', () => {
      renderWithRouter(<Blog />);
      
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent('Technical Blog');
    });

    it('renders the page description', () => {
      renderWithRouter(<Blog />);
      
      const description = screen.getByText('Insights, tutorials, and industry perspectives');
      expect(description).toBeInTheDocument();
    });

    it('has proper heading styling', () => {
      renderWithRouter(<Blog />);
      
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveClass('text-4xl');
      expect(heading).toHaveClass('font-bold');
      expect(heading).toHaveClass('text-gray-900');
    });
  });

  describe('Blog Post Listing', () => {
    it('renders all blog posts', () => {
      renderWithRouter(<Blog />);
      
      // Check for sample blog post titles
      expect(screen.getByText('Modern Web Development Best Practices')).toBeInTheDocument();
      expect(screen.getByText('The Future of AI in Software Development')).toBeInTheDocument();
    });

    it('displays blog post excerpts', () => {
      renderWithRouter(<Blog />);
      
      expect(screen.getByText(/exploring the latest trends and best practices/i)).toBeInTheDocument();
      expect(screen.getByText(/analyzing how artificial intelligence is transforming/i)).toBeInTheDocument();
    });

    it('shows blog post metadata', () => {
      renderWithRouter(<Blog />);
      
      expect(screen.getByText('2024-01-15')).toBeInTheDocument();
      expect(screen.getByText('5 min read')).toBeInTheDocument();
      expect(screen.getByText('2024-01-10')).toBeInTheDocument();
      expect(screen.getByText('4 min read')).toBeInTheDocument();
    });

    it('displays blog post categories', () => {
      renderWithRouter(<Blog />);
      
      expect(screen.getByText('Web Development')).toBeInTheDocument();
      expect(screen.getByText('Artificial Intelligence')).toBeInTheDocument();
    });

    it('renders blog post images', () => {
      renderWithRouter(<Blog />);
      
      const images = screen.getAllByRole('img');
      expect(images).toHaveLength(2);
      expect(images[0]).toHaveAttribute('src', '/assets/blog-1.svg');
      expect(images[1]).toHaveAttribute('src', '/assets/blog-2.svg');
    });

    it('has proper grid layout for posts', () => {
      renderWithRouter(<Blog />);
      
      const gridContainer = document.querySelector('.grid.gap-8.md\\:grid-cols-2.lg\\:grid-cols-3');
      expect(gridContainer).toBeInTheDocument();
    });
  });

  describe('Category Filtering', () => {
    it('displays category badges with proper styling', () => {
      renderWithRouter(<Blog />);
      
      const webDevCategory = screen.getByText('Web Development');
      const aiCategory = screen.getByText('Artificial Intelligence');
      
      expect(webDevCategory).toHaveClass('bg-blue-100');
      expect(webDevCategory).toHaveClass('text-blue-800');
      expect(aiCategory).toHaveClass('bg-blue-100');
      expect(aiCategory).toHaveClass('text-blue-800');
    });

    it('shows categories as clickable elements', () => {
      renderWithRouter(<Blog />);
      
      const categories = document.querySelectorAll('.bg-blue-100.text-blue-800');
      expect(categories).toHaveLength(2);
    });

    it('renders read more buttons for all posts', () => {
      renderWithRouter(<Blog />);
      
      const readMoreButtons = screen.getAllByText('Read more →');
      expect(readMoreButtons).toHaveLength(2);
    });
  });

  describe('Analytics Tracking', () => {
    it('tracks page view on component mount', () => {
      renderWithRouter(<Blog />);
      
      expect(analytics.event).toHaveBeenCalledWith({
        action: 'page_view',
        category: 'blog',
        label: 'Blog Page View',
      });
    });

    it('tracks blog post click analytics', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Blog />);
      
      const firstBlogPost = screen.getByText('Modern Web Development Best Practices').closest('article');
      expect(firstBlogPost).toBeInTheDocument();
      
      if (firstBlogPost) {
        await user.click(firstBlogPost);
        
        expect(analytics.event).toHaveBeenCalledWith({
          action: 'blog_post_click',
          category: 'blog',
          label: 'Modern Web Development Best Practices',
        });
      }
    });

    it('tracks individual blog post clicks correctly', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Blog />);
      
      const secondBlogPost = screen.getByText('The Future of AI in Software Development').closest('article');
      expect(secondBlogPost).toBeInTheDocument();
      
      if (secondBlogPost) {
        await user.click(secondBlogPost);
        
        expect(analytics.event).toHaveBeenCalledWith({
          action: 'blog_post_click',
          category: 'blog',
          label: 'The Future of AI in Software Development',
        });
      }
    });
  });

  describe('Interactive Features', () => {
    it('has hover effects on blog post cards', () => {
      renderWithRouter(<Blog />);
      
      const blogPosts = document.querySelectorAll('article');
      blogPosts.forEach(post => {
        expect(post).toHaveClass('hover:transform');
        expect(post).toHaveClass('hover:scale-105');
      });
    });

    it('has proper transition classes', () => {
      renderWithRouter(<Blog />);
      
      const blogPosts = document.querySelectorAll('article');
      blogPosts.forEach(post => {
        expect(post).toHaveClass('transition-transform');
        expect(post).toHaveClass('duration-300');
      });
    });

    it('displays clickable read more buttons', () => {
      renderWithRouter(<Blog />);
      
      const readMoreButtons = screen.getAllByText('Read more →');
      readMoreButtons.forEach(button => {
        expect(button).toHaveClass('text-blue-600');
        expect(button).toHaveClass('hover:text-blue-800');
      });
    });
  });

  describe('Responsive Design', () => {
    it('has responsive grid layout', () => {
      renderWithRouter(<Blog />);
      
      const gridContainer = document.querySelector('.grid.gap-8.md\\:grid-cols-2.lg\\:grid-cols-3');
      expect(gridContainer).toBeInTheDocument();
    });

    it('has responsive image sizing', () => {
      renderWithRouter(<Blog />);
      
      const imageContainers = document.querySelectorAll('.h-48.w-full');
      expect(imageContainers).toHaveLength(2);
    });

    it('has responsive padding and spacing', () => {
      renderWithRouter(<Blog />);
      
      const container = document.querySelector('.py-12.px-4.sm\\:px-6.lg\\:px-8');
      const maxWidthContainer = document.querySelector('.max-w-7xl.mx-auto');
      
      expect(container).toBeInTheDocument();
      expect(maxWidthContainer).toBeInTheDocument();
    });
  });

  describe('Content Structure', () => {
    it('displays proper article structure', () => {
      renderWithRouter(<Blog />);
      
      const articles = document.querySelectorAll('article');
      expect(articles).toHaveLength(2);
      
      articles.forEach(article => {
        // Each article should have image, content, and metadata
        const image = article.querySelector('img');
        const title = article.querySelector('h2');
        const excerpt = article.querySelector('p');
        
        expect(image).toBeInTheDocument();
        expect(title).toBeInTheDocument();
        expect(excerpt).toBeInTheDocument();
      });
    });

    it('has proper heading hierarchy', () => {
      renderWithRouter(<Blog />);
      
      const h1Elements = screen.getAllByRole('heading', { level: 1 });
      const h2Elements = screen.getAllByRole('heading', { level: 2 });
      
      expect(h1Elements).toHaveLength(1);
      expect(h2Elements).toHaveLength(2);
    });

    it('displays metadata in proper format', () => {
      renderWithRouter(<Blog />);
      
      // Check for date and read time separator
      const metadataSeparators = screen.getAllByText('•');
      expect(metadataSeparators).toHaveLength(2);
    });
  });

  describe('Accessibility', () => {
    it('has proper alt text for images', () => {
      renderWithRouter(<Blog />);
      
      const images = screen.getAllByRole('img');
      images.forEach(image => {
        expect(image).toHaveAttribute('alt');
        expect(image.getAttribute('alt')).toBeTruthy();
      });
    });

    it('has semantic HTML structure', () => {
      renderWithRouter(<Blog />);
      
      const articles = document.querySelectorAll('article');
      expect(articles).toHaveLength(2);
      
      const headings = screen.getAllByRole('heading');
      expect(headings.length).toBeGreaterThan(0);
    });

    it('has proper button markup', () => {
      renderWithRouter(<Blog />);
      
      const readMoreButtons = screen.getAllByText('Read more →');
      readMoreButtons.forEach(button => {
        expect(button.tagName).toBe('BUTTON');
      });
    });

    it('provides meaningful content descriptions', () => {
      renderWithRouter(<Blog />);
      
      // Check that each post has substantial text content
      const postExcerpts = [
        screen.getByText(/exploring the latest trends and best practices/i),
        screen.getByText(/analyzing how artificial intelligence is transforming/i),
      ];
      
      postExcerpts.forEach(excerpt => {
        expect(excerpt).toBeInTheDocument();
        expect(excerpt.textContent!.length).toBeGreaterThan(50);
      });
    });
  });

  describe('Performance', () => {
    it('renders without throwing errors', () => {
      expect(() => {
        renderWithRouter(<Blog />);
      }).not.toThrow();
    });

    it('handles multiple rapid clicks gracefully', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Blog />);
      
      const firstPost = screen.getByText('Modern Web Development Best Practices').closest('article');
      
      if (firstPost) {
        // Multiple rapid clicks should not cause errors
        await user.click(firstPost);
        await user.click(firstPost);
        await user.click(firstPost);
        
        expect(analytics.event).toHaveBeenCalledTimes(4); // 1 page view + 3 clicks
      }
    });

    it('loads efficiently with static content', () => {
      renderWithRouter(<Blog />);
      
      // All content should be immediately available (no loading states)
      expect(screen.getByText('Technical Blog')).toBeInTheDocument();
      expect(screen.getByText('Modern Web Development Best Practices')).toBeInTheDocument();
      expect(screen.getByText('The Future of AI in Software Development')).toBeInTheDocument();
    });
  });

  describe('SEO and Meta Information', () => {
    it('has descriptive page title', () => {
      renderWithRouter(<Blog />);
      
      const pageTitle = screen.getByRole('heading', { level: 1 });
      expect(pageTitle).toHaveTextContent('Technical Blog');
    });

    it('includes descriptive subtitles', () => {
      renderWithRouter(<Blog />);
      
      const subtitle = screen.getByText('Insights, tutorials, and industry perspectives');
      expect(subtitle).toBeInTheDocument();
    });

    it('has structured blog post information', () => {
      renderWithRouter(<Blog />);
      
      const posts = screen.getAllByRole('heading', { level: 2 });
      posts.forEach(post => {
        expect(post.textContent).toBeTruthy();
        expect(post.textContent!.length).toBeGreaterThan(10);
      });
    });
  });
});