import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Send,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Bell,
  Settings,
  Shield,
  Zap,
  Clock,
  Users,
  TrendingUp,
  BookOpen,
  Code,
  Award,
  Heart,
  Star,
  Calendar
} from 'lucide-react';

interface SubscriptionPreferences {
  frequency: 'weekly' | 'biweekly' | 'monthly';
  categories: string[];
  emailFormat: 'html' | 'text';
  notifications: {
    newIssues: boolean;
    replies: boolean;
    mentions: boolean;
  };
}

interface Interest {
  id: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  popular?: boolean;
}

const interests: Interest[] = [
  {
    id: 'web-dev',
    label: 'Web Development',
    description: 'Frontend & Backend insights',
    icon: Code,
    popular: true
  },
  {
    id: 'mobile-dev',
    label: 'Mobile Development',
    description: 'React Native, Flutter, Swift',
    icon: Zap
  },
  {
    id: 'industry-news',
    label: 'Industry News',
    description: 'Tech trends & startup updates',
    icon: TrendingUp,
    popular: true
  },
  {
    id: 'tutorials',
    label: 'Tutorials & Guides',
    description: 'Step-by-step learning content',
    icon: BookOpen
  },
  {
    id: 'case-studies',
    label: 'Case Studies',
    description: 'Real-world project breakdowns',
    icon: Award,
    popular: true
  },
  {
    id: 'career',
    label: 'Career Advice',
    description: 'Growth tips & opportunities',
    icon: Users
  }
];

const defaultPreferences: SubscriptionPreferences = {
  frequency: 'weekly',
  categories: [],
  emailFormat: 'html',
  notifications: {
    newIssues: true,
    replies: false,
    mentions: false
  }
};

export default function EnhancedNewsletterForm() {
  const [step, setStep] = useState<'email' | 'preferences' | 'verification' | 'success'>('email');
  const [email, setEmail] = useState('');
  const [preferences, setPreferences] = useState<SubscriptionPreferences>(defaultPreferences);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      setStatus('error');
      setMessage('Please enter a valid email address');
      return;
    }

    setStatus('loading');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStep('preferences');
      setStatus('idle');
    } catch {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  };

  const handlePreferencesSubmit = async () => {
    setStatus('loading');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStep('verification');
      setStatus('idle');
      setResendCooldown(60);
    } catch {
      setStatus('error');
      setMessage('Failed to save preferences. Please try again.');
    }
  };

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!verificationCode || verificationCode.length !== 6) {
      setStatus('error');
      setMessage('Please enter a valid 6-digit verification code');
      return;
    }

    setStatus('loading');

    try {
      // Simulate verification
      await new Promise(resolve => setTimeout(resolve, 1500));
      setStep('success');
      setStatus('success');
      setMessage('Welcome aboard! Your subscription is now active.');
    } catch {
      setStatus('error');
      setMessage('Invalid verification code. Please try again.');
    }
  };

  const resendVerification = async () => {
    if (resendCooldown > 0) return;
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setResendCooldown(60);
      setMessage('Verification code resent!');
    } catch {
      setMessage('Failed to resend code. Please try again.');
    }
  };

  const toggleInterest = (interestId: string) => {
    setPreferences(prev => ({
      ...prev,
      categories: prev.categories.includes(interestId)
        ? prev.categories.filter(id => id !== interestId)
        : [...prev.categories, interestId]
    }));
  };

  const stepIndicator = [
    { step: 'email', label: 'Email', icon: Mail },
    { step: 'preferences', label: 'Preferences', icon: Settings },
    { step: 'verification', label: 'Verify', icon: Shield },
    { step: 'success', label: 'Complete', icon: CheckCircle }
  ];

  const currentStepIndex = stepIndicator.findIndex(s => s.step === step);

  return (
    <div className="max-w-2xl mx-auto">
      {/* Step Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {stepIndicator.map((stepItem, index) => {
            const IconComponent = stepItem.icon;
            const isActive = index === currentStepIndex;
            const isCompleted = index < currentStepIndex;
            
            return (
              <div key={stepItem.step} className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isCompleted 
                    ? 'bg-accent text-primary' 
                    : isActive 
                    ? 'bg-accent text-primary' 
                    : 'bg-gray-700 text-gray-400'
                }`}>
                  <IconComponent className="w-5 h-5" />
                </div>
                <span className={`text-xs mt-2 ${
                  isActive || isCompleted ? 'text-accent' : 'text-gray-400'
                }`}>
                  {stepItem.label}
                </span>
                {index < stepIndicator.length - 1 && (
                  <div className={`hidden sm:block absolute h-0.5 w-20 mt-5 ml-20 ${
                    isCompleted ? 'bg-accent' : 'bg-gray-700'
                  }`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="glass p-8 rounded-3xl">
        <AnimatePresence mode="wait">
          {/* Step 1: Email */}
          {step === 'email' && (
            <motion.div
              key="email"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 rounded-2xl mb-4">
                  <Mail className="w-8 h-8 text-accent" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Join Our Newsletter</h2>
                <p className="text-gray-400">
                  Get weekly insights from the developer community
                </p>
              </div>

              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full pl-12 pr-4 py-4 newsletter-bg newsletter-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent text-white placeholder-gray-400 transition-all duration-300"
                    disabled={status === 'loading'}
                  />
                </div>

                {status === 'error' && (
                  <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                    <AlertCircle className="w-5 h-5 text-red-400" />
                    <p className="text-red-400 text-sm">{message}</p>
                  </div>
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={status === 'loading'}
                  className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                    status === 'loading'
                      ? 'bg-accent/20 text-accent/60 cursor-not-allowed'
                      : 'bg-accent text-primary hover:bg-accent/90 hover:shadow-lg hover:shadow-accent/25'
                  }`}
                >
                  {status === 'loading' ? (
                    <>
                      <div className="w-5 h-5 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Continue
                      <Send className="w-5 h-5" />
                    </>
                  )}
                </motion.button>
              </form>

              <div className="mt-6 flex items-center justify-center gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  2.5K+ subscribers
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4" />
                  4.9/5 rating
                </div>
                <div className="flex items-center gap-1">
                  <Shield className="w-4 h-4" />
                  No spam ever
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Preferences */}
          {step === 'preferences' && (
            <motion.div
              key="preferences"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 rounded-2xl mb-4">
                  <Settings className="w-8 h-8 text-accent" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Customize Your Experience</h2>
                <p className="text-gray-400">
                  Tell us what interests you most
                </p>
              </div>

              <div className="space-y-6">
                {/* Frequency */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-accent" />
                    Email Frequency
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: 'weekly', label: 'Weekly', description: 'Every Monday' },
                      { value: 'biweekly', label: 'Bi-weekly', description: 'Twice a month' },
                      { value: 'monthly', label: 'Monthly', description: 'Once a month' }
                    ].map((option) => (
                      <motion.button
                        key={option.value}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setPreferences(prev => ({ ...prev, frequency: option.value as 'weekly' | 'biweekly' | 'monthly' }))}
                        className={`p-3 rounded-xl border-2 transition-all duration-300 ${
                          preferences.frequency === option.value
                            ? 'border-accent bg-accent/10 text-white'
                            : 'border-gray-700 newsletter-bg newsletter-border text-gray-300 hover:border-accent/50'
                        }`}
                      >
                        <div className="font-medium">{option.label}</div>
                        <div className="text-xs text-gray-400">{option.description}</div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Interests */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <Heart className="w-5 h-5 text-accent" />
                    Your Interests
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {interests.map((interest) => {
                      const IconComponent = interest.icon;
                      const isSelected = preferences.categories.includes(interest.id);
                      return (
                        <motion.button
                          key={interest.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => toggleInterest(interest.id)}
                          className={`p-4 rounded-xl border-2 transition-all duration-300 text-left relative ${
                            isSelected
                              ? 'border-accent bg-accent/10 text-white'
                              : 'border-gray-700 newsletter-bg newsletter-border text-gray-300 hover:border-accent/50'
                          }`}
                        >
                          {interest.popular && (
                            <div className="absolute top-2 right-2">
                              <Sparkles className="w-4 h-4 text-accent" />
                            </div>
                          )}
                          <div className="flex items-start gap-3">
                            <IconComponent className={`w-5 h-5 mt-1 ${
                              isSelected ? 'text-accent' : 'text-gray-400'
                            }`} />
                            <div>
                              <div className="font-medium">{interest.label}</div>
                              <div className="text-sm text-gray-400">{interest.description}</div>
                            </div>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Notifications */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <Bell className="w-5 h-5 text-accent" />
                    Notification Preferences
                  </h3>
                  <div className="space-y-3">
                    {[
                      { key: 'newIssues', label: 'New newsletter issues', description: 'Get notified when new content is published' },
                      { key: 'replies', label: 'Comment replies', description: 'When someone replies to your comments' },
                      { key: 'mentions', label: 'Mentions', description: 'When someone mentions you in discussions' }
                    ].map((notification) => (
                      <div key={notification.key} className="flex items-center justify-between p-3 newsletter-bg newsletter-border rounded-xl">
                        <div>
                          <div className="font-medium text-white">{notification.label}</div>
                          <div className="text-sm text-gray-400">{notification.description}</div>
                        </div>
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setPreferences(prev => ({
                            ...prev,
                            notifications: {
                              ...prev.notifications,
                              [notification.key]: !prev.notifications[notification.key as keyof typeof prev.notifications]
                            }
                          }))}
                          className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${
                            preferences.notifications[notification.key as keyof typeof preferences.notifications]
                              ? 'bg-accent'
                              : 'bg-gray-600'
                          }`}
                        >
                          <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                            preferences.notifications[notification.key as keyof typeof preferences.notifications]
                              ? 'translate-x-6'
                              : 'translate-x-0'
                          }`} />
                        </motion.button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep('email')}
                    className="flex-1 py-3 px-4 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-colors"
                  >
                    Back
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handlePreferencesSubmit}
                    disabled={status === 'loading' || preferences.categories.length === 0}
                    className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                      status === 'loading' || preferences.categories.length === 0
                        ? 'bg-accent/20 text-accent/60 cursor-not-allowed'
                        : 'bg-accent text-primary hover:bg-accent/90'
                    }`}
                  >
                    {status === 'loading' ? (
                      <>
                        <div className="w-5 h-5 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Continue'
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Verification */}
          {step === 'verification' && (
            <motion.div
              key="verification"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 rounded-2xl mb-4">
                  <Shield className="w-8 h-8 text-accent" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Verify Your Email</h2>
                <p className="text-gray-400">
                  We've sent a 6-digit code to <span className="text-accent">{email}</span>
                </p>
              </div>

              <form onSubmit={handleVerification} className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="Enter 6-digit code"
                    className="w-full text-center text-2xl py-4 newsletter-bg newsletter-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent text-white placeholder-gray-400 transition-all duration-300 tracking-widest"
                    disabled={status === 'loading'}
                  />
                </div>

                {status === 'error' && (
                  <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                    <AlertCircle className="w-5 h-5 text-red-400" />
                    <p className="text-red-400 text-sm">{message}</p>
                  </div>
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={status === 'loading' || verificationCode.length !== 6}
                  className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                    status === 'loading' || verificationCode.length !== 6
                      ? 'bg-accent/20 text-accent/60 cursor-not-allowed'
                      : 'bg-accent text-primary hover:bg-accent/90 hover:shadow-lg hover:shadow-accent/25'
                  }`}
                >
                  {status === 'loading' ? (
                    <>
                      <div className="w-5 h-5 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      Verify & Subscribe
                      <CheckCircle className="w-5 h-5" />
                    </>
                  )}
                </motion.button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={resendVerification}
                    disabled={resendCooldown > 0}
                    className={`text-sm ${
                      resendCooldown > 0 
                        ? 'text-gray-500 cursor-not-allowed' 
                        : 'text-accent hover:underline'
                    }`}
                  >
                    {resendCooldown > 0 
                      ? `Resend code in ${resendCooldown}s`
                      : 'Didn\'t receive the code? Resend'
                    }
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* Step 4: Success */}
          {step === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/10 rounded-3xl mb-6">
                <CheckCircle className="w-12 h-12 text-green-400" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">Welcome Aboard! 🎉</h2>
              <p className="text-gray-300 mb-6 max-w-md mx-auto">
                Your subscription is now active. You'll receive your first newsletter based on your preferences.
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                <div className="newsletter-bg newsletter-border p-3 rounded-xl">
                  <Calendar className="w-5 h-5 text-accent mx-auto mb-2" />
                  <div className="text-white font-medium">Next Issue</div>
                  <div className="text-gray-400">Monday, Jan 29</div>
                </div>
                <div className="newsletter-bg newsletter-border p-3 rounded-xl">
                  <Heart className="w-5 h-5 text-red-400 mx-auto mb-2" />
                  <div className="text-white font-medium">Your Interests</div>
                  <div className="text-gray-400">{preferences.categories.length} selected</div>
                </div>
              </div>

              <div className="space-y-3">
                <button className="w-full py-3 bg-accent text-primary rounded-xl font-semibold hover:bg-accent/90 transition-colors">
                  Browse Newsletter Archive
                </button>
                <button className="w-full py-3 newsletter-bg newsletter-border text-accent rounded-xl font-medium hover:bg-accent/10 transition-colors">
                  Share with Friends
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}