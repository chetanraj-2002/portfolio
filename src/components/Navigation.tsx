import { useState, useEffect } from 'react';
import { Menu, X, Settings, LogOut, User as UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Get initial session
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const navLinks = [
    { href: '#home', label: 'Home' },
    { href: '#about', label: 'About' },
    { href: '#projects', label: 'Projects' },
    { href: '#certificates', label: 'Certificates' },
    { href: '#contact', label: 'Contact' }
  ];

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-background/80 backdrop-blur-lg border-b border-border' : 'bg-transparent'
    }`}>
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            CHETANRAJ JAKANUR
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollToSection(link.href)}
                className="text-foreground hover:text-primary transition-colors duration-300"
              >
                {link.label}
              </button>
            ))}
            
            {/* Admin Controls */}
            <div className="flex items-center gap-4 ml-8 border-l border-border/50 pl-8">
              {user ? (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/admin')}
                    className="flex items-center gap-2"
                  >
                    <Settings className="w-4 h-4" />
                    Admin
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSignOut}
                    className="flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/auth')}
                  className="flex items-center gap-2"
                >
                  <UserIcon className="w-4 h-4" />
                  Admin Login
                </Button>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-border bg-background/95 backdrop-blur-lg rounded-lg border border-border/50">
            <div className="flex flex-col space-y-4 p-4">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollToSection(link.href)}
                  className="text-left text-foreground hover:text-primary transition-colors duration-300 p-2 rounded-md hover:bg-accent/50"
                >
                  {link.label}
                </button>
              ))}
              
              {/* Mobile Admin Controls */}
              <div className="border-t border-border/50 pt-4 mt-4">
                {user ? (
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        navigate('/admin');
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center gap-2 justify-start"
                    >
                      <Settings className="w-4 h-4" />
                      Admin Dashboard
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        handleSignOut();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center gap-2 justify-start"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      navigate('/auth');
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center gap-2 justify-start w-full"
                  >
                    <UserIcon className="w-4 h-4" />
                    Admin Login
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navigation;
