import { useEffect, useState } from 'react';
import { Calendar, MapPin, Briefcase, GraduationCap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useScroll3D } from '@/hooks/use-scroll-3d';

interface TimelineItem {
  id: string;
  type: 'work' | 'education';
  year: string;
  title: string;
  company: string;
  location?: string;
  description: string;
  color: string;
  icon: any;
}

const DatabaseTimelineSection = () => {
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { ref, transform } = useScroll3D();

  useEffect(() => {
    fetchTimelineData();
  }, []);

  const fetchTimelineData = async () => {
    try {
      // Fetch work experiences
      const { data: experiences } = await supabase
        .from('work_experiences')
        .select('*')
        .order('start_date', { ascending: false });

      // Fetch education
      const { data: education } = await supabase
        .from('education')
        .select('*')
        .order('start_date', { ascending: false });

      const combinedItems: TimelineItem[] = [];

      // Add work experiences
      experiences?.forEach((exp, index) => {
        const startYear = new Date(exp.start_date).getFullYear();
        const endYear = exp.end_date ? new Date(exp.end_date).getFullYear() : 'Present';
        
        combinedItems.push({
          id: exp.id,
          type: 'work',
          year: `${startYear} - ${endYear}`,
          title: exp.position,
          company: exp.company_name,
          location: exp.location,
          description: exp.description || '',
          color: index % 2 === 0 ? '262 70% 65%' : '280 70% 70%',
          icon: Briefcase
        });
      });

      // Add education
      education?.forEach((edu, index) => {
        const startYear = new Date(edu.start_date).getFullYear();
        const endYear = edu.end_date ? new Date(edu.end_date).getFullYear() : 'Present';
        
        combinedItems.push({
          id: edu.id,
          type: 'education',
          year: `${startYear} - ${endYear}`,
          title: `${edu.degree} - ${edu.field_of_study}`,
          company: edu.institution_name,
          location: '',
          description: edu.description || '',
          color: index % 2 === 0 ? '262 70% 65%' : '280 70% 70%',
          icon: GraduationCap
        });
      });

      // Sort by start date (most recent first)
      combinedItems.sort((a, b) => {
        const getYear = (item: TimelineItem) => {
          const yearStr = item.year.split(' - ')[0];
          return parseInt(yearStr);
        };
        return getYear(b) - getYear(a);
      });

      setTimelineItems(combinedItems);
    } catch (error) {
      console.error('Error fetching timeline data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-20 relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-gradient mb-4">My Journey</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Professional experience and educational milestones that shaped my career
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse space-y-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-muted rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 relative overflow-hidden" ref={ref}>
      <div 
        className="container mx-auto px-6 scroll-3d"
        style={{
          transform: `perspective(1000px) rotateX(${transform.rotateX}deg) scale(${transform.scale})`,
        }}
      >
        <div className="text-center mb-16">
          <h2 id="experience" className="text-4xl font-display font-bold text-gradient mb-4">My Journey</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Professional experience and educational milestones that shaped my career
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-accent to-primary opacity-30"></div>

            <div className="space-y-12">
              {timelineItems.map((item, index) => {
                const Icon = item.icon;
                const isLeft = index % 2 === 0;
                
                return (
                  <div
                    key={item.id}
                    className={`relative flex items-center ${isLeft ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}
                    style={{ animationDelay: `${index * 200}ms` }}
                  >
                    {/* Timeline dot */}
                    <div className="absolute left-4 lg:left-6 w-6 h-6 rounded-full bg-gradient-to-r from-primary to-accent border-4 border-background z-10 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    </div>

                    {/* Content */}
                    <div className={`flex-1 ml-16 lg:ml-20 ${isLeft ? 'lg:pr-8' : 'lg:pl-8'}`}>
                      <Card className="card-glass hover-lift group">
                        <CardContent className="p-4 lg:p-6">
                          <div className="flex items-start space-x-3 lg:space-x-4">
                            <div className="p-2 lg:p-3 rounded-xl border border-primary/20 group-hover:scale-110 transition-transform"
                                 style={{ backgroundColor: `hsl(${item.color} / 0.1)` }}>
                              <Icon className="w-5 h-5 lg:w-6 lg:h-6 text-primary" />
                            </div>
                            
                            <div className="flex-1 space-y-2 lg:space-y-3">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full w-fit">
                                  {item.year}
                                </span>
                                {item.location && (
                                  <div className="flex items-center space-x-1 text-muted-foreground text-sm">
                                    <MapPin className="w-3 h-3" />
                                    <span>{item.location}</span>
                                  </div>
                                )}
                              </div>
                              
                              <div>
                                <h3 className="text-base lg:text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                                  {item.title}
                                </h3>
                                <p className="text-muted-foreground font-medium text-sm lg:text-base">
                                  {item.company}
                                </p>
                              </div>
                              
                              <p className="text-muted-foreground leading-relaxed text-sm lg:text-base">
                                {item.description}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DatabaseTimelineSection;