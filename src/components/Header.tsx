
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Phone, 
  Shield, 
  Settings, 
  Menu, 
  Code, 
  X,
  BellOff
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useApp } from '@/context/AppContext';
import { useIsMobile } from '@/hooks/use-mobile';

const Header = () => {
  const { recordingEnabled, setRecordingEnabled } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  // Close mobile menu on route change
  useEffect(() => {
    setShowMobileMenu(false);
  }, [location.pathname]);
  
  const toggleRecording = () => {
    setRecordingEnabled(!recordingEnabled);
  };
  
  const navItems = [
    {
      name: 'בית',
      path: '/',
      icon: Phone,
    },
    {
      name: 'דף שחור',
      path: '/blacklist',
      icon: Shield,
    },
    {
      name: 'CodeGuard',
      path: '/code-guard',
      icon: Code,
    },
    {
      name: 'הגדרות',
      path: '/settings',
      icon: Settings,
    }
  ];
  
  return (
    <header className="fixed top-0 left-0 w-full bg-background/80 backdrop-blur-sm border-b border-border/40 z-50">
      <div className="container flex items-center justify-between h-16 max-w-5xl mx-auto px-4">
        <div className="flex items-center">
          <Button
            className="mr-2"
            variant="ghost"
            size="icon"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            {showMobileMenu ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
            <span className="sr-only">תפריט</span>
          </Button>
          
          <Button
            variant="ghost"
            className="text-xl font-semibold tracking-tight flex items-center px-2"
            onClick={() => navigate('/')}
          >
            <Shield className="mr-2 h-5 w-5 text-primary" />
            CallShield
          </Button>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => (
            <Button
              key={item.path}
              variant="ghost"
              size="sm"
              className={cn(
                "flex items-center gap-1.5",
                location.pathname === item.path && "bg-accent text-accent-foreground"
              )}
              onClick={() => navigate(item.path)}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Button>
          ))}
        </nav>
        
        <div className="flex items-center">
          <Button
            variant={recordingEnabled ? "default" : "outline"}
            size="sm"
            className={cn(
              "hidden sm:flex gap-1.5",
              !recordingEnabled && "text-muted-foreground"
            )}
            onClick={toggleRecording}
          >
            {recordingEnabled ? (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive/60 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-destructive"></span>
                </span>
                הקלטה פעילה
              </>
            ) : (
              <>
                <BellOff className="h-4 w-4" />
                הקלטה כבויה
              </>
            )}
          </Button>
        </div>
      </div>
      
      {/* Mobile Navigation Overlay */}
      {showMobileMenu && (
        <div className="md:hidden border-t border-border/40">
          <nav className="container max-w-5xl mx-auto flex flex-col py-3 px-4 space-y-1">
            {navItems.map((item) => (
              <Button
                key={item.path}
                variant="ghost"
                size="sm"
                className={cn(
                  "justify-start w-full",
                  location.pathname === item.path && "bg-accent text-accent-foreground"
                )}
                onClick={() => navigate(item.path)}
              >
                <item.icon className="h-4 w-4 mr-2" />
                {item.name}
              </Button>
            ))}
            
            <div className="pt-2 mt-2 border-t border-border/60">
              <Button
                variant={recordingEnabled ? "default" : "outline"}
                size="sm"
                className={cn(
                  "w-full justify-start",
                  !recordingEnabled && "text-muted-foreground"
                )}
                onClick={toggleRecording}
              >
                {recordingEnabled ? (
                  <>
                    <span className="relative flex h-2 w-2 mr-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive/60 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-destructive"></span>
                    </span>
                    הקלטה פעילה
                  </>
                ) : (
                  <>
                    <BellOff className="h-4 w-4 mr-2" />
                    הקלטה כבויה
                  </>
                )}
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
