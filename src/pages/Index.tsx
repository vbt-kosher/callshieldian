
import { useState, useEffect } from 'react';
import { useCallRecording } from '@/hooks/useCallRecording';
import { useApp } from '@/context/AppContext';
import Header from '@/components/Header';
import StatusBanner from '@/components/StatusBanner';
import StatisticsSection from '@/components/StatisticsSection';
import RecentCallsSection from '@/components/RecentCallsSection';
import SimulateCallDialog from '@/components/SimulateCallDialog';

const Index = () => {
  const { calls, blacklistedNumbers, recordingEnabled } = useApp();
  const { hasPermission, requestPermissions } = useCallRecording();
  const [simulateOpen, setSimulateOpen] = useState(false);
  
  useEffect(() => {
    const checkPermissions = async () => {
      if (hasPermission === null || hasPermission === false) {
        await requestPermissions();
      }
    };
    
    if (recordingEnabled) {
      checkPermissions();
    }
  }, [hasPermission, requestPermissions, recordingEnabled]);
  
  return (
    <div className="min-h-screen flex flex-col pb-20">
      <Header />
      
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 pt-24 pb-4">
        <section className="mb-8 animate-slide-up">
          <h1 className="text-3xl font-semibold tracking-tight">
            CallShield
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Monitor and protect your calls. The app automatically analyzes outgoing calls 
            to identify and filter potentially problematic numbers.
          </p>
          
          <StatusBanner recordingEnabled={recordingEnabled} />
        </section>
        
        <StatisticsSection 
          calls={calls} 
          blacklistedNumbers={blacklistedNumbers}
          onSimulateClick={() => setSimulateOpen(true)}
        />
        
        <RecentCallsSection 
          calls={calls}
          onSimulateClick={() => setSimulateOpen(true)}
        />
      </main>
      
      <SimulateCallDialog 
        open={simulateOpen} 
        onOpenChange={setSimulateOpen} 
      />
    </div>
  );
};

export default Index;
