
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  PlusCircle,
  Search,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
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

import Header from '@/components/Header';
import BlacklistItem from '@/components/BlacklistItem';
import { useApp } from '@/context/AppContext';

const Blacklist = () => {
  const navigate = useNavigate();
  const { blacklistedNumbers, addToBlacklist, clearData } = useApp();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [clearDialogOpen, setClearDialogOpen] = useState(false);
  const [newPhoneNumber, setNewPhoneNumber] = useState('+1 (555) ');
  const [newReason, setNewReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Filter blacklisted numbers based on search query
  const filteredNumbers = blacklistedNumbers.filter(item =>
    item.phoneNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.reason && item.reason.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  // Handle add to blacklist
  const handleAddToBlacklist = async () => {
    if (!newPhoneNumber) {
      return;
    }
    
    setIsLoading(true);
    // Simulate API delay for better UX
    await new Promise(resolve => setTimeout(resolve, 600));
    addToBlacklist(newPhoneNumber, newReason);
    setIsLoading(false);
    setNewPhoneNumber('+1 (555) ');
    setNewReason('');
    setAddDialogOpen(false);
  };
  
  // Handle clear all
  const handleClearAll = async () => {
    setIsLoading(true);
    // Simulate API delay for better UX
    await new Promise(resolve => setTimeout(resolve, 800));
    clearData();
    setIsLoading(false);
    setClearDialogOpen(false);
  };
  
  return (
    <div className="min-h-screen flex flex-col pb-20">
      <Header />
      
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 pt-24 pb-4">
        {/* Header Section */}
        <section className="mb-8 animate-slide-up">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight flex items-center">
                <Shield className="mr-2 h-7 w-7 text-primary/80" />
                Blacklisted Numbers
              </h1>
              <p className="text-muted-foreground mt-2">
                Manage phone numbers that have been blacklisted to prevent future calls.
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="sm"
                className="subtle-ring-focus"
                onClick={() => setAddDialogOpen(true)}
              >
                <PlusCircle className="mr-1.5 h-4 w-4" />
                Add Number
              </Button>
              
              {blacklistedNumbers.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive border-destructive/20 hover:bg-destructive/10 subtle-ring-focus"
                  onClick={() => setClearDialogOpen(true)}
                >
                  <Trash2 className="mr-1.5 h-4 w-4" />
                  Clear All
                </Button>
              )}
            </div>
          </div>
        </section>
        
        {/* Search and Filter */}
        {blacklistedNumbers.length > 0 && (
          <div className="mb-6 relative animate-slide-up" style={{ animationDelay: '100ms' }}>
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-4 w-4 text-muted-foreground" />
            </div>
            <Input
              type="search"
              placeholder="Search by phone number or reason..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 subtle-ring-focus"
            />
          </div>
        )}
        
        {/* Blacklist Grid */}
        {filteredNumbers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-slide-up" style={{ animationDelay: '150ms' }}>
            {filteredNumbers.map((item) => (
              <BlacklistItem 
                key={item.id} 
                blacklistedNumber={item} 
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center animate-scale-in">
            <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
              {searchQuery ? (
                <Search className="h-8 w-8 text-muted-foreground/70" />
              ) : (
                <Shield className="h-8 w-8 text-muted-foreground/70" />
              )}
            </div>
            
            <h3 className="text-lg font-medium mb-1">
              {searchQuery ? "No matching numbers found" : "No blacklisted numbers yet"}
            </h3>
            
            <p className="text-muted-foreground max-w-sm">
              {searchQuery ? (
                "Try searching with a different term or clear the search filter."
              ) : (
                "When a call is flagged as problematic, its number will be added to the blacklist."
              )}
            </p>
            
            {searchQuery ? (
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setSearchQuery('')}
              >
                Clear Search
              </Button>
            ) : (
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setAddDialogOpen(true)}
              >
                Add Number Manually
              </Button>
            )}
          </div>
        )}
      </main>
      
      {/* Add to Blacklist Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add to Blacklist</DialogTitle>
            <DialogDescription>
              Enter a phone number to add to the blacklist
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="phone-number">Phone Number</Label>
              <Input
                id="phone-number"
                value={newPhoneNumber}
                onChange={(e) => setNewPhoneNumber(e.target.value)}
                placeholder="+1 (555) 123-4567"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reason">Reason (optional)</Label>
              <Input
                id="reason"
                value={newReason}
                onChange={(e) => setNewReason(e.target.value)}
                placeholder="Spam, scam, etc."
              />
            </div>
          </div>
          
          <DialogFooter className="sm:justify-start">
            <Button
              type="button"
              onClick={handleAddToBlacklist}
              disabled={isLoading || !newPhoneNumber.trim()}
            >
              {isLoading ? "Adding..." : "Add to Blacklist"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setAddDialogOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Clear All Confirmation Dialog */}
      <AlertDialog open={clearDialogOpen} onOpenChange={setClearDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-destructive" />
              Clear all blacklisted numbers?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently remove all
              phone numbers from the blacklist.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleClearAll();
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isLoading}
            >
              {isLoading ? "Clearing..." : "Yes, clear all"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Blacklist;
