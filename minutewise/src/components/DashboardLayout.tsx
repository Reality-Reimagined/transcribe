import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  FileAudio,
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Logo } from './Logo';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
}

function NavItem({ to, icon, label, active }: NavItemProps) {
  return (
    <Link
      to={to}
      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
        active
          ? 'bg-indigo-100 text-indigo-900'
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </Link>
  );
}

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, profile } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const navItems = [
    {
      to: '/dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
      label: 'Dashboard'
    },
    {
      to: '/meetings',
      icon: <FileAudio className="w-5 h-5" />,
      label: 'Meetings'
    },
    {
      to: '/settings',
      icon: <Settings className="w-5 h-5" />,
      label: 'Settings'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 right-4 z-50 p-2 bg-white rounded-lg shadow-md"
      >
        {isMobileMenuOpen ? (
          <X className="w-6 h-6 text-gray-600" />
        ) : (
          <Menu className="w-6 h-6 text-gray-600" />
        )}
      </button>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: isMobileMenuOpen ? 0 : -280,
          opacity: isMobileMenuOpen ? 1 : 0
        }}
        className={`fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 z-40 lg:translate-x-0 lg:opacity-100`}
      >
        <div className="p-6">
          <div className="flex items-center space-x-3">
            <Logo className="w-8 h-8" />
            <span className="text-xl font-bold text-gray-900">MinuteWise</span>
          </div>
        </div>

        <nav className="px-4 space-y-1">
          {navItems.map((item) => (
            <NavItem
              key={item.to}
              {...item}
              active={location.pathname.startsWith(item.to)}
            />
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="border-t border-gray-200 pt-4">
            <div className="px-4 py-2">
              <p className="text-sm font-medium text-gray-900">
                {profile?.full_name || 'User'}
              </p>
              <p className="text-sm text-gray-500">{profile?.organization?.name}</p>
            </div>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Main content */}
      <main className="lg:pl-64">
        <div className="max-w-7xl mx-auto px-4 py-8">{children}</div>
      </main>

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}