
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useCallRecording } from '@/hooks/useCallRecording';

interface SimulateCallDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SimulateCallDialog = ({ open, onOpenChange }: SimulateCallDialogProps) => {
  const { makeTestCall } = useCallRecording();
  const [testPhoneNumber, setTestPhoneNumber] = useState('+1 (555) ');
  const [testDuration, setTestDuration] = useState('200');
  const [isLoading, setIsLoading] = useState(false);

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
      onOpenChange(false);
    } catch (error) {
      console.error("Error simulating call:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SimulateCallDialog;
