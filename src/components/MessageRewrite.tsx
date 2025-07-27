import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, Download, Share2, Heart, Brain, Lightbulb } from 'lucide-react';
import { MessageRewrite as MessageRewriteType } from '../services/openai';

interface MessageRewriteProps {
  originalText: string;
  rewrittenVersions: MessageRewriteType;
}

export function MessageRewrite({ originalText, rewrittenVersions }: MessageRewriteProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [selectedVersion, setSelectedVersion] = useState<'calm' | 'constructive' | 'empathetic'>('calm');

  const versions = [
    {
      key: 'calm' as const,
      title: 'Calm Version',
      icon: Heart,
      color: 'text-teal-500',
      bgColor: 'from-teal-500/10 to-cyan-500/10',
      borderColor: 'border-teal-200',
      description: 'A more peaceful and relaxed tone'
    },
    {
      key: 'constructive' as const,
      title: 'Constructive Version',
      icon: Lightbulb,
      color: 'text-blue-500',
      bgColor: 'from-blue-500/10 to-indigo-500/10',
      borderColor: 'border-blue-200',
      description: 'Solution-focused and productive'
    },
    {
      key: 'empathetic' as const,
      title: 'Empathetic Version',
      icon: Brain,
      color: 'text-purple-500',
      bgColor: 'from-purple-500/10 to-pink-500/10',
      borderColor: 'border-purple-200',
      description: 'Understanding and compassionate'
    }
  ];

  const handleCopy = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  const handleShare = async (text: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'EchoCare - Rewritten Message',
          text: text
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback to copy
      handleCopy(text, -1);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-4xl mx-auto space-y-6"
    >
      {/* Original Message */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="p-6 bg-gradient-to-r from-gray-500/10 to-slate-500/10 rounded-2xl border border-gray-200 backdrop-blur-sm"
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
          <span className="w-3 h-3 bg-gray-400 rounded-full mr-3"></span>
          Original Message
        </h3>
        <p className="text-gray-700 leading-relaxed italic">
          "{originalText}"
        </p>
      </motion.div>

      {/* Version Selector */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex flex-wrap gap-3 justify-center"
      >
        {versions.map((version, index) => {
          const IconComponent = version.icon;
          return (
            <motion.button
              key={version.key}
              onClick={() => setSelectedVersion(version.key)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${
                selectedVersion === version.key
                  ? `${version.color} bg-white shadow-lg scale-105`
                  : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <IconComponent size={16} />
              <span className="text-sm font-medium">{version.title}</span>
            </motion.button>
          );
        })}
      </motion.div>

      {/* Selected Version Display */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedVersion}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="space-y-4"
        >
          {(() => {
            const version = versions.find(v => v.key === selectedVersion)!;
            const IconComponent = version.icon;
            const text = rewrittenVersions[selectedVersion];

            return (
              <div className={`p-6 bg-gradient-to-br ${version.bgColor} rounded-2xl border ${version.borderColor} backdrop-blur-sm shadow-lg`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center ${version.color}`}>
                      <IconComponent size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {version.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {version.description}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2">
                    <motion.button
                      onClick={() => handleCopy(text, versions.findIndex(v => v.key === selectedVersion))}
                      className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-200"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <AnimatePresence mode="wait">
                        {copiedIndex === versions.findIndex(v => v.key === selectedVersion) ? (
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

                    <motion.button
                      onClick={() => handleShare(text)}
                      className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-200"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Share2 size={16} className="text-gray-600" />
                    </motion.button>
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="p-4 bg-white/70 rounded-xl backdrop-blur-sm"
                >
                  <p className="text-gray-800 leading-relaxed">
                    "{text}"
                  </p>
                </motion.div>
              </div>
            );
          })()}
        </motion.div>
      </AnimatePresence>

      {/* Improvement Tips */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="p-4 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl border border-indigo-200 backdrop-blur-sm"
      >
        <h4 className="font-medium text-gray-800 mb-2">💡 Communication Tip</h4>
        <p className="text-sm text-gray-700">
          {selectedVersion === 'calm' && "Taking a breath and speaking calmly helps others listen better and respond more positively."}
          {selectedVersion === 'constructive' && "Focusing on solutions rather than problems builds trust and moves conversations forward."}
          {selectedVersion === 'empathetic' && "Showing understanding and compassion creates deeper connections and stronger relationships."}
        </p>
      </motion.div>
    </motion.div>
  );
}