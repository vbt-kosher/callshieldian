
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, Shield, Clock, FileText, BarChart3, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';

import Header from '@/components/Header';
import CallCard from '@/components/CallCard';
import StatisticsCard from '@/components/StatisticsCard';
import { useApp, Call } from '@/context/AppContext';
import { useCallRecording } from '@/hooks/useCallRecording';

const Index = () => {
  const navigate = useNavigate();
  const { calls, blacklistedNumbers, recordingEnabled } = useApp();
  const { hasPermissions, requestPermissions, makeTestCall } = useCallRecording();
  
  const [simulateOpen, setSimulateOpen] = useState(false);
  const [testPhoneNumber, setTestPhoneNumber] = useState('+1 (555) ');
  const [testDuration, setTestDuration] = useState('200');
  const [isLoading, setIsLoading] = useState(false);
  
  // Calculate statistics
  const totalCalls = calls.length;
  const flaggedCalls = calls.filter(call => call.flagged).length;
  const totalBlacklisted = blacklistedNumbers.length;
  
  // Sort calls by date (newest first)
  const sortedCalls = [...calls].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  // Get recent calls (last 5)
  const recentCalls = sortedCalls.slice(0, 5);
  
  // Handle simulate call
  const handleSimulateCall = async () => {
    if (!testPhoneNumber || !testDuration) {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid phone number and duration.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    try {
      await makeTestCall(testPhoneNumber, parseInt(testDuration));
      setSimulateOpen(false);
    } catch (error) {
      console.error("Error simulating call:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Check permissions on load
  useEffect(() => {
    const checkPermissions = async () => {
      if (hasPermissions === null || hasPermissions === false) {
        // If no permissions, request them (in a real app, we'd show a UI first)
        await requestPermissions();
      }
    };
    
    if (recordingEnabled) {
      checkPermissions();
    }
  }, [hasPermissions, requestPermissions, recordingEnabled]);
  
  return (
    <div className="min-h-screen flex flex-col pb-20">
      <Header />
      
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 pt-24 pb-4">
        {/* Welcome Section */}
        <section className="mb-8 animate-slide-up">
          <h1 className="text-3xl font-semibold tracking-tight">
            CallShield
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Monitor and protect your calls. The app automatically analyzes outgoing calls 
            to identify and filter potentially problematic numbers.
          </p>
          
          {/* Status banner */}
          <Card className={`mt-6 p-4 flex items-center space-x-3
            ${recordingEnabled 
              ? "bg-green-100 dark:bg-green-950/30 border-green-200 dark:border-green-900/50" 
              : "bg-amber-100 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/50"
            }`}>
            <div className="rounded-full p-2 bg-white/80 dark:bg-black/10">
              <Shield className={`h-5 w-5 
                ${recordingEnabled 
                  ? "text-green-600 dark:text-green-400" 
                  : "text-amber-600 dark:text-amber-400"
                }`} 
              />
            </div>
            <div className="flex-1">
              <h3 className={`font-medium 
                ${recordingEnabled 
                  ? "text-green-800 dark:text-green-300" 
                  : "text-amber-800 dark:text-amber-300"
                }`}>
                Call monitoring is {recordingEnabled ? "active" : "inactive"}
              </h3>
              <p className={`text-sm 
                ${recordingEnabled 
                  ? "text-green-700/80 dark:text-green-400/80" 
                  : "text-amber-700/80 dark:text-amber-400/80"
                }`}>
                {recordingEnabled
                  ? "CallShield is monitoring your outgoing calls longer than 3 minutes."
                  : "Enable call recording in settings to start monitoring calls."}
              </p>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              className={`shrink-0 border 
                ${recordingEnabled 
                  ? "bg-green-50 border-green-200 hover:bg-green-100 text-green-700 dark:bg-green-900/20 dark:border-green-900/50 dark:text-green-300 dark:hover:bg-green-900/30" 
                  : "bg-amber-50 border-amber-200 hover:bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:border-amber-900/50 dark:text-amber-300 dark:hover:bg-amber-900/30"
                }`}
              onClick={() => navigate('/settings')}
            >
              {recordingEnabled ? "Settings" : "Enable"}
            </Button>
          </Card>
        </section>
        
        {/* Statistics Section */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium">Call Statistics</h2>
            <Button 
              variant="outline" 
              size="sm"
              className="text-xs subtle-ring-focus"
              onClick={() => setSimulateOpen(true)}
            >
              <PlusCircle className="mr-1 h-3.5 w-3.5" />
              Simulate Call
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <StatisticsCard
              title="Total Calls"
              value={totalCalls}
              description="Monitored calls"
              icon={Phone}
            />
            <StatisticsCard
              title="Flagged Calls"
              value={flaggedCalls}
              description={`${Math.round((flaggedCalls / (totalCalls || 1)) * 100)}% of total`}
              icon={FileText}
              trend={flaggedCalls > 0 ? "up" : "neutral"}
              trendValue={flaggedCalls > 0 ? `+${flaggedCalls}` : "0"}
            />
            <StatisticsCard
              title="Blacklisted Numbers"
              value={totalBlacklisted}
              description="Blocked numbers"
              icon={Shield}
            />
            <StatisticsCard
              title="Avg. Call Duration"
              value={
                totalCalls > 0 
                  ? `${Math.round(calls.reduce((sum, call) => sum + call.duration, 0) / totalCalls / 60)}m`
                  : "0m"
              }
              description="Per monitored call"
              icon={Clock}
            />
          </div>
        </section>
        
        {/* Recent Calls Section */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium">Recent Calls</h2>
            {calls.length > 5 && (
              <Button
                variant="ghost"
                size="sm"
                className="text-primary"
                onClick={() => navigate('/calls')}
              >
                View all
              </Button>
            )}
          </div>
          
          {recentCalls.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recentCalls.map((call) => (
                <CallCard key={call.id} call={call} />
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center border-dashed">
              <div className="mx-auto w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                <Phone className="h-6 w-6 text-muted-foreground/70" />
              </div>
              <h3 className="text-lg font-medium mb-1">No calls recorded yet</h3>
              <p className="text-muted-foreground max-w-sm mx-auto">
                Calls longer than 3 minutes will be automatically recorded and analyzed.
              </p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setSimulateOpen(true)}
              >
                Simulate a test call
              </Button>
            </Card>
          )}
        </section>
      </main>
      
      {/* Simulate Call Dialog */}
      <Dialog open={simulateOpen} onOpenChange={setSimulateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Simulate Call</DialogTitle>
            <DialogDescription>
              Create a simulated call for testing purposes
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={testPhoneNumber}
                onChange={(e) => setTestPhoneNumber(e.target.value)}
                placeholder="+1 (555) 123-4567"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">
                Duration (seconds)
                <span className="text-muted-foreground ml-1 text-xs">
                  (minimum 180s for recording)
                </span>
              </Label>
              <Input
                id="duration"
                type="number"
                min="30"
                max="600"
                value={testDuration}
                onChange={(e) => setTestDuration(e.target.value)}
                placeholder="200"
              />
            </div>
          </div>
          
          <DialogFooter className="sm:justify-start">
            <Button
              type="button"
              variant="default"
              onClick={handleSimulateCall}
              disabled={isLoading}
            >
              {isLoading ? "Simulating..." : "Simulate Call"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setSimulateOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
