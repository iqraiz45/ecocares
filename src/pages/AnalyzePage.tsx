import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Download, Share2 } from 'lucide-react';
import { VoiceRecorderComponent } from '../components/VoiceRecorder';
import { EmotionDisplay } from '../components/EmotionDisplay';
import { MessageRewrite } from '../components/MessageRewrite';
import { aiService, EmotionAnalysis, MessageRewrite as MessageRewriteType } from '../services/openai';
import { dbService } from '../services/database';
import { useAuth } from '../hooks/useAuth';

interface AnalyzePageProps {
  onBack: () => void;
}

type AnalysisState = 'recording' | 'analyzing' | 'results';

export function AnalyzePage({ onBack }: AnalyzePageProps) {
  const { user } = useAuth();
  const [analysisState, setAnalysisState] = useState<AnalysisState>('recording');
  const [transcript, setTranscript] = useState('');
  const [emotion, setEmotion] = useState<EmotionAnalysis | null>(null);
  const [rewrittenVersions, setRewrittenVersions] = useState<MessageRewriteType | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

  const handleTranscriptChange = (newTranscript: string) => {
    setTranscript(newTranscript);
  };

  const handleRecordingComplete = async (audio: Blob, finalTranscript: string) => {
    if (!finalTranscript.trim()) {
      alert('No speech detected. Please try again.');
      return;
    }

    setAudioBlob(audio);
    setAnalysisState('analyzing');
    
    try {
      // Analyze emotion
      const emotionResult = await aiService.analyzeEmotion(finalTranscript);
      setEmotion(emotionResult);

      // Rewrite message
      const rewriteResult = await aiService.rewriteMessage(finalTranscript, emotionResult.emotion);
      setRewrittenVersions(rewriteResult);

      // Save to database if user is logged in
      if (user) {
        await dbService.saveAnalysis({
          userId: user.uid,
          originalText: finalTranscript,
          emotion: emotionResult,
          rewrittenVersions: rewriteResult
        });
      }

      setAnalysisState('results');
    } catch (error) {
      console.error('Analysis error:', error);
      alert('Failed to analyze your message. Please try again.');
      setAnalysisState('recording');
    }
  };

  const handleNewAnalysis = () => {
    setAnalysisState('recording');
    setTranscript('');
    setEmotion(null);
    setRewrittenVersions(null);
    setAudioBlob(null);
  };

  const getBackgroundGradient = () => {
    if (analysisState === 'analyzing') return 'from-purple-50 via-indigo-50 to-pink-50';
    if (analysisState === 'results' && emotion) {
      switch (emotion.emotion) {
        case 'happy': return 'from-green-50 via-emerald-50 to-teal-50';
        case 'sad': return 'from-blue-50 via-indigo-50 to-slate-50';
        case 'angry': return 'from-red-50 via-pink-50 to-rose-50';
        case 'anxious': return 'from-yellow-50 via-orange-50 to-amber-50';
        case 'calm': return 'from-teal-50 via-cyan-50 to-blue-50';
        default: return 'from-gray-50 via-slate-50 to-zinc-50';
      }
    }
    return 'from-indigo-50 via-white to-purple-50';
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${getBackgroundGradient()} transition-all duration-1000`}>
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
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Voice Analysis
            </h1>
            <p className="text-gray-600 mt-1">
              {analysisState === 'recording' && 'Speak naturally and we\'ll analyze your emotions'}
              {analysisState === 'analyzing' && 'Analyzing your emotional tone...'}
              {analysisState === 'results' && 'Here are your results'}
            </p>
          </div>

          <div className="w-32" /> {/* Spacer for centering */}
        </motion.div>

        {/* Progress Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center mb-12"
        >
          <div className="flex items-center space-x-4">
            {['recording', 'analyzing', 'results'].map((step, index) => (
              <React.Fragment key={step}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  analysisState === step
                    ? 'bg-indigo-600 border-indigo-600 text-white'
                    : index < ['recording', 'analyzing', 'results'].indexOf(analysisState)
                    ? 'bg-green-500 border-green-500 text-white'
                    : 'bg-gray-200 border-gray-300 text-gray-500'
                }`}>
                  {index + 1}
                </div>
                {index < 2 && (
                  <div className={`w-16 h-1 transition-all duration-300 ${
                    index < ['recording', 'analyzing', 'results'].indexOf(analysisState)
                      ? 'bg-green-500'
                      : 'bg-gray-300'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            {analysisState === 'recording' && (
              <motion.div
                key="recording"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
                className="flex justify-center"
              >
                <VoiceRecorderComponent
                  onTranscriptChange={handleTranscriptChange}
                  onRecordingComplete={handleRecordingComplete}
                  isAnalyzing={false}
                />
              </motion.div>
            )}

            {analysisState === 'analyzing' && (
              <motion.div
                key="analyzing"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-24 h-24 border-4 border-purple-200 border-t-purple-600 rounded-full mx-auto mb-8"
                />
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Analyzing Your Voice...
                </h2>
                <p className="text-gray-600 mb-8">
                  Our AI is processing your emotional tone and preparing suggestions
                </p>
                {transcript && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-2xl mx-auto p-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200"
                  >
                    <h3 className="font-medium text-gray-900 mb-3">Transcript:</h3>
                    <p className="text-gray-700 italic leading-relaxed">
                      "{transcript}"
                    </p>
                  </motion.div>
                )}
              </motion.div>
            )}

            {analysisState === 'results' && emotion && rewrittenVersions && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-8"
              >
                {/* Emotion Analysis */}
                <EmotionDisplay emotion={emotion} />

                {/* Message Rewrite */}
                <MessageRewrite
                  originalText={transcript}
                  rewrittenVersions={rewrittenVersions}
                />

                {/* Actions */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                >
                  <motion.button
                    onClick={handleNewAnalysis}
                    className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Analyze Another Message
                  </motion.button>

                  {!user && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      className="text-center p-4 bg-amber-50 border border-amber-200 rounded-xl"
                    >
                      <p className="text-amber-800 text-sm">
                        💡 <strong>Sign in</strong> to save your analyses and track your emotional growth over time!
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}