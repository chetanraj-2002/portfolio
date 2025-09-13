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
      title: 'Analytics Dashboard',
      description: 'A comprehensive dashboard for data visualization with real-time analytics, interactive charts, and customizable widgets for business intelligence.',
      image: project1,
      demoLink: 'https://demo-link.com',
      repoLink: 'https://github.com/username/project1',
      technologies: ['React', 'D3.js', 'Node.js', 'PostgreSQL'],
      category: 'Web App'
    },
    {
      id: 2,
      title: 'Task Management Suite',
      description: 'A sophisticated task management application featuring drag-and-drop functionality, team collaboration, and productivity analytics.',
      image: project2,
      demoLink: 'https://demo-link.com',
      repoLink: 'https://github.com/username/project2',
      technologies: ['React Native', 'Firebase', 'Redux', 'TypeScript'],
      category: 'Mobile App'
    },
    {
      id: 3,
      title: 'Creative Portfolio Platform',
      description: 'An elegant portfolio platform for creatives with advanced gallery features, customizable themes, and seamless content management.',
      image: project3,
      demoLink: 'https://demo-link.com',
      repoLink: 'https://github.com/username/project3',
      technologies: ['Next.js', 'Headless CMS', 'Tailwind CSS', 'Framer Motion'],
      category: 'Web Platform'
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
          {projects.map((project, index) => (
            <Card 
              key={project.id} 
              className="card-glass hover-lift group relative overflow-hidden"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              {/* Category badge */}
              <div className="absolute top-4 left-4 z-10">
                <span className="px-3 py-1 text-xs font-medium bg-primary/20 text-primary rounded-full border border-primary/30 backdrop-blur-sm">
                  {project.category}
                </span>
              </div>
              
              <div className="relative overflow-hidden rounded-t-lg">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-56 object-cover transition-all duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Overlay buttons */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                  <div className="flex gap-3">
                    <Button size="sm" className="btn-hero">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Demo
                    </Button>
                    <Button size="sm" variant="outline" className="bg-background/20 backdrop-blur-sm border-white/20 text-white hover:bg-white/20">
                      <Github className="w-4 h-4 mr-2" />
                      Code
                    </Button>
                  </div>
                </div>
              </div>
              
              <CardHeader className="pb-3">
                <CardTitle className="text-xl font-display group-hover:text-primary transition-colors">
                  {project.title}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">{project.description}</p>
                
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="skill-tag px-3 py-1 text-xs font-medium text-primary rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </CardContent>
              
              {/* Decorative border */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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