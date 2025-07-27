import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Type, Zap, Copy, Check, RefreshCw } from 'lucide-react';
import { aiService, EmotionAnalysis, MessageRewrite } from '../services/openai';
import { dbService } from '../services/database';
import { useAuth } from '../hooks/useAuth';

interface LiveAnalysisProps {
  onAnalysisComplete?: (emotion: EmotionAnalysis, rewrite: MessageRewrite, originalText: string) => void;
}

export function LiveAnalysis({ onAnalysisComplete }: LiveAnalysisProps) {
  const { user } = useAuth();
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [emotion, setEmotion] = useState<EmotionAnalysis | null>(null);
  const [rewrittenVersions, setRewrittenVersions] = useState<MessageRewrite | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [analysisTimeout, setAnalysisTimeout] = useState<NodeJS.Timeout | null>(null);

  // Debounced analysis function
  const analyzeText = useCallback(async (text: string) => {
    if (!text.trim() || text.length < 10) {
      setEmotion(null);
      setRewrittenVersions(null);
      return;
    }

    setIsAnalyzing(true);
    
    try {
      // Analyze emotion
      const emotionResult = await aiService.analyzeEmotion(text);
      setEmotion(emotionResult);

      // Rewrite message
      const rewriteResult = await aiService.rewriteMessage(text, emotionResult.emotion);
      setRewrittenVersions(rewriteResult);

      // Save to database if user is logged in
      if (user) {
        await dbService.saveAnalysis({
          userId: user.uid,
          originalText: text,
          emotion: emotionResult,
          rewrittenVersions: rewriteResult
        });
      }

      // Notify parent component
      onAnalysisComplete?.(emotionResult, rewriteResult, text);
    } catch (error) {
      console.error('Live analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [user, onAnalysisComplete]);

  // Handle input changes with debouncing
  useEffect(() => {
    if (analysisTimeout) {
      clearTimeout(analysisTimeout);
    }

    if (inputText.trim().length >= 10) {
      const timeout = setTimeout(() => {
        analyzeText(inputText);
      }, 1500); // Wait 1.5 seconds after user stops typing
      
      setAnalysisTimeout(timeout);
    } else {
      setEmotion(null);
      setRewrittenVersions(null);
    }

    return () => {
      if (analysisTimeout) {
        clearTimeout(analysisTimeout);
      }
    };
  }, [inputText, analyzeText]);

  const handleCopy = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  const getEmotionColor = () => {
    if (!emotion) return 'from-gray-500/20 to-slate-500/20';
    
    const emotionColors = {
      happy: 'from-green-500/20 to-emerald-500/20',
      sad: 'from-blue-500/20 to-indigo-500/20',
      angry: 'from-red-500/20 to-pink-500/20',
      anxious: 'from-yellow-500/20 to-orange-500/20',
      frustrated: 'from-orange-500/20 to-red-500/20',
      calm: 'from-teal-500/20 to-cyan-500/20',
      excited: 'from-purple-500/20 to-pink-500/20',
      neutral: 'from-gray-500/20 to-slate-500/20',
    };

    return emotionColors[emotion.emotion as keyof typeof emotionColors] || 'from-gray-500/20 to-slate-500/20';
  };

  const getEmotionIcon = () => {
    if (!emotion) return '💭';
    
    const emotionEmojis = {
      happy: '😊',
      sad: '😢',
      angry: '😡',
      anxious: '😰',
      frustrated: '😤',
      calm: '😌',
      excited: '🤩',
      neutral: '😐',
    };

    return emotionEmojis[emotion.emotion as keyof typeof emotionEmojis] || '💭';
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <motion.div
        className={`relative p-6 rounded-3xl bg-gradient-to-br ${getEmotionColor()} backdrop-blur-sm border border-white/20 shadow-2xl transition-all duration-500`}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
            <Type className="text-white" size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">Live Analysis</h3>
            <p className="text-sm text-gray-600">Type your message and get instant emotional insights</p>
          </div>
          {isAnalyzing && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="ml-auto"
            >
              <RefreshCw className="text-indigo-500" size={20} />
            </motion.div>
          )}
        </div>

        {/* Input Area */}
        <div className="space-y-4">
          <div className="relative">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Start typing your message here... (minimum 10 characters for analysis)"
              className="w-full h-32 p-4 bg-white/70 backdrop-blur-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none text-gray-800 placeholder-gray-500"
              maxLength={500}
            />
            <div className="absolute bottom-3 right-3 text-xs text-gray-500">
              {inputText.length}/500
            </div>
          </div>

          {/* Real-time Emotion Display */}
          <AnimatePresence>
            {emotion && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex items-center justify-between p-4 bg-white/50 rounded-xl backdrop-blur-sm"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getEmotionIcon()}</span>
                  <div>
                    <p className="font-medium text-gray-800 capitalize">
                      {emotion.emotion} detected
                    </p>
                    <p className="text-sm text-gray-600">
                      {emotion.confidence}% confidence • {emotion.intensity} intensity
                    </p>
                  </div>
                </div>
                <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${emotion.confidence}%` }}
                    transition={{ duration: 0.8 }}
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-600"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Rewritten Versions */}
          <AnimatePresence>
            {rewrittenVersions && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-3"
              >
                <h4 className="font-semibold text-gray-800 flex items-center">
                  <Zap className="mr-2 text-indigo-500" size={18} />
                  Improved Versions
                </h4>
                
                {[
                  { key: 'calm', title: 'Calm Version', color: 'border-teal-200 bg-teal-50/50', icon: '😌' },
                  { key: 'constructive', title: 'Constructive Version', color: 'border-blue-200 bg-blue-50/50', icon: '🧠' },
                  { key: 'empathetic', title: 'Empathetic Version', color: 'border-purple-200 bg-purple-50/50', icon: '💝' }
                ].map((version, index) => (
                  <motion.div
                    key={version.key}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-xl border ${version.color} backdrop-blur-sm`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span>{version.icon}</span>
                          <span className="font-medium text-gray-800 text-sm">
                            {version.title}
                          </span>
                        </div>
                        <p className="text-gray-700 leading-relaxed">
                          "{rewrittenVersions[version.key as keyof MessageRewrite]}"
                        </p>
                      </div>
                      <motion.button
                        onClick={() => handleCopy(rewrittenVersions[version.key as keyof MessageRewrite], index)}
                        className="ml-3 p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-200"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <AnimatePresence mode="wait">
                          {copiedIndex === index ? (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                            >
                              <Check size={16} className="text-green-500" />
                            </motion.div>
                          ) : (
                            <Copy size={16} className="text-gray-600" />
                          )}
                        </AnimatePresence>
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Helper Text */}
          {!inputText.trim() && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-gray-500 text-sm py-4"
            >
              💡 Start typing to see real-time emotional analysis and message improvements
            </motion.div>
          )}

          {inputText.trim() && inputText.length < 10 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-amber-600 text-sm py-2"
            >
              ⏳ Type at least 10 characters for analysis
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Tips */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 text-center text-gray-600 text-sm"
      >
        <p>✨ Analysis happens automatically as you type</p>
        <p className="mt-1">Your messages are analyzed locally and saved securely</p>
      </motion.div>
    </div>
  );
}