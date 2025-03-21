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
        {/* Outer circle */}
        <circle cx="100" cy="100" r="80" fill="none" stroke="url(#gradient)" strokeWidth="2" opacity="0.3" />
        
        {/* Inner circles */}
        <motion.circle
          cx="100"
          cy="100"
          r="60"
          fill="none"
          stroke="url(#gradient)"
          strokeWidth="1"
          opacity="0.2"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.2, delay: 0.3 }}
        />
        
        {/* Sound waves with glow effect */}
        <motion.path
          d="M70,100 Q85,70 100,100 Q115,130 130,100"
          stroke="url(#gradient)"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          filter="url(#glow)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
        
        <motion.path
          d="M60,100 Q85,50 100,100 Q115,150 140,100"
          stroke="url(#gradient)"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
          filter="url(#glow)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, delay: 0.2, ease: "easeInOut" }}
        />
        
        <motion.path
          d="M50,100 Q85,30 100,100 Q115,170 150,100"
          stroke="url(#gradient)"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          filter="url(#glow)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, delay: 0.4, ease: "easeInOut" }}
        />
        
        {/* Dots at wave intersections */}
        <motion.circle
          cx="100"
          cy="100"
          r="4"
          fill="url(#gradient)"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 1.5 }}
        />
      </motion.g>
    </motion.svg>
  );
}