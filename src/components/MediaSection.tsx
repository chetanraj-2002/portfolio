import { Play, Image as ImageIcon, Music } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const MediaSection = () => {
  const mediaItems = [
    {
      type: 'image',
      title: 'Development Setup',
      description: 'My current workspace and development environment',
      thumbnail: '/placeholder.svg',
      icon: ImageIcon
    },
    {
      type: 'video',
      title: 'Code Walkthrough',
      description: 'Explaining the architecture of my latest project',
      thumbnail: '/placeholder.svg',
      icon: Play
    },
    {
      type: 'audio',
      title: 'Tech Podcast',
      description: 'Discussion about modern web development trends',
      thumbnail: '/placeholder.svg',
      icon: Music
    }
  ];

  return (
    <section id="media" className="py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gradient mb-4">Media Gallery</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A collection of images, videos, and audio content showcasing my work and interests.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mediaItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <Card key={index} className="card-glass hover-lift group cursor-pointer">
                <div className="relative overflow-hidden rounded-t-lg">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                      <Icon className="w-8 h-8 text-primary-foreground" />
                    </div>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="px-2 py-1 bg-background/80 text-xs rounded-full capitalize">
                      {item.type}
                    </span>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Upload Notice */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-card border border-border rounded-lg">
            <span className="text-sm text-muted-foreground">
              Sample media items - Admin can upload and manage media content
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MediaSection;