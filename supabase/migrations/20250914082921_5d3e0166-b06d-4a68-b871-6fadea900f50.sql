-- Create content management tables for portfolio administration

-- Create admin profiles table with enhanced functionality
CREATE TABLE IF NOT EXISTS public.admin_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  title TEXT DEFAULT 'Full Stack Developer',
  bio TEXT,
  profile_image_url TEXT,
  resume_url TEXT,
  linkedin_url TEXT,
  github_url TEXT,
  phone TEXT,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create work experiences table
CREATE TABLE IF NOT EXISTS public.work_experiences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID NOT NULL REFERENCES public.admin_profiles(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  position TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  is_current BOOLEAN DEFAULT false,
  description TEXT,
  technologies TEXT[],
  location TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create dynamic projects table
CREATE TABLE IF NOT EXISTS public.portfolio_projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID NOT NULL REFERENCES public.admin_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  demo_link TEXT,
  repo_link TEXT,
  technologies TEXT[],
  status TEXT DEFAULT 'completed',
  start_date DATE,
  end_date DATE,
  featured BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create skills table
CREATE TABLE IF NOT EXISTS public.skills (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID NOT NULL REFERENCES public.admin_profiles(id) ON DELETE CASCADE,
  skill_name TEXT NOT NULL,
  category TEXT NOT NULL,
  proficiency_level INTEGER CHECK (proficiency_level >= 1 AND proficiency_level <= 100),
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create education table
CREATE TABLE IF NOT EXISTS public.education (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID NOT NULL REFERENCES public.admin_profiles(id) ON DELETE CASCADE,
  institution_name TEXT NOT NULL,
  degree TEXT NOT NULL,
  field_of_study TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  grade TEXT,
  description TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;

-- Create admin check function
CREATE OR REPLACE FUNCTION public.is_admin_user(user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_profiles 
    WHERE admin_profiles.user_id = $1
  );
END;
$$;

-- RLS Policies for admin profiles
CREATE POLICY "Admin can view their own profile" 
ON public.admin_profiles FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admin can update their own profile" 
ON public.admin_profiles FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view published admin profile" 
ON public.admin_profiles FOR SELECT 
USING (true);

-- RLS Policies for work experiences
CREATE POLICY "Admin can manage their experiences" 
ON public.work_experiences FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.admin_profiles 
  WHERE admin_profiles.id = work_experiences.admin_id 
  AND admin_profiles.user_id = auth.uid()
));

CREATE POLICY "Anyone can view published experiences" 
ON public.work_experiences FOR SELECT 
USING (true);

-- RLS Policies for projects
CREATE POLICY "Admin can manage their projects" 
ON public.portfolio_projects FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.admin_profiles 
  WHERE admin_profiles.id = portfolio_projects.admin_id 
  AND admin_profiles.user_id = auth.uid()
));

CREATE POLICY "Anyone can view published projects" 
ON public.portfolio_projects FOR SELECT 
USING (true);

-- RLS Policies for skills
CREATE POLICY "Admin can manage their skills" 
ON public.skills FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.admin_profiles 
  WHERE admin_profiles.id = skills.admin_id 
  AND admin_profiles.user_id = auth.uid()
));

CREATE POLICY "Anyone can view published skills" 
ON public.skills FOR SELECT 
USING (true);

-- RLS Policies for education
CREATE POLICY "Admin can manage their education" 
ON public.education FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.admin_profiles 
  WHERE admin_profiles.id = education.admin_id 
  AND admin_profiles.user_id = auth.uid()
));

CREATE POLICY "Anyone can view published education" 
ON public.education FOR SELECT 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_admin_profiles_updated_at
BEFORE UPDATE ON public.admin_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_work_experiences_updated_at
BEFORE UPDATE ON public.work_experiences
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_portfolio_projects_updated_at
BEFORE UPDATE ON public.portfolio_projects
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_skills_updated_at
BEFORE UPDATE ON public.skills
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_education_updated_at
BEFORE UPDATE ON public.education
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default admin profile for CHETANRAJ JAKANUR
-- Note: This will be linked to the user account after authentication is set up