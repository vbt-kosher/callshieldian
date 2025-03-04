import { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Shield, 
  Mic, 
  Bell, 
  Phone,
  AlertTriangle,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import Header from '@/components/Header';
import PermissionRequest from '@/components/PermissionRequest';
import { useApp } from '@/context/AppContext';
import { useCallRecording } from '@/hooks/useCallRecording';
import { toast } from '@/components/ui/use-toast';

const Settings = () => {
  const { recordingEnabled, setRecordingEnabled, clearData } = useApp();
  const { hasPermission, requestPermissions } = useCallRecording();
  
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [autoBlacklist, setAutoBlacklist] = useState(true);
  const [minDuration, setMinDuration] = useState(180); // 3 minutes in seconds
  
  const handleToggleRecording = async (enabled: boolean) => {
    if (enabled && !hasPermission) {
      const granted = await requestPermissions();
      if (!granted) {
        toast({
          title: "Permission Required",
          description: "Call recording requires microphone and phone permissions.",
          variant: "destructive",
        });
        return;
      }
    }
    
    setRecordingEnabled(enabled);
    toast({
      title: enabled ? "Recording Enabled" : "Recording Disabled",
      description: enabled 
        ? "CallShield will now monitor your outgoing calls." 
        : "Call monitoring has been disabled.",
    });
  };
  
  const handleReset = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    clearData();
    setIsLoading(false);
    setShowResetDialog(false);
  };
  
  return (
    <div className="min-h-screen flex flex-col pb-20">
      <Header />
      
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 pt-24 pb-4">
        <section className="mb-8 animate-slide-up">
          <h1 className="text-3xl font-semibold tracking-tight flex items-center">
            <SettingsIcon className="mr-2 h-7 w-7 text-primary/80" />
            Settings
          </h1>
          <p className="text-muted-foreground mt-2">
            Configure your call monitoring and blacklist preferences.
          </p>
        </section>
        
        <div className="space-y-8">
          <section className="animate-slide-up" style={{ animationDelay: '50ms' }}>
            <h2 className="text-lg font-medium mb-4 flex items-center">
              <Phone className="mr-2 h-5 w-5 text-muted-foreground" />
              Call Monitoring
            </h2>
            
            <Card className="p-5">
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base" htmlFor="recording-toggle">
                      Enable Call Recording
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Record outgoing calls longer than 3 minutes
                    </p>
                  </div>
                  <Switch
                    id="recording-toggle"
                    checked={recordingEnabled}
                    onCheckedChange={handleToggleRecording}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base" htmlFor="notification-toggle">
                      Notifications
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Receive alerts when calls are flagged
                    </p>
                  </div>
                  <Switch
                    id="notification-toggle"
                    checked={notifications}
                    onCheckedChange={setNotifications}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base" htmlFor="blacklist-toggle">
                      Auto-Blacklist
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically add flagged numbers to blacklist
                    </p>
                  </div>
                  <Switch
                    id="blacklist-toggle"
                    checked={autoBlacklist}
                    onCheckedChange={setAutoBlacklist}
                  />
                </div>
              </div>
            </Card>
          </section>
          
          <section className="animate-slide-up" style={{ animationDelay: '100ms' }}>
            <h2 className="text-lg font-medium mb-4 flex items-center">
              <Shield className="mr-2 h-5 w-5 text-muted-foreground" />
              App Permissions
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <PermissionRequest
                title="Call Recording"
                description="Permission to record phone calls"
                icon={<Phone className="h-4 w-4 mr-2 text-primary/80" />}
                onRequest={requestPermissions}
                hasPermission={hasPermission}
              />
              
              <PermissionRequest
                title="Microphone Access"
                description="Permission to access the microphone"
                icon={<Mic className="h-4 w-4 mr-2 text-primary/80" />}
                onRequest={requestPermissions}
                hasPermission={hasPermission}
              />
            </div>
          </section>
          
          <section className="animate-slide-up" style={{ animationDelay: '150ms' }}>
            <h2 className="text-lg font-medium mb-4 flex items-center">
              <Info className="mr-2 h-5 w-5 text-muted-foreground" />
              Privacy Information
            </h2>
            
            <Card className="p-5 border-blue-200 dark:border-blue-800/50 bg-blue-50/50 dark:bg-blue-950/20">
              <div className="flex">
                <div className="shrink-0 mr-3">
                  <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">
                    Your Data Privacy
                  </h3>
                  <div className="mt-2 text-sm text-blue-700 dark:text-blue-400">
                    <p className="mb-2">
                      CallShield respects your privacy. Here's how we handle your data:
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>All call analysis is done on your device</li>
                      <li>Only phone numbers are sent to the control center, never call content</li>
                      <li>No personally identifiable information is collected</li>
                      <li>Your blacklist is stored only on your device</li>
                    </ul>
                  </div>
                </div>
              </div>
            </Card>
          </section>
          
          <section className="animate-slide-up" style={{ animationDelay: '200ms' }}>
            <h2 className="text-lg font-medium mb-4 flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5 text-muted-foreground" />
              Data Management
            </h2>
            
            <Card className="p-5">
              <div className="flex flex-col space-y-4">
                <div>
                  <h3 className="text-base font-medium">Reset Application Data</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Clear all recorded calls and blacklisted numbers. This action cannot be undone.
                  </p>
                </div>
                
                <div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="destructive"
                          onClick={() => setShowResetDialog(true)}
                        >
                          Reset All Data
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>This will delete all recorded calls and blacklisted numbers</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </Card>
          </section>
        </div>
      </main>
      
      <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-destructive" />
              Reset all application data?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete all
              recorded calls and blacklisted numbers from your device.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleReset();
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isLoading}
            >
              {isLoading ? "Resetting..." : "Yes, reset all data"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Settings;
