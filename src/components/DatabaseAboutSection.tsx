import { useEffect, useState } from 'react';
import { Download, GraduationCap, Briefcase, Code, Eye, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
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
  const [showKnowMoreModal, setShowKnowMoreModal] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

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
    <section id="about" className="py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gradient mb-4">About Me</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Passionate developer with expertise in modern web technologies and a commitment to creating innovative solutions.
          </p>
        </div>

        {/* Know More Popover */}
        <div className="text-center mb-8">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                Know More
                <ChevronDown className="w-4 h-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 bg-background border shadow-lg">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Detailed Information</h3>
                <div className="space-y-2">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start"
                    onClick={() => setShowSkillsModal(true)}
                  >
                    <Code className="w-4 h-4 mr-2" />
                    View All Skills
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start"
                    onClick={() => setShowKnowMoreModal(true)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Complete Overview
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Dynamic Accordion Layout */}
        <Accordion type="multiple" value={expandedSections} onValueChange={setExpandedSections} className="space-y-4 mb-12">
          {/* Skills Section */}
          <AccordionItem value="skills" className="border rounded-lg">
            <Card className="card-glass hover-lift border-0">
              <AccordionTrigger className="p-6 hover:no-underline">
                <CardTitle className="flex items-center gap-2">
                  <Code className="w-6 h-6 text-primary" />
                  Skills
                </CardTitle>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <div className="flex flex-wrap gap-3">
                  {skills.slice(0, 12).map((skill) => (
                    <Button
                      key={skill.id}
                      variant="outline"
                      size="sm"
                      className="skill-tag px-4 py-2 text-sm font-medium text-primary rounded-full hover:bg-primary/10"
                      onClick={() => setShowSkillsModal(true)}
                    >
                      {skill.skill_name}
                    </Button>
                  ))}
                  {skills.length > 12 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="skill-tag px-4 py-2 text-sm font-medium text-muted-foreground rounded-full"
                      onClick={() => setShowSkillsModal(true)}
                    >
                      +{skills.length - 12} more
                    </Button>
                  )}
                </div>
              </AccordionContent>
            </Card>
          </AccordionItem>

          {/* Education Section */}
          <AccordionItem value="education" className="border rounded-lg">
            <Card className="card-glass hover-lift border-0">
              <AccordionTrigger className="p-6 hover:no-underline">
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="w-6 h-6 text-primary" />
                  Education
                </CardTitle>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <div className="space-y-4">
                  {education.map((edu) => (
                    <div key={edu.id} className="space-y-2 p-4 rounded-lg bg-muted/50">
                      <h4 className="font-semibold">{edu.degree}</h4>
                      <p className="text-muted-foreground">{edu.institution_name}</p>
                      <p className="text-sm text-primary">
                        {formatPeriod(edu.start_date, edu.end_date)}
                      </p>
                      {edu.grade && (
                        <p className="text-sm">Grade: {edu.grade}</p>
                      )}
                      {edu.field_of_study && (
                        <p className="text-sm">Field: {edu.field_of_study}</p>
                      )}
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </Card>
          </AccordionItem>

          {/* Experience Section */}
          <AccordionItem value="experience" className="border rounded-lg">
            <Card className="card-glass hover-lift border-0">
              <AccordionTrigger className="p-6 hover:no-underline">
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="w-6 h-6 text-primary" />
                  Experience
                </CardTitle>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <div className="space-y-4">
                  {experience.map((exp) => (
                    <div key={exp.id} className="space-y-2 p-4 rounded-lg bg-muted/50">
                      <h4 className="font-semibold">{exp.position}</h4>
                      <p className="text-muted-foreground">{exp.company_name}</p>
                      <p className="text-sm text-primary">
                        {formatPeriod(exp.start_date, exp.end_date, exp.is_current)}
                      </p>
                      {exp.location && (
                        <p className="text-sm">Location: {exp.location}</p>
                      )}
                      {exp.description && (
                        <p className="text-sm">{exp.description}</p>
                      )}
                      {exp.technologies && exp.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {exp.technologies.map((tech, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </Card>
          </AccordionItem>
        </Accordion>

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
              <DialogTitle className="text-2xl font-display flex items-center justify-between">
                <span>Technical Skills</span>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowSkillsModal(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {getUniqueCategories().map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span className="text-sm text-muted-foreground">
                  {getFilteredSkills().length} skill{getFilteredSkills().length !== 1 ? 's' : ''}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {getFilteredSkills().map((skill) => (
                  <Card key={skill.id} className="p-4 hover:shadow-md transition-shadow">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">{skill.skill_name}</h4>
                        <Badge variant="outline">{skill.category}</Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Proficiency</span>
                          <span className="font-medium">{getProficiencyLabel(skill.proficiency_level)}</span>
                        </div>
                        
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${getSkillColor(skill.proficiency_level)} transition-all duration-500`}
                            style={{ width: `${(skill.proficiency_level / 5) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Know More Modal */}
        <Dialog open={showKnowMoreModal} onOpenChange={setShowKnowMoreModal}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-display flex items-center justify-between">
                <span>Complete Overview</span>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowKnowMoreModal(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </DialogTitle>
            </DialogHeader>
            
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Skills Overview */}
              <Card className="card-glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="w-6 h-6 text-primary" />
                    Skills Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {getUniqueCategories().map((category) => (
                      <div key={category} className="space-y-2">
                        <h4 className="font-semibold text-sm">{category}</h4>
                        <div className="flex flex-wrap gap-2">
                          {skills.filter(s => s.category === category).slice(0, 5).map((skill) => (
                            <Badge key={skill.id} variant="secondary" className="text-xs">
                              {skill.skill_name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Education Overview */}
              <Card className="card-glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="w-6 h-6 text-primary" />
                    Education Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {education.map((edu) => (
                    <div key={edu.id} className="space-y-2 p-3 rounded bg-muted/50">
                      <h4 className="font-semibold text-sm">{edu.degree}</h4>
                      <p className="text-sm text-muted-foreground">{edu.institution_name}</p>
                      <p className="text-xs text-primary">
                        {formatPeriod(edu.start_date, edu.end_date)}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Experience Overview */}
              <Card className="card-glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="w-6 h-6 text-primary" />
                    Experience Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {experience.map((exp) => (
                    <div key={exp.id} className="space-y-2 p-3 rounded bg-muted/50">
                      <h4 className="font-semibold text-sm">{exp.position}</h4>
                      <p className="text-sm text-muted-foreground">{exp.company_name}</p>
                      <p className="text-xs text-primary">
                        {formatPeriod(exp.start_date, exp.end_date, exp.is_current)}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default DatabaseAboutSection;