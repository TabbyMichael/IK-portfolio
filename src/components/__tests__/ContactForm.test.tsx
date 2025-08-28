import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ContactForm from '../contact/ContactForm';

// Mock analytics
import * as analytics from '../../utils/analytics';
jest.mock('../../utils/analytics', () => ({
  trackFormSubmission: jest.fn(),
}));

describe('ContactForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all form fields', () => {
    render(<ContactForm />);

    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/subject/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<ContactForm />);

    const form = screen.getByRole('form', { name: /contact form/i });
    expect(form).toBeInTheDocument();
    expect(form).toHaveAttribute('noValidate');

    // Check for required field indicators
    const requiredFields = screen.getAllByText('*');
    expect(requiredFields.length).toBeGreaterThan(0);

    // Check for form description
    expect(screen.getByText(/contact form with name, email, subject, and message fields/i)).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    const submitButton = screen.getByRole('button', { name: /send message/i });
    
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/subject is required/i)).toBeInTheDocument();
      expect(screen.getByText(/message is required/i)).toBeInTheDocument();
    });
  });

  it('validates email format', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    const emailInput = screen.getByLabelText(/email address/i);
    
    await user.type(emailInput, 'invalid-email');
    await user.tab(); // Trigger onBlur validation

    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
    });
  });

  it('validates minimum field lengths', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    const nameInput = screen.getByLabelText(/full name/i);
    const messageInput = screen.getByLabelText(/message/i);
    
    await user.type(nameInput, 'A');
    await user.type(messageInput, 'Short');
    await user.tab();

    await waitFor(() => {
      expect(screen.getByText(/name must be at least 2 characters/i)).toBeInTheDocument();
      expect(screen.getByText(/message must be at least 10 characters/i)).toBeInTheDocument();
    });
  });

  it('shows loading state during submission', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    // Fill out the form
    await user.type(screen.getByLabelText(/full name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email address/i), 'john@example.com');
    await user.type(screen.getByLabelText(/subject/i), 'Test Subject');
    await user.type(screen.getByLabelText(/message/i), 'This is a test message that is long enough');

    const submitButton = screen.getByRole('button', { name: /send message/i });
    await user.click(submitButton);

    // Should show loading state
    await waitFor(() => {
      expect(screen.getByText(/sending/i)).toBeInTheDocument();
      expect(submitButton).toBeDisabled();
    });
  });

  it('shows success message after successful submission', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    // Fill out the form
    await user.type(screen.getByLabelText(/full name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email address/i), 'john@example.com');
    await user.type(screen.getByLabelText(/subject/i), 'Test Subject');
    await user.type(screen.getByLabelText(/message/i), 'This is a test message that is long enough');

    await user.click(screen.getByRole('button', { name: /send message/i }));

    await waitFor(() => {
      expect(screen.getByText(/thank you! your message has been sent successfully/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('provides visual feedback for field validation', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    const nameInput = screen.getByLabelText(/full name/i);
    
    // Type valid input
    await user.type(nameInput, 'John Doe');
    await user.tab();

    await waitFor(() => {
      expect(nameInput).toHaveClass('border-green-500');
    });

    // Clear input to make it invalid
    await user.clear(nameInput);
    await user.tab();

    await waitFor(() => {
      expect(nameInput).toHaveClass('border-red-500');
    });
  });

  it('includes honeypot field for spam protection', () => {
    render(<ContactForm />);

    const honeypotField = screen.getByLabelText(/don't fill this field/i);
    expect(honeypotField).toBeInTheDocument();
    expect(honeypotField).toHaveAttribute('tabIndex', '-1');
    expect(honeypotField.closest('div')).toHaveClass('hidden');
  });

  it('prevents submission when honeypot is filled', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    // Fill honeypot field (simulating spam)
    const honeypotField = screen.getByLabelText(/don't fill this field/i);
    await user.type(honeypotField, 'spam content');

    // Fill out other fields
    await user.type(screen.getByLabelText(/full name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email address/i), 'john@example.com');
    await user.type(screen.getByLabelText(/subject/i), 'Test Subject');
    await user.type(screen.getByLabelText(/message/i), 'This is a test message');

    await user.click(screen.getByRole('button', { name: /send message/i }));

    // Should not submit successfully
    await waitFor(() => {
      expect(screen.getByText(/error sending your message/i)).toBeInTheDocument();
    });
  });

  it('has proper ARIA live regions for status updates', () => {
    render(<ContactForm />);

    const liveRegion = screen.getByRole('status');
    expect(liveRegion).toBeInTheDocument();
    expect(liveRegion).toHaveAttribute('aria-live', 'polite');
    expect(liveRegion).toHaveAttribute('aria-atomic', 'true');
  });

  it('tracks form submission analytics', async () => {
    const trackFormSubmissionSpy = jest.spyOn(analytics, 'trackFormSubmission').mockImplementation(() => {});
    const user = userEvent.setup();
    render(<ContactForm />);

    // Fill out and submit form with valid data (no honeypot)
    await user.type(screen.getByLabelText(/full name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email address/i), 'john@example.com');
    await user.type(screen.getByLabelText(/subject/i), 'Test Subject');
    await user.type(screen.getByLabelText(/message/i), 'This is a test message that is long enough');

    await user.click(screen.getByRole('button', { name: /send message/i }));

    // Wait for form submission to complete and success state
    await waitFor(() => {
      expect(screen.getByText(/thank you! your message has been sent successfully/i)).toBeInTheDocument();
    }, { timeout: 3000 });

    // Verify analytics was called with success=true
    await waitFor(() => {
      expect(trackFormSubmissionSpy).toHaveBeenCalledWith('Contact Form', true);
    });

    trackFormSubmissionSpy.mockRestore();
  });

  it('resets form after successful submission', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    const nameInput = screen.getByLabelText(/full name/i) as HTMLInputElement;
    const emailInput = screen.getByLabelText(/email address/i) as HTMLInputElement;

    // Fill out form
    await user.type(nameInput, 'John Doe');
    await user.type(emailInput, 'john@example.com');
    await user.type(screen.getByLabelText(/subject/i), 'Test Subject');
    await user.type(screen.getByLabelText(/message/i), 'This is a test message that is long enough');

    await user.click(screen.getByRole('button', { name: /send message/i }));

    // Wait for success and form reset
    await waitFor(() => {
      expect(nameInput.value).toBe('');
      expect(emailInput.value).toBe('');
    }, { timeout: 3000 });
  });
});