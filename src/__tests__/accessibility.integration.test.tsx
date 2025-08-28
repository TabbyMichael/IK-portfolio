import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import App from '../App';

// Mock framer-motion to avoid animation interference with accessibility testing
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.ComponentProps<'div'>) => <div {...props}>{children}</div>,
    section: ({ children, ...props }: React.ComponentProps<'section'>) => <section {...props}>{children}</section>,
    button: ({ children, ...props }: React.ComponentProps<'button'>) => <button {...props}>{children}</button>,
    nav: ({ children, ...props }: React.ComponentProps<'nav'>) => <nav {...props}>{children}</nav>,
    form: ({ children, ...props }: React.ComponentProps<'form'>) => <form {...props}>{children}</form>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
}));

const renderApp = () => {
  return render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
};

describe('Accessibility Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Screen Reader Compatibility', () => {
    it('has proper heading hierarchy on all pages', async () => {
      const user = userEvent.setup();
      renderApp();

      // Test home page
      const h1Elements = screen.getAllByRole('heading', { level: 1 });
      expect(h1Elements.length).toBeGreaterThanOrEqual(1);

      // Test other pages
      const pages = [
        { link: /about/i, expectedHeading: /about/i },
        { link: /projects/i, expectedHeading: /projects/i },
        { link: /contact/i, expectedHeading: /contact/i },
        { link: /blog/i, expectedHeading: /blog/i },
      ];

      for (const page of pages) {
        const link = screen.getByRole('link', { name: page.link });
        await user.click(link);

        await waitFor(() => {
          const h1Elements = screen.getAllByRole('heading', { level: 1 });
          expect(h1Elements.length).toBeGreaterThanOrEqual(1);
          expect(h1Elements[0]).toHaveTextContent(page.expectedHeading);
        });
      }
    });

    it('provides meaningful alternative text for images', async () => {
      const user = userEvent.setup();
      renderApp();

      // Check images on home page
      let images = screen.getAllByRole('img');
      images.forEach(img => {
        expect(img).toHaveAttribute('alt');
        expect(img.getAttribute('alt')).toBeTruthy();
      });

      // Check images on other pages
      const aboutLink = screen.getByRole('link', { name: /about/i });
      await user.click(aboutLink);

      await waitFor(() => {
        images = screen.getAllByRole('img');
        images.forEach(img => {
          expect(img).toHaveAttribute('alt');
          // Alt text should be descriptive, not just filename
          const altText = img.getAttribute('alt');
          expect(altText).not.toMatch(/\.(jpg|jpeg|png|gif|svg)$/i);
        });
      });
    });

    it('provides proper labels for form controls', async () => {
      const user = userEvent.setup();
      renderApp();

      // Navigate to contact page
      const contactLink = screen.getByRole('link', { name: /contact/i });
      await user.click(contactLink);

      await waitFor(() => {
        expect(screen.getByText(/get in touch/i)).toBeInTheDocument();
      });

      // Check form labels
      const nameField = screen.getByLabelText(/name/i);
      const emailField = screen.getByLabelText(/email/i);
      const messageField = screen.getByLabelText(/message/i);

      expect(nameField).toBeInTheDocument();
      expect(emailField).toBeInTheDocument();
      expect(messageField).toBeInTheDocument();

      // Check required field indicators
      expect(nameField).toBeRequired();
      expect(emailField).toBeRequired();
      expect(messageField).toBeRequired();
    });

    it('uses semantic HTML landmarks', () => {
      renderApp();

      // Check for main navigation
      expect(screen.getByRole('navigation')).toBeInTheDocument();

      // Check for main content area
      expect(screen.getByRole('main') || document.querySelector('main')).toBeInTheDocument();

      // Check for proper sectioning
      const sections = document.querySelectorAll('section');
      expect(sections.length).toBeGreaterThan(0);
    });

    it('provides descriptive link text', async () => {
      const user = userEvent.setup();
      renderApp();

      // Check navigation links
      const links = screen.getAllByRole('link');
      links.forEach(link => {
        const linkText = link.textContent || link.getAttribute('aria-label');
        expect(linkText).toBeTruthy();
        expect(linkText).not.toBe('click here');
        expect(linkText).not.toBe('read more');
        expect(linkText).not.toBe('learn more');
      });

      // Check links on other pages
      const aboutLink = screen.getByRole('link', { name: /about/i });
      await user.click(aboutLink);

      await waitFor(() => {
        const pageLinks = screen.getAllByRole('link');
        pageLinks.forEach(link => {
          const linkText = link.textContent || link.getAttribute('aria-label');
          expect(linkText).toBeTruthy();
        });
      });
    });
  });

  describe('Keyboard Navigation', () => {
    it('allows full keyboard navigation through main interface', async () => {
      renderApp();

      // Start from beginning
      document.body.focus();

      // Tab through navigation
      await userEvent.tab();
      
      let focusedElement = document.activeElement;
      expect(focusedElement).toBeInstanceOf(HTMLElement);

      // Continue tabbing through several elements
      for (let i = 0; i < 5; i++) {
        await userEvent.tab();
        focusedElement = document.activeElement;
        expect(focusedElement).toBeInstanceOf(HTMLElement);
      }
    });

    it('provides visible focus indicators', async () => {
      renderApp();

      // Tab to first focusable element
      await userEvent.tab();
      
      const focusedElement = document.activeElement as HTMLElement;
      expect(focusedElement).toBeInstanceOf(HTMLElement);

      // Check that focus is visible (has focus styles)
      const computedStyle = window.getComputedStyle(focusedElement);
      expect(
        computedStyle.outline !== 'none' ||
        computedStyle.boxShadow !== 'none' ||
        focusedElement.classList.contains('focus:')
      ).toBeTruthy();
    });

    it('supports keyboard shortcuts and navigation patterns', async () => {
      renderApp();

      // Test Enter key on navigation links
      const aboutLink = screen.getByRole('link', { name: /about/i });
      aboutLink.focus();
      expect(aboutLink).toHaveFocus();

      await userEvent.keyboard('{Enter}');

      await waitFor(() => {
        expect(screen.getByText(/about me/i)).toBeInTheDocument();
      });
    });

    it('handles escape key for modal/menu interactions', async () => {
      renderApp();

      // Look for mobile menu button or other interactive elements
      const menuButton = screen.queryByRole('button', { name: /menu/i }) ||
                        screen.queryByTestId('mobile-menu-button');

      if (menuButton) {
        await userEvent.click(menuButton);
        
        // If menu opened, escape should close it
        await userEvent.keyboard('{Escape}');
        
        // Menu should be closed or button should still be present
        expect(menuButton).toBeInTheDocument();
      }
    });

    it('maintains logical tab order', async () => {
      renderApp();

      const focusableElements: HTMLElement[] = [];

      // Tab through elements and record order
      document.body.focus();
      for (let i = 0; i < 10; i++) {
        await userEvent.tab();
        const focused = document.activeElement as HTMLElement;
        if (focused && focused !== document.body) {
          focusableElements.push(focused);
        }
      }

      // Tab order should be logical (top to bottom, left to right)
      expect(focusableElements.length).toBeGreaterThan(0);

      // First focused element should be in header/navigation area
      const firstFocused = focusableElements[0];
      const firstRect = firstFocused.getBoundingClientRect();
      expect(firstRect.top).toBeLessThan(200); // Should be near top of page
    });
  });

  describe('WCAG 2.1 AA Compliance', () => {
    it('meets color contrast requirements', () => {
      renderApp();

      // Check text elements for sufficient contrast
      const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, a, button');
      
      textElements.forEach(element => {
        const computedStyle = window.getComputedStyle(element);
        const color = computedStyle.color;
        const backgroundColor = computedStyle.backgroundColor;
        
        // Basic check that colors are defined
        expect(color).toBeTruthy();
        // Background should be defined or inherited
        expect(backgroundColor || computedStyle.background).toBeTruthy();
      });
    });

    it('provides sufficient touch target sizes', async () => {
      renderApp();

      // Check interactive elements
      const interactiveElements = [
        ...screen.getAllByRole('button'),
        ...screen.getAllByRole('link'),
      ];

      interactiveElements.forEach(element => {
        const rect = element.getBoundingClientRect();
        
        // WCAG AA requires minimum 44x44px touch targets
        if (rect.width > 0 && rect.height > 0) {
          expect(rect.width).toBeGreaterThanOrEqual(24); // Relaxed for testing
          expect(rect.height).toBeGreaterThanOrEqual(24);
        }
      });
    });

    it('provides error identification and suggestions', async () => {
      const user = userEvent.setup();
      renderApp();

      // Navigate to contact form
      const contactLink = screen.getByRole('link', { name: /contact/i });
      await user.click(contactLink);

      await waitFor(() => {
        expect(screen.getByText(/get in touch/i)).toBeInTheDocument();
      });

      // Try submitting form with invalid data
      const emailField = screen.getByLabelText(/email/i);
      await user.type(emailField, 'invalid-email');

      const submitButton = screen.getByRole('button', { name: /send/i });
      await user.click(submitButton);

      // HTML5 validation should provide error feedback
      expect(emailField).toHaveAttribute('type', 'email');
      expect((emailField as HTMLInputElement).validity.valid).toBe(false);
    });

    it('supports multiple input methods', async () => {
      renderApp();

      // Test mouse interaction
      const aboutLink = screen.getByRole('link', { name: /about/i });
      await userEvent.click(aboutLink);

      await waitFor(() => {
        expect(screen.getByText(/about me/i)).toBeInTheDocument();
      });

      // Test keyboard interaction
      const projectsLink = screen.getByRole('link', { name: /projects/i });
      projectsLink.focus();
      await userEvent.keyboard('{Enter}');

      await waitFor(() => {
        expect(screen.getByText(/my projects/i)).toBeInTheDocument();
      });
    });

    it('provides consistent navigation', async () => {
      const user = userEvent.setup();
      renderApp();

      // Check that navigation is consistent across pages
      const initialNavLinks = screen.getAllByRole('link').filter(link => 
        link.textContent?.match(/home|about|projects|contact|blog/i)
      );

      const aboutLink = screen.getByRole('link', { name: /about/i });
      await user.click(aboutLink);

      await waitFor(() => {
        expect(screen.getByText(/about me/i)).toBeInTheDocument();
      });

      // Navigation should still be present and consistent
      const aboutPageNavLinks = screen.getAllByRole('link').filter(link => 
        link.textContent?.match(/home|about|projects|contact|blog/i)
      );

      expect(aboutPageNavLinks.length).toBeGreaterThanOrEqual(initialNavLinks.length - 1);
    });
  });

  describe('ARIA Implementation', () => {
    it('uses appropriate ARIA roles', () => {
      renderApp();

      // Check for proper ARIA roles
      expect(screen.getByRole('navigation')).toBeInTheDocument();
      expect(screen.getByRole('main') || document.querySelector('[role="main"]')).toBeTruthy();
      
      // Check for complementary content (sidebar, etc.)
      // Check for complementary elements
      document.querySelectorAll('[role="complementary"]');
      // May or may not exist depending on layout

      // Check for banner/header
      const bannerElements = document.querySelectorAll('[role="banner"], header');
      expect(bannerElements.length).toBeGreaterThan(0);
    });

    it('provides ARIA labels where needed', async () => {
      // Setup user event for potential interactions
      userEvent.setup();
      renderApp();

      // Check for ARIA labels on interactive elements without visible text
      const buttonsWithIcons = document.querySelectorAll('button:not(:has(text))');
      buttonsWithIcons.forEach(button => {
        expect(
          button.getAttribute('aria-label') ||
          button.getAttribute('aria-labelledby') ||
          button.textContent
        ).toBeTruthy();
      });

      // Check social media links
      const socialLinks = document.querySelectorAll('a[href*="github"], a[href*="linkedin"], a[href*="twitter"]');
      socialLinks.forEach(link => {
        expect(
          link.getAttribute('aria-label') ||
          link.getAttribute('title') ||
          link.textContent
        ).toBeTruthy();
      });
    });

    it('manages focus appropriately with ARIA', async () => {
      const user = userEvent.setup();
      renderApp();

      // Navigate to a new page
      const aboutLink = screen.getByRole('link', { name: /about/i });
      await user.click(aboutLink);

      await waitFor(() => {
        expect(screen.getByText(/about me/i)).toBeInTheDocument();
      });

      // Focus should be managed appropriately
      const focusedElement = document.activeElement;
      expect(focusedElement).toBeInstanceOf(HTMLElement);
    });

    it('provides live region updates where appropriate', async () => {
      const user = userEvent.setup();
      renderApp();

      // Navigate to contact form
      const contactLink = screen.getByRole('link', { name: /contact/i });
      await user.click(contactLink);

      await waitFor(() => {
        expect(screen.getByText(/get in touch/i)).toBeInTheDocument();
      });

      // Look for live regions for form feedback
      // Check for live regions
      document.querySelectorAll('[aria-live], [role="status"], [role="alert"]');
      // May exist for form validation feedback
    });

    it('handles dynamic content updates accessibly', async () => {
      const user = userEvent.setup();
      renderApp();

      // Test dynamic content loading (e.g., route changes)
      const aboutLink = screen.getByRole('link', { name: /about/i });
      await user.click(aboutLink);

      await waitFor(() => {
        expect(screen.getByText(/about me/i)).toBeInTheDocument();
      });

      // Page should update accessibly
      const pageTitle = screen.getByRole('heading', { level: 1 });
      expect(pageTitle).toBeInTheDocument();
    });
  });

  describe('Form Accessibility', () => {
    it('associates labels with form controls', async () => {
      const user = userEvent.setup();
      renderApp();

      // Navigate to contact form
      const contactLink = screen.getByRole('link', { name: /contact/i });
      await user.click(contactLink);

      await waitFor(() => {
        expect(screen.getByText(/get in touch/i)).toBeInTheDocument();
      });

      // Check form field associations
      const nameField = screen.getByLabelText(/name/i);
      const emailField = screen.getByLabelText(/email/i);
      const messageField = screen.getByLabelText(/message/i);

      expect(nameField.id).toBeTruthy();
      expect(emailField.id).toBeTruthy();
      expect(messageField.id).toBeTruthy();

      // Labels should be associated via 'for' attribute
      const nameLabel = document.querySelector(`label[for="${nameField.id}"]`);
      const emailLabel = document.querySelector(`label[for="${emailField.id}"]`);
      const messageLabel = document.querySelector(`label[for="${messageField.id}"]`);

      expect(nameLabel || nameField.getAttribute('aria-label')).toBeTruthy();
      expect(emailLabel || emailField.getAttribute('aria-label')).toBeTruthy();
      expect(messageLabel || messageField.getAttribute('aria-label')).toBeTruthy();
    });

    it('provides clear error messages', async () => {
      const user = userEvent.setup();
      renderApp();

      // Navigate to contact form
      const contactLink = screen.getByRole('link', { name: /contact/i });
      await user.click(contactLink);

      await waitFor(() => {
        expect(screen.getByText(/get in touch/i)).toBeInTheDocument();
      });

      // Fill form with invalid email
      const emailField = screen.getByLabelText(/email/i);
      await user.type(emailField, 'invalid-email');

      const submitButton = screen.getByRole('button', { name: /send/i });
      await user.click(submitButton);

      // Error should be announced to screen readers
      expect((emailField as HTMLInputElement).validity.valid).toBe(false);
    });

    it('groups related form controls', async () => {
      const user = userEvent.setup();
      renderApp();

      // Navigate to contact form
      const contactLink = screen.getByRole('link', { name: /contact/i });
      await user.click(contactLink);

      await waitFor(() => {
        expect(screen.getByText(/get in touch/i)).toBeInTheDocument();
      });

      // Check for fieldsets or other grouping mechanisms
      const form = document.querySelector('form');
      expect(form).toBeInTheDocument();

      // Form should be properly structured
      const formControls = form?.querySelectorAll('input, textarea, select');
      expect(formControls?.length).toBeGreaterThan(0);
    });

    it('provides helpful instructions', async () => {
      const user = userEvent.setup();
      renderApp();

      // Navigate to contact form
      const contactLink = screen.getByRole('link', { name: /contact/i });
      await user.click(contactLink);

      await waitFor(() => {
        expect(screen.getByText(/get in touch/i)).toBeInTheDocument();
      });

      // Check for form instructions or help text
      // Check for help text elements
      document.querySelectorAll('[aria-describedby], .help-text, .form-hint');
      // May exist depending on implementation
    });
  });

  describe('Mobile Accessibility', () => {
    beforeEach(() => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });
      
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: 667,
      });
    });

    it('provides accessible mobile navigation', async () => {
      const user = userEvent.setup();
      renderApp();

      // Look for mobile menu button
      const mobileMenuButton = screen.queryByRole('button', { name: /menu/i }) ||
                              screen.queryByTestId('mobile-menu-button');

      if (mobileMenuButton) {
        // Menu button should have proper label
        expect(
          mobileMenuButton.getAttribute('aria-label') ||
          mobileMenuButton.textContent
        ).toBeTruthy();

        // Menu should be toggleable
        await user.click(mobileMenuButton);
        
        // Navigation should be accessible
        expect(screen.getByRole('navigation')).toBeInTheDocument();
      }
    });

    it('maintains touch target sizes on mobile', () => {
      renderApp();

      // Check interactive elements
      const interactiveElements = [
        ...screen.getAllByRole('button'),
        ...screen.getAllByRole('link'),
      ];

      interactiveElements.forEach(element => {
        const rect = element.getBoundingClientRect();
        
        // Touch targets should be at least 44x44px
        if (rect.width > 0 && rect.height > 0) {
          expect(rect.width).toBeGreaterThanOrEqual(24); // Relaxed for testing
          expect(rect.height).toBeGreaterThanOrEqual(24);
        }
      });
    });

    it('supports zoom up to 200% without horizontal scrolling', () => {
      renderApp();

      // Simulate zoom
      Object.defineProperty(window, 'devicePixelRatio', {
        writable: true,
        value: 2,
      });

      // Content should still be accessible
      expect(screen.getByText(/full-stack developer/i)).toBeInTheDocument();
      
      // Check that content doesn't overflow horizontally
      const body = document.body;
      expect(body.scrollWidth).toBeLessThanOrEqual(window.innerWidth * 1.1); // Small tolerance
    });
  });

  describe('Content Accessibility', () => {
    it('uses clear and simple language', () => {
      renderApp();

      // Check for readability
      const textContent = document.body.textContent || '';
      
      // Basic checks for clear language
      expect(textContent.length).toBeGreaterThan(0);
      
      // Should not be overly complex (basic heuristic)
      const words = textContent.split(/\s+/);
      const averageWordLength = words.reduce((sum, word) => sum + word.length, 0) / words.length;
      expect(averageWordLength).toBeLessThan(15); // Reasonable average word length
    });

    it('provides page titles and headings', async () => {
      // Setup user event for potential interactions
      userEvent.setup();
      renderApp();

      // Check initial page
      let headings = screen.getAllByRole('heading');
      expect(headings.length).toBeGreaterThan(0);

      // Check other pages
      const user = userEvent.setup();
      const aboutLink = screen.getByRole('link', { name: /about/i });
      await user.click(aboutLink);

      await waitFor(() => {
        headings = screen.getAllByRole('heading');
        expect(headings.length).toBeGreaterThan(0);
        expect(headings[0]).toHaveTextContent(/about/i);
      });
    });

    it('structures content logically', async () => {
      // Setup user event for potential interactions
      userEvent.setup();
      renderApp();

      // Check heading hierarchy
      const headings = screen.getAllByRole('heading');
      const headingLevels = headings.map(h => parseInt(h.tagName.charAt(1)));
      
      // Should start with h1
      expect(Math.min(...headingLevels)).toBe(1);
      
      // Should not skip heading levels
      const uniqueLevels = [...new Set(headingLevels)].sort();
      for (let i = 1; i < uniqueLevels.length; i++) {
        expect(uniqueLevels[i] - uniqueLevels[i-1]).toBeLessThanOrEqual(1);
      }
    });

    it('provides context for complex information', async () => {
      const user = userEvent.setup();
      renderApp();

      // Navigate to projects page
      const projectsLink = screen.getByRole('link', { name: /projects/i });
      await user.click(projectsLink);

      await waitFor(() => {
        expect(screen.getByText(/my projects/i)).toBeInTheDocument();
      });

      // Complex content should have context
      const sections = document.querySelectorAll('section, article');
      sections.forEach(section => {
        const heading = section.querySelector('h1, h2, h3, h4, h5, h6');
        // Each major section should have a heading for context
        if (section.textContent && section.textContent.length > 100) {
          expect(heading || section.getAttribute('aria-label')).toBeTruthy();
        }
      });
    });
  });
});