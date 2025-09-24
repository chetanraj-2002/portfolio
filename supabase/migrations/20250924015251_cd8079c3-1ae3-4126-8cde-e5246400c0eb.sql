-- Create a view that only exposes non-sensitive public fields from admin_profiles
-- Views don't support RLS policies directly, so we'll create a simple view
CREATE OR REPLACE VIEW public_admin_profile AS
SELECT 
  id,
  full_name,
  title,
  bio,
  profile_image_url,
  linkedin_url,
  github_url,
  location,
  created_at
FROM admin_profiles;

-- Grant public access to the view
GRANT SELECT ON public_admin_profile TO anon, authenticated;