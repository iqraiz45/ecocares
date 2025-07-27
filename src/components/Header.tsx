import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, User, LogOut, BarChart3, Menu, X, Mic, Type } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { AuthForm } from './AuthForm';

interface HeaderProps {
  currentView: 'home' | 'analyze' | 'live-analysis' | 'dashboard';
  onViewChange: (view: 'home' | 'analyze' | 'live-analysis' | 'dashboard') => void;
}

export function Header({ currentView, onViewChange }: HeaderProps) {
  const { user, logout } = useAuth();
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      onViewChange('home');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const menuItems = [
    { id: 'home', label: 'Home', icon: Heart },
    { id: 'analyze', label: 'Voice Analysis', icon: Mic },
    { id: 'live-analysis', label: 'Live Analysis', icon: Type },
    ...(user ? [{ id: 'dashboard', label: 'Dashboard', icon: BarChart3 }] : [])
  ];

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-40"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.div
              className="flex items-center space-x-3 cursor-pointer"
              onClick={() => onViewChange('home')}
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Heart className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">EchoCare</h1>
                <p className="text-xs text-gray-500 leading-none">Your Emotional Mirror</p>
              </div>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {menuItems.map(item => {
                const IconComponent = item.icon;
                return (
                  <motion.button
                    key={item.id}
                    onClick={() => onViewChange(item.id as any)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
                      currentView === item.id
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
                    }`}
                    whileHover={{ scale: 1.05 }}
                  >
                    <IconComponent size={18} />
                    <span className="font-medium">{item.label}</span>
                  </motion.button>
                );
              })}
            </nav>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="hidden md:flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {user.displayName || 'User'}
                    </p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                    <User className="text-white" size={16} />
                  </div>
                  <motion.button
                    onClick={handleLogout}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    whileHover={{ scale: 1.1 }}
                  >
                    <LogOut size={18} />
                  </motion.button>
                </div>
              ) : (
                <motion.button
                  onClick={() => setShowAuthForm(true)}
                  className="hidden md:flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all"
                  whileHover={{ scale: 1.05 }}
                >
                  <User size={18} />
                  <span>Sign In</span>
                </motion.button>
              )}

              {/* Mobile Menu Button */}
              <motion.button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="md:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors"
                whileHover={{ scale: 1.1 }}
              >
                {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {showMobileMenu && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-gray-200"
            >
              <div className="px-4 py-4 space-y-3">
                {menuItems.map(item => {
                  const IconComponent = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onViewChange(item.id as any);
                        setShowMobileMenu(false);
                      }}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                        currentView === item.id
                          ? 'bg-indigo-100 text-indigo-700'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <IconComponent size={20} />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  );
                })}

                {user ? (
                  <div className="border-t border-gray-200 pt-3 mt-3">
                    <div className="px-4 py-2 mb-3">
                      <p className="font-medium text-gray-900">
                        {user.displayName || 'User'}
                      </p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <LogOut size={20} />
                      <span className="font-medium">Sign Out</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setShowAuthForm(true);
                      setShowMobileMenu(false);
                    }}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl"
                  >
                    <User size={20} />
                    <span className="font-medium">Sign In</span>
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Auth Modal */}
      <AnimatePresence>
        {showAuthForm && (
          <AuthForm onClose={() => setShowAuthForm(false)} />
        )}
      </AnimatePresence>
    </>
  );
}