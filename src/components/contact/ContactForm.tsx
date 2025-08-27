import React, { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { trackFormSubmission } from '../../utils/analytics';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  honeypot?: string; // Anti-spam field
}

interface FormErrors {
  [key: string]: string;
}

const ContactForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);
  const [submitMessage, setSubmitMessage] = useState('');
  const [liveRegionMessage, setLiveRegionMessage] = useState('');
  
  const formRef = useRef<HTMLFormElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, touchedFields },
    watch,
    setError
  } = useForm<FormData>({
    mode: 'onBlur',
    reValidateMode: 'onChange'
  });

  // Watch form values for real-time feedback
  const watchedValues = watch();

  // Announce status changes to screen readers
  useEffect(() => {
    if (submitStatus) {
      const message = submitStatus === 'success' 
        ? 'Form submitted successfully! Thank you for your message.'
        : 'Form submission failed. Please try again or contact directly.';
      
      setLiveRegionMessage(message);
      
      // Focus status message for screen readers
      setTimeout(() => {
        statusRef.current?.focus();
      }, 100);
    }
  }, [submitStatus]);

  // Custom validation function
  const validateForm = (data: FormData): FormErrors => {
    const errors: FormErrors = {};
    
    // Additional custom validations
    if (data.message && data.message.length < 10) {
      errors.message = 'Message must be at least 10 characters long';
    }
    
    if (data.name && data.name.length < 2) {
      errors.name = 'Name must be at least 2 characters long';
    }
    
    // Check for potential spam
    if (data.honeypot) {
      errors.honeypot = 'Potential spam detected';
    }
    
    return errors;
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setSubmitStatus(null);
    setLiveRegionMessage('Submitting form...');
    
    try {
      // Custom validation
      const validationErrors = validateForm(data);
      if (Object.keys(validationErrors).length > 0) {
        Object.entries(validationErrors).forEach(([field, message]) => {
          setError(field as keyof FormData, { type: 'manual', message });
        });
        throw new Error('Validation failed');
      }

      // Anti-spam check
      if (data.honeypot) {
        console.warn('Spam attempt detected');
        throw new Error('Spam detected');
      }

      // Simulate API call - Replace with actual form submission
      console.log('Form data:', data);
      
      // Here you would integrate with your backend or service like:
      // - Netlify Forms
      // - EmailJS 
      // - Your own API endpoint
      // - Third-party form service
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSubmitStatus('success');
      setSubmitMessage('Thank you! Your message has been sent successfully. I\'ll get back to you soon.');
      trackFormSubmission('Contact Form', true);
      reset();
      
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
      setSubmitMessage('Sorry, there was an error sending your message. Please try again or contact me directly at kibuguzian@gmail.com');
      trackFormSubmission('Contact Form', false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get field error message
  const getFieldError = (fieldName: keyof FormData) => {
    return errors[fieldName]?.message || '';
  };

  // Check if field has error
  const hasFieldError = (fieldName: keyof FormData) => {
    return !!errors[fieldName];
  };

  // Get field validation state classes
  const getFieldClasses = (fieldName: keyof FormData, baseClasses: string) => {
    const hasError = hasFieldError(fieldName);
    const isTouched = touchedFields[fieldName];
    const hasValue = watchedValues[fieldName];
    
    let classes = baseClasses;
    
    if (hasError) {
      classes += ' border-red-500 focus:border-red-500 focus:ring-red-500';
    } else if (isTouched && hasValue && !hasError) {
      classes += ' border-green-500 focus:border-green-500 focus:ring-green-500';
    } else {
      classes += ' border-gray-300 focus:border-blue-500 focus:ring-blue-500';
    }
    
    return classes;
  };

  return (
    <div className="max-w-lg mx-auto">
      {/* Live region for screen reader announcements */}
      <div 
        aria-live="polite" 
        aria-atomic="true" 
        className="sr-only"
        role="status"
      >
        {liveRegionMessage}
      </div>

      <form 
        ref={formRef}
        onSubmit={handleSubmit(onSubmit)} 
        className="space-y-6"
        noValidate
        aria-describedby="form-description"
      >
        {/* Form description for screen readers */}
        <div id="form-description" className="sr-only">
          Contact form with name, email, subject, and message fields. All fields are required.
        </div>

        {/* Honeypot field for spam protection */}
        <div className="hidden" aria-hidden="true">
          <label htmlFor="honeypot">Don't fill this field:</label>
          <input
            type="text"
            id="honeypot"
            {...register('honeypot')}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>
        {/* Name Field */}
        <div>
          <label 
            htmlFor="name" 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Full Name <span className="text-red-500" aria-label="required">*</span>
          </label>
          <input
            type="text"
            id="name"
            autoComplete="name"
            {...register('name', { 
              required: 'Full name is required',
              minLength: {
                value: 2,
                message: 'Name must be at least 2 characters'
              },
              pattern: {
                value: /^[a-zA-Z\s'-]+$/,
                message: 'Please enter a valid name'
              }
            })}
            className={getFieldClasses('name', 'mt-1 block w-full rounded-md shadow-sm transition-colors duration-200 px-3 py-2')}
            aria-invalid={hasFieldError('name')}
            aria-describedby={hasFieldError('name') ? 'name-error' : 'name-help'}
            placeholder="Enter your full name"
          />
          <div id="name-help" className="mt-1 text-xs text-gray-500">
            Your full name as you'd like to be addressed
          </div>
          {hasFieldError('name') && (
            <div 
              id="name-error" 
              className="mt-1 flex items-center text-sm text-red-600"
              role="alert"
              aria-live="polite"
            >
              <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0" aria-hidden="true" />
              {getFieldError('name')}
            </div>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label 
            htmlFor="email" 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email Address <span className="text-red-500" aria-label="required">*</span>
          </label>
          <input
            type="email"
            id="email"
            autoComplete="email"
            {...register('email', {
              required: 'Email address is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Please enter a valid email address'
              }
            })}
            className={getFieldClasses('email', 'mt-1 block w-full rounded-md shadow-sm transition-colors duration-200 px-3 py-2')}
            aria-invalid={hasFieldError('email')}
            aria-describedby={hasFieldError('email') ? 'email-error' : 'email-help'}
            placeholder="your.email@example.com"
          />
          <div id="email-help" className="mt-1 text-xs text-gray-500">
            I'll use this to respond to your message
          </div>
          {hasFieldError('email') && (
            <div 
              id="email-error" 
              className="mt-1 flex items-center text-sm text-red-600"
              role="alert"
              aria-live="polite"
            >
              <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0" aria-hidden="true" />
              {getFieldError('email')}
            </div>
          )}
        </div>

        {/* Subject Field */}
        <div>
          <label 
            htmlFor="subject" 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Subject <span className="text-red-500" aria-label="required">*</span>
          </label>
          <input
            type="text"
            id="subject"
            autoComplete="off"
            {...register('subject', { 
              required: 'Subject is required',
              minLength: {
                value: 3,
                message: 'Subject must be at least 3 characters'
              }
            })}
            className={getFieldClasses('subject', 'mt-1 block w-full rounded-md shadow-sm transition-colors duration-200 px-3 py-2')}
            aria-invalid={hasFieldError('subject')}
            aria-describedby={hasFieldError('subject') ? 'subject-error' : 'subject-help'}
            placeholder="Brief description of your inquiry"
          />
          <div id="subject-help" className="mt-1 text-xs text-gray-500">
            A brief summary of what you'd like to discuss
          </div>
          {hasFieldError('subject') && (
            <div 
              id="subject-error" 
              className="mt-1 flex items-center text-sm text-red-600"
              role="alert"
              aria-live="polite"
            >
              <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0" aria-hidden="true" />
              {getFieldError('subject')}
            </div>
          )}
        </div>

        {/* Message Field */}
        <div>
          <label 
            htmlFor="message" 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Message <span className="text-red-500" aria-label="required">*</span>
          </label>
          <textarea
            id="message"
            rows={5}
            {...register('message', { 
              required: 'Message is required',
              minLength: {
                value: 10,
                message: 'Message must be at least 10 characters'
              },
              maxLength: {
                value: 1000,
                message: 'Message must be less than 1000 characters'
              }
            })}
            className={getFieldClasses('message', 'mt-1 block w-full rounded-md shadow-sm transition-colors duration-200 px-3 py-2 resize-y min-h-[120px]')}
            aria-invalid={hasFieldError('message')}
            aria-describedby={hasFieldError('message') ? 'message-error' : 'message-help'}
            placeholder="Tell me about your project, questions, or how I can help you..."
          />
          <div id="message-help" className="mt-1 text-xs text-gray-500 flex justify-between">
            <span>Share details about your project or inquiry</span>
            <span 
              className={`${
                watchedValues.message && watchedValues.message.length > 900 
                  ? 'text-orange-600' 
                  : 'text-gray-400'
              }`}
            >
              {watchedValues.message?.length || 0}/1000
            </span>
          </div>
          {hasFieldError('message') && (
            <div 
              id="message-error" 
              className="mt-1 flex items-center text-sm text-red-600"
              role="alert"
              aria-live="polite"
            >
              <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0" aria-hidden="true" />
              {getFieldError('message')}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={isSubmitting || !isValid}
            className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              isSubmitting || !isValid
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 active:bg-blue-800'
            }`}
            aria-describedby="submit-help"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" aria-hidden="true" />
                <span>Sending Message...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" aria-hidden="true" />
                <span>Send Message</span>
              </>
            )}
          </button>
          <div id="submit-help" className="mt-2 text-xs text-gray-500 text-center">
            {!isValid && Object.keys(errors).length > 0 ? (
              <span className="text-red-600">
                Please fix the errors above before submitting
              </span>
            ) : (
              "I'll respond within 24 hours"
            )}
          </div>
        </div>
      </form>

      {/* Status Messages */}
      {submitStatus && (
        <div 
          ref={statusRef}
          className={`mt-6 p-4 rounded-md flex items-start space-x-3 ${
            submitStatus === 'success' 
              ? 'bg-green-100 border border-green-200' 
              : 'bg-red-100 border border-red-200'
          }`}
          role="alert"
          aria-live="assertive"
          tabIndex={-1}
        >
          {submitStatus === 'success' ? (
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
          )}
          <div>
            <h3 className={`text-sm font-medium ${
              submitStatus === 'success' ? 'text-green-800' : 'text-red-800'
            }`}>
              {submitStatus === 'success' ? 'Message Sent!' : 'Error Sending Message'}
            </h3>
            <p className={`mt-1 text-sm ${
              submitStatus === 'success' ? 'text-green-700' : 'text-red-700'
            }`}>
              {submitMessage}
            </p>
            {submitStatus === 'error' && (
              <div className="mt-2">
                <p className="text-xs text-red-600">
                  Alternative: Email me directly at{' '}
                  <a 
                    href="mailto:kibuguzian@gmail.com" 
                    className="underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded"
                  >
                    kibuguzian@gmail.com
                  </a>
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactForm;