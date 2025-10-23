import { useState, useEffect } from 'react';
import { Github, Linkedin, Mail, Download, Code, Sparkles, FileText, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import profileImage from '@/assets/chetanraj-profile.jpg';

interface AdminProfile {
  id: string;
  full_name: string;
  title: string;
  bio: string;
  profile_image_url: string;
  linkedin_url: string;
  github_url: string;
  location: string;
}

const HeroSection = () => {
  const [text, setText] = useState('');
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null);
  const titles = ['Cloud Engineer', 'Full Stack Developer', 'Database Engineer'];
  const [currentTitleIndex, setCurrentTitleIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  
  useEffect(() => {
    const currentTitle = titles[currentTitleIndex];
    let timeout: NodeJS.Timeout;

    if (!isDeleting && text === currentTitle) {
      // Pause before starting to delete
      timeout = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && text === '') {
      // Move to next title after deletion
      setIsDeleting(false);
      setCurrentTitleIndex((prev) => (prev + 1) % titles.length);
    } else {
      // Type or delete one character
      const typingSpeed = isDeleting ? 50 : 100;
      timeout = setTimeout(() => {
        setText(current => {
          if (isDeleting) {
            return current.slice(0, -1);
          } else {
            return currentTitle.slice(0, current.length + 1);
          }
        });
      }, typingSpeed);
    }

    return () => clearTimeout(timeout);
  }, [text, isDeleting, currentTitleIndex]);

  useEffect(() => {
    fetchAdminProfile();
    
    // Set up real-time subscription for profile updates
    const subscription = supabase
      .channel('admin_profile_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'admin_profiles' 
        }, 
        () => {
          fetchAdminProfile();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchAdminProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('public_admin_profile')
        .select('*')
        .maybeSingle();
      
      if (!error && data) {
        setAdminProfile(data);
      }
    } catch (error) {
      console.error('Error fetching admin profile:', error);
    }
  };

  const getSocialLinks = () => {
    const defaultLinks = [
      { icon: Github, href: 'https://github.com/chetanraj-2002', label: 'GitHub' },
      { icon: Linkedin, href: 'https://www.linkedin.com/in/chetanraj-jakanur-1425451b4/', label: 'LinkedIn' },
      { icon: Mail, href: 'mailto:chetanrajjakanur2002@gmail.com', label: 'Email' }
    ];

    if (adminProfile) {
      return [
        { icon: Github, href: adminProfile.github_url || defaultLinks[0].href, label: 'GitHub' },
        { icon: Linkedin, href: adminProfile.linkedin_url || defaultLinks[1].href, label: 'LinkedIn' },
        { icon: Mail, href: `mailto:${adminProfile.full_name}`, label: 'Email' }
      ];
    }

    return defaultLinks;
  };

  const socialLinks = getSocialLinks();

  return (
    <section id="home" className="min-h-screen flex items-center justify-center pt-20 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/10 rounded-full mix-blend-multiply filter blur-xl animate-float opacity-70"></div>
        <div className="absolute top-3/4 right-1/4 w-72 h-72 bg-accent/10 rounded-full mix-blend-multiply filter blur-xl animate-float opacity-70" style={{ animationDelay: '-2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-primary/5 rounded-full mix-blend-multiply filter blur-xl animate-float opacity-70" style={{ animationDelay: '-4s' }}></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8 animate-fade-in-up">
            <div className="space-y-6">
              <div className="flex items-center space-x-2 text-primary">
                <Sparkles className="w-5 h-5" />
                <span className="text-sm font-medium tracking-wide uppercase">Hello, I am</span>
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-display font-bold text-gradient leading-tight">
                {adminProfile?.full_name?.toUpperCase() || 'CHETANRAJ JAKANUR'}
              </h1>
              
              <div className="text-2xl lg:text-3xl font-medium text-muted-foreground min-h-[40px]">
                <span>
                  {text}
                </span>
              </div>
              
              <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
                {adminProfile?.bio || 'Full Stack Developer — Cloud Engineer — Database Engineer. Proficient in building dynamic web applications using MERN stack, Flask, and Flutter with hands-on experience in AI/ML models and cloud-based services.'}
              </p>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group p-4 rounded-xl card-glass hover-lift border border-border/50 backdrop-blur-sm"
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5 group-hover:text-primary transition-colors" />
                  </a>
                );
              })}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                className="btn-hero group"
                onClick={() => setIsResumeOpen(true)}
              >
                <FileText className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                View Resume
              </Button>
              <Button 
                variant="outline" 
                className="group border-primary/20 hover:border-primary/40"
                onClick={() => {
                  const projectsSection = document.getElementById('projects');
                  if (projectsSection) {
                    projectsSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                <Code className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
                View Projects
              </Button>
            </div>
          </div>

          {/* Profile Image */}
          <div className="flex justify-center lg:justify-end animate-scale-in">
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-accent opacity-75 blur-2xl animate-pulse-glow"></div>
              
              {/* Main image container */}
              <div className="relative w-80 h-80 rounded-full overflow-hidden card-glass animate-float border-2 border-primary/20">
                <img
                  src={adminProfile?.profile_image_url || profileImage}
                  alt={`${adminProfile?.full_name || 'CHETANRAJ JAKANUR'} - ${adminProfile?.title || 'Full Stack Developer'}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent"></div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full card-glass border border-primary/30 flex items-center justify-center animate-pulse-glow">
                <span className="text-3xl">💻</span>
              </div>
              <div className="absolute -bottom-6 -left-6 w-16 h-16 rounded-full card-glass border border-accent/30 flex items-center justify-center animate-float" style={{ animationDelay: '-1s' }}>
                <span className="text-2xl">🚀</span>
              </div>
              <div className="absolute top-1/2 -left-8 w-12 h-12 rounded-full card-glass border border-primary/20 flex items-center justify-center animate-float" style={{ animationDelay: '-3s' }}>
                <span className="text-lg">✨</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Resume Viewer Dialog */}
      <Dialog open={isResumeOpen} onOpenChange={setIsResumeOpen}>
        <DialogContent className="max-w-6xl h-[90vh] p-0">
          <DialogHeader className="px-6 py-4 border-b">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-semibold">Resume - {adminProfile?.full_name || 'Chetanraj Jakanur'}</DialogTitle>
              <Button
                variant="default"
                size="sm"
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = '/ChetanrajJakanur_Resume.pdf';
                  link.download = 'ChetanrajJakanur_Resume.pdf';
                  link.click();
                }}
                className="gap-2"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </Button>
            </div>
          </DialogHeader>
          <div className="flex-1 overflow-hidden">
            <iframe
              src="/ChetanrajJakanur_Resume.pdf"
              className="w-full h-full"
              title="Resume PDF Viewer"
            />
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default HeroSection;