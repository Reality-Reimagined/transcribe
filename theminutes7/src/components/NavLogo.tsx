import React from 'react';
import { motion } from 'framer-motion';

export function NavLogo() {
  return (
    <div className="flex items-center gap-2">
      <motion.svg
        width="32"
        height="32"
        viewBox="0 0 100 100"
        initial="hidden"
        animate="visible"
      >
        <defs>
          <linearGradient id="navGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4F46E5" />
            <stop offset="50%" stopColor="#9333EA" />
            <stop offset="100%" stopColor="#EC4899" />
          </linearGradient>
          <filter id="navGlow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feDropShadow dx="0" dy="0" stdDeviation="1" floodColor="#9333EA" floodOpacity="0.3"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Clock face */}
        <motion.circle 
          cx="50" 
          cy="50" 
          r="40" 
          fill="none" 
          stroke="url(#navGradient)" 
          strokeWidth="4"
          filter="url(#navGlow)"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        />
        
        {/* Center dot */}
        <motion.circle
          cx="50"
          cy="50"
          r="2"
          fill="url(#navGradient)"
          filter="url(#navGlow)"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, duration: 0.3 }}
        />
        
        {/* Hour hand */}
        <motion.line
          x1="50"
          y1="50"
          x2="50"
          y2="30"
          stroke="url(#navGradient)"
          strokeWidth="3"
          strokeLinecap="round"
          filter="url(#navGlow)"
          animate={{ 
            rotate: 360,
            originX: 50,
            originY: 50
          }}
          transition={{ 
            duration: 60,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        {/* Minute hand */}
        <motion.line
          x1="50"
          y1="50"
          x2="65"
          y2="50"
          stroke="url(#navGradient)"
          strokeWidth="2"
          strokeLinecap="round"
          filter="url(#navGlow)"
          animate={{ 
            rotate: 360,
            originX: 50,
            originY: 50
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
            cx={50 + 35 * Math.cos((angle * Math.PI) / 180)}
            cy={50 + 35 * Math.sin((angle * Math.PI) / 180)}
            r="2"
            fill="url(#navGradient)"
            filter="url(#navGlow)"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0, 1, 0],
              scale: [0.8, 1.2, 0.8]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: index * 0.2,
              ease: "easeInOut"
            }}
          />
        ))}
      </motion.svg>
      
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-2xl font-bold"
      >
        <motion.span 
          className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600"
          whileHover={{ 
            scale: 1.02,
            transition: { 
              type: "spring",
              stiffness: 400,
              damping: 10
            }
          }}
        >
          The Minutes
        </motion.span>
      </motion.div>
    </div>
  );
}


// import React from 'react';
// import { motion } from 'framer-motion';

// export function NavLogo() {
//   return (
//     <div className="flex items-center gap-2">
//       <motion.svg
//         width="32"
//         height="32"
//         viewBox="0 0 100 100"
//         initial="hidden"
//         animate="visible"
//       >
//         <defs>
//           <linearGradient id="navGradient" x1="0%" y1="0%" x2="100%" y2="100%">
//             <stop offset="0%" stopColor="#4F46E5" />
//             <stop offset="50%" stopColor="#9333EA" />
//             <stop offset="100%" stopColor="#EC4899" />
//           </linearGradient>
//           <filter id="navGlow">
//             <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
//             <feMerge>
//               <feMergeNode in="coloredBlur"/>
//               <feMergeNode in="SourceGraphic"/>
//             </feMerge>
//           </filter>
//         </defs>
        
//         {/* Clock face */}
//         <motion.circle 
//           cx="50" 
//           cy="50" 
//           r="40" 
//           fill="none" 
//           stroke="url(#navGradient)" 
//           strokeWidth="4"
//           initial={{ scale: 0.8, opacity: 0 }}
//           animate={{ scale: 1, opacity: 1 }}
//           transition={{ duration: 0.5 }}
//         />
        
//         {/* Hour hand */}
//         <motion.line
//           x1="50"
//           y1="50"
//           x2="50"
//           y2="30"
//           stroke="url(#navGradient)"
//           strokeWidth="3"
//           strokeLinecap="round"
//           filter="url(#navGlow)"
//           animate={{ 
//             rotate: 360,
//             originX: 50,
//             originY: 50
//           }}
//           transition={{ 
//             duration: 60,
//             repeat: Infinity,
//             ease: "linear"
//           }}
//         />
        
//         {/* Minute hand */}
//         <motion.line
//           x1="50"
//           y1="50"
//           x2="65"
//           y2="50"
//           stroke="url(#navGradient)"
//           strokeWidth="2"
//           strokeLinecap="round"
//           filter="url(#navGlow)"
//           animate={{ 
//             rotate: 360,
//             originX: 50,
//             originY: 50
//           }}
//           transition={{ 
//             duration: 10,
//             repeat: Infinity,
//             ease: "linear"
//           }}
//         />

//         {/* Dots */}
//         {[0, 60, 120, 180, 240, 300].map((angle, index) => (
//           <motion.circle
//             key={angle}
//             cx={50 + 35 * Math.cos((angle * Math.PI) / 180)}
//             cy={50 + 35 * Math.sin((angle * Math.PI) / 180)}
//             r="2"
//             fill="url(#navGradient)"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: [0, 1, 0] }}
//             transition={{
//               duration: 2,
//               repeat: Infinity,
//               delay: index * 0.2,
//             }}
//           />
//         ))}
//       </motion.svg>
      
//       <motion.div
//         initial={{ opacity: 0, x: -20 }}
//         animate={{ opacity: 1, x: 0 }}
//         transition={{ duration: 0.5 }}
//         className="text-2xl font-bold"
//       >
//         <motion.span 
//           className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600"
//           whileHover={{ scale: 1.05 }}
//           transition={{ type: "spring", stiffness: 300 }}
//         >
//           The Minutes
//         </motion.span>
//       </motion.div>
//     </div>
//   );
// }