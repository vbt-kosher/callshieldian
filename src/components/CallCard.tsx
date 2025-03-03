
import { useState } from 'react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Phone, Clock, Shield, Flag, ArrowRight } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Call, useApp } from '@/context/AppContext';
import { 
  formatCallDuration, 
  getCallTypeLabel, 
  getCallTypeColor 
} from '@/utils/callAnalysis';
import { cn } from '@/lib/utils';

interface CallCardProps {
  call: Call;
  showActions?: boolean;
}

const CallCard = ({ call, showActions = true }: CallCardProps) => {
  const navigate = useNavigate();
  const { addToBlacklist, isBlacklisted } = useApp();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleViewDetails = () => {
    navigate(`/analysis/${call.id}`);
  };
  
  const handleBlacklist = async () => {
    setIsLoading(true);
    // Simulate API delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));
    addToBlacklist(
      call.phoneNumber, 
      call.type !== 'normal' ? `Flagged as ${call.type} content` : 'Manually blacklisted'
    );
    setIsLoading(false);
  };
  
  const alreadyBlacklisted = isBlacklisted(call.phoneNumber);
  
  return (
    <Card 
      className={cn(
        "overflow-hidden group transition-all duration-250 animate-in-fast border",
        call.flagged ? "border-destructive/20" : "border-border/60"
      )}
    >
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-base font-medium flex items-center">
            <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
            {call.phoneNumber}
          </CardTitle>
          
          {call.analyzed && (
            <Badge 
              variant="outline" 
              className={cn(
                "ml-2 text-xs font-normal", 
                getCallTypeColor(call.type)
              )}
            >
              {getCallTypeLabel(call.type)}
            </Badge>
          )}
        </div>
        
        <div className="flex items-center mt-1 text-sm text-muted-foreground">
          <Clock className="h-3 w-3 mr-1.5" />
          <span>{format(call.date, 'MMM d, h:mm a')}</span>
          <span className="mx-1.5">•</span>
          <span>{formatCallDuration(call.duration)}</span>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 pt-2 pb-3">
        {call.transcription ? (
          <p className="text-sm text-muted-foreground line-clamp-2 group-hover:line-clamp-3 transition-all">
            {call.transcription}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground italic">
            {call.analyzed ? "No transcription available" : "Waiting for analysis..."}
          </p>
        )}
      </CardContent>
      
      {showActions && (
        <CardFooter className="p-3 pt-0 flex justify-between gap-3 border-t border-border/60">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full text-xs h-8 subtle-ring-focus"
            onClick={handleViewDetails}
          >
            Details
            <ArrowRight className="ml-1.5 h-3 w-3" />
          </Button>
          
          {!alreadyBlacklisted && (
            <Button 
              variant="outline" 
              size="sm" 
              className={cn(
                "w-full text-xs h-8 subtle-ring-focus",
                call.flagged ? "text-destructive hover:text-destructive/90" : ""
              )}
              disabled={isLoading || alreadyBlacklisted}
              onClick={handleBlacklist}
            >
              <Shield className="mr-1.5 h-3 w-3" />
              Blacklist
            </Button>
          )}
          
          {alreadyBlacklisted && (
            <Badge variant="outline" className="h-8 text-xs border-yellow-300/50 bg-yellow-100/50 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800/30">
              <Shield className="mr-1.5 h-3 w-3" />
              Blacklisted
            </Badge>
          )}
        </CardFooter>
      )}
    </Card>
  );
};

export default CallCard;
