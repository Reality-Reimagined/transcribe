import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Clock, 
  FileAudio, 
  Brain, 
  Share2, 
  CheckCircle2, 
  ArrowRight 
} from 'lucide-react';

export function LandingPage() {
  const features = [
    {
      icon: <FileAudio className="w-6 h-6 text-indigo-600" />,
      title: 'Audio Transcription',
      description: 'Convert any meeting recording into accurate, searchable text'
    },
    {
      icon: <Brain className="w-6 h-6 text-purple-600" />,
      title: 'AI-Powered Summaries',
      description: 'Get intelligent meeting summaries with key points and action items'
    },
    {
      icon: <Share2 className="w-6 h-6 text-pink-600" />,
      title: 'CRM Integration',
      description: 'Seamlessly sync with your existing tools and workflows'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      {/* Header */}
      <header className="px-4 py-6">
        <nav className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold text-indigo-900">MinuteWise</div>
          <div className="space-x-4">
            <Link 
              to="/auth/login"
              className="px-4 py-2 text-indigo-600 hover:text-indigo-700"
            >
              Sign In
            </Link>
            <Link
              to="/auth/register"
              className="px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-6xl font-bold text-gray-900 mb-6">
            Your Meeting Minutes,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              Transcribed in Seconds
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Transform your audio recordings into professional meeting minutes with AI-powered 
            transcription, summaries, and action items. Perfect for professionals who value efficiency.
          </p>
          <Link
            to="/auth/register"
            className="inline-flex items-center px-8 py-4 text-lg font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all"
          >
            Start Free Trial
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </motion.div>

        {/* Features */}
        <div className="mt-32 grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="bg-white rounded-xl p-6 shadow-lg"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Benefits */}
        <div className="mt-32">
          <h2 className="text-4xl font-bold text-center mb-12">
            Why Choose MinuteWise?
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              'Accurate transcription with speaker identification',
              'Custom templates for different meeting types',
              'Secure and compliant data handling',
              'Integration with popular CRM platforms',
              'Automated action item tracking',
              'Team collaboration features'
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-3"
              >
                <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
                <span className="text-lg text-gray-700">{benefit}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}