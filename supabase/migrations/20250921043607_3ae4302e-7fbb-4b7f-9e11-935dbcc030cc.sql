-- Create skills table (only if it doesn't exist)
CREATE TABLE IF NOT EXISTS public.skills (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID NOT NULL,
  skill_name TEXT NOT NULL,
  category TEXT NOT NULL,
  proficiency_level INTEGER CHECK (proficiency_level >= 1 AND proficiency_level <= 5),
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on skills table
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for skills (only if they don't exist)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin can manage their skills' AND tablename = 'skills') THEN
    CREATE POLICY "Admin can manage their skills" 
    ON public.skills 
    FOR ALL 
    USING (EXISTS (
      SELECT 1 FROM admin_profiles 
      WHERE admin_profiles.id = skills.admin_id 
      AND admin_profiles.user_id = auth.uid()
    ));
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can view published skills' AND tablename = 'skills') THEN
    CREATE POLICY "Anyone can view published skills" 
    ON public.skills 
    FOR SELECT 
    USING (true);
  END IF;
END $$;

-- Create updated_at trigger for skills (only if it doesn't exist)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_skills_updated_at') THEN
    CREATE TRIGGER update_skills_updated_at
    BEFORE UPDATE ON public.skills
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;