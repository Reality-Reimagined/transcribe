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
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
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
        <circle cx="100" cy="100" r="80" fill="none" stroke="url(#gradient)" strokeWidth="4" opacity="0.2" />
        <circle cx="100" cy="100" r="75" fill="none" stroke="url(#gradient)" strokeWidth="2" />
        
        {/* Hour hand */}
        <motion.line
          x1="100"
          y1="100"
          x2="100"
          y2="50"
          stroke="url(#gradient)"
          strokeWidth="6"
          strokeLinecap="round"
          filter="url(#glow)"
          animate={{ 
            rotate: 360,
            originX: 100,
            originY: 100
          }}
          transition={{ 
            duration: 60,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        {/* Minute hand */}
        <motion.line
          x1="100"
          y1="100"
          x2="140"
          y2="100"
          stroke="url(#gradient)"
          strokeWidth="4"
          strokeLinecap="round"
          filter="url(#glow)"
          animate={{ 
            rotate: 360,
            originX: 100,
            originY: 100
          }}
          transition={{ 
            duration: 10,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        {/* Dots */}
        {[0, 60, 120, 180, 240, 300].map((angle, index) => (
          <motion.circle
            key={angle}
            cx={100 + 65 * Math.cos((angle * Math.PI) / 180)}
            cy={100 + 65 * Math.sin((angle * Math.PI) / 180)}
            r="4"
            fill="url(#gradient)"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: index * 0.2,
            }}
          />
        ))}

        {/* Animated text path */}
        <motion.path
          d="M50,100 A50,50 0 1,1 150,100"
          fill="none"
          stroke="url(#gradient)"
          strokeWidth="2"
          strokeDasharray="314"
          strokeDashoffset="314"
          opacity="0.5"
          animate={{ strokeDashoffset: 0 }}
          transition={{ duration: 2, delay: 1 }}
        />
      </motion.g>
    </motion.svg>
  );
}