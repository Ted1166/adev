import { motion } from 'framer-motion';

interface AdevLogoProps {
  size?: number;
  animate?: boolean;
  className?: string;
}

export function AdevLogo({ size = 40, animate = false, className = '' }: AdevLogoProps) {
  const pathVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: { duration: 1.5, ease: "easeInOut" }
    }
  };

  const dotVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { delay: 1, duration: 0.5 }
    }
  };

  const lineVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 0.5,
      transition: { delay: 0.5, duration: 1 }
    }
  };

  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 200 200" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="hexGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#10b981', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#3b82f6', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      
      {/* Outer Hexagon */}
      {animate ? (
        <motion.polygon
          points="100,30 130,50 130,90 100,110 70,90 70,50"
          stroke="url(#hexGradient)"
          strokeWidth="6"
          fill="none"
          opacity="0.4"
          variants={pathVariants}
          initial="hidden"
          animate="visible"
        />
      ) : (
        <polygon
          points="100,30 130,50 130,90 100,110 70,90 70,50"
          stroke="url(#hexGradient)"
          strokeWidth="6"
          fill="none"
          opacity="0.4"
        />
      )}
      
      {/* Middle Hexagon */}
      {animate ? (
        <motion.polygon
          points="100,60 120,72 120,96 100,108 80,96 80,72"
          stroke="url(#hexGradient)"
          strokeWidth="8"
          fill="none"
          opacity="0.7"
          variants={pathVariants}
          initial="hidden"
          animate="visible"
        />
      ) : (
        <polygon
          points="100,60 120,72 120,96 100,108 80,96 80,72"
          stroke="url(#hexGradient)"
          strokeWidth="8"
          fill="none"
          opacity="0.7"
        />
      )}
      
      {/* Center Circle */}
      {animate ? (
        <motion.circle
          cx="100"
          cy="84"
          r="12"
          fill="url(#hexGradient)"
          variants={dotVariants}
          initial="hidden"
          animate="visible"
        />
      ) : (
        <circle cx="100" cy="84" r="12" fill="url(#hexGradient)" />
      )}
      
      {/* Connection Lines */}
      {animate ? (
        <>
          <motion.line
            x1="100" y1="30" x2="100" y2="60"
            stroke="url(#hexGradient)"
            strokeWidth="3"
            variants={lineVariants}
            initial="hidden"
            animate="visible"
          />
          <motion.line
            x1="130" y1="50" x2="120" y2="72"
            stroke="url(#hexGradient)"
            strokeWidth="3"
            variants={lineVariants}
            initial="hidden"
            animate="visible"
          />
        </>
      ) : (
        <>
          <line x1="100" y1="30" x2="100" y2="60" stroke="url(#hexGradient)" strokeWidth="3" opacity="0.5" />
          <line x1="130" y1="50" x2="120" y2="72" stroke="url(#hexGradient)" strokeWidth="3" opacity="0.5" />
        </>
      )}
    </svg>
  );
}