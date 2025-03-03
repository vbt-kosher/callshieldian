
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatisticsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  className?: string;
}

const StatisticsCard = ({
  title,
  value,
  description,
  icon: Icon,
  trend,
  trendValue,
  className
}: StatisticsCardProps) => {
  return (
    <Card className={cn("overflow-hidden h-full", className)}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        
        {(description || trend) && (
          <CardDescription className="mt-1 flex items-center text-xs">
            {description}
            
            {trend && trendValue && (
              <span 
                className={cn(
                  "ml-1.5 flex items-center",
                  trend === 'up' ? "text-green-600 dark:text-green-400" : 
                  trend === 'down' ? "text-red-600 dark:text-red-400" : 
                  "text-gray-500 dark:text-gray-400"
                )}
              >
                {trendValue}
              </span>
            )}
          </CardDescription>
        )}
      </CardContent>
    </Card>
  );
};

export default StatisticsCard;
