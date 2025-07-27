import React from 'react';
import { motion } from 'framer-motion';
import { Mic, Heart, Brain, Lightbulb, Star, ArrowRight, Users, Shield, Zap, Type } from 'lucide-react';

interface HomePageProps {
  onStartAnalysis: () => void;
  onStartLiveAnalysis: () => void;
}

export function HomePage({ onStartAnalysis, onStartLiveAnalysis }: HomePageProps) {
  const features = [
    {
      icon: Mic,
      title: 'Voice Analysis',
      description: 'Speak naturally and our AI analyzes your emotional tone from your voice patterns.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Brain,
      title: 'Emotion Detection',
      description: 'Advanced AI identifies your emotional state with high accuracy and confidence.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Lightbulb,
      title: 'Message Rewriting',
      description: 'Get calmer, more constructive versions of your message for better communication.',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: Heart,
      title: 'Personal Growth',
      description: 'Track your emotional patterns and improve your communication skills over time.',
      color: 'from-green-500 to-teal-500'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Marketing Manager',
      content: 'EchoCare helped me communicate better with my team during stressful projects.',
      rating: 5
    },
    {
      name: 'Michael Rodriguez',
      role: 'College Student',
      content: 'Perfect for improving my communication skills and managing study stress.',
      rating: 5
    },
    {
      name: 'Emily Johnson',
      role: 'Therapist',
      content: 'I recommend EchoCare to clients working on emotional awareness and expression.',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative px-4 pt-20 pb-16">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
              Your{' '}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Emotional
              </span>
              <br />
              Mirror & Message Fixer
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Speak freely, understand your emotions, and communicate better. 
              EchoCare analyzes your tone and helps you express yourself more effectively.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 max-w-4xl mx-auto"
          >
            <motion.button
              onClick={onStartAnalysis}
              className="px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-lg font-semibold rounded-2xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 flex items-center space-x-3 shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Mic size={24} />
              <span>Voice Analysis</span>
              <ArrowRight size={20} />
            </motion.button>
            
            <motion.button
              onClick={onStartLiveAnalysis}
              className="px-6 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-lg font-semibold rounded-2xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 flex items-center space-x-3 shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Type size={24} />
              <span>Live Analysis</span>
              <Zap size={20} />
            </motion.button>
            
            <motion.button
              className="px-6 py-4 bg-white text-gray-700 text-lg font-semibold rounded-2xl border-2 border-gray-200 hover:border-indigo-300 hover:text-indigo-600 transition-all duration-200"
              whileHover={{ scale: 1.05 }}
            >
              Watch Demo
            </motion.button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto mb-20"
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600 mb-2">95%</div>
              <div className="text-gray-600">Emotion Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">10k+</div>
              <div className="text-gray-600">Messages Improved</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-600 mb-2">4.9★</div>
              <div className="text-gray-600">User Rating</div>
            </div>
          </motion.div>
        </div>

        {/* Background Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              How EchoCare Helps You
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI-powered platform analyzes your emotional state and provides personalized 
              feedback to improve your communication skills.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
                  whileHover={{ y: -5 }}
                >
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6`}>
                    <IconComponent className="text-white" size={32} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-gradient-to-r from-indigo-500/5 to-purple-500/5">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Simple 3-Step Process
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                step: '01',
                title: 'Speak Naturally',
                description: 'Just talk into your microphone as you normally would. Express yourself freely.',
                icon: Mic
              },
              {
                step: '02',
                title: 'AI Analysis',
                description: 'Our AI analyzes your voice tone, emotion, and converts speech to text.',
                icon: Brain
              },
              {
                step: '03',
                title: 'Get Better Messages',
                description: 'Receive calmer, more constructive versions of your message to improve communication.',
                icon: Lightbulb
              }
            ].map((item, index) => {
              const IconComponent = item.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.2, duration: 0.6 }}
                  className="text-center"
                >
                  <div className="relative mb-8">
                    <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="text-white" size={32} />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {item.step}
                    </div>
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              What Our Users Say
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="text-yellow-400 fill-current" size={20} />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed italic">
                  "{testimonial.content}"
                </p>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Improve Your Communication?
            </h2>
            <p className="text-xl text-indigo-100 mb-8 leading-relaxed">
              Join thousands of users who have already improved their emotional intelligence 
              and communication skills with EchoCare.
            </p>
            <motion.button
              onClick={onStartAnalysis}
              className="px-6 py-4 bg-white text-indigo-600 text-lg font-semibold rounded-2xl hover:bg-gray-50 transition-all duration-200 flex items-center space-x-3 mx-auto shadow-lg hover:shadow-xl mr-4"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Mic size={24} />
              <span>Start Your Journey</span>
              <ArrowRight size={20} />
            </motion.button>
            
            <motion.button
              onClick={onStartLiveAnalysis}
              className="px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-lg font-semibold rounded-2xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 flex items-center space-x-3 mx-auto shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Type size={24} />
              <span>Try Live Analysis</span>
              <Zap size={20} />
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}