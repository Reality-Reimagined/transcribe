import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  CheckCircle2, Headphones, Clock, Languages, ArrowRight, 
  Sparkles, Shield, Zap, Users, Globe, Lock, Laptop, Webhook 
} from 'lucide-react';
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
    {
      icon: <Zap className="w-6 h-6 text-indigo-600" />,
      title: 'Lightning Fast',
      description: 'Get your transcriptions in minutes, not hours',
    },
    {
      icon: <Users className="w-6 h-6 text-indigo-600" />,
      title: 'Team Collaboration',
      description: 'Share and collaborate on transcriptions with your team',
    },
    {
      icon: <Webhook className="w-6 h-6 text-indigo-600" />,
      title: 'API Access',
      description: 'API and Webhook access',
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

  const stats = [
    { number: '99%', label: 'Accuracy Rate' },
    { number: '50+', label: 'Languages' },
    { number: '1M+', label: 'Minutes Transcribed' },
    { number: '500+', label: 'Happy Teams' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 bg-gradient-mesh"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
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
              className="text-6xl md:text-7xl font-bold text-gradient mb-6 text-glow"
            >
              Meeting Minutes
              <br />
              Transcribed in Seconds
            </motion.h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
            >
              Transform your meetings into searchable, shareable documents with AI-powered transcription. Save time and never miss a detail.
            </motion.p>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="space-x-4"
            >
              <Link to="/register" className="btn-primary">
                Start Free Trial
                <ArrowRight className="w-4 h-4 ml-2 inline-block" />
              </Link>
              <Link to="/login" className="btn-secondary">
                Sign In
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 bg-white rounded-2xl p-8 shadow-xl"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-gradient">{stat.number}</div>
                <div className="text-gray-600 mt-2">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 text-gradient">Everything You Need</h2>
            <p className="text-xl text-gray-600">Powerful features to make your meetings more productive</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="feature-card group"
              >
                <div className="mb-4 bg-indigo-50 w-12 h-12 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 text-gradient">Simple, transparent pricing</h2>
            <p className="text-xl text-gray-600">No hidden fees. Cancel anytime.</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`pricing-card ${plan.popular ? 'pricing-card-popular' : 'pricing-card-basic'}`}
              >
                {plan.popular && (
                  <div className="flex items-center gap-1 text-xs font-semibold mb-4">
                    <Sparkles className="w-4 h-4" />
                    MOST POPULAR
                  </div>
                )}
                <h3 className="text-2xl font-semibold mb-2">{plan.name}</h3>
                <div className="flex items-baseline mb-6">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="ml-2 opacity-75">/month</span>
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/register"
                  className={`block text-center py-3 px-4 rounded-full font-semibold transition-all hover:scale-105 ${
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

      {/* Trust Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="flex justify-center mb-6">
              <Shield className="w-16 h-16 text-indigo-600" />
            </div>
            <h2 className="text-4xl font-bold mb-6 text-gradient">Trusted by Teams Worldwide</h2>
            <p className="text-xl text-gray-600 mb-12">
              Join thousands of teams who trust The Minutes for their meeting transcription needs.
              Enterprise-grade security, reliability, and support you can count on.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="flex flex-col items-center">
                <Globe className="w-8 h-8 text-indigo-600 mb-4" />
                <div className="text-lg font-semibold">Global Reach</div>
              </div>
              <div className="flex flex-col items-center">
                <Shield className="w-8 h-8 text-indigo-600 mb-4" />
                <div className="text-lg font-semibold">Enterprise Security</div>
              </div>
              <div className="flex flex-col items-center">
                <Users className="w-8 h-8 text-indigo-600 mb-4" />
                <div className="text-lg font-semibold">Team Support</div>
              </div>
              <div className="flex flex-col items-center">
                <Laptop className="w-8 h-8 text-indigo-600 mb-4" />
                <div className="text-lg font-semibold">Easy Integration</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}