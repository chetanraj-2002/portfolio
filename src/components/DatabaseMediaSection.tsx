import { useEffect, useState } from 'react';
import { Play, Image as ImageIcon, Music, Eye, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useScroll3D } from '@/hooks/use-scroll-3d';

interface MediaItem {
  id: string;
  title: string;
  description: string;
  media_url: string;
  media_type: string;
  thumbnail_url?: string;
  tags: string[];
  featured: boolean;
}

const DatabaseMediaSection = () => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [filteredMedia, setFilteredMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const { ref, transform, isVisible } = useScroll3D();

  useEffect(() => {
    fetchMediaItems();
  }, []);

  useEffect(() => {
    filterMedia();
  }, [mediaItems, filter]);

  const fetchMediaItems = async () => {
    try {
      const { data, error } = await supabase
        .from('media_gallery')
        .select('*')
        .order('order_index', { ascending: false });

      if (error) throw error;
      setMediaItems(data || []);
    } catch (error) {
      console.error('Error fetching media:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterMedia = () => {
    let filtered = mediaItems;
    
    if (filter === 'featured') {
      filtered = mediaItems.filter(item => item.featured);
    } else if (filter !== 'all') {
      filtered = mediaItems.filter(item => item.media_type === filter);
    }
    
    setFilteredMedia(filtered);
  };

  const getMediaIcon = (type: string) => {
    switch (type) {
      case 'video':
        return Play;
      case 'audio':
        return Music;
      default:
        return ImageIcon;
    }
  };

  if (loading) {
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
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-48 bg-muted rounded-t-lg"></div>
                <div className="h-32 bg-muted/50 rounded-b-lg"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="media" className="py-20" ref={ref}>
      <div 
        className="container mx-auto px-6 scroll-3d transition-all duration-700"
        style={{
          transform: `perspective(1500px) rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg) scale(${transform.scale})`,
          opacity: transform.opacity,
        }}
      >
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gradient mb-4">Media Gallery</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A collection of images, videos, and audio content showcasing my work and interests.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 items-center justify-between">
          <div className="flex items-center gap-4">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter media" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Media</SelectItem>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="image">Images</SelectItem>
                <SelectItem value="video">Videos</SelectItem>
                <SelectItem value="audio">Audio</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <span className="text-sm text-muted-foreground">
            {filteredMedia.length} item{filteredMedia.length !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredMedia.map((item, index) => {
            const Icon = getMediaIcon(item.media_type);
            return (
              <Card 
                key={item.id} 
                className="card-glass hover-lift group cursor-pointer"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Featured badge */}
                {item.featured && (
                  <div className="absolute top-4 left-4 z-10">
                    <Badge className="bg-primary/20 text-primary border-primary/30">
                      Featured
                    </Badge>
                  </div>
                )}

                <div className="relative overflow-hidden rounded-t-lg">
                  <img
                    src={item.thumbnail_url || item.media_url || '/placeholder.svg'}
                    alt={item.title}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="flex gap-3">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="bg-background/20 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
                        onClick={() => setSelectedMedia(item)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                      <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                        <Icon className="w-6 h-6 text-primary-foreground" />
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="px-2 py-1 bg-background/80 text-xs rounded-full capitalize">
                      {item.media_type}
                    </span>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm mb-3">{item.description}</p>
                  
                  {/* Tags */}
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {item.tags.slice(0, 3).map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                      {item.tags.length > 3 && (
                        <span className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded-full">
                          +{item.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* No media message */}
        {filteredMedia.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-card border border-border rounded-lg">
              <span className="text-sm text-muted-foreground">
                No media items found. Admin can upload and manage media content.
              </span>
            </div>
          </div>
        )}

        {/* Media Detail Modal */}
        <Dialog open={!!selectedMedia} onOpenChange={() => setSelectedMedia(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            {selectedMedia && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-2xl font-display flex items-center justify-between">
                    <span>{selectedMedia.title}</span>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setSelectedMedia(null)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </DialogTitle>
                </DialogHeader>
                
                <div className="space-y-6">
                  {/* Media Content */}
                  <div className="w-full">
                    {selectedMedia.media_type === 'video' ? (
                      <video 
                        src={selectedMedia.media_url} 
                        controls 
                        className="w-full rounded-lg max-h-96"
                        poster={selectedMedia.thumbnail_url}
                      >
                        Your browser does not support video playback.
                      </video>
                    ) : selectedMedia.media_type === 'audio' ? (
                      <div className="bg-card p-8 rounded-lg border text-center">
                        <div className="flex justify-center mb-4">
                          <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center">
                            <Music className="w-10 h-10 text-primary-foreground" />
                          </div>
                        </div>
                        <audio 
                          src={selectedMedia.media_url} 
                          controls 
                          className="w-full"
                        >
                          Your browser does not support audio playback.
                        </audio>
                      </div>
                    ) : (
                      <img
                        src={selectedMedia.media_url}
                        alt={selectedMedia.title}
                        className="w-full rounded-lg max-h-96 object-contain"
                      />
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed">
                      {selectedMedia.description}
                    </p>
                    
                    {/* Tags */}
                    {selectedMedia.tags && selectedMedia.tags.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="font-semibold">Tags:</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedMedia.tags.map((tag, index) => (
                            <Badge key={index} variant="outline">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
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

export default DatabaseMediaSection;