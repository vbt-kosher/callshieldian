
import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, MicOff, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PermissionRequestProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onRequest: () => Promise<boolean>;
  hasPermission: boolean | null;
  className?: string;
}

const PermissionRequest = ({
  title,
  description,
  icon,
  onRequest,
  hasPermission,
  className
}: PermissionRequestProps) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleRequestPermission = async () => {
    setIsLoading(true);
    try {
      await onRequest();
    } catch (error) {
      console.error("Error requesting permission:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-base font-medium flex items-center">
          {icon}
          {title}
        </CardTitle>
        <CardDescription className="text-sm mt-1">
          {description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-4 pt-2 pb-3">
        <div className="flex items-center space-x-2">
          <div
            className={cn(
              "h-2.5 w-2.5 rounded-full",
              hasPermission === true 
                ? "bg-green-500" 
                : hasPermission === false 
                  ? "bg-red-500" 
                  : "bg-amber-500"
            )}
          />
          <span className="text-sm">
            {hasPermission === true 
              ? "Permission granted" 
              : hasPermission === false 
                ? "Permission denied" 
                : "Permission status unknown"}
          </span>
        </div>
      </CardContent>
      
      <CardFooter className="p-3 pt-0 border-t border-border/60">
        <Button 
          variant="outline"
          size="sm"
          className="w-full subtle-ring-focus"
          disabled={isLoading || hasPermission === true}
          onClick={handleRequestPermission}
        >
          {isLoading 
            ? "Requesting..." 
            : hasPermission === true 
              ? "Already granted" 
              : "Request permission"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PermissionRequest;
