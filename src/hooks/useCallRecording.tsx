
import { useState, useEffect, useCallback } from 'react';
import { callRecorder, RecordingSession, simulateOutgoingCall } from '@/utils/recording';
import { toast } from '@/components/ui/use-toast';
import { useApp } from '@/context/AppContext';
import { transcribeAudio } from '@/utils/transcription';

export const useCallRecording = () => {
  const [hasPermissions, setHasPermissions] = useState<boolean | null>(null);
  const [activeSession, setActiveSession] = useState<RecordingSession | null>(null);
  const { addCall, isBlacklisted, recordingEnabled } = useApp();
  
  // Check permissions on init
  useEffect(() => {
    const checkPermissions = async () => {
      const result = await callRecorder.checkPermissions();
      setHasPermissions(result);
    };
    
    checkPermissions();
  }, []);
  
  // Request necessary permissions
  const requestPermissions = useCallback(async () => {
    try {
      const granted = await callRecorder.requestPermissions();
      setHasPermissions(granted);
      
      if (granted) {
        toast({
          title: "Permissions Granted",
          description: "Call recording permissions have been granted.",
        });
      } else {
        toast({
          title: "Permission Denied",
          description: "Call recording requires additional permissions.",
          variant: "destructive",
        });
      }
      
      return granted;
    } catch (error) {
      console.error('Error requesting permissions:', error);
      toast({
        title: "Permission Error",
        description: "Failed to request necessary permissions.",
        variant: "destructive",
      });
      return false;
    }
  }, []);
  
  // Simulate an outgoing call (for demo purposes)
  const makeTestCall = useCallback(async (phoneNumber: string, duration: number = 200) => {
    if (!recordingEnabled) {
      toast({
        title: "Recording Disabled",
        description: "Enable call recording in settings first.",
        variant: "destructive",
      });
      return;
    }
    
    if (isBlacklisted(phoneNumber)) {
      toast({
        title: "Call Blocked",
        description: `Number ${phoneNumber} is blacklisted.`,
        variant: "destructive",
      });
      return;
    }
    
    if (!hasPermissions) {
      const granted = await requestPermissions();
      if (!granted) return;
    }
    
    try {
      // In a real app, this would hook into actual phone calls
      // Here we're just simulating for demonstration
      const session = await simulateOutgoingCall(phoneNumber, duration);
      
      // For calls over 3 minutes (180 seconds), add to the calls list
      if (duration >= 180) {
        const mockAudioData = 'data:audio/wav;base64,UklGRiXuAgBXQVZFZm10IBAAAAABAAEA...';
        const transcriptionResult = await transcribeAudio(mockAudioData);
        
        addCall({
          phoneNumber,
          date: new Date(),
          duration,
          type: 'unknown',
          transcription: transcriptionResult.text,
          analyzed: false,
          flagged: false
        });
      }
      
      return session;
    } catch (error) {
      console.error('Error making test call:', error);
      toast({
        title: "Call Error",
        description: "Failed to complete test call.",
        variant: "destructive",
      });
      return null;
    }
  }, [hasPermissions, requestPermissions, addCall, isBlacklisted, recordingEnabled]);
  
  return {
    hasPermissions,
    requestPermissions,
    activeSession,
    isRecording: !!activeSession,
    makeTestCall
  };
};
