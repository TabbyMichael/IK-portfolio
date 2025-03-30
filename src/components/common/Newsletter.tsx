import React, { useState } from 'react';
import { event } from '../../utils/analytics';

const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      // TODO: Implement actual newsletter subscription logic
      // This is a mock implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      event({
        action: 'newsletter_subscribe',
        category: 'engagement',
        label: 'Newsletter Subscription',
      });

      setStatus('success');
      setMessage('Thank you for subscribing! You\'ll receive our latest updates soon.');
      setEmail('');
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      setStatus('error');
      setMessage('Something went wrong. Please try again later.');
    }
  };

  return (
    <section className="bg-blue-900 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Stay Updated
          </h2>
          <p className="mt-4 text-xl text-blue-100">
            Subscribe to receive insights about technology, development, and industry trends
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 sm:flex justify-center max-w-2xl mx-auto"
        >
          <div className="min-w-0 flex-1">
            <label htmlFor="email" className="sr-only">
              Email address
            </label>
            <input
              id="email"
              type="email"
              required
              className="block w-full px-4 py-3 rounded-md border-0 text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === 'loading'}
            />
          </div>
          <div className="mt-3 sm:mt-0 sm:ml-3">
            <button
              type="submit"
              disabled={status === 'loading'}
              className="block w-full rounded-md px-4 py-3 border border-transparent text-base font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-700 sm:px-10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
            </button>
          </div>
        </form>

        {message && (
          <div className={`mt-4 text-center ${status === 'success' ? 'text-green-400' : 'text-red-400'}`}>
            {message}
          </div>
        )}
      </div>
    </section>
  );
};

export default Newsletter;