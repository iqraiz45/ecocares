import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Square, Play } from 'lucide-react';
import { VoiceRecorder, SpeechToText } from '../services/voiceRecording';

interface VoiceRecorderProps {
  onTranscriptChange: (transcript: string) => void;
  onRecordingComplete: (audioBlob: Blob, transcript: string) => void;
  isAnalyzing: boolean;
}

export function VoiceRecorderComponent({ onTranscriptChange, onRecordingComplete, isAnalyzing }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [audioLevel, setAudioLevel] = useState(0);
  const [recordingTime, setRecordingTime] = useState(0);
  
  const voiceRecorderRef = useRef<VoiceRecorder>(new VoiceRecorder());
  const speechToTextRef = useRef<SpeechToText>(new SpeechToText());
  const animationRef = useRef<number>();
  const intervalRef = useRef<NodeJS.Timeout>();

  // Simulate audio level for visual effect
  useEffect(() => {
    if (isRecording) {
      const updateAudioLevel = () => {
        setAudioLevel(Math.random() * 0.8 + 0.2);
        animationRef.current = requestAnimationFrame(updateAudioLevel);
      };
      updateAudioLevel();

      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      setAudioLevel(0);
      setRecordingTime(0);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRecording]);

  const startRecording = async () => {
    try {
      setIsRecording(true);
      setTranscript('');
      
      // Start audio recording
      await voiceRecorderRef.current.startRecording();
      
      // Start speech recognition
      if (speechToTextRef.current.isSupported()) {
        speechToTextRef.current.startListening((text, isFinal) => {
          setTranscript(text);
          onTranscriptChange(text);
        }, (error) => {
          console.error('Speech recognition error:', error);
        });
      }
    } catch (error) {
      console.error('Error starting recording:', error);
      setIsRecording(false);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = async () => {
    try {
      setIsRecording(false);
      
      // Stop speech recognition
      speechToTextRef.current.stopListening();
      
      // Stop and get audio recording
      const audioBlob = await voiceRecorderRef.current.stopRecording();
      
      onRecordingComplete(audioBlob, transcript);
    } catch (error) {
      console.error('Error stopping recording:', error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getMicColor = () => {
    if (isAnalyzing) return 'text-purple-500';
    if (isRecording) return 'text-red-500';
    return 'text-blue-500';
  };

  const getBackgroundGradient = () => {
    if (isAnalyzing) return 'from-purple-500/20 to-indigo-500/20';
    if (isRecording) return 'from-red-500/20 to-pink-500/20';
    return 'from-blue-500/20 to-teal-500/20';
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Main Recording Interface */}
      <motion.div 
        className={`relative p-8 rounded-3xl bg-gradient-to-br ${getBackgroundGradient()} backdrop-blur-sm border border-white/20 shadow-2xl`}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Audio Visualizer */}
        <div className="absolute inset-0 rounded-3xl overflow-hidden">
          <AnimatePresence>
            {isRecording && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-pink-500/10"
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: [0.3, 0.6, 0.3],
                  scale: [1, 1.05, 1]
                }}
                exit={{ opacity: 0 }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Microphone Button */}
        <div className="relative z-10 flex flex-col items-center space-y-6">
          <motion.button
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isAnalyzing}
            className={`relative w-24 h-24 rounded-full ${getMicColor()} transition-all duration-300 hover:scale-110 disabled:opacity-50`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Pulsing ring for recording */}
            <AnimatePresence>
              {isRecording && (
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-red-500"
                  initial={{ scale: 1, opacity: 1 }}
                  animate={{ 
                    scale: [1, 1.5, 2],
                    opacity: [1, 0.5, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeOut"
                  }}
                />
              )}
            </AnimatePresence>

            {/* Microphone Icon */}
            <div className="absolute inset-0 flex items-center justify-center bg-white rounded-full shadow-lg">
              <motion.div
                animate={{ scale: isRecording ? [1, 1.1, 1] : 1 }}
                transition={{ duration: 1, repeat: isRecording ? Infinity : 0 }}
              >
                {isAnalyzing ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Mic size={32} />
                  </motion.div>
                ) : isRecording ? (
                  <Square size={32} className="text-red-500" />
                ) : (
                  <Mic size={32} />
                )}
              </motion.div>
            </div>
          </motion.button>

          {/* Recording Status */}
          <div className="text-center">
            {isAnalyzing ? (
              <motion.p 
                className="text-purple-600 font-medium"
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                Analyzing your emotion...
              </motion.p>
            ) : isRecording ? (
              <div className="space-y-2">
                <p className="text-red-600 font-medium">Recording...</p>
                <p className="text-gray-600 text-sm">{formatTime(recordingTime)}</p>
              </div>
            ) : (
              <p className="text-gray-600">Tap to start recording</p>
            )}
          </div>

          {/* Live Transcript */}
          <AnimatePresence>
            {transcript && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="w-full p-4 bg-white/50 rounded-xl backdrop-blur-sm"
              >
                <p className="text-sm text-gray-700 leading-relaxed">
                  {transcript}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Instructions */}
      <motion.div 
        className="mt-6 text-center text-gray-600 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <p>Speak naturally and we'll analyze your emotional tone</p>
        <p className="mt-1">Your voice helps us understand how you're feeling</p>
      </motion.div>
    </div>
  );
}