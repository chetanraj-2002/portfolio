import { Calendar, MapPin, Briefcase, GraduationCap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const TimelineSection = () => {
  const timelineItems = [
    {
      year: '2024',
      type: 'work',
      icon: Briefcase,
      title: 'Senior Full Stack Developer',
      company: 'Tech Innovations Inc.',
      location: 'San Francisco, CA',
      description: 'Leading development of cutting-edge web applications using modern technologies. Mentoring junior developers and architecting scalable solutions.',
      color: 'primary'
    },
    {
      year: '2023',
      type: 'work',
      icon: Briefcase,
      title: 'Full Stack Developer',
      company: 'Digital Solutions Co.',
      location: 'Remote',
      description: 'Developed and maintained multiple client projects, focusing on React and Node.js applications with emphasis on performance and user experience.',
      color: 'accent'
    },
    {
      year: '2022',
      type: 'education',
      icon: GraduationCap,
      title: 'Bachelor of Computer Science',
      company: 'University of Technology',
      location: 'Boston, MA',
      description: 'Graduated Magna Cum Laude with specialization in Software Engineering and Web Development. Active in coding competitions and tech societies.',
      color: 'primary'
    },
    {
      year: '2021',
      type: 'work',
      icon: Briefcase,
      title: 'Frontend Developer Intern',
      company: 'StartupXYZ',
      location: 'New York, NY',
      description: 'Contributed to the development of a SaaS platform, gaining hands-on experience with React, TypeScript, and modern development workflows.',
      color: 'accent'
    }
  ];

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-display font-bold text-gradient mb-4">My Journey</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A timeline of my professional and educational milestones
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
                    key={index}
                    className={`relative flex items-center ${isLeft ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}
                    style={{ animationDelay: `${index * 200}ms` }}
                  >
                    {/* Timeline dot */}
                    <div className="absolute left-6 w-6 h-6 rounded-full bg-gradient-to-r from-primary to-accent border-4 border-background z-10 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    </div>

                    {/* Content */}
                    <div className={`flex-1 ml-20 lg:ml-0 ${isLeft ? 'lg:pr-20' : 'lg:pl-20'}`}>
                      <Card className="card-glass hover-lift group">
                        <CardContent className="p-6">
                          <div className="flex items-start space-x-4">
                            <div className={`p-3 rounded-xl bg-${item.color}/10 border border-${item.color}/20 group-hover:scale-110 transition-transform`}>
                              <Icon className={`w-6 h-6 text-${item.color}`} />
                            </div>
                            
                            <div className="flex-1 space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                                  {item.year}
                                </span>
                                <div className="flex items-center space-x-1 text-muted-foreground text-sm">
                                  <MapPin className="w-3 h-3" />
                                  <span>{item.location}</span>
                                </div>
                              </div>
                              
                              <div>
                                <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                                  {item.title}
                                </h3>
                                <p className="text-muted-foreground font-medium">
                                  {item.company}
                                </p>
                              </div>
                              
                              <p className="text-muted-foreground leading-relaxed">
                                {item.description}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Year badge for larger screens */}
                    <div className={`hidden lg:block absolute ${isLeft ? 'right-0' : 'left-0'} top-1/2 transform -translate-y-1/2`}>
                      <div className="bg-gradient-to-r from-primary to-accent text-white px-4 py-2 rounded-lg font-bold text-lg shadow-lg">
                        {item.year}
                      </div>
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

export default TimelineSection;