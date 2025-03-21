import { useEffect } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../lib/store';
import { LogOut, User } from 'lucide-react';
import { NavLogo } from './NavLogo';

export function Layout() {
  const { user, loading, initialize, signOut } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/#' + id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b sticky top-0 z-50 backdrop-blur-lg bg-white/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link
                to="/"
                className="flex items-center px-2"
              >
                <NavLogo />
              </Link>
            </div>

            <div className="flex items-center gap-6">
              {user ? (
                <>
                  <Link to="/dashboard" className="nav-link">
                    Dashboard
                  </Link>
                  <Link to="/transcribe" className="nav-link">
                    New Transcription
                  </Link>
                  <Link to="/connections" className="nav-link">
                    Connections
                  </Link>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => signOut()}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors font-semibold"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </motion.button>
                </>
              ) : (
                <>
                  <Link to="/login" className="nav-link font-semibold">
                    Sign In
                  </Link>
                  <Link to="/register" className="btn-primary">
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main>
        <Outlet />
      </main>

      <footer className="bg-white border-t mt-auto">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <NavLogo />
              <p className="mt-4 text-gray-600">
                Transform your meetings into searchable, shareable documents with AI-powered transcription.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Product</h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <button 
                    onClick={() => scrollToSection('features')} 
                    className="text-gray-600 hover:text-indigo-600 transition-colors"
                  >
                    Features
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection('pricing')} 
                    className="text-gray-600 hover:text-indigo-600 transition-colors"
                  >
                    Pricing
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection('security')} 
                    className="text-gray-600 hover:text-indigo-600 transition-colors"
                  >
                    Security
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Resources</h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <Link to="/connections" className="text-gray-600 hover:text-indigo-600 transition-colors">
                    API & Integrations
                  </Link>
                </li>
                <li>
                  <Link to="/docs" className="text-gray-600 hover:text-indigo-600 transition-colors">
                    Documentation
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Legal</h3>
              <ul className="mt-4 space-y-4">
                <li><Link to="/privacy" className="text-gray-600 hover:text-indigo-600">Privacy</Link></li>
                <li><Link to="/terms" className="text-gray-600 hover:text-indigo-600">Terms</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-center text-gray-500">
              © {new Date().getFullYear()} The Minutes. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}