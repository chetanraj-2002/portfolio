-- Update or insert admin profile data with correct information
INSERT INTO admin_profiles (
  user_id,
  full_name,
  email,
  title,
  bio,
  phone,
  location,
  linkedin_url,
  github_url,
  resume_url,
  profile_image_url
) VALUES (
  '00000000-0000-0000-0000-000000000000', -- Placeholder, will be updated when user is created
  'CHETANRAJ JAKANUR',
  'chetanrajjakanur2002@gmail.com',
  'Full Stack Developer — Cloud Engineer — Database Engineer',
  'Proficient Full Stack Developer with hands-on experience in building dynamic web applications using MERN stack, Flask, and Flutter. Skilled in integrating AI/ML models, real-time data systems, and cloud-based services to deliver scalable, user-centric solutions.',
  '7022929504',
  'Bengaluru, Karnataka, India',
  'https://www.linkedin.com/in/chetanraj-jakanur-1425451b4/',
  'https://github.com/chetanraj-2002',
  '/ChetanrajJakanur_Resume.pdf',
  '/src/assets/chetanraj-profile.jpg'
) ON CONFLICT (user_id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  email = EXCLUDED.email,
  title = EXCLUDED.title,
  bio = EXCLUDED.bio,
  phone = EXCLUDED.phone,
  location = EXCLUDED.location,
  linkedin_url = EXCLUDED.linkedin_url,
  github_url = EXCLUDED.github_url,
  resume_url = EXCLUDED.resume_url,
  profile_image_url = EXCLUDED.profile_image_url;