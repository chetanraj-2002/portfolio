import { Github, Linkedin, Mail, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import profileImage from '@/assets/profile-image.jpg';

const HeroSection = () => {
  const socialLinks = [
    { icon: Github, href: 'https://github.com', label: 'GitHub' },
    { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: Mail, href: 'mailto:your.email@example.com', label: 'Email' }
  ];

  return (
    <section id="home" className="min-h-screen flex items-center justify-center pt-20">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-xl text-muted-foreground">Hello, I am</h3>
              <h1 className="text-5xl lg:text-7xl font-bold text-gradient">
                Your Name
              </h1>
              <p className="text-xl text-muted-foreground max-w-lg">
                Elevating Possibilities Through Code: Bridging Academic Excellence with a Passion for Innovation.
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
                    className="p-3 rounded-lg bg-card border border-border hover-lift transition-all duration-300"
                    aria-label={social.label}
                  >
                    <Icon className="w-6 h-6" />
                  </a>
                );
              })}
            </div>

            {/* CTA Button */}
            <div>
              <Button className="btn-hero group">
                <Download className="w-4 h-4 mr-2 group-hover:animate-bounce" />
                Download Resume
              </Button>
            </div>
          </div>

          {/* Profile Image */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <div className="w-80 h-80 rounded-full overflow-hidden card-glass animate-float">
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-primary rounded-full flex items-center justify-center animate-pulse">
                <span className="text-2xl">💻</span>
              </div>
              <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-accent rounded-full flex items-center justify-center animate-bounce">
                <span className="text-lg">🚀</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;