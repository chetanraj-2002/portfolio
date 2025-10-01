import { useEffect, useState } from 'react';
import { Download, GraduationCap, Briefcase, Code, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';

interface Skill {
  id: string;
  skill_name: string;
  category: string;
  proficiency_level: number;
}

interface Education {
  id: string;
  institution_name: string;
  degree: string;
  field_of_study: string;
  start_date: string;
  end_date?: string;
  grade?: string;
}

interface Experience {
  id: string;
  company_name: string;
  position: string;
  start_date: string;
  end_date?: string;
  is_current: boolean;
  description?: string;
  location?: string;
  technologies?: string[];
}

const DatabaseAboutSection = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSkillsModal, setShowSkillsModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedEducation, setSelectedEducation] = useState<Education | null>(null);
  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [skillsRes, educationRes, experienceRes] = await Promise.all([
        supabase.from('skills').select('*').order('order_index'),
        supabase.from('education').select('*').order('start_date', { ascending: false }),
        supabase.from('work_experiences').select('*').order('start_date', { ascending: false })
      ]);

      setSkills(skillsRes.data || []);
      setEducation(educationRes.data || []);
      setExperience(experienceRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProficiencyLabel = (level: number) => {
    const labels = ['', 'Beginner', 'Intermediate', 'Advanced', 'Expert', 'Master'];
    return labels[level] || 'Unknown';
  };

  const getSkillColor = (level: number) => {
    if (level >= 5) return 'bg-emerald-500';
    if (level >= 4) return 'bg-blue-500';
    if (level >= 3) return 'bg-yellow-500';
    if (level >= 2) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getUniqueCategories = () => {
    const categories = [...new Set(skills.map(s => s.category))];
    return categories;
  };

  const getFilteredSkills = () => {
    if (selectedCategory === 'all') return skills;
    return skills.filter(s => s.category === selectedCategory);
  };

  const formatPeriod = (startDate: string, endDate?: string, isCurrent?: boolean) => {
    const start = new Date(startDate).getFullYear();
    if (isCurrent || !endDate) return `${start}-Present`;
    const end = new Date(endDate).getFullYear();
    return `${start}-${end}`;
  };

  if (loading) {
    return (
      <section id="about" className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gradient mb-4">About Me</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Passionate developer with expertise in modern web technologies and a commitment to creating innovative solutions.
            </p>
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-64 bg-muted rounded-lg"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section 
      id="about" 
      className="py-20"
    >
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gradient mb-4">About Me</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Passionate developer with expertise in modern web technologies and a commitment to creating innovative solutions.
          </p>
        </div>

        {/* Main Content Sections */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Skills Section */}
          <Card className="card-glass hover-lift">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="w-6 h-6 text-primary" />
                Skills
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {skills.slice(0, 6).map((skill) => (
                    <div
                      key={skill.id}
                      className="px-3 py-1.5 bg-background border border-purple-300/30 text-sm font-medium rounded-full shadow-sm hover:shadow-purple-300/20 transition-all duration-300"
                      style={{
                        boxShadow: '0 0 8px rgba(147, 51, 234, 0.15), 0 2px 8px rgba(147, 51, 234, 0.08)',
                        borderColor: 'hsl(262 83% 58% / 0.2)',
                        background: 'linear-gradient(135deg, hsl(var(--background)), hsl(262 83% 98% / 0.5))'
                      }}
                    >
                      {skill.skill_name}
                    </div>
                  ))}
                </div>
                {skills.length > 6 && (
                  <Button 
                    variant="ghost" 
                    className="w-full text-sm"
                    onClick={() => setShowSkillsModal(true)}
                  >
                    View {skills.length - 6} more skills
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Education Section */}
          <Card className="card-glass hover-lift">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="w-6 h-6 text-primary" />
                Education
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {education.slice(0, 2).map((edu) => (
                  <div key={edu.id} className="border-b border-border/50 pb-2 last:border-0">
                    <h4 className="font-semibold text-sm">{edu.degree}</h4>
                    <p className="text-muted-foreground text-xs">{edu.institution_name}</p>
                  </div>
                ))}
                {education.length > 2 && (
                  <Button 
                    variant="ghost" 
                    className="w-full text-sm"
                    onClick={() => setSelectedEducation({ all: true } as any)}
                  >
                    View {education.length - 2} more
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Experience Section */}
          <Card className="card-glass hover-lift">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-6 h-6 text-primary" />
                Experience
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {experience.slice(0, 2).map((exp) => (
                  <div key={exp.id} className="border-b border-border/50 pb-2 last:border-0">
                    <h4 className="font-semibold text-sm">{exp.position}</h4>
                    <p className="text-muted-foreground text-xs">{exp.company_name}</p>
                  </div>
                ))}
                {experience.length > 2 && (
                  <Button 
                    variant="ghost" 
                    className="w-full text-sm"
                    onClick={() => setSelectedExperience({ all: true } as any)}
                  >
                    View {experience.length - 2} more
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Resume Download */}
        <div className="text-center">
          <Button 
            className="btn-hero group"
            onClick={() => {
              const link = document.createElement('a');
              link.href = '/ChetanrajJakanur_Resume.pdf';
              link.download = 'ChetanrajJakanur_Resume.pdf';
              link.click();
            }}
          >
            <Download className="w-4 h-4 mr-2 group-hover:animate-bounce" />
            Download Full Resume
          </Button>
        </div>

        {/* Skills Modal */}
        <Dialog open={showSkillsModal} onOpenChange={setShowSkillsModal}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-display">
                Technical Skills
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getUniqueCategories().map((category) => (
                  <div key={category} className="space-y-3">
                    <h4 className="font-semibold text-lg text-primary border-b border-primary/20 pb-1">
                      {category}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {skills
                        .filter(skill => skill.category === category)
                        .map((skill) => (
                          <div
                            key={skill.id}
                            className="px-4 py-2 bg-background border border-purple-300/30 text-sm font-medium rounded-full shadow-sm hover:shadow-purple-300/25 transition-all duration-300 cursor-default"
                            style={{
                              boxShadow: '0 0 12px rgba(147, 51, 234, 0.2), 0 4px 12px rgba(147, 51, 234, 0.1)',
                              borderColor: 'hsl(262 83% 58% / 0.25)',
                              background: 'linear-gradient(135deg, hsl(var(--background)), hsl(262 83% 98% / 0.6))'
                            }}
                            title={`${skill.skill_name} - ${getProficiencyLabel(skill.proficiency_level)}`}
                          >
                            <span>{skill.skill_name}</span>
                            <span className="ml-2 text-xs text-purple-600 font-normal">
                              {getProficiencyLabel(skill.proficiency_level)}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Education Detail Modal */}
        <Dialog open={!!selectedEducation} onOpenChange={() => setSelectedEducation(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            {selectedEducation && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-2xl font-display flex items-center gap-2">
                    <GraduationCap className="w-6 h-6 text-primary" />
                    Education
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  {education.map((edu) => (
                    <Card key={edu.id} className="p-6">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-lg">{edu.degree}</h4>
                          <p className="text-muted-foreground">{edu.institution_name}</p>
                          <p className="text-primary text-sm mt-1">
                            {formatPeriod(edu.start_date, edu.end_date)}
                          </p>
                        </div>
                        {edu.field_of_study && (
                          <div>
                            <p className="text-sm text-muted-foreground">Field of Study</p>
                            <p className="font-medium">{edu.field_of_study}</p>
                          </div>
                        )}
                        {edu.grade && (
                          <div>
                            <p className="text-sm text-muted-foreground">Grade</p>
                            <p className="font-medium">{edu.grade}</p>
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Experience Detail Modal */}
        <Dialog open={!!selectedExperience} onOpenChange={() => setSelectedExperience(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            {selectedExperience && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-2xl font-display flex items-center gap-2">
                    <Briefcase className="w-6 h-6 text-primary" />
                    Work Experience
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  {experience.map((exp) => (
                    <Card key={exp.id} className="p-6">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-lg">{exp.position}</h4>
                          <p className="text-muted-foreground">{exp.company_name}</p>
                          <p className="text-primary text-sm mt-1">
                            {formatPeriod(exp.start_date, exp.end_date, exp.is_current)}
                          </p>
                          {exp.location && (
                            <p className="text-muted-foreground text-sm">{exp.location}</p>
                          )}
                        </div>
                        {exp.description && (
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">Description</p>
                            <p className="leading-relaxed whitespace-pre-line">{exp.description}</p>
                          </div>
                        )}
                        {exp.technologies && exp.technologies.length > 0 && (
                          <div>
                            <p className="text-sm text-muted-foreground mb-2">Technologies Used</p>
                            <div className="flex flex-wrap gap-2">
                              {exp.technologies.map((tech, index) => (
                                <Badge key={index} variant="secondary">
                                  {tech}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

      </div>
    </section>
  );
};

export default DatabaseAboutSection;