import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function Navbar() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Home', path: '/', emoji: '🏠' },
    { name: 'Learn', path: '/learn', emoji: '📚' },
    { name: 'Playground', path: '/playground', emoji: '🎮' },
    { name: 'Exercises', path: '/exercises', emoji: '🎯' },
    { name: 'Quiz', path: '/quiz', emoji: '🏆' }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 hover:scale-105 transition-transform">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">🤖</span>
            </div>
            <span className="text-xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Word Feelings Lab
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={isActive(item.path) ? "default" : "ghost"}
                  className={`rounded-full transition-all duration-200 ${
                    isActive(item.path) 
                      ? 'bg-primary text-primary-foreground shadow-lg' 
                      : 'hover:bg-muted'
                  }`}
                >
                  <span className="mr-2">{item.emoji}</span>
                  {item.name}
                </Button>
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center">
              <div className={`w-4 h-0.5 bg-foreground transition-all duration-300 ${
                isMobileMenuOpen ? 'rotate-45 translate-y-1' : ''
              }`} />
              <div className={`w-4 h-0.5 bg-foreground mt-1 transition-all duration-300 ${
                isMobileMenuOpen ? 'opacity-0' : ''
              }`} />
              <div className={`w-4 h-0.5 bg-foreground mt-1 transition-all duration-300 ${
                isMobileMenuOpen ? '-rotate-45 -translate-y-1' : ''
              }`} />
            </div>
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link 
                  key={item.path} 
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Button
                    variant={isActive(item.path) ? "default" : "ghost"}
                    className={`w-full justify-start rounded-xl ${
                      isActive(item.path) 
                        ? 'bg-primary text-primary-foreground' 
                        : ''
                    }`}
                  >
                    <span className="mr-3">{item.emoji}</span>
                    {item.name}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}