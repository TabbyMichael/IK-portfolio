import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Award,
  MessageCircle,
  ThumbsUp,
  Share2,
  Heart,
  ChevronRight,
  CheckCircle,
  BarChart3
} from 'lucide-react';

interface Poll {
  id: number;
  question: string;
  options: Array<{
    text: string;
    votes: number;
    percentage: number;
  }>;
  totalVotes: number;
  isActive: boolean;
  endDate: string;
}

interface CommunityMember {
  id: number;
  name: string;
  title: string;
  company: string;
  avatar: string;
  contribution: string;
  badges: string[];
}

interface Discussion {
  id: number;
  title: string;
  author: string;
  replies: number;
  likes: number;
  lastActivity: string;
  category: string;
}

const activePoll: Poll = {
  id: 1,
  question: "What frontend framework should we cover in our next deep-dive series?",
  options: [
    { text: "Vue.js 3 Composition API", votes: 145, percentage: 35 },
    { text: "Angular 17 Signals", votes: 98, percentage: 24 },
    { text: "Svelte & SvelteKit", votes: 87, percentage: 21 },
    { text: "Next.js 14 App Router", votes: 82, percentage: 20 }
  ],
  totalVotes: 412,
  isActive: true,
  endDate: "2024-02-01"
};

const featuredMembers: CommunityMember[] = [
  {
    id: 1,
    name: "Sarah Chen",
    title: "Senior Frontend Engineer",
    company: "Safaricom",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b5eb?auto=format&fit=crop&w=150&q=80",
    contribution: "Shared amazing insights on React performance optimization",
    badges: ["Top Contributor", "React Expert"]
  },
  {
    id: 2,
    name: "David Kimani",
    title: "Full Stack Developer",
    company: "Equity Bank",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    contribution: "Created comprehensive TypeScript guide for the community",
    badges: ["Community Helper", "TypeScript Guru"]
  },
  {
    id: 3,
    name: "Grace Wanjiku",
    title: "DevOps Engineer",
    company: "Andela",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80",
    contribution: "Led discussion on modern deployment strategies",
    badges: ["Infrastructure Expert", "Mentor"]
  }
];

const recentDiscussions: Discussion[] = [
  {
    id: 1,
    title: "Best practices for handling authentication in React apps",
    author: "Alex M.",
    replies: 23,
    likes: 45,
    lastActivity: "2 hours ago",
    category: "Security"
  },
  {
    id: 2,
    title: "Comparison: REST vs GraphQL vs tRPC in 2024",
    author: "Maria K.",
    replies: 18,
    likes: 67,
    lastActivity: "4 hours ago",
    category: "API Design"
  },
  {
    id: 3,
    title: "How to optimize bundle size for production React apps",
    author: "John D.",
    replies: 31,
    likes: 89,
    lastActivity: "6 hours ago",
    category: "Performance"
  }
];

export default function CommunityFeatures() {
  const [selectedPollOption, setSelectedPollOption] = useState<number | null>(null);
  const [hasVoted, setHasVoted] = useState(false);

  const handleVote = (optionIndex: number) => {
    if (!hasVoted) {
      setSelectedPollOption(optionIndex);
      setHasVoted(true);
    }
  };

  return (
    <div className="space-y-8">
      {/* Community Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-6 rounded-2xl"
      >
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <Users className="w-6 h-6 text-accent" />
          Community Insights
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Active Members", value: "2.5K+", icon: Users, color: "text-blue-400" },
            { label: "Discussions", value: "1.2K", icon: MessageCircle, color: "text-green-400" },
            { label: "Projects Shared", value: "485", icon: Share2, color: "text-purple-400" },
            { label: "Knowledge Shared", value: "95%", icon: BarChart3, color: "text-accent" }
          ].map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="text-center p-4 bg-primary/30 rounded-xl">
                <IconComponent className={`w-8 h-8 mx-auto mb-2 ${stat.color}`} />
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Active Poll */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass p-6 rounded-2xl"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">Community Poll</h3>
          <span className="text-sm text-accent">Active until {new Date(activePoll.endDate).toLocaleDateString()}</span>
        </div>
        
        <p className="text-gray-300 mb-6">{activePoll.question}</p>
        
        <div className="space-y-3">
          {activePoll.options.map((option, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => handleVote(index)}
              disabled={hasVoted}
              className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left relative overflow-hidden ${
                hasVoted && selectedPollOption === index
                  ? 'border-accent bg-accent/10'
                  : hasVoted
                  ? 'border-gray-700 bg-primary/30'
                  : 'border-gray-700 bg-primary/30 hover:border-accent/50'
              }`}
            >
              {hasVoted && (
                <div 
                  className="absolute left-0 top-0 h-full bg-accent/20 transition-all duration-1000"
                  style={{ width: `${option.percentage}%` }}
                />
              )}
              <div className="relative flex items-center justify-between">
                <span className="text-white font-medium">{option.text}</span>
                {hasVoted && (
                  <div className="flex items-center gap-2 text-accent">
                    <span className="text-sm font-bold">{option.percentage}%</span>
                    {selectedPollOption === index && <CheckCircle className="w-4 h-4" />}
                  </div>
                )}
              </div>
            </motion.button>
          ))}
        </div>
        
        {hasVoted && (
          <div className="mt-4 text-center text-gray-400 text-sm">
            Thanks for voting! {activePoll.totalVotes} developers have participated.
          </div>
        )}
      </motion.div>

      {/* Featured Community Members */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass p-6 rounded-2xl"
      >
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Award className="w-5 h-5 text-accent" />
          Community Spotlights
        </h3>
        
        <div className="space-y-4">
          {featuredMembers.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              className="flex items-start gap-4 p-4 bg-primary/30 rounded-xl hover:bg-primary/40 transition-colors"
            >
              <img
                src={member.avatar}
                alt={member.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-white">{member.name}</h4>
                    <p className="text-sm text-gray-400">{member.title} at {member.company}</p>
                  </div>
                  <Heart className="w-5 h-5 text-red-400" />
                </div>
                <p className="text-sm text-gray-300 mt-2">{member.contribution}</p>
                <div className="flex gap-2 mt-2">
                  {member.badges.map((badge) => (
                    <span
                      key={badge}
                      className="px-2 py-1 bg-accent/10 text-accent text-xs rounded-full"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Recent Discussions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass p-6 rounded-2xl"
      >
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-accent" />
          Hot Discussions
        </h3>
        
        <div className="space-y-4">
          {recentDiscussions.map((discussion, index) => (
            <motion.div
              key={discussion.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="flex items-start justify-between p-4 bg-primary/30 rounded-xl hover:bg-primary/40 transition-colors cursor-pointer group"
            >
              <div className="flex-1">
                <h4 className="font-medium text-white group-hover:text-accent transition-colors mb-1">
                  {discussion.title}
                </h4>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span>by {discussion.author}</span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    {discussion.replies} replies
                  </span>
                  <span className="flex items-center gap-1">
                    <ThumbsUp className="w-4 h-4" />
                    {discussion.likes}
                  </span>
                  <span>{discussion.lastActivity}</span>
                </div>
                <span className="inline-block mt-2 px-2 py-1 bg-accent/10 text-accent text-xs rounded-full">
                  {discussion.category}
                </span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-accent transition-colors" />
            </motion.div>
          ))}
        </div>
        
        <button className="w-full mt-4 py-2 text-accent hover:bg-accent/10 rounded-lg transition-colors duration-300 text-sm font-medium">
          View All Discussions →
        </button>
      </motion.div>
    </div>
  );
}