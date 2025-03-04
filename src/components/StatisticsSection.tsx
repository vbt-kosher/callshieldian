
import { PlusCircle, Phone, FileText, Shield, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import StatisticsCard from '@/components/StatisticsCard';
import { Call, BlacklistedNumber } from '@/context/AppContext';

interface StatisticsSectionProps {
  calls: Call[];
  blacklistedNumbers: BlacklistedNumber[];
  onSimulateClick: () => void;
}

const StatisticsSection = ({ 
  calls, 
  blacklistedNumbers, 
  onSimulateClick 
}: StatisticsSectionProps) => {
  const totalCalls = calls.length;
  const flaggedCalls = calls.filter(call => call.flagged).length;
  const totalBlacklisted = blacklistedNumbers.length;
  
  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium">Call Statistics</h2>
        <Button 
          variant="outline" 
          size="sm"
          className="text-xs subtle-ring-focus"
          onClick={onSimulateClick}
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
  );
};

export default StatisticsSection;
