import React from 'react';
import { motion } from 'framer-motion';

interface LogoProps {
  className?: string;
}

export function Logo({ className = "w-24 h-24" }: LogoProps) {
  return (
    <motion.svg
      className={className}
      viewBox="0 0 200 200"
      initial="hidden"
      animate="visible"
    >
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4F46E5" />
          <stop offset="50%" stopColor="#9333EA" />
          <stop offset="100%" stopColor="#EC4899" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      <motion.g
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        {/* Clock face */}
        <circle cx="100" cy="100" r="80" fill="none" stroke="url(#gradient)" strokeWidth="4" />
        
        {/* Hour marks */}
        {[...Array(12)].map((_, i) => {
          const angle = (i * 30) * Math.PI / 180;
          const x1 = 100 + 70 * Math.sin(angle);
          const y1 = 100 - 70 * Math.cos(angle);
          const x2 = 100 + 80 * Math.sin(angle);
          const y2 = 100 - 80 * Math.cos(angle);
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="url(#gradient)"
              strokeWidth="2"
              opacity="0.6"
            />
          );
        })}
        
        {/* Sound wave overlay */}
        <motion.path
          d="M70,100 Q85,70 100,100 Q115,130 130,100"
          stroke="url(#gradient)"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          filter="url(#glow)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
        
        {/* Clock hands */}
        <motion.line
          x1="100"
          y1="100"
          x2="100"
          y2="40"
          stroke="url(#gradient)"
          strokeWidth="4"
          strokeLinecap="round"
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: '100px 100px' }}
        />
        
        <motion.line
          x1="100"
          y1="100"
          x2="140"
          y2="100"
          stroke="url(#gradient)"
          strokeWidth="4"
          strokeLinecap="round"
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: '100px 100px' }}
        />
        
        {/* Center dot */}
        <circle cx="100" cy="100" r="6" fill="url(#gradient)" />
      </motion.g>
    </motion.svg>
  );
}