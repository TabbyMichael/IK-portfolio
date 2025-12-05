import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Users, 
  Mail, 
  Calendar, 
  Award, 
  BookOpen,
  MessageCircle,
  TrendingUp,
  Heart,
  Gift
} from 'lucide-react';
import EnhancedNewsletterForm from '../components/Newsletter/EnhancedNewsletterForm';
import NewsletterArchive from '../components/Newsletter/NewsletterArchive';
import CommunityFeatures from '../components/Newsletter/CommunityFeatures';
import ReferralProgram from '../components/Newsletter/ReferralProgram';

type ActiveTab = 'subscribe' | 'archive' | 'community' | 'referral';

const Newsletter: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('subscribe');

  const stats = [
    { value: '2.5K+', label: 'Subscribers', icon: Users, color: 'text-blue-400' },
    { value: '48', label: 'Issues Published', icon: Calendar, color: 'text-green-400' },
    { value: '95%', label: 'Open Rate', icon: Mail, color: 'text-purple-400' },
    { value: '4.9/5', label: 'Reader Rating', icon: Award, color: 'text-accent' }
  ];

  const features = [
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: 'Weekly Insights',
      description: 'Curated content from the developer community, latest trends, and industry news delivered every Monday.'
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: 'Community Driven',
      description: 'Join discussions, share your projects, and connect with fellow developers from top companies.'
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: 'Career Growth',
      description: 'Get tips, opportunities, and resources to advance your development career and skills.'
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: 'Personalized',
      description: 'Choose your interests and frequency. Get content that matters to you most.'
    }
  ];

  const tabs = [
    { id: 'subscribe' as const, label: 'Subscribe', icon: Mail, description: 'Join our community' },
    { id: 'archive' as const, label: 'Archive', icon: BookOpen, description: 'Browse past issues' },
    { id: 'community' as const, label: 'Community', icon: Users, description: 'Connect & engage' },
    { id: 'referral' as const, label: 'Refer & Earn', icon: Gift, description: 'Share & get rewards' }
  ];

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Developer Newsletter Hub
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Stay <span className="text-accent">Connected</span> with Tech
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Join thousands of developers in a thriving community where we share insights, 
            discuss trends, and grow together. Your hub for all things development.
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.1 + index * 0.1 }}
                  className="glass p-6 rounded-2xl text-center"
                >
                  <IconComponent className={`w-8 h-8 mx-auto mb-3 ${stat.color}`} />
                  <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Features Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
                className="glass p-6 rounded-2xl hover:border-accent/30 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-accent/10 rounded-lg text-accent">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold text-white">{feature.title}</h3>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-8"
        >
          <div className="glass p-2 rounded-2xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <motion.button
                    key={tab.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab(tab.id)}
                    className={`p-4 rounded-xl transition-all duration-300 text-left ${
                      isActive
                        ? 'bg-accent text-primary shadow-lg'
                        : 'text-gray-300 hover:text-white hover:bg-primary/50'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <IconComponent className="w-5 h-5" />
                      <span className="font-semibold">{tab.label}</span>
                    </div>
                    <p className={`text-xs ${
                      isActive ? 'text-primary/80' : 'text-gray-400'
                    }`}>
                      {tab.description}
                    </p>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-16"
        >
          {activeTab === 'subscribe' && <EnhancedNewsletterForm />}
          {activeTab === 'archive' && <NewsletterArchive />}
          {activeTab === 'community' && <CommunityFeatures />}
          {activeTab === 'referral' && <ReferralProgram />}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="glass p-8 rounded-3xl text-center"
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Join the Community?
          </h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Connect with developers from top companies like Safaricom, Equity Bank, and Andela. 
            Share knowledge, grow your skills, and advance your career.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab('subscribe')}
              className="px-8 py-3 bg-accent text-primary rounded-xl font-semibold hover:bg-accent/90 transition-colors"
            >
              Join Newsletter
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab('community')}
              className="px-8 py-3 bg-primary/50 text-accent border border-accent/20 rounded-xl font-semibold hover:bg-accent/10 transition-colors"
            >
              Explore Community
            </motion.button>
          </div>
          
          <div className="flex justify-center items-center gap-2 text-sm text-gray-500">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 bg-gradient-to-br from-accent to-accent/60 rounded-full border-2 border-primary"
                />
              ))}
            </div>
            <span>Join 2,547+ developers already in our community</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Newsletter;