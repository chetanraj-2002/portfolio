import { ExternalLink, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import project1 from '@/assets/project-1.jpg';
import project2 from '@/assets/project-2.jpg';
import project3 from '@/assets/project-3.jpg';

const ProjectsSection = () => {
  const projects = [
    {
      id: 1,
      title: 'E-Commerce Dashboard',
      description: 'A comprehensive dashboard for managing e-commerce operations with real-time analytics and inventory management.',
      image: project1,
      demoLink: 'https://demo-link.com',
      repoLink: 'https://github.com/username/project1',
      technologies: ['React', 'Node.js', 'MongoDB', 'Chart.js']
    },
    {
      id: 2,
      title: 'Mobile Task Manager',
      description: 'A responsive task management application with drag-and-drop functionality and team collaboration features.',
      image: project2,
      demoLink: 'https://demo-link.com',
      repoLink: 'https://github.com/username/project2',
      technologies: ['React Native', 'Firebase', 'Redux', 'TypeScript']
    },
    {
      id: 3,
      title: 'Shopping Platform',
      description: 'Modern e-commerce platform with advanced search, filtering, and secure payment processing capabilities.',
      image: project3,
      demoLink: 'https://demo-link.com',
      repoLink: 'https://github.com/username/project3',
      technologies: ['Next.js', 'Stripe', 'PostgreSQL', 'Tailwind CSS']
    }
  ];

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
          {projects.map((project) => (
            <Card key={project.id} className="card-glass hover-lift group">
              <div className="relative overflow-hidden rounded-t-lg">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              
              <CardHeader>
                <CardTitle className="text-xl">{project.title}</CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{project.description}</p>
                
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs bg-primary/10 text-primary rounded border border-primary/20"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                
                <div className="flex gap-3 pt-4">
                  <Button size="sm" variant="outline" className="flex-1">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Demo
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <Github className="w-4 h-4 mr-2" />
                    Code
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Admin Note */}
        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground">
            More projects coming soon! Admin can manage projects via the dashboard.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;