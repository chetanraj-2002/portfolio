import { LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Footer = () => {
  const handleAdminLogin = () => {
    // This would open a login modal or redirect to admin page
    // For now, we'll show an alert about Supabase integration
    alert('Admin login requires Supabase integration. Please connect to Supabase first.');
  };

  return (
    <footer className="py-12 border-t border-border">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <div className="text-2xl font-bold text-gradient mb-2">Portfolio.</div>
            <p className="text-muted-foreground">
              © 2024 Your Name. All rights reserved.
            </p>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-sm text-muted-foreground">
              Built with React, TypeScript & Tailwind CSS
            </div>
            
            {/* Admin Login Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleAdminLogin}
              className="group"
            >
              <LogIn className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
              Admin Login
            </Button>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            This portfolio showcases my work and skills. For admin functionality like project management, 
            a backend database connection is required.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;