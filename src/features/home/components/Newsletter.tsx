import { motion } from 'framer-motion';
import { useState } from 'react';
import { Mail, Send, CheckCircle, AlertCircle, Sparkles, TrendingUp, Code, Zap } from 'lucide-react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Please enter a valid email address');
      return;
    }

    setStatus('loading');
    
    // Simulate API call - replace with actual newsletter service
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setStatus('success');
      setMessage('Welcome aboard! Check your inbox for a confirmation email.');
      setEmail('');
    } catch {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  };

  const features = [
    {
      icon: <Code className="w-5 h-5" />,
      title: 'Code Insights',
      description: 'Latest coding techniques, best practices, and development trends'
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      title: 'Industry Updates',
      description: 'Tech industry news, startup insights, and career opportunities'
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: 'Project Spotlights',
      description: 'Behind-the-scenes look at exciting projects and case studies'
    },
    {
      icon: <Sparkles className="w-5 h-5" />,
      title: 'Exclusive Content',
      description: 'Early access to tutorials, resources, and development tools'
    }
  ];

  const stats = [
    { value: '2.5K+', label: 'Subscribers' },
    { value: '95%', label: 'Open Rate' },
    { value: 'Weekly', label: 'Updates' }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="glass rounded-3xl p-8 md:p-12 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-32 h-32 bg-accent rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-accent rounded-full blur-3xl"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center relative">
          {/* Left Side - Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {/* Badge */}
            <div className="flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium mb-6 w-fit">
              <Sparkles className="w-4 h-4" />
              Developer Insights Newsletter
            </div>

            {/* Heading */}
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Stay Updated with
              <span className="text-accent"> Tech Insights</span>
            </h2>

            {/* Description */}
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Join thousands of developers and tech enthusiasts getting weekly insights, 
              coding tips, and exclusive project updates delivered to your inbox.
            </p>

            {/* Features Grid */}
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex gap-3 items-start"
                >
                  <div className="flex-shrink-0 p-2 bg-accent/10 rounded-lg text-accent">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400 text-xs leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Stats */}
            <div className="flex gap-8 mb-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl font-bold text-accent">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Side - Newsletter Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="glass p-8 rounded-2xl border border-accent/20">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 rounded-2xl mb-4">
                  <Mail className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Subscribe Now
                </h3>
                <p className="text-gray-400">
                  Get weekly updates and exclusive content
                </p>
              </div>

              {/* Status Messages */}
              {status === 'success' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-3 bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-6"
                >
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <p className="text-green-400 text-sm">{message}</p>
                </motion.div>
              )}

              {status === 'error' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6"
                >
                  <AlertCircle className="w-5 h-5 text-red-400" />
                  <p className="text-red-400 text-sm">{message}</p>
                </motion.div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full pl-12 pr-4 py-4 bg-primary/50 border border-accent/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent text-white placeholder-gray-400 transition-all duration-300"
                    disabled={status === 'loading' || status === 'success'}
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={status === 'loading' || status === 'success'}
                  className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                    status === 'success'
                      ? 'bg-green-500/20 text-green-400 cursor-default'
                      : status === 'loading'
                      ? 'bg-accent/20 text-accent/60 cursor-not-allowed'
                      : 'bg-accent text-primary hover:bg-accent/90 hover:shadow-lg hover:shadow-accent/25'
                  }`}
                >
                  {status === 'loading' && (
                    <div className="w-5 h-5 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
                  )}
                  {status === 'success' ? (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Subscribed!
                    </>
                  ) : status === 'loading' ? (
                    'Subscribing...'
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Subscribe Now
                    </>
                  )}
                </motion.button>
              </form>

              {/* Privacy Note */}
              <p className="text-xs text-gray-500 text-center mt-4 leading-relaxed">
                📧 No spam, ever. Unsubscribe anytime with one click.<br />
                Your email is safe and will never be shared.
              </p>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-accent/20 rounded-full animate-pulse"></div>
            <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-accent/30 rounded-full animate-pulse animation-delay-1000"></div>
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12 pt-8 border-t border-gray-700/50"
        >
          <p className="text-gray-400 mb-4">
            Join developers from top companies like{' '}
            <span className="text-accent font-medium">Safaricom</span>,{' '}
            <span className="text-accent font-medium">Equity Bank</span>, and{' '}
            <span className="text-accent font-medium">Andela</span>
          </p>
          <div className="flex justify-center items-center gap-2 text-sm text-gray-500">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 bg-gradient-to-br from-accent to-accent/60 rounded-full border-2 border-primary"
                />
              ))}
            </div>
            <span>+2,547 developers already subscribed</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}