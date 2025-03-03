
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  ShieldAlert, 
  Settings, 
  Menu as MenuIcon, 
  X
} from 'lucide-react';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Track scroll position for header styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Close mobile menu when changing routes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);
  
  const isActive = (path: string) => location.pathname === path;
  
  const navItems = [
    { name: 'Home', path: '/', icon: <Home className="h-4 w-4 mr-2" /> },
    { name: 'Blacklist', path: '/blacklist', icon: <ShieldAlert className="h-4 w-4 mr-2" /> },
    { name: 'Settings', path: '/settings', icon: <Settings className="h-4 w-4 mr-2" /> }
  ];
  
  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-350 ease-spring px-4 py-3",
        isScrolled ? "bg-background/80 backdrop-blur-md border-b" : "bg-transparent"
      )}
    >
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-foreground hover:opacity-90 transition-opacity"
        >
          <ShieldAlert className="h-6 w-6 text-primary" />
          <span className="font-semibold text-lg tracking-tight">CallShield</span>
        </button>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => (
            <Button
              key={item.path}
              variant={isActive(item.path) ? "secondary" : "ghost"}
              size="sm"
              onClick={() => navigate(item.path)}
              className={cn(
                "transition-all duration-250",
                isActive(item.path) 
                  ? "font-medium"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {item.icon}
              {item.name}
            </Button>
          ))}
        </nav>
        
        {/* Mobile Menu Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
        </Button>
      </div>
      
      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-background/95 backdrop-blur-md border-b shadow-lg md:hidden animate-slide-down">
          <nav className="max-w-5xl mx-auto py-2 px-4 flex flex-col space-y-1">
            {navItems.map((item) => (
              <Button
                key={item.path}
                variant={isActive(item.path) ? "secondary" : "ghost"}
                className={cn(
                  "justify-start",
                  isActive(item.path)
                    ? "font-medium"
                    : "text-muted-foreground hover:text-foreground"
                )}
                onClick={() => {
                  navigate(item.path);
                  setIsMenuOpen(false);
                }}
              >
                {item.icon}
                {item.name}
              </Button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
