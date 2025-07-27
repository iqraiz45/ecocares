import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  getDocs, 
  Timestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { EmotionAnalysis, MessageRewrite } from './openai';

export interface AnalysisRecord {
  id?: string;
  userId: string;
  timestamp: Timestamp;
  originalText: string;
  emotion: EmotionAnalysis;
  rewrittenVersions: MessageRewrite;
  audioUrl?: string;
}

export class DatabaseService {
  async saveAnalysis(analysis: Omit<AnalysisRecord, 'id' | 'timestamp'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'analyses'), {
        ...analysis,
        timestamp: Timestamp.now()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error saving analysis:', error);
      throw error;
    }
  }

  async getUserAnalyses(userId: string, limit = 50): Promise<AnalysisRecord[]> {
    try {
      const q = query(
        collection(db, 'analyses'),
        where('userId', '==', userId),
        orderBy('timestamp', 'desc')
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as AnalysisRecord));
    } catch (error) {
      console.error('Error fetching user analyses:', error);
      throw error;
    }
  }

  async getEmotionTrends(userId: string, days = 7): Promise<{ date: string; emotion: string; count: number }[]> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      const q = query(
        collection(db, 'analyses'),
        where('userId', '==', userId),
        where('timestamp', '>=', Timestamp.fromDate(cutoffDate)),
        orderBy('timestamp', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const emotionCounts: { [key: string]: { [emotion: string]: number } } = {};

      querySnapshot.docs.forEach(doc => {
        const data = doc.data() as AnalysisRecord;
        const date = data.timestamp.toDate().toDateString();
        const emotion = data.emotion.emotion;

        if (!emotionCounts[date]) {
          emotionCounts[date] = {};
        }
        emotionCounts[date][emotion] = (emotionCounts[date][emotion] || 0) + 1;
      });

      // Convert to array format for charting
      const trends: { date: string; emotion: string; count: number }[] = [];
      Object.entries(emotionCounts).forEach(([date, emotions]) => {
        Object.entries(emotions).forEach(([emotion, count]) => {
          trends.push({ date, emotion, count });
        });
      });

      return trends;
    } catch (error) {
      console.error('Error fetching emotion trends:', error);
      return [];
    }
  }
}

export const dbService = new DatabaseService();