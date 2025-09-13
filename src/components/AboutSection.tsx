import { Download, GraduationCap, Briefcase, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AboutSection = () => {
  const skills = [
    'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java',
    'HTML/CSS', 'SQL', 'Git', 'Docker', 'AWS', 'MongoDB'
  ];

  const education = [
    {
      degree: 'Bachelor of Science in Computer Science',
      school: 'University Name',
      year: '2020-2024',
      gpa: '3.8/4.0'
    }
  ];

  const experience = [
    {
      position: 'Full Stack Developer',
      company: 'Tech Company',
      period: '2023-Present',
      description: 'Developed and maintained web applications using React and Node.js'
    },
    {
      position: 'Software Engineering Intern',
      company: 'Startup Company',
      period: '2022-2023',
      description: 'Built responsive web interfaces and collaborated on API development'
    }
  ];

  return (
    <section id="about" className="py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gradient mb-4">About Me</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Passionate developer with expertise in modern web technologies and a commitment to creating innovative solutions.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Skills */}
          <Card className="card-glass hover-lift">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="w-6 h-6 text-primary" />
                Skills
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {skills.map((skill, index) => (
                  <span
                    key={index}
                    className="skill-tag px-4 py-2 text-sm font-medium text-primary rounded-full"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Education */}
          <Card className="card-glass hover-lift">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="w-6 h-6 text-primary" />
                Education
              </CardTitle>
            </CardHeader>
            <CardContent>
              {education.map((edu, index) => (
                <div key={index} className="space-y-2">
                  <h4 className="font-semibold">{edu.degree}</h4>
                  <p className="text-muted-foreground">{edu.school}</p>
                  <p className="text-sm text-primary">{edu.year}</p>
                  <p className="text-sm">GPA: {edu.gpa}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Experience */}
          <Card className="card-glass hover-lift">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-6 h-6 text-primary" />
                Experience
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {experience.map((exp, index) => (
                <div key={index} className="space-y-2">
                  <h4 className="font-semibold">{exp.position}</h4>
                  <p className="text-muted-foreground">{exp.company}</p>
                  <p className="text-sm text-primary">{exp.period}</p>
                  <p className="text-sm">{exp.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Resume Download */}
        <div className="text-center">
          <Button className="btn-hero group">
            <Download className="w-4 h-4 mr-2 group-hover:animate-bounce" />
            Download Full Resume
          </Button>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;