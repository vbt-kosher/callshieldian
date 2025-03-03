
import { useState } from 'react';
import { format } from 'date-fns';
import { Shield, Trash2, AlertCircle } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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

import { BlacklistedNumber, useApp } from '@/context/AppContext';
import { cn } from '@/lib/utils';

interface BlacklistItemProps {
  blacklistedNumber: BlacklistedNumber;
}

const BlacklistItem = ({ blacklistedNumber }: BlacklistItemProps) => {
  const { removeFromBlacklist } = useApp();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleDelete = async () => {
    setIsLoading(true);
    // Simulate API delay for better UX
    await new Promise(resolve => setTimeout(resolve, 600));
    removeFromBlacklist(blacklistedNumber.id);
    setIsLoading(false);
    setShowDeleteDialog(false);
  };
  
  return (
    <>
      <Card className="overflow-hidden animate-in-fast border-border/60">
        <CardHeader className="p-4 pb-2 flex flex-row items-start justify-between space-y-0">
          <div>
            <div className="font-medium flex items-center">
              <Shield className="h-4 w-4 mr-2 text-destructive/80" />
              {blacklistedNumber.phoneNumber}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              Added {format(blacklistedNumber.dateAdded, 'MMM d, yyyy')}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-4 pt-2 pb-3">
          <p className="text-sm text-muted-foreground">
            {blacklistedNumber.reason || "No reason provided"}
          </p>
        </CardContent>
        
        <CardFooter className="p-3 pt-0 border-t border-border/60 flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            className="text-xs h-8 text-destructive hover:text-destructive/90 hover:bg-destructive/10 subtle-ring-focus"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="mr-1.5 h-3.5 w-3.5" />
            Remove
          </Button>
        </CardFooter>
      </Card>
      
      <AlertDialog 
        open={showDeleteDialog} 
        onOpenChange={setShowDeleteDialog}
      >
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-destructive" />
              Remove from blacklist?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove {blacklistedNumber.phoneNumber} from the blacklist? This will allow calls to this number.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:justify-start">
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isLoading}
            >
              {isLoading ? "Removing..." : "Yes, remove it"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default BlacklistItem;
