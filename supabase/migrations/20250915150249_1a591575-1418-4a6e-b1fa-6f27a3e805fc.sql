-- Insert admin user credentials and create admin profile
-- First, create the admin user in auth.users (this is handled by Supabase auth)
-- We'll create the admin profile record that will be linked to your user account

-- Insert admin profile for the specific admin user
INSERT INTO public.admin_profiles (
  id,
  user_id,
  full_name,
  email,
  title,
  bio,
  location,
  phone,
  github_url,
  linkedin_url,
  resume_url
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000'::uuid, -- Placeholder - will be updated when user signs up
  'Chetanraj Jakanur',
  'chetanrajjakanur2002@gmail.com',
  'Full Stack Developer',
  'Passionate full-stack developer with expertise in modern web technologies.',
  'India',
  '+91 9876543210',
  'https://github.com/chetanrajjakanur',
  'https://linkedin.com/in/chetanrajjakanur',
  '/ChetanrajJakanur_Resume.pdf'
) ON CONFLICT (email) DO NOTHING;

-- Create a trigger to automatically update admin profile when the specific user signs up
CREATE OR REPLACE FUNCTION public.handle_admin_signup()
RETURNS TRIGGER AS $$
BEGIN
  -- Only process if this is the admin email
  IF NEW.email = 'chetanrajjakanur2002@gmail.com' THEN
    -- Update the admin profile with the actual user_id
    UPDATE public.admin_profiles 
    SET user_id = NEW.id
    WHERE email = 'chetanrajjakanur2002@gmail.com' AND user_id = '00000000-0000-0000-0000-000000000000'::uuid;
    
    -- If no existing profile, create one
    IF NOT FOUND THEN
      INSERT INTO public.admin_profiles (
        user_id,
        full_name,
        email,
        title,
        bio,
        location,
        phone,
        github_url,
        linkedin_url,
        resume_url
      ) VALUES (
        NEW.id,
        'Chetanraj Jakanur',
        'chetanrajjakanur2002@gmail.com',
        'Full Stack Developer',
        'Passionate full-stack developer with expertise in modern web technologies.',
        'India',
        '+91 9876543210',
        'https://github.com/chetanrajjakanur',
        'https://linkedin.com/in/chetanrajjakanur',
        '/ChetanrajJakanur_Resume.pdf'
      ) ON CONFLICT (user_id) DO NOTHING;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;