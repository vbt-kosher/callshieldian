
import { useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface StatusBannerProps {
  recordingEnabled: boolean;
}

const StatusBanner = ({ recordingEnabled }: StatusBannerProps) => {
  const navigate = useNavigate();
  
  return (
    <Card className={`p-4 flex items-center space-x-3
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
  );
};

export default StatusBanner;
