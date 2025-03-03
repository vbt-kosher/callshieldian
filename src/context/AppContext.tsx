
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';

// Mock data and types for demonstration
export type CallType = 'normal' | 'news' | 'sports' | 'inappropriate' | 'automated' | 'unknown';

export interface Call {
  id: string;
  phoneNumber: string;
  date: Date;
  duration: number; // in seconds
  type: CallType;
  transcription?: string;
  analyzed: boolean;
  flagged: boolean;
}

export interface BlacklistedNumber {
  id: string;
  phoneNumber: string;
  reason: string;
  dateAdded: Date;
}

interface AppContextType {
  calls: Call[];
  blacklistedNumbers: BlacklistedNumber[];
  recordingEnabled: boolean;
  setRecordingEnabled: (enabled: boolean) => void;
  addCall: (call: Omit<Call, 'id'>) => void;
  analyzeCall: (id: string) => void;
  flagCall: (id: string, flag: boolean) => void;
  getCallById: (id: string) => Call | undefined;
  addToBlacklist: (phoneNumber: string, reason: string) => void;
  removeFromBlacklist: (id: string) => void;
  isBlacklisted: (phoneNumber: string) => boolean;
  clearData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Sample mock data
const mockCalls: Call[] = [
  {
    id: '1',
    phoneNumber: '+1 (555) 123-4567',
    date: new Date(Date.now() - 86400000), // 1 day ago
    duration: 245, // 4:05
    type: 'normal',
    analyzed: true,
    flagged: false
  },
  {
    id: '2',
    phoneNumber: '+1 (555) 987-6543',
    date: new Date(Date.now() - 43200000), // 12 hours ago
    duration: 427, // 7:07
    type: 'news',
    transcription: 'This call contained discussions about current news events...',
    analyzed: true,
    flagged: true
  },
  {
    id: '3',
    phoneNumber: '+1 (555) 555-5555',
    date: new Date(Date.now() - 7200000), // 2 hours ago
    duration: 193, // 3:13
    type: 'automated',
    transcription: 'This call was with an automated system...',
    analyzed: true,
    flagged: true
  }
];

const mockBlacklist: BlacklistedNumber[] = [
  {
    id: '1',
    phoneNumber: '+1 (555) 987-6543',
    reason: 'News service',
    dateAdded: new Date(Date.now() - 43000000)
  },
  {
    id: '2',
    phoneNumber: '+1 (555) 555-5555',
    reason: 'Automated system',
    dateAdded: new Date(Date.now() - 7000000)
  }
];

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [calls, setCalls] = useState<Call[]>(mockCalls);
  const [blacklistedNumbers, setBlacklistedNumbers] = useState<BlacklistedNumber[]>(mockBlacklist);
  const [recordingEnabled, setRecordingEnabled] = useState<boolean>(false);

  const addCall = (call: Omit<Call, 'id'>) => {
    const newCall: Call = {
      ...call,
      id: Math.random().toString(36).substr(2, 9),
    };
    
    setCalls((prevCalls) => [newCall, ...prevCalls]);
    
    // If call is longer than 3 minutes (180 seconds), analyze it
    if (call.duration > 180) {
      setTimeout(() => {
        analyzeCall(newCall.id);
      }, 1000); // Mock delay for analysis
    }
  };

  const analyzeCall = (id: string) => {
    setCalls((prevCalls) => 
      prevCalls.map((call) => {
        if (call.id === id) {
          // Mock analysis logic - randomly assign call types for demo
          const types: CallType[] = ['normal', 'news', 'sports', 'inappropriate', 'automated'];
          const randomType = types[Math.floor(Math.random() * types.length)];
          const shouldFlag = randomType !== 'normal';
          
          return {
            ...call,
            type: randomType,
            analyzed: true,
            flagged: shouldFlag,
            transcription: `This call was analyzed and identified as ${randomType} content...`,
          };
        }
        return call;
      })
    );
    
    // Find the call after updating
    setTimeout(() => {
      const analyzedCall = calls.find(call => call.id === id);
      if (analyzedCall?.flagged) {
        toast({
          title: "Call Flagged",
          description: `Call to ${analyzedCall.phoneNumber} has been flagged as ${analyzedCall.type}.`,
          variant: "destructive",
        });
      }
    }, 500);
  };

  const flagCall = (id: string, flag: boolean) => {
    setCalls((prevCalls) =>
      prevCalls.map((call) => {
        if (call.id === id) {
          return { ...call, flagged: flag };
        }
        return call;
      })
    );
  };

  const getCallById = (id: string) => {
    return calls.find((call) => call.id === id);
  };

  const addToBlacklist = (phoneNumber: string, reason: string) => {
    const alreadyBlacklisted = blacklistedNumbers.some(
      (item) => item.phoneNumber === phoneNumber
    );

    if (alreadyBlacklisted) {
      toast({
        title: "Already Blacklisted",
        description: `${phoneNumber} is already in the blacklist.`,
      });
      return;
    }

    const newBlacklistedNumber: BlacklistedNumber = {
      id: Math.random().toString(36).substr(2, 9),
      phoneNumber,
      reason,
      dateAdded: new Date(),
    };

    setBlacklistedNumbers((prev) => [newBlacklistedNumber, ...prev]);
    
    toast({
      title: "Number Blacklisted",
      description: `${phoneNumber} has been added to the blacklist.`,
    });
  };

  const removeFromBlacklist = (id: string) => {
    setBlacklistedNumbers((prev) => prev.filter((item) => item.id !== id));
    
    toast({
      title: "Number Removed",
      description: "The number has been removed from the blacklist.",
    });
  };

  const isBlacklisted = (phoneNumber: string) => {
    return blacklistedNumbers.some((item) => item.phoneNumber === phoneNumber);
  };

  const clearData = () => {
    setCalls([]);
    setBlacklistedNumbers([]);
    toast({
      title: "Data Cleared",
      description: "All calls and blacklisted numbers have been cleared.",
    });
  };

  const value = {
    calls,
    blacklistedNumbers,
    recordingEnabled,
    setRecordingEnabled,
    addCall,
    analyzeCall,
    flagCall,
    getCallById,
    addToBlacklist,
    removeFromBlacklist,
    isBlacklisted,
    clearData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
