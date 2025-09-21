-- Populate default data for all tables
-- Insert default admin profile (assuming admin user exists)
INSERT INTO public.admin_profiles (
  user_id, full_name, email, title, bio, location, phone, 
  github_url, linkedin_url, profile_image_url
) VALUES (
  '00000000-0000-0000-0000-000000000000', -- Placeholder user_id
  'CHETANRAJ JAKANUR', 
  'chetanraj@example.com',
  'Full Stack Developer & Software Engineer',
  'Passionate developer with expertise in modern web technologies and a commitment to creating innovative solutions. Backend & API Development specialist focusing on RESTful APIs in Node.js, full-stack apps with Flutter frontend.',
  'Davangere, India',
  '+91-XXXXXXXXXX',
  'https://github.com/chetanraj',
  'https://linkedin.com/in/chetanraj-jakanur',
  '/assets/chetanraj-profile.jpg'
) ON CONFLICT (user_id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  title = EXCLUDED.title,
  bio = EXCLUDED.bio,
  location = EXCLUDED.location,
  github_url = EXCLUDED.github_url,
  linkedin_url = EXCLUDED.linkedin_url;

-- Create skills table
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

-- Create RLS policies for skills
CREATE POLICY "Admin can manage their skills" 
ON public.skills 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM admin_profiles 
  WHERE admin_profiles.id = skills.admin_id 
  AND admin_profiles.user_id = auth.uid()
));

CREATE POLICY "Anyone can view published skills" 
ON public.skills 
FOR SELECT 
USING (true);

-- Create updated_at trigger for skills
CREATE TRIGGER update_skills_updated_at
BEFORE UPDATE ON public.skills
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default skills data (will work when admin profile exists)
WITH admin_data AS (
  SELECT id FROM admin_profiles LIMIT 1
)
INSERT INTO public.skills (admin_id, skill_name, category, proficiency_level, order_index)
SELECT 
  admin_data.id,
  skill_data.skill_name,
  skill_data.category,
  skill_data.proficiency_level,
  skill_data.order_index
FROM admin_data, (VALUES
  ('JavaScript', 'Frontend', 5, 1),
  ('TypeScript', 'Frontend', 5, 2),
  ('React', 'Frontend', 5, 3),
  ('Next.js', 'Frontend', 4, 4),
  ('Tailwind CSS', 'Frontend', 5, 5),
  ('Node.js', 'Backend', 5, 6),
  ('Python', 'Backend', 4, 7),
  ('Java', 'Backend', 3, 8),
  ('Express.js', 'Backend', 5, 9),
  ('PostgreSQL', 'Database', 4, 10),
  ('MongoDB', 'Database', 4, 11),
  ('Firebase', 'Backend', 4, 12),
  ('AWS', 'Cloud', 3, 13),
  ('Docker', 'DevOps', 3, 14),
  ('Git', 'Tools', 5, 15),
  ('Flutter', 'Mobile', 4, 16)
) AS skill_data(skill_name, category, proficiency_level, order_index)
WHERE NOT EXISTS (SELECT 1 FROM skills WHERE admin_id = admin_data.id);

-- Insert default work experiences
WITH admin_data AS (
  SELECT id FROM admin_profiles LIMIT 1
)
INSERT INTO public.work_experiences (
  admin_id, company_name, position, start_date, end_date, is_current, 
  location, description, technologies, order_index
)
SELECT admin_data.id, exp_data.*
FROM admin_data, (VALUES
  ('STOFO Technologies LLP', 'Software Developer Intern', '2024-01-01', NULL, true, 'Remote', 
   'Backend & API Development specialist focusing on RESTful APIs in Node.js, full-stack apps with Flutter frontend, and Firebase optimization reducing latency by 25%.', 
   ARRAY['Node.js', 'Flutter', 'Firebase', 'REST API'], 1),
  ('Internet Society (ISOC) India Bengaluru', 'Chapter Member and Volunteer', '2024-01-01', NULL, true, 'Bengaluru, India',
   'Contributing to technology bootcamps, hackathons, and policy meetings. Gaining exposure to Internet governance, community leadership, and strategic planning.',
   ARRAY['Community Leadership', 'Event Management', 'Policy Development'], 2)
) AS exp_data(company_name, position, start_date, end_date, is_current, location, description, technologies, order_index)
WHERE NOT EXISTS (SELECT 1 FROM work_experiences WHERE admin_id = admin_data.id);

-- Insert default education
WITH admin_data AS (
  SELECT id FROM admin_profiles LIMIT 1
)
INSERT INTO public.education (
  admin_id, institution_name, degree, field_of_study, start_date, end_date, 
  grade, description, order_index
)
SELECT admin_data.id, edu_data.*
FROM admin_data, (VALUES
  ('Bapuji Institute of Engineering and Technology', 'Bachelor of Engineering', 'Information Science', '2020-08-01', '2026-06-01',
   'CGPA: 8.57', 'Specializing in software engineering, web development, and cloud technologies. Active in coding competitions and technical societies.', 1),
  ('Sir M V PU College', 'Higher Secondary', 'Science (PCM)', '2019-06-01', '2021-04-01',
   'Percentage: 91.67%', 'Strong foundation in mathematics and computer science, leading to passion for software development.', 2)
) AS edu_data(institution_name, degree, field_of_study, start_date, end_date, grade, description, order_index)
WHERE NOT EXISTS (SELECT 1 FROM education WHERE admin_id = admin_data.id);

-- Insert default projects
WITH admin_data AS (
  SELECT id FROM admin_profiles LIMIT 1
)
INSERT INTO public.portfolio_projects (
  admin_id, title, description, technologies, status, demo_link, repo_link, 
  image_url, featured, order_index
)
SELECT admin_data.id, proj_data.*
FROM admin_data, (VALUES
  ('Analytics Dashboard', 'A comprehensive dashboard for data visualization with real-time analytics, interactive charts, and customizable widgets for business intelligence.',
   ARRAY['React', 'D3.js', 'Node.js', 'PostgreSQL'], 'completed', 'https://demo-link.com', 'https://github.com/username/project1',
   '/assets/project-1.jpg', true, 1),
  ('Task Management Suite', 'A sophisticated task management application featuring drag-and-drop functionality, team collaboration, and productivity analytics.',
   ARRAY['React Native', 'Firebase', 'Redux', 'TypeScript'], 'completed', 'https://demo-link.com', 'https://github.com/username/project2',
   '/assets/project-2.jpg', true, 2),
  ('Creative Portfolio Platform', 'An elegant portfolio platform for creatives with advanced gallery features, customizable themes, and seamless content management.',
   ARRAY['Next.js', 'Headless CMS', 'Tailwind CSS', 'Framer Motion'], 'completed', 'https://demo-link.com', 'https://github.com/username/project3',
   '/assets/project-3.jpg', true, 3)
) AS proj_data(title, description, technologies, status, demo_link, repo_link, image_url, featured, order_index)
WHERE NOT EXISTS (SELECT 1 FROM portfolio_projects WHERE admin_id = admin_data.id);

-- Insert default testimonials
WITH admin_data AS (
  SELECT id FROM admin_profiles LIMIT 1
)
INSERT INTO public.testimonials (
  admin_id, client_name, client_title, client_company, testimonial_text, 
  rating, featured, order_index
)
SELECT admin_data.id, test_data.*
FROM admin_data, (VALUES
  ('Sarah Johnson', 'Product Manager', 'TechCorp', 
   'Working with this developer was an absolute pleasure. The attention to detail and innovative solutions exceeded our expectations.', 
   5, true, 1),
  ('Michael Chen', 'CTO', 'StartupXYZ',
   'Exceptional technical skills combined with great communication. Delivered a complex project on time and within budget.',
   5, true, 2),
  ('Emily Rodriguez', 'Design Director', 'Creative Agency',
   'The perfect blend of technical expertise and creative vision. Transformed our ideas into beautiful, functional solutions.',
   5, true, 3)
) AS test_data(client_name, client_title, client_company, testimonial_text, rating, featured, order_index)
WHERE NOT EXISTS (SELECT 1 FROM testimonials WHERE admin_id = admin_data.id);

-- Insert default media gallery items
WITH admin_data AS (
  SELECT id FROM admin_profiles LIMIT 1
)
INSERT INTO public.media_gallery (
  admin_id, title, description, media_url, media_type, thumbnail_url, 
  tags, featured, order_index
)
SELECT admin_data.id, media_data.*
FROM admin_data, (VALUES
  ('Project Showcase', 'Screenshots and demos of my latest projects', '/assets/project-1.jpg', 'image', '/assets/project-1.jpg',
   ARRAY['projects', 'web-development', 'react'], true, 1),
  ('Development Process', 'Behind the scenes of my development workflow', '/assets/project-2.jpg', 'image', '/assets/project-2.jpg',
   ARRAY['development', 'process', 'workflow'], false, 2),
  ('UI/UX Designs', 'Collection of user interface and experience designs', '/assets/project-3.jpg', 'image', '/assets/project-3.jpg',
   ARRAY['design', 'ui-ux', 'frontend'], false, 3)
) AS media_data(title, description, media_url, media_type, thumbnail_url, tags, featured, order_index)
WHERE NOT EXISTS (SELECT 1 FROM media_gallery WHERE admin_id = admin_data.id);