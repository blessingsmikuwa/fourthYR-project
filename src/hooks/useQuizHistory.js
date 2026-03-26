import { useState, useEffect } from 'react';

// Custom hook for managing quiz history
// Designed to easily switch between localStorage and API calls
export const useQuizHistory = () => {
  const [quizHistory, setQuizHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load quiz history on mount
  useEffect(() => {
    loadQuizHistory();
  }, []);

  // Save to localStorage whenever history changes
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('quizHistory', JSON.stringify(quizHistory));
    }
  }, [quizHistory, loading]);

  const loadQuizHistory = async () => {
    try {
      setLoading(true);

      // TODO: Replace with API call
      // const response = await fetch('/api/quizzes/history');
      // const data = await response.json();
      // setQuizHistory(data.quizzes);

      // For now, load from localStorage
      const saved = localStorage.getItem('quizHistory');
      if (saved) {
        setQuizHistory(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading quiz history:', error);
    } finally {
      setLoading(false);
    }
  };

  const addQuizRecord = async (quizRecord) => {
    try {
      // TODO: Send to backend API
      // await fetch('/api/quizzes/complete', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(quizRecord)
      // });

      // For now, add to local state
      setQuizHistory(prev => [quizRecord, ...prev]);
    } catch (error) {
      console.error('Error saving quiz record:', error);
      throw error;
    }
  };

  const getQuizStats = () => {
    const totalQuizzes = quizHistory.length;
    const averageScore = totalQuizzes > 0
      ? Math.round(quizHistory.reduce((sum, quiz) => sum + quiz.percentage, 0) / totalQuizzes)
      : 0;

    return {
      totalQuizzes,
      averageScore,
      recentQuizzes: quizHistory.slice(0, 5)
    };
  };

  return {
    quizHistory,
    loading,
    addQuizRecord,
    getQuizStats,
    refreshHistory: loadQuizHistory
  };
};