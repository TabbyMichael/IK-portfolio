import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: number;
  color?: string;
}

const LoadingSpinner = ({ size = 40, color = '#3B82F6' }: LoadingSpinnerProps) => {
  return (
    <div className="flex items-center justify-center">
      <motion.div
        style={{
          width: size,
          height: size,
          border: `4px solid ${color}`,
          borderBottomColor: 'transparent',
          borderRadius: '50%',
        }}
        animate={{
          rotate: 360
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'linear'
        }}
      />
    </div>
  );
};

export default LoadingSpinner;