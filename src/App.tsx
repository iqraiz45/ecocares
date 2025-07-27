import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Header } from './components/Header';
import { HomePage } from './pages/HomePage';
import { AnalyzePage } from './pages/AnalyzePage';
import { LiveAnalysisPage } from './pages/LiveAnalysisPage';
import { Dashboard } from './components/Dashboard';
import { AuthProvider, useAuthState } from './hooks/useAuth.tsx';

type View = 'home' | 'analyze' | 'live-analysis' | 'dashboard';

function AppContent() {
  const [currentView, setCurrentView] = useState<View>('home');
  const authState = useAuthState();

  const handleStartAnalysis = () => {
    setCurrentView('analyze');
  };

  const handleStartLiveAnalysis = () => {
    setCurrentView('live-analysis');
  };

  const handleViewChange = (view: View) => {
    setCurrentView(view);
  };

  const handleBackToHome = () => {
    setCurrentView('home');
  };

  if (authState.loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading EchoCare...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header currentView={currentView} onViewChange={handleViewChange} />
      
      <AnimatePresence mode="wait">
        {currentView === 'home' && (
          <HomePage 
            key="home" 
            onStartAnalysis={handleStartAnalysis}
            onStartLiveAnalysis={handleStartLiveAnalysis}
          />
        )}
        {currentView === 'analyze' && (
          <AnalyzePage key="analyze" onBack={handleBackToHome} />
        )}
        {currentView === 'live-analysis' && (
          <LiveAnalysisPage key="live-analysis" onBack={handleBackToHome} />
        )}
        {currentView === 'dashboard' && authState.user && (
          <Dashboard key="dashboard" />
        )}
      </AnimatePresence>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;