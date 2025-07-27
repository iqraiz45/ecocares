import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Type, Zap } from 'lucide-react';
import { LiveAnalysis } from '../components/LiveAnalysis';
import { EmotionAnalysis, MessageRewrite } from '../services/openai';

interface LiveAnalysisPageProps {
  onBack: () => void;
}

export function LiveAnalysisPage({ onBack }: LiveAnalysisPageProps) {
  const handleAnalysisComplete = (emotion: EmotionAnalysis, rewrite: MessageRewrite, originalText: string) => {
    // Optional: Handle completed analysis (e.g., show notification, track analytics)
    console.log('Analysis completed:', { emotion, rewrite, originalText });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 transition-all duration-1000">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <motion.button
            onClick={onBack}
            className="flex items-center space-x-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back to Home</span>
          </motion.button>

          <div className="text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center justify-center space-x-3">
              <Type className="text-emerald-600" size={32} />
              <span>Live Analysis</span>
              <Zap className="text-teal-600" size={28} />
            </h1>
            <p className="text-gray-600 mt-1">
              Type your message and get instant emotional insights & improvements
            </p>
          </div>

          <div className="w-32" /> {/* Spacer for centering */}
        </motion.div>

        {/* Feature Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 max-w-4xl mx-auto"
        >
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-emerald-200 text-center">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-2">
              <Zap className="text-white" size={20} />
            </div>
            <h3 className="font-semibold text-gray-800 text-sm">Real-time Analysis</h3>
            <p className="text-xs text-gray-600 mt-1">Instant emotion detection as you type</p>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-teal-200 text-center">
            <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-2">
              <Type className="text-white" size={20} />
            </div>
            <h3 className="font-semibold text-gray-800 text-sm">Smart Rewriting</h3>
            <p className="text-xs text-gray-600 mt-1">Get calmer, more constructive versions</p>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-cyan-200 text-center">
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-white text-sm">💡</span>
            </div>
            <h3 className="font-semibold text-gray-800 text-sm">Instant Feedback</h3>
            <p className="text-xs text-gray-600 mt-1">No waiting, immediate results</p>
          </div>
        </motion.div>

        {/* Main Live Analysis Component */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="flex justify-center"
        >
          <LiveAnalysis onAnalysisComplete={handleAnalysisComplete} />
        </motion.div>

        {/* Tips Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-12 max-w-3xl mx-auto"
        >
          <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-2xl p-6 border border-emerald-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
              💡 Tips for Better Results
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
              <div className="flex items-start space-x-2">
                <span className="text-emerald-500 mt-0.5">✓</span>
                <span>Write at least 10 characters for analysis to begin</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-emerald-500 mt-0.5">✓</span>
                <span>Express your genuine feelings and thoughts</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-emerald-500 mt-0.5">✓</span>
                <span>Analysis updates automatically as you type</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-emerald-500 mt-0.5">✓</span>
                <span>Copy improved versions with one click</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}