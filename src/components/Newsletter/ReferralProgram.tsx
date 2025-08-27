import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Gift,
  Share2,
  Copy,
  CheckCircle,
  Users,
  Trophy,
  Star,
  Facebook,
  Twitter,
  Linkedin,
  MessageCircle,
  Mail,
  Link as LinkIcon
} from 'lucide-react';

interface ReferralReward {
  id: number;
  name: string;
  description: string;
  requiredReferrals: number;
  icon: React.ComponentType<{ className?: string }>;
  claimed: boolean;
  value: string;
}

interface ReferralStats {
  totalReferrals: number;
  successfulReferrals: number;
  pendingReferrals: number;
  totalRewardsEarned: number;
}

const rewards: ReferralReward[] = [
  {
    id: 1,
    name: "Early Access",
    description: "Get exclusive early access to new tutorials and resources",
    requiredReferrals: 1,
    icon: Star,
    claimed: false,
    value: "Exclusive Content"
  },
  {
    id: 2,
    name: "Dev Tools Bundle",
    description: "Curated collection of premium development tools and resources",
    requiredReferrals: 3,
    icon: Gift,
    claimed: false,
    value: "$50 Value"
  },
  {
    id: 3,
    name: "1-on-1 Code Review",
    description: "Personal code review session with industry experts",
    requiredReferrals: 5,
    icon: Users,
    claimed: false,
    value: "$100 Value"
  },
  {
    id: 4,
    name: "Beta Tester Badge",
    description: "Become a beta tester for new features and projects",
    requiredReferrals: 10,
    icon: Trophy,
    claimed: false,
    value: "VIP Access"
  }
];

const mockStats: ReferralStats = {
  totalReferrals: 7,
  successfulReferrals: 5,
  pendingReferrals: 2,
  totalRewardsEarned: 2
};

export default function ReferralProgram() {
  const [referralCode] = useState('IK-DEV-2024');
  const [copied, setCopied] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  const referralLink = `https://ik-portfolio.netlify.app/news?ref=${referralCode}`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLinks = [
    {
      name: 'Twitter',
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?text=Check out this amazing developer newsletter! Join thousands of developers getting weekly insights.&url=${encodeURIComponent(referralLink)}`,
      color: 'text-blue-400'
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralLink)}`,
      color: 'text-blue-600'
    },
    {
      name: 'Facebook',
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`,
      color: 'text-blue-500'
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      url: `https://wa.me/?text=Check out this developer newsletter: ${encodeURIComponent(referralLink)}`,
      color: 'text-green-500'
    },
    {
      name: 'Email',
      icon: Mail,
      url: `mailto:?subject=Check out this Developer Newsletter&body=I thought you might be interested in this newsletter: ${encodeURIComponent(referralLink)}`,
      color: 'text-gray-400'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium mb-4">
          <Gift className="w-4 h-4" />
          Referral Program
        </div>
        <h2 className="text-3xl font-bold text-white mb-4">
          Share & Earn <span className="text-accent">Rewards</span>
        </h2>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Invite fellow developers to join our community and unlock exclusive rewards. 
          The more you share, the more you earn!
        </p>
      </motion.div>

      {/* Stats Dashboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass p-6 rounded-2xl"
      >
        <h3 className="text-xl font-bold text-white mb-4">Your Referral Stats</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-primary/30 rounded-xl">
            <div className="text-2xl font-bold text-accent">{mockStats.totalReferrals}</div>
            <div className="text-sm text-gray-400">Total Sent</div>
          </div>
          <div className="text-center p-4 bg-primary/30 rounded-xl">
            <div className="text-2xl font-bold text-green-400">{mockStats.successfulReferrals}</div>
            <div className="text-sm text-gray-400">Successful</div>
          </div>
          <div className="text-center p-4 bg-primary/30 rounded-xl">
            <div className="text-2xl font-bold text-yellow-400">{mockStats.pendingReferrals}</div>
            <div className="text-sm text-gray-400">Pending</div>
          </div>
          <div className="text-center p-4 bg-primary/30 rounded-xl">
            <div className="text-2xl font-bold text-purple-400">{mockStats.totalRewardsEarned}</div>
            <div className="text-sm text-gray-400">Rewards Earned</div>
          </div>
        </div>
      </motion.div>

      {/* Referral Link */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass p-6 rounded-2xl"
      >
        <h3 className="text-xl font-bold text-white mb-4">Your Referral Link</h3>
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={referralLink}
              readOnly
              className="w-full pl-10 pr-4 py-3 bg-primary/50 border border-accent/20 rounded-xl text-white text-sm"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => copyToClipboard(referralLink)}
            className="px-6 py-3 bg-accent text-primary rounded-xl font-medium hover:bg-accent/90 transition-colors flex items-center gap-2"
          >
            {copied ? (
              <>
                <CheckCircle className="w-4 h-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy
              </>
            )}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShareModalOpen(true)}
            className="px-6 py-3 bg-primary border border-accent/20 text-accent rounded-xl font-medium hover:bg-accent/10 transition-colors flex items-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            Share
          </motion.button>
        </div>
      </motion.div>

      {/* Rewards Tiers */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass p-6 rounded-2xl"
      >
        <h3 className="text-xl font-bold text-white mb-6">Unlock Rewards</h3>
        <div className="space-y-4">
          {rewards.map((reward, index) => {
            const IconComponent = reward.icon;
            const isUnlocked = mockStats.successfulReferrals >= reward.requiredReferrals;
            const progress = Math.min((mockStats.successfulReferrals / reward.requiredReferrals) * 100, 100);
            
            return (
              <motion.div
                key={reward.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                  isUnlocked
                    ? 'border-accent bg-accent/10'
                    : 'border-gray-700 bg-primary/30'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${
                    isUnlocked ? 'bg-accent/20 text-accent' : 'bg-gray-700/50 text-gray-400'
                  }`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className={`font-semibold ${
                          isUnlocked ? 'text-accent' : 'text-white'
                        }`}>
                          {reward.name}
                        </h4>
                        <p className="text-gray-400 text-sm">{reward.description}</p>
                      </div>
                      <div className="text-right">
                        <div className={`text-sm font-medium ${
                          isUnlocked ? 'text-accent' : 'text-gray-400'
                        }`}>
                          {reward.value}
                        </div>
                        {isUnlocked && (
                          <div className="text-xs text-green-400 flex items-center gap-1 mt-1">
                            <CheckCircle className="w-3 h-3" />
                            Unlocked
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">
                          {mockStats.successfulReferrals} / {reward.requiredReferrals} referrals
                        </span>
                        <span className={isUnlocked ? 'text-accent' : 'text-gray-400'}>
                          {Math.round(progress)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            isUnlocked ? 'bg-accent' : 'bg-gray-600'
                          }`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Share Modal */}
      {shareModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShareModalOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass p-6 rounded-2xl max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-white mb-4">Share Your Referral Link</h3>
            <div className="grid grid-cols-3 gap-3 mb-6">
              {shareLinks.map((platform) => {
                const IconComponent = platform.icon;
                return (
                  <motion.a
                    key={platform.name}
                    href={platform.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex flex-col items-center gap-2 p-4 bg-primary/30 rounded-xl hover:bg-primary/40 transition-colors"
                  >
                    <IconComponent className={`w-6 h-6 ${platform.color}`} />
                    <span className="text-xs text-gray-400">{platform.name}</span>
                  </motion.a>
                );
              })}
            </div>
            <button
              onClick={() => setShareModalOpen(false)}
              className="w-full py-2 text-gray-400 hover:text-white transition-colors"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}