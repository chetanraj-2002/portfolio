import { useEffect, useState, useRef } from 'react';
import { ExternalLink, Github, Eye, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';

interface Project {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  demo_link?: string;
  repo_link?: string;
  technologies: string[];
  status: string;
  featured: boolean;
}

const DatabaseProjectsSection = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [showAll, setShowAll] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    const checkInitialVisibility = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
        if (isInViewport) {
          setIsVisible(true);
          return true;
        }
      }
      return false;
    };

    if (checkInitialVisibility()) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), 300);
        }
      },
      { threshold: 0.05 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    filterProjects();
  }, [projects, filter]);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('portfolio_projects')
        .select('*')
        .eq('status', 'completed')
        .order('order_index', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProjects = () => {
    let filtered = projects;
    
    if (filter === 'featured') {
      filtered = projects.filter(p => p.featured);
    }
    
    setFilteredProjects(filtered);
  };

  const displayedProjects = showAll ? filteredProjects : filteredProjects.slice(0, 6);

  const getAllTechnologies = () => {
    const allTechs = projects.flatMap(p => p.technologies || []);
    return [...new Set(allTechs)];
  };

  if (loading) {
    return (
      <section id="projects" className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gradient mb-4">My Projects</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A showcase of my recent work and personal projects that demonstrate my skills and passion for development.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-56 bg-muted rounded-t-lg"></div>
                <div className="h-32 bg-muted/50 rounded-b-lg"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section 
      id="projects" 
      className="py-20"
      ref={sectionRef}
    >
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gradient mb-4">My Projects</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A showcase of my recent work and personal projects that demonstrate my skills and passion for development.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 items-center justify-between">
          <div className="flex items-center gap-4">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter projects" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                <SelectItem value="featured">Featured</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <span className="text-sm text-muted-foreground">
            {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedProjects.map((project, index) => (
            <Card 
              key={project.id} 
              className="card-glass hover-lift group relative overflow-hidden"
            >
              {/* Featured badge */}
              {project.featured && (
                <div className="absolute top-4 left-4 z-10">
                  <Badge className="bg-primary/20 text-primary border-primary/30">
                    Featured
                  </Badge>
                </div>
              )}
              
              <div className="relative overflow-hidden rounded-t-lg">
                <img
                  src={project.image_url || '/assets/project-placeholder.jpg'}
                  alt={project.title}
                  className="w-full h-56 object-cover transition-all duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Overlay buttons */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                  <div className="flex gap-3">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="bg-background/20 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
                          onClick={() => setSelectedProject(project)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                      </DialogTrigger>
                    </Dialog>
                    
                    {project.demo_link && (
                      <Button 
                        size="sm" 
                        className="btn-hero"
                        onClick={() => window.open(project.demo_link, '_blank')}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Demo
                      </Button>
                    )}
                    
                    {project.repo_link && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="bg-background/20 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
                        onClick={() => window.open(project.repo_link, '_blank')}
                      >
                        <Github className="w-4 h-4 mr-2" />
                        Code
                      </Button>
                    )}
                  </div>
                </div>
              </div>
              
              <CardHeader className="pb-3">
                <CardTitle className="text-xl font-display group-hover:text-primary transition-colors">
                  {project.title}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed line-clamp-3">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-2">
                  {(project.technologies || []).slice(0, 3).map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="skill-tag px-3 py-1 text-xs font-medium text-primary rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                  {(project.technologies || []).length > 3 && (
                    <span className="skill-tag px-3 py-1 text-xs font-medium text-muted-foreground rounded-full">
                      +{(project.technologies || []).length - 3} more
                    </span>
                  )}
                </div>
              </CardContent>
              
              {/* Decorative border */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Card>
          ))}
        </div>

        {/* View More Button */}
        {!showAll && filteredProjects.length > 6 && (
          <div className="text-center mt-12">
            <Button 
              variant="outline" 
              className="btn-hero"
              onClick={() => setShowAll(true)}
            >
              <Eye className="w-4 h-4 mr-2" />
              View More Projects ({filteredProjects.length - 6} more)
            </Button>
          </div>
        )}

        {/* Project Detail Modal */}
        <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            {selectedProject && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-2xl font-display">
                    {selectedProject.title}
                  </DialogTitle>
                </DialogHeader>
                
                <div className="space-y-6">
                  <img
                    src={selectedProject.image_url || '/assets/project-placeholder.jpg'}
                    alt={selectedProject.title}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  
                  <div className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed">
                      {selectedProject.description}
                    </p>
                    
                    <div className="space-y-3">
                      <h4 className="font-semibold">Technologies Used:</h4>
                      <div className="flex flex-wrap gap-2">
                        {(selectedProject.technologies || []).map((tech, index) => (
                          <Badge key={index} variant="outline">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex gap-4 pt-4">
                      {selectedProject.demo_link && (
                        <Button 
                          className="btn-hero"
                          onClick={() => window.open(selectedProject.demo_link, '_blank')}
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View Demo
                        </Button>
                      )}
                      
                      {selectedProject.repo_link && (
                        <Button 
                          variant="outline"
                          onClick={() => window.open(selectedProject.repo_link, '_blank')}
                        >
                          <Github className="w-4 h-4 mr-2" />
                          View Code
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default DatabaseProjectsSection;