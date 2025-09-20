-- Create testimonials table for managing client testimonials
CREATE TABLE public.testimonials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID NOT NULL,
  client_name TEXT NOT NULL,
  client_title TEXT,
  client_company TEXT,
  testimonial_text TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  client_image_url TEXT,
  featured BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create media_gallery table for managing portfolio images and media
CREATE TABLE public.media_gallery (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  media_url TEXT NOT NULL,
  media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video', 'audio')),
  thumbnail_url TEXT,
  tags TEXT[],
  featured BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_gallery ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for testimonials
CREATE POLICY "Admin can manage their testimonials" 
ON public.testimonials 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM admin_profiles 
  WHERE admin_profiles.id = testimonials.admin_id 
  AND admin_profiles.user_id = auth.uid()
));

CREATE POLICY "Anyone can view published testimonials" 
ON public.testimonials 
FOR SELECT 
USING (true);

-- Create RLS policies for media_gallery
CREATE POLICY "Admin can manage their media" 
ON public.media_gallery 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM admin_profiles 
  WHERE admin_profiles.id = media_gallery.admin_id 
  AND admin_profiles.user_id = auth.uid()
));

CREATE POLICY "Anyone can view published media" 
ON public.media_gallery 
FOR SELECT 
USING (true);

-- Create updated_at triggers
CREATE TRIGGER update_testimonials_updated_at
BEFORE UPDATE ON public.testimonials
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_media_gallery_updated_at
BEFORE UPDATE ON public.media_gallery
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create media storage bucket for uploads
INSERT INTO storage.buckets (id, name, public) 
VALUES ('media-uploads', 'media-uploads', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for media uploads
CREATE POLICY "Admin can upload media" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'media-uploads' AND auth.uid() IS NOT NULL);

CREATE POLICY "Admin can update their media" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'media-uploads' AND auth.uid() IS NOT NULL);

CREATE POLICY "Admin can delete their media" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'media-uploads' AND auth.uid() IS NOT NULL);

CREATE POLICY "Anyone can view media uploads" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'media-uploads');