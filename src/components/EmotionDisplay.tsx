import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Frown, Smile, Zap, Brain, AlertTriangle } from 'lucide-react';
import { EmotionAnalysis } from '../services/openai';

interface EmotionDisplayProps {
  emotion: EmotionAnalysis;
}

const emotionConfig = {
  happy: { icon: Smile, color: 'text-green-500', bgColor: 'from-green-500/20 to-emerald-500/20', emoji: '😊' },
  sad: { icon: Frown, color: 'text-blue-500', bgColor: 'from-blue-500/20 to-indigo-500/20', emoji: '😢' },
  angry: { icon: AlertTriangle, color: 'text-red-500', bgColor: 'from-red-500/20 to-pink-500/20', emoji: '😡' },
  anxious: { icon: Zap, color: 'text-yellow-500', bgColor: 'from-yellow-500/20 to-orange-500/20', emoji: '😰' },
  frustrated: { icon: AlertTriangle, color: 'text-orange-500', bgColor: 'from-orange-500/20 to-red-500/20', emoji: '😤' },
  calm: { icon: Heart, color: 'text-teal-500', bgColor: 'from-teal-500/20 to-cyan-500/20', emoji: '😌' },
  excited: { icon: Zap, color: 'text-purple-500', bgColor: 'from-purple-500/20 to-pink-500/20', emoji: '🤩' },
  neutral: { icon: Brain, color: 'text-gray-500', bgColor: 'from-gray-500/20 to-slate-500/20', emoji: '😐' },
};

export function EmotionDisplay({ emotion }: EmotionDisplayProps) {
  const config = emotionConfig[emotion.emotion as keyof typeof emotionConfig] || emotionConfig.neutral;
  const IconComponent = config.icon;

  const getIntensityColor = () => {
    switch (emotion.intensity) {
      case 'high': return 'border-red-300 bg-red-50';
      case 'medium': return 'border-yellow-300 bg-yellow-50';
      case 'low': return 'border-green-300 bg-green-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className={`p-6 rounded-2xl bg-gradient-to-br ${config.bgColor} backdrop-blur-sm border border-white/20 shadow-xl`}
    >
      {/* Emotion Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center ${config.color}`}
          >
            <IconComponent size={24} />
          </motion.div>
          <div>
            <h3 className="text-xl font-bold text-gray-800 capitalize">
              {emotion.emotion} {config.emoji}
            </h3>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Confidence:</span>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${emotion.confidence}%` }}
                transition={{ duration: 1, delay: 0.3 }}
                className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden"
              >
                <div 
                  className={`h-full ${config.color.replace('text-', 'bg-')} transition-all duration-1000`}
                  style={{ width: `${emotion.confidence}%` }}
                />
              </motion.div>
              <span className="text-sm font-medium text-gray-700">
                {emotion.confidence}%
              </span>
            </div>
          </div>
        </div>

        {/* Intensity Badge */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className={`px-3 py-1 rounded-full border ${getIntensityColor()}`}
        >
          <span className="text-xs font-medium text-gray-700 capitalize">
            {emotion.intensity} intensity
          </span>
        </motion.div>
      </div>

      {/* Description */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="p-4 bg-white/50 rounded-xl backdrop-blur-sm"
      >
        <p className="text-gray-700 leading-relaxed">
          {emotion.description}
        </p>
      </motion.div>

      {/* Visual Emotion Meter */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-4"
      >
        <div className="flex justify-between text-xs text-gray-500 mb-2">
          <span>Low</span>
          <span>Medium</span>
          <span>High</span>
        </div>
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ 
              width: emotion.intensity === 'low' ? '33%' : 
                     emotion.intensity === 'medium' ? '66%' : '100%'
            }}
            transition={{ duration: 1, delay: 0.7 }}
            className={`h-full ${config.color.replace('text-', 'bg-')} rounded-full`}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}