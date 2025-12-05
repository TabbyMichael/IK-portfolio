import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Contact from '../Contact';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.ComponentProps<'div'>) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: React.ComponentProps<'button'>) => <button {...props}>{children}</button>,
  },
}));

// Mock ContactMap component
jest.mock('../../components/contact/ContactMap', () => {
  return function MockContactMap() {
    return (
      <div data-testid="contact-map">
        <div data-testid="map-container">Interactive Map</div>
        <div data-testid="location-marker">Nairobi, Kenya</div>
      </div>
    );
  };
});

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Github: ({ className, ...props }: { className?: string } & React.ComponentProps<'svg'>) => <svg data-testid="github-icon" className={className} {...props} />,
  Linkedin: ({ className, ...props }: { className?: string } & React.ComponentProps<'svg'>) => <svg data-testid="linkedin-icon" className={className} {...props} />,
  Mail: ({ className, ...props }: { className?: string } & React.ComponentProps<'svg'>) => <svg data-testid="mail-icon" className={className} {...props} />,
  MapPin: ({ className, ...props }: { className?: string } & React.ComponentProps<'svg'>) => <svg data-testid="mappin-icon" className={className} {...props} />,
  Phone: ({ className, ...props }: { className?: string } & React.ComponentProps<'svg'>) => <svg data-testid="phone-icon" className={className} {...props} />,
}));

// Mock fetch
global.fetch = jest.fn();

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Contact Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      status: 200,
    });
  });

  describe('Page Structure', () => {
    it('renders the main contact page container', () => {
      renderWithRouter(<Contact />);
      
      const container = document.querySelector('.min-h-screen.pt-24.pb-24');
      expect(container).toBeInTheDocument();
    });

    it('renders with proper responsive layout', () => {
      renderWithRouter(<Contact />);
      
      const maxWidthContainer = document.querySelector('.max-w-7xl');
      expect(maxWidthContainer).toBeInTheDocument();
      expect(maxWidthContainer).toHaveClass('mx-auto');
      expect(maxWidthContainer).toHaveClass('px-6');
      expect(maxWidthContainer).toHaveClass('sm:px-8');
      expect(maxWidthContainer).toHaveClass('lg:px-10');
    });

    it('has proper grid layout for desktop', () => {
      renderWithRouter(<Contact />);
      
      const gridContainer = document.querySelector('.grid.grid-cols-1.lg\\:grid-cols-3');
      expect(gridContainer).toBeInTheDocument();
    });
  });

  describe('Header Section', () => {
    it('renders the main page title', () => {
      renderWithRouter(<Contact />);
      
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent('Get In Touch');
    });

    it('renders the page description', () => {
      renderWithRouter(<Contact />);
      
      const description = screen.getByText("Let's work together on something great");
      expect(description).toBeInTheDocument();
    });
  });

  describe('Contact Form Integration', () => {
    it('renders the contact form', () => {
      renderWithRouter(<Contact />);
      
      const form = screen.getByRole('form') || document.querySelector('form[name="contact"]');
      expect(form).toBeInTheDocument();
    });

    it('has all required form fields', () => {
      renderWithRouter(<Contact />);
      
      expect(screen.getByLabelText(/your name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/your email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/your message/i)).toBeInTheDocument();
    });

    it('has proper form attributes for Netlify', () => {
      renderWithRouter(<Contact />);
      
      const form = document.querySelector('form[name="contact"]');
      expect(form).toHaveAttribute('method', 'POST');
      expect(form).toHaveAttribute('data-netlify', 'true');
      expect(form).toHaveAttribute('data-netlify-honeypot', 'bot-field');
    });

    it('includes hidden form fields for Netlify', () => {
      renderWithRouter(<Contact />);
      
      const formNameInput = document.querySelector('input[name="form-name"]');
      const botFieldInput = document.querySelector('input[name="bot-field"]');
      
      expect(formNameInput).toHaveAttribute('type', 'hidden');
      expect(formNameInput).toHaveAttribute('value', 'contact');
      expect(botFieldInput).toHaveAttribute('type', 'hidden');
    });
  });

  describe('Form Functionality', () => {
    it('handles form input changes', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Contact />);
      
      const nameInput = screen.getByLabelText(/your name/i);
      const emailInput = screen.getByLabelText(/your email/i);
      const messageInput = screen.getByLabelText(/your message/i);
      
      await user.type(nameInput, 'John Doe');
      await user.type(emailInput, 'john@example.com');
      await user.type(messageInput, 'Test message');
      
      expect(nameInput).toHaveValue('John Doe');
      expect(emailInput).toHaveValue('john@example.com');
      expect(messageInput).toHaveValue('Test message');
    });

    it('handles form submission successfully', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Contact />);
      
      // Fill form
      await user.type(screen.getByLabelText(/your name/i), 'John Doe');
      await user.type(screen.getByLabelText(/your email/i), 'john@example.com');
      await user.type(screen.getByLabelText(/your message/i), 'Test message');
      
      // Submit form
      const submitButton = screen.getByRole('button', { name: /send message/i });
      await user.click(submitButton);
      
      // Check loading state
      expect(screen.getByText('Sending...')).toBeInTheDocument();
      
      // Wait for success message
      await waitFor(() => {
        expect(screen.getByText(/thank you! your message has been sent successfully/i)).toBeInTheDocument();
      });
    });

    it('handles form submission errors', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));
      
      const user = userEvent.setup();
      renderWithRouter(<Contact />);
      
      // Fill and submit form
      await user.type(screen.getByLabelText(/your name/i), 'John Doe');
      await user.type(screen.getByLabelText(/your email/i), 'john@example.com');
      await user.type(screen.getByLabelText(/your message/i), 'Test message');
      
      const submitButton = screen.getByRole('button', { name: /send message/i });
      await user.click(submitButton);
      
      // Wait for error message
      await waitFor(() => {
        expect(screen.getByText(/sorry, there was an error sending your message/i)).toBeInTheDocument();
      });
    });

    it('clears form after successful submission', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Contact />);
      
      const nameInput = screen.getByLabelText(/your name/i);
      const emailInput = screen.getByLabelText(/your email/i);
      const messageInput = screen.getByLabelText(/your message/i);
      
      // Fill form
      await user.type(nameInput, 'John Doe');
      await user.type(emailInput, 'john@example.com');
      await user.type(messageInput, 'Test message');
      
      // Submit form
      const submitButton = screen.getByRole('button', { name: /send message/i });
      await user.click(submitButton);
      
      // Wait for success and check form is cleared
      await waitFor(() => {
        expect(nameInput).toHaveValue('');
        expect(emailInput).toHaveValue('');
        expect(messageInput).toHaveValue('');
      });
    });
  });

  describe('Contact Information Display', () => {
    it('displays location information', () => {
      renderWithRouter(<Contact />);
      
      expect(screen.getByTestId('mappin-icon')).toBeInTheDocument();
      expect(screen.getByText('Nairobi, Kenya')).toBeInTheDocument();
    });

    it('displays phone information', () => {
      renderWithRouter(<Contact />);
      
      expect(screen.getByTestId('phone-icon')).toBeInTheDocument();
      expect(screen.getByText('+254 701 740 280')).toBeInTheDocument();
    });

    it('displays email information', () => {
      renderWithRouter(<Contact />);
      
      expect(screen.getByTestId('mail-icon')).toBeInTheDocument();
      expect(screen.getByText('kibuguzian@gmail.com')).toBeInTheDocument();
    });

    it('displays social media links', () => {
      renderWithRouter(<Contact />);
      
      const githubLink = screen.getByRole('link', { name: /github/i }) || 
                        document.querySelector('a[href*="github.com"]');
      const linkedinLink = screen.getByRole('link', { name: /linkedin/i }) || 
                          document.querySelector('a[href*="linkedin.com"]');
      
      expect(githubLink).toBeInTheDocument();
      expect(linkedinLink).toBeInTheDocument();
      expect(githubLink).toHaveAttribute('target', '_blank');
      expect(linkedinLink).toHaveAttribute('target', '_blank');
    });
  });

  describe('Map Integration', () => {
    it('renders the ContactMap component', () => {
      renderWithRouter(<Contact />);
      
      const contactMap = screen.getByTestId('contact-map');
      expect(contactMap).toBeInTheDocument();
    });

    it('includes map container', () => {
      renderWithRouter(<Contact />);
      
      const mapContainer = screen.getByTestId('map-container');
      expect(mapContainer).toBeInTheDocument();
    });

    it('shows location marker', () => {
      renderWithRouter(<Contact />);
      
      const locationMarker = screen.getByTestId('location-marker');
      expect(locationMarker).toBeInTheDocument();
      expect(locationMarker).toHaveTextContent('Nairobi, Kenya');
    });
  });

  describe('Accessibility', () => {
    it('has proper form labels', () => {
      renderWithRouter(<Contact />);
      
      expect(screen.getByLabelText(/your name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/your email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/your message/i)).toBeInTheDocument();
    });

    it('has required field validation', () => {
      renderWithRouter(<Contact />);
      
      const nameInput = screen.getByLabelText(/your name/i);
      const emailInput = screen.getByLabelText(/your email/i);
      const messageInput = screen.getByLabelText(/your message/i);
      
      expect(nameInput).toBeRequired();
      expect(emailInput).toBeRequired();
      expect(messageInput).toBeRequired();
    });

    it('has proper link accessibility attributes', () => {
      renderWithRouter(<Contact />);
      
      const externalLinks = document.querySelectorAll('a[target="_blank"]');
      externalLinks.forEach(link => {
        expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      });
    });

    it('provides meaningful form feedback', () => {
      renderWithRouter(<Contact />);
      
      // Check for form placeholders
      expect(screen.getByPlaceholderText('John Doe')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('john@example.com')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Your message here...')).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    it('has responsive grid layout', () => {
      renderWithRouter(<Contact />);
      
      const gridContainer = document.querySelector('.grid.grid-cols-1.lg\\:grid-cols-3');
      expect(gridContainer).toBeInTheDocument();
    });

    it('has responsive contact info layout', () => {
      renderWithRouter(<Contact />);
      
      const contactInfoSection = document.querySelector('.glass.p-8.rounded-lg.space-y-8');
      expect(contactInfoSection).toBeInTheDocument();
    });

    it('has responsive padding classes', () => {
      renderWithRouter(<Contact />);
      
      const container = document.querySelector('.px-6.sm\\:px-8.lg\\:px-10');
      expect(container).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('renders without throwing errors', () => {
      expect(() => {
        renderWithRouter(<Contact />);
      }).not.toThrow();
    });

    it('handles multiple form submissions gracefully', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Contact />);
      
      const submitButton = screen.getByRole('button', { name: /send message/i });
      
      // First submission
      await user.click(submitButton);
      expect(submitButton).toBeDisabled();
      
      // Wait for completion
      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });
      
      // Second submission should work
      await user.click(submitButton);
      expect(submitButton).toBeDisabled();
    });
  });
});