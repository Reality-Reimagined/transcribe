import React from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Languages,
  Clock,
  MessageSquare,
} from 'lucide-react';

interface ProcessingOptionsProps {
  mode: 'transcribe' | 'translate' | 'timestamps' | 'words';
  onModeChange: (mode: 'transcribe' | 'translate' | 'timestamps' | 'words') => void;
  disabled?: boolean;
}

export function ProcessingOptions({
  mode,
  onModeChange,
  disabled = false
}: ProcessingOptionsProps) {
  const options = [
    {
      id: 'transcribe',
      label: 'Transcribe',
      icon: <FileText className="w-5 h-5" />,
      description: 'Convert audio to text'
    },
    {
      id: 'translate',
      label: 'Translate',
      icon: <Languages className="w-5 h-5" />,
      description: 'Translate to English'
    },
    {
      id: 'timestamps',
      label: 'Timestamps',
      icon: <Clock className="w-5 h-5" />,
      description: 'Add time markers'
    },
    {
      id: 'words',
      label: 'Word by Word',
      icon: <MessageSquare className="w-5 h-5" />,
      description: 'Detailed word timing'
    }
  ] as const;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {options.map((option) => (
        <motion.button
          key={option.id}
          whileHover={!disabled ? { scale: 1.02 } : undefined}
          whileTap={!disabled ? { scale: 0.98 } : undefined}
          onClick={() => !disabled && onModeChange(option.id)}
          className={`relative p-4 rounded-xl text-left transition-colors ${
            disabled
              ? 'opacity-50 cursor-not-allowed'
              : mode === option.id
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
              : 'bg-white hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center space-x-3">
            {option.icon}
            <div>
              <h3 className="font-medium">{option.label}</h3>
              <p className={`text-sm ${
                mode === option.id ? 'text-indigo-100' : 'text-gray-500'
              }`}>
                {option.description}
              </p>
            </div>
          </div>
        </motion.button>
      ))}
    </div>
  );
}