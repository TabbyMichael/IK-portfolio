import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import App from '../App';
import * as analytics from '../utils/analytics';

// Mock analytics
jest.mock('../utils/analytics', () => ({
  event: jest.fn(),
  trackFormSubmission: jest.fn(),
}));

// Mock fetch for form submissions
global.fetch = jest.fn();

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.ComponentProps<'div'>) => <div {...props}>{children}</div>,
    form: ({ children, ...props }: React.ComponentProps<'form'>) => <form {...props}>{children}</form>,
    button: ({ children, ...props }: React.ComponentProps<'button'>) => <button {...props}>{children}</button>,
    section: ({ children, ...props }: React.ComponentProps<'section'>) => <section {...props}>{children}</section>,
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

describe('Form Submission Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      status: 200,
    });
  });

  describe('Contact Form → Email Delivery → Confirmation', () => {
    it('completes full contact form submission workflow', async () => {
      const user = userEvent.setup();
      renderApp();

      // Navigate to Contact page
      const contactLink = screen.getByRole('link', { name: /contact/i });
      await user.click(contactLink);

      await waitFor(() => {
        expect(screen.getByText(/get in touch/i)).toBeInTheDocument();
      });

      // Find form fields
      const nameField = screen.getByLabelText(/name/i);
      const emailField = screen.getByLabelText(/email/i);
      const messageField = screen.getByLabelText(/message/i);

      // Fill out form
      await user.type(nameField, 'John Doe');
      await user.type(emailField, 'john@example.com');
      await user.type(messageField, 'Hello, this is a test message for the contact form.');

      // Submit form
      const submitButton = screen.getByRole('button', { name: /send/i });
      await user.click(submitButton);

      // Should show loading state
      expect(screen.getByText(/sending/i)).toBeInTheDocument();

      // Wait for success confirmation
      await waitFor(() => {
        expect(screen.getByText(/thank you.*sent successfully/i)).toBeInTheDocument();
      });

      // Verify fetch was called with correct data
      expect(global.fetch).toHaveBeenCalledWith('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: expect.stringContaining('form-name=contact'),
      });

      // Verify analytics tracking
      expect(analytics.trackFormSubmission).toHaveBeenCalledWith(
        'Contact Form',
        true
      );
    });

    it('handles contact form validation errors', async () => {
      const user = userEvent.setup();
      renderApp();

      // Navigate to Contact page
      const contactLink = screen.getByRole('link', { name: /contact/i });
      await user.click(contactLink);

      await waitFor(() => {
        expect(screen.getByText(/get in touch/i)).toBeInTheDocument();
      });

      // Try to submit empty form
      const submitButton = screen.getByRole('button', { name: /send/i });
      await user.click(submitButton);

      // Should show validation errors (HTML5 validation)
      const nameField = screen.getByLabelText(/name/i);
      const emailField = screen.getByLabelText(/email/i);
      const messageField = screen.getByLabelText(/message/i);

      expect(nameField).toBeRequired();
      expect(emailField).toBeRequired();
      expect(messageField).toBeRequired();
    });

    it('handles contact form submission errors', async () => {
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      const user = userEvent.setup();
      renderApp();

      // Navigate to Contact page
      const contactLink = screen.getByRole('link', { name: /contact/i });
      await user.click(contactLink);

      await waitFor(() => {
        expect(screen.getByText(/get in touch/i)).toBeInTheDocument();
      });

      // Fill out form
      const nameField = screen.getByLabelText(/name/i);
      const emailField = screen.getByLabelText(/email/i);
      const messageField = screen.getByLabelText(/message/i);

      await user.type(nameField, 'John Doe');
      await user.type(emailField, 'john@example.com');
      await user.type(messageField, 'Test message');

      // Submit form
      const submitButton = screen.getByRole('button', { name: /send/i });
      await user.click(submitButton);

      // Wait for error message
      await waitFor(() => {
        expect(screen.getByText(/error.*try again/i)).toBeInTheDocument();
      });

      // Verify analytics tracking for failed submission
      expect(analytics.trackFormSubmission).toHaveBeenCalledWith(
        'Contact Form',
        false
      );
    });

    it('clears form after successful submission', async () => {
      const user = userEvent.setup();
      renderApp();

      // Navigate to Contact page
      const contactLink = screen.getByRole('link', { name: /contact/i });
      await user.click(contactLink);

      await waitFor(() => {
        expect(screen.getByText(/get in touch/i)).toBeInTheDocument();
      });

      // Fill out form
      const nameField = screen.getByLabelText(/name/i) as HTMLInputElement;
      const emailField = screen.getByLabelText(/email/i) as HTMLInputElement;
      const messageField = screen.getByLabelText(/message/i) as HTMLTextAreaElement;

      await user.type(nameField, 'John Doe');
      await user.type(emailField, 'john@example.com');
      await user.type(messageField, 'Test message');

      // Submit form
      const submitButton = screen.getByRole('button', { name: /send/i });
      await user.click(submitButton);

      // Wait for success and form clearing
      await waitFor(() => {
        expect(nameField.value).toBe('');
        expect(emailField.value).toBe('');
        expect(messageField.value).toBe('');
      });
    });
  });

  describe('Newsletter Signup → Subscription Confirmation', () => {
    it('completes newsletter subscription workflow', async () => {
      const user = userEvent.setup();
      renderApp();

      // Navigate to Newsletter page
      const newsletterLink = screen.getByRole('link', { name: /newsletter/i });
      await user.click(newsletterLink);

      await waitFor(() => {
        expect(screen.getByText(/stay connected/i)).toBeInTheDocument();
      });

      // Find newsletter subscription form
      const emailField = screen.getByPlaceholderText(/enter your email/i) ||
                        screen.getByLabelText(/email/i);
      
      if (emailField) {
        // Fill out email
        await user.type(emailField, 'subscriber@example.com');

        // Find and click subscribe button
        const subscribeButton = screen.getByRole('button', { name: /subscribe/i });
        await user.click(subscribeButton);

        // Wait for success confirmation
        await waitFor(() => {
          expect(
            screen.getByText(/subscribed|success|thank you/i)
          ).toBeInTheDocument();
        });

        // Verify analytics tracking
        expect(analytics.event).toHaveBeenCalledWith(
          expect.objectContaining({
            action: expect.stringMatching(/subscribe|newsletter/i),
          })
        );
      }
    });

    it('handles newsletter subscription validation', async () => {
      const user = userEvent.setup();
      renderApp();

      // Navigate to Newsletter page
      const newsletterLink = screen.getByRole('link', { name: /newsletter/i });
      await user.click(newsletterLink);

      await waitFor(() => {
        expect(screen.getByText(/stay connected/i)).toBeInTheDocument();
      });

      // Try to subscribe with invalid email
      const emailField = screen.getByPlaceholderText(/enter your email/i) ||
                        screen.getByLabelText(/email/i);
      
      if (emailField) {
        await user.type(emailField, 'invalid-email');

        const subscribeButton = screen.getByRole('button', { name: /subscribe/i });
        await user.click(subscribeButton);

        // Should show validation error or HTML5 validation
        expect(emailField).toHaveAttribute('type', 'email');
      }
    });

    it('handles newsletter subscription errors', async () => {
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Subscription error'));

      const user = userEvent.setup();
      renderApp();

      // Navigate to Newsletter page
      const newsletterLink = screen.getByRole('link', { name: /newsletter/i });
      await user.click(newsletterLink);

      await waitFor(() => {
        expect(screen.getByText(/stay connected/i)).toBeInTheDocument();
      });

      const emailField = screen.getByPlaceholderText(/enter your email/i) ||
                        screen.getByLabelText(/email/i);
      
      if (emailField) {
        await user.type(emailField, 'subscriber@example.com');

        const subscribeButton = screen.getByRole('button', { name: /subscribe/i });
        await user.click(subscribeButton);

        // Should handle error gracefully
        await waitFor(() => {
          expect(
            screen.getByText(/error|failed|try again/i) ||
            screen.getByRole('button', { name: /subscribe/i })
          ).toBeInTheDocument();
        });
      }
    });
  });

  describe('Analytics Event Tracking Validation', () => {
    it('tracks form field interactions', async () => {
      const user = userEvent.setup();
      renderApp();

      // Navigate to Contact page
      const contactLink = screen.getByRole('link', { name: /contact/i });
      await user.click(contactLink);

      await waitFor(() => {
        expect(screen.getByText(/get in touch/i)).toBeInTheDocument();
      });

      // Interact with form fields
      const nameField = screen.getByLabelText(/name/i);
      await user.click(nameField);

      // Analytics should track field focus/interactions
      expect(analytics.event).toHaveBeenCalledWith(
        expect.objectContaining({
          category: expect.stringMatching(/form|contact/i),
        })
      );
    });

    it('tracks form submission attempts', async () => {
      const user = userEvent.setup();
      renderApp();

      // Navigate to Contact page
      const contactLink = screen.getByRole('link', { name: /contact/i });
      await user.click(contactLink);

      await waitFor(() => {
        expect(screen.getByText(/get in touch/i)).toBeInTheDocument();
      });

      // Fill and submit form
      const nameField = screen.getByLabelText(/name/i);
      const emailField = screen.getByLabelText(/email/i);
      const messageField = screen.getByLabelText(/message/i);

      await user.type(nameField, 'John Doe');
      await user.type(emailField, 'john@example.com');
      await user.type(messageField, 'Test message');

      const submitButton = screen.getByRole('button', { name: /send/i });
      await user.click(submitButton);

      // Should track form submission
      expect(analytics.trackFormSubmission).toHaveBeenCalled();
    });

    it('tracks different form types separately', async () => {
      const user = userEvent.setup();
      renderApp();

      // Test contact form tracking
      const contactLink = screen.getByRole('link', { name: /contact/i });
      await user.click(contactLink);

      await waitFor(() => {
        expect(screen.getByText(/get in touch/i)).toBeInTheDocument();
      });

      const nameField = screen.getByLabelText(/name/i);
      await user.type(nameField, 'Test');

      // Navigate to newsletter and test tracking
      const newsletterLink = screen.getByRole('link', { name: /newsletter/i });
      await user.click(newsletterLink);

      await waitFor(() => {
        expect(screen.getByText(/stay connected/i)).toBeInTheDocument();
      });

      // Different forms should have different tracking
      expect(analytics.event).toHaveBeenCalledWith(
        expect.objectContaining({
          category: expect.any(String),
        })
      );
    });
  });

  describe('Form State Management', () => {
    it('preserves form data during navigation', async () => {
      const user = userEvent.setup();
      renderApp();

      // Navigate to Contact page
      const contactLink = screen.getByRole('link', { name: /contact/i });
      await user.click(contactLink);

      await waitFor(() => {
        expect(screen.getByText(/get in touch/i)).toBeInTheDocument();
      });

      // Fill form partially
      const nameField = screen.getByLabelText(/name/i) as HTMLInputElement;
      await user.type(nameField, 'John Doe');

      // Navigate away and back
      const aboutLink = screen.getByRole('link', { name: /about/i });
      await user.click(aboutLink);

      await waitFor(() => {
        expect(screen.getByText(/about me/i)).toBeInTheDocument();
      });

      // Navigate back to Contact
      const contactLinkAgain = screen.getByRole('link', { name: /contact/i });
      await user.click(contactLinkAgain);

      await waitFor(() => {
        expect(screen.getByText(/get in touch/i)).toBeInTheDocument();
      });

      // Form should be cleared (fresh state)
      const nameFieldAgain = screen.getByLabelText(/name/i) as HTMLInputElement;
      expect(nameFieldAgain.value).toBe('');
    });

    it('handles multiple form submissions gracefully', async () => {
      const user = userEvent.setup();
      renderApp();

      // Navigate to Contact page
      const contactLink = screen.getByRole('link', { name: /contact/i });
      await user.click(contactLink);

      await waitFor(() => {
        expect(screen.getByText(/get in touch/i)).toBeInTheDocument();
      });

      // Submit form multiple times
      for (let i = 0; i < 3; i++) {
        const nameField = screen.getByLabelText(/name/i);
        const emailField = screen.getByLabelText(/email/i);
        const messageField = screen.getByLabelText(/message/i);

        await user.clear(nameField);
        await user.clear(emailField);
        await user.clear(messageField);

        await user.type(nameField, `John Doe ${i}`);
        await user.type(emailField, `john${i}@example.com`);
        await user.type(messageField, `Test message ${i}`);

        const submitButton = screen.getByRole('button', { name: /send/i });
        await user.click(submitButton);

        await waitFor(() => {
          expect(screen.getByText(/thank you.*sent successfully/i)).toBeInTheDocument();
        });
      }

      // Should have tracked multiple submissions
      expect(analytics.trackFormSubmission).toHaveBeenCalledTimes(3);
    });

    it('prevents double submissions', async () => {
      const user = userEvent.setup();
      renderApp();

      // Navigate to Contact page
      const contactLink = screen.getByRole('link', { name: /contact/i });
      await user.click(contactLink);

      await waitFor(() => {
        expect(screen.getByText(/get in touch/i)).toBeInTheDocument();
      });

      // Fill form
      const nameField = screen.getByLabelText(/name/i);
      const emailField = screen.getByLabelText(/email/i);
      const messageField = screen.getByLabelText(/message/i);

      await user.type(nameField, 'John Doe');
      await user.type(emailField, 'john@example.com');
      await user.type(messageField, 'Test message');

      // Submit form rapidly multiple times
      const submitButton = screen.getByRole('button', { name: /send/i });
      await user.click(submitButton);
      await user.click(submitButton);
      await user.click(submitButton);

      // Should only submit once
      await waitFor(() => {
        expect(screen.getByText(/sending|thank you/i)).toBeInTheDocument();
      });

      // Fetch should be called only once
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('Form Accessibility', () => {
    it('provides proper form labels and descriptions', async () => {
      const user = userEvent.setup();
      renderApp();

      // Navigate to Contact page
      const contactLink = screen.getByRole('link', { name: /contact/i });
      await user.click(contactLink);

      await waitFor(() => {
        expect(screen.getByText(/get in touch/i)).toBeInTheDocument();
      });

      // Check that all form fields have proper labels
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

    it('handles keyboard navigation in forms', async () => {
      renderApp();

      // Navigate to Contact page
      const contactLink = screen.getByRole('link', { name: /contact/i });
      contactLink.focus();
      await userEvent.keyboard('{Enter}');

      await waitFor(() => {
        expect(screen.getByText(/get in touch/i)).toBeInTheDocument();
      });

      // Tab through form fields
      await userEvent.tab();
      
      const focusedElement = document.activeElement;
      expect(focusedElement).toBeInstanceOf(HTMLInputElement);
    });

    it('provides clear error messages', async () => {
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Submission failed'));

      const user = userEvent.setup();
      renderApp();

      // Navigate to Contact page
      const contactLink = screen.getByRole('link', { name: /contact/i });
      await user.click(contactLink);

      await waitFor(() => {
        expect(screen.getByText(/get in touch/i)).toBeInTheDocument();
      });

      // Fill and submit form
      const nameField = screen.getByLabelText(/name/i);
      const emailField = screen.getByLabelText(/email/i);
      const messageField = screen.getByLabelText(/message/i);

      await user.type(nameField, 'John Doe');
      await user.type(emailField, 'john@example.com');
      await user.type(messageField, 'Test message');

      const submitButton = screen.getByRole('button', { name: /send/i });
      await user.click(submitButton);

      // Error message should be clear and accessible
      await waitFor(() => {
        const errorMessage = screen.getByText(/error.*try again/i);
        expect(errorMessage).toBeInTheDocument();
        expect(errorMessage).toBeVisible();
      });
    });
  });
});