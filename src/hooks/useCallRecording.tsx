
import { useState, useEffect, useCallback } from 'react';
import { callRecorder, RecordingSession, simulateOutgoingCall } from '@/utils/recording';
import { toast } from '@/components/ui/use-toast';
import { useApp } from '@/context/AppContext';
import { transcribeAudio } from '@/utils/transcription';
import { hashData, obfuscatePhoneNumber } from '@/utils/encryption';

export const useCallRecording = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [activeSession, setActiveSession] = useState<RecordingSession | null>(null);
  const [securityVerified, setSecurityVerified] = useState<boolean>(false);
  const { addCall, isBlacklisted, recordingEnabled } = useApp();
  
  // Check permissions and security status on init
  useEffect(() => {
    const initialize = async () => {
      // Check recording permissions
      const permResult = await callRecorder.checkPermissions();
      setHasPermission(permResult);
      
      // Check if security token exists
      const hasToken = callRecorder.hasSecurityToken();
      setSecurityVerified(hasToken);
      
      // If no security token, create one
      if (!hasToken) {
        // In a real app, we'd verify device integrity here
        await verifyEnvironment();
      }
    };
    
    initialize();
  }, []);
  
  // Verify execution environment for security
  const verifyEnvironment = useCallback(async () => {
    try {
      // Check if running in a secure context
      const isSecureContext = window.isSecureContext;
      
      // In a real app, add additional checks:
      // - Check if running in an emulator
      // - Verify app signature
      // - Check for debugging tools
      // - Detect rooted/jailbroken devices
      
      if (isSecureContext) {
        console.log('Running in a secure context');
        return true;
      } else {
        console.warn('Not running in a secure context!');
        toast({
          title: "Security Warning",
          description: "Application is running in an insecure environment.",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error('Environment verification error:', error);
      return false;
    }
  }, []);
  
  // Request necessary permissions
  const requestPermissions = useCallback(async () => {
    try {
      const granted = await callRecorder.requestPermissions();
      setHasPermission(granted);
      
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
    
    // Check blacklist before attempting call
    if (isBlacklisted(phoneNumber)) {
      toast({
        title: "Call Blocked",
        description: `Number ${obfuscatePhoneNumber(phoneNumber)} is blacklisted.`,
        variant: "destructive",
      });
      return;
    }
    
    // Ensure permissions are granted
    if (!hasPermission) {
      const granted = await requestPermissions();
      if (!granted) return;
    }
    
    // Verify security status
    if (!securityVerified) {
      const verified = await verifyEnvironment();
      if (!verified) {
        toast({
          title: "Security Error",
          description: "Call cannot be made due to security concerns.",
          variant: "destructive",
        });
        return;
      }
      setSecurityVerified(true);
    }
    
    try {
      // Create a non-reversible hash of the phone number for logging
      const phoneHash = await hashData(phoneNumber);
      console.log(`Making call to hashed number: ${phoneHash.substring(0, 8)}...`);
      
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
  }, [hasPermission, requestPermissions, addCall, isBlacklisted, recordingEnabled, securityVerified, verifyEnvironment]);
  
  return {
    hasPermission,
    requestPermissions,
    activeSession,
    isRecording: !!activeSession,
    securityVerified,
    verifyEnvironment,
    makeTestCall
  };
};
