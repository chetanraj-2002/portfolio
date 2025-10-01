import { useState, useEffect, useRef } from 'react';
import { Code, Users, Award } from 'lucide-react';

const StatsSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [counts, setCounts] = useState({
    projects: 0,
    clients: 0,
    awards: 0
  });
  
  const sectionRef = useRef<HTMLDivElement>(null);

  const stats = [
    {
      icon: Code,
      target: 50,
      label: 'Projects Completed',
      suffix: '+',
      key: 'projects' as keyof typeof counts
    },
    {
      icon: Users,
      target: 25,
      label: 'Happy Clients',
      suffix: '+',
      key: 'clients' as keyof typeof counts
    },
    {
      icon: Award,
      target: 5,
      label: 'Awards Won',
      suffix: '',
      key: 'awards' as keyof typeof counts
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const animateCounter = (target: number, key: keyof typeof counts) => {
      const duration = 2000;
      const steps = 60;
      const increment = target / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        setCounts(prev => ({ ...prev, [key]: Math.floor(current) }));
      }, duration / steps);
    };

    stats.forEach(stat => {
      animateCounter(stat.target, stat.key);
    });
  }, [isVisible]);

  return (
    <section ref={sectionRef} className="py-20 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-display font-bold text-gradient mb-4">By the Numbers</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Some milestones from my journey as a developer
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="text-center space-y-4 group"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                
                <div className="space-y-2">
                  <div className="text-3xl lg:text-4xl font-bold text-gradient">
                    {counts[stat.key]}{stat.suffix}
                  </div>
                  <p className="text-muted-foreground font-medium">
                    {stat.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;