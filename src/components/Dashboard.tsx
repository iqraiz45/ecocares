import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Calendar, TrendingUp, Heart, Brain } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { dbService, AnalysisRecord } from '../services/database';

export function Dashboard() {
  const { user } = useAuth();
  const [analyses, setAnalyses] = useState<AnalysisRecord[]>([]);
  const [trends, setTrends] = useState<{ date: string; emotion: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const [userAnalyses, emotionTrends] = await Promise.all([
          dbService.getUserAnalyses(user.uid, 20),
          dbService.getEmotionTrends(user.uid, 7)
        ]);

        setAnalyses(userAnalyses);
        setTrends(emotionTrends);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [user]);

  const getEmotionStats = () => {
    const emotionCounts: { [key: string]: number } = {};
    analyses.forEach(analysis => {
      const emotion = analysis.emotion.emotion;
      emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
    });

    return Object.entries(emotionCounts).map(([emotion, count]) => ({
      emotion,
      count,
      percentage: Math.round((count / analyses.length) * 100)
    }));
  };

  const getWeeklyTrends = () => {
    const weeklyData: { [key: string]: { [emotion: string]: number } } = {};
    
    trends.forEach(trend => {
      const date = new Date(trend.date).toLocaleDateString('en-US', { weekday: 'short' });
      if (!weeklyData[date]) {
        weeklyData[date] = {};
      }
      weeklyData[date][trend.emotion] = (weeklyData[date][trend.emotion] || 0) + trend.count;
    });

    return Object.entries(weeklyData).map(([day, emotions]) => ({
      day,
      ...emotions
    }));
  };

  const emotionColors = {
    happy: '#10B981',
    sad: '#3B82F6', 
    angry: '#EF4444',
    anxious: '#F59E0B',
    frustrated: '#F97316',
    calm: '#14B8A6',
    excited: '#8B5CF6',
    neutral: '#6B7280'
  };

  const pieData = getEmotionStats().map(stat => ({
    name: stat.emotion,
    value: stat.count,
    color: emotionColors[stat.emotion as keyof typeof emotionColors] || '#6B7280'
  }));

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Your Emotional Journey
          </h1>
          <p className="text-gray-600">
            Track your emotional patterns and communication improvements
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Analyses</p>
                <p className="text-3xl font-bold text-gray-900">{analyses.length}</p>
              </div>
              <Brain className="text-indigo-500" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">This Week</p>
                <p className="text-3xl font-bold text-gray-900">{trends.length}</p>
              </div>
              <Calendar className="text-green-500" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Most Common</p>
                <p className="text-lg font-bold text-gray-900 capitalize">
                  {getEmotionStats()[0]?.emotion || 'N/A'}
                </p>
              </div>
              <Heart className="text-red-500" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Improvement</p>
                <p className="text-3xl font-bold text-green-600">+24%</p>
              </div>
              <TrendingUp className="text-green-500" size={32} />
            </div>
          </div>
        </motion.div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Emotion Distribution */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Emotion Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {getEmotionStats().map(stat => (
                <div key={stat.emotion} className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: emotionColors[stat.emotion as keyof typeof emotionColors] }}
                  />
                  <span className="text-sm text-gray-600 capitalize">
                    {stat.emotion} ({stat.percentage}%)
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Weekly Trends */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Weekly Emotion Trends
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={getWeeklyTrends()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                {Object.keys(emotionColors).map(emotion => (
                  <Bar
                    key={emotion}
                    dataKey={emotion}
                    stackId="emotions"
                    fill={emotionColors[emotion as keyof typeof emotionColors]}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Recent Analyses */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            Recent Analyses
          </h3>
          <div className="space-y-4">
            {analyses.slice(0, 5).map((analysis, index) => (
              <motion.div
                key={analysis.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
              >
                <div className="flex items-center space-x-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold"
                    style={{ backgroundColor: emotionColors[analysis.emotion.emotion as keyof typeof emotionColors] }}
                  >
                    {analysis.emotion.emotion.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 capitalize">
                      {analysis.emotion.emotion}
                    </p>
                    <p className="text-sm text-gray-600 truncate max-w-md">
                      "{analysis.originalText}"
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">
                    {analysis.timestamp.toDate().toLocaleDateString()}
                  </p>
                  <p className="text-xs text-gray-400">
                    {analysis.emotion.confidence}% confidence
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white"
        >
          <h3 className="text-xl font-semibold mb-4">Personalized Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <h4 className="font-medium mb-2">Communication Style</h4>
              <p className="text-sm opacity-90">
                You're becoming more constructive in your communication approach.
              </p>
            </div>
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <h4 className="font-medium mb-2">Emotional Awareness</h4>
              <p className="text-sm opacity-90">
                Your emotional intelligence has improved by 24% this week.
              </p>
            </div>
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <h4 className="font-medium mb-2">Growth Opportunity</h4>
              <p className="text-sm opacity-90">
                Try practicing calm responses when feeling frustrated.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}