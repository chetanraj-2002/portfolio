import { Calendar, MapPin, Briefcase, GraduationCap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const TimelineSection = () => {
  const timelineItems = [
    {
      year: '2024 - Present',
      type: 'work',
      icon: Briefcase,
      title: 'Software Developer Intern',
      company: 'STOFO Technologies LLP',
      location: 'Remote',
      description: 'Backend & API Development specialist focusing on RESTful APIs in Node.js, full-stack apps with Flutter frontend, and Firebase optimization reducing latency by 25%.',
      color: '262 70% 65%'
    },
    {
      year: '2024 - Present',
      type: 'work',
      icon: Briefcase,
      title: 'Chapter Member and Volunteer',
      company: 'Internet Society (ISOC) India Bengaluru',
      location: 'Bengaluru, India',
      description: 'Contributing to technology bootcamps, hackathons, and policy meetings. Gaining exposure to Internet governance, community leadership, and strategic planning.',
      color: '280 70% 70%'
    },
    {
      year: '2020 - 2026',
      type: 'education',
      icon: GraduationCap,
      title: 'Bachelor of Engineering - Information Science',
      company: 'Bapuji Institute of Engineering and Technology',
      location: 'Davangere, India',
      description: 'CGPA: 8.57. Specializing in software engineering, web development, and cloud technologies. Active in coding competitions and technical societies.',
      color: '262 70% 65%'
    },
    {
      year: '2021',
      type: 'education',
      icon: GraduationCap,
      title: 'Class 12 - Science',
      company: 'Sir M V PU College',
      location: 'Davangere, India',
      description: 'Percentage: 91.67%. Strong foundation in mathematics and computer science, leading to passion for software development.',
      color: '280 70% 70%'
    }
  ];

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-6">
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
                    key={index}
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
                                <div className="flex items-center space-x-1 text-muted-foreground text-sm">
                                  <MapPin className="w-3 h-3" />
                                  <span>{item.location}</span>
                                </div>
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

export default TimelineSection;