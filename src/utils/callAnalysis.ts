import { Call, CallType } from '@/context/AppContext';

// This is a mock implementation of call analysis
// In a real application, this would integrate with a backend service
// that uses AI to analyze the transcription

interface AnalysisResult {
  type: CallType;
  confidence: number;
  flagged: boolean;
}

export const analyzeTranscription = async (transcription: string): Promise<AnalysisResult> => {
  // Mock implementation - In a real app, this would call an AI service
  // to analyze the transcription
  
  console.log('Analyzing transcription:', transcription.substring(0, 50) + '...');
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Mock analysis logic - just checking for keywords in this demo
  const lowerText = transcription.toLowerCase();
  
  // Hebrew and English keywords
  if (lowerText.includes('news') || lowerText.includes('report') || 
      lowerText.includes('headlines') || lowerText.includes('חדשות') || 
      lowerText.includes('מנוי') || lowerText.includes('עיתון')) {
    return { type: 'news', confidence: 0.87, flagged: true };
  }
  
  if (lowerText.includes('sports') || lowerText.includes('game') || 
      lowerText.includes('score') || lowerText.includes('ספורט') || 
      lowerText.includes('משחק') || lowerText.includes('שער')) {
    return { type: 'sports', confidence: 0.92, flagged: true };
  }
  
  if (lowerText.includes('press 1') || lowerText.includes('automated') || 
      lowerText.includes('menu') || lowerText.includes('הקש') || 
      lowerText.includes('אוטומטי') || lowerText.includes('מערכת')) {
    return { type: 'automated', confidence: 0.95, flagged: true };
  }
  
  if (lowerText.includes('adult') || lowerText.includes('premium') || 
      lowerText.includes('charge') || lowerText.includes('פרימיום') || 
      lowerText.includes('חיוב') || lowerText.includes('תשלום')) {
    return { type: 'inappropriate', confidence: 0.89, flagged: true };
  }
  
  // Default to normal call if no patterns matched
  return { type: 'normal', confidence: 0.78, flagged: false };
};

export const formatCallDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const formatPhoneNumber = (phoneNumber: string): string => {
  // Simple formatting - in a real app, you would use a library like libphonenumber-js
  return phoneNumber;
};

export const getCallTypeLabel = (type: CallType): string => {
  const labels: Record<CallType, string> = {
    normal: 'שיחה רגילה',
    news: 'תוכן חדשותי',
    sports: 'תוכן ספורט',
    inappropriate: 'תוכן לא ראוי',
    automated: 'מערכת אוטומטית',
    unknown: 'לא ידוע'
  };
  
  return labels[type] || 'לא ידוע';
};

export const getCallTypeColor = (type: CallType): string => {
  const colors: Record<CallType, string> = {
    normal: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    news: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    sports: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    inappropriate: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    automated: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    unknown: 'bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-300'
  };
  
  return colors[type] || colors.unknown;
};
