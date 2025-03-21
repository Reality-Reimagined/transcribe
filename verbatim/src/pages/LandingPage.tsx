import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CheckCircle2, Headphones, Clock, Languages } from 'lucide-react';
import { Logo } from '../Logo';

export function LandingPage() {
  const features = [
    {
      icon: <Headphones className="w-6 h-6 text-indigo-600" />,
      title: 'Crystal Clear Transcription',
      description: 'Advanced AI technology for accurate speech-to-text conversion',
    },
    {
      icon: <Clock className="w-6 h-6 text-indigo-600" />,
      title: 'Precise Timestamps',
      description: 'Navigate through your audio with word-level precision',
    },
    {
      icon: <Languages className="w-6 h-6 text-indigo-600" />,
      title: 'Multi-language Support',
      description: 'Translate transcriptions into multiple languages instantly',
    },
  ];

  const plans = [
    {
      name: 'Starter',
      price: '29',
      features: [
        '5 hours of audio per month',
        'Basic transcription',
        'Email support',
        'Export to TXT and PDF',
      ],
    },
    {
      name: 'Professional',
      price: '79',
      features: [
        '20 hours of audio per month',
        'Advanced transcription',
        'Priority support',
        'All export formats',
        'Team collaboration',
      ],
      popular: true,
    },
    {
      name: 'Enterprise',
      price: '199',
      features: [
        'Unlimited audio',
        'Custom AI models',
        'Dedicated support',
        'API access',
        'Advanced analytics',
      ],
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex justify-center mb-8"
            >
              <Logo className="w-32 h-32" />
            </motion.div>
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 mb-6"
            >
              Your meeting minutes in seconds
            </motion.h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-600 mb-8"
            >
              Transform your audio recordings into accurate, searchable text with AI-powered transcription
            </motion.p>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Link
                to="/register"
                className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-full font-medium hover:bg-indigo-700 transition-colors"
              >
                Start Free Trial
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.2 }}
                className="p-6 bg-white rounded-xl shadow-lg"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12">Simple, transparent pricing</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.2 }}
                className={`p-8 rounded-xl ${
                  plan.popular
                    ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-xl scale-105'
                    : 'bg-white shadow-lg'
                }`}
              >
                <h3 className="text-2xl font-semibold mb-2">{plan.name}</h3>
                <div className="flex items-baseline mb-6">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="ml-2 opacity-75">/month</span>
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/register"
                  className={`block text-center py-2 px-4 rounded-full font-medium transition-colors ${
                    plan.popular
                      ? 'bg-white text-indigo-600 hover:bg-gray-100'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  Get Started
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}