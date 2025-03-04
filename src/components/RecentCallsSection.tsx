
import { useNavigate } from 'react-router-dom';
import { Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import CallCard from '@/components/CallCard';
import { Call } from '@/context/AppContext';

interface RecentCallsSectionProps {
  calls: Call[];
  onSimulateClick: () => void;
}

const RecentCallsSection = ({ calls, onSimulateClick }: RecentCallsSectionProps) => {
  const navigate = useNavigate();
  const sortedCalls = [...calls].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  const recentCalls = sortedCalls.slice(0, 5);
  
  return (
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
            onClick={onSimulateClick}
          >
            Simulate a test call
          </Button>
        </Card>
      )}
    </section>
  );
};

export default RecentCallsSection;
