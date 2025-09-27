-- Create certificates table for storing certifications and achievements
CREATE TABLE public.certificates (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  admin_id uuid NOT NULL,
  certificate_name text NOT NULL,
  issuing_organization text NOT NULL,
  issue_date date NOT NULL,
  expiry_date date,
  credential_id text,
  credential_url text,
  certificate_image_url text,
  description text,
  skills_demonstrated text[],
  featured boolean DEFAULT false,
  order_index integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

-- Enable Row Level Security
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- Create policies for certificates
CREATE POLICY "Admin can manage their certificates" 
ON public.certificates 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM admin_profiles 
  WHERE admin_profiles.id = certificates.admin_id 
  AND admin_profiles.user_id = auth.uid()
));

CREATE POLICY "Anyone can view published certificates" 
ON public.certificates 
FOR SELECT 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_certificates_updated_at
BEFORE UPDATE ON public.certificates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();