-- Fix security issue: Restrict public access to admin_profiles to only non-sensitive fields
-- Remove the overly permissive policy that exposes all data
DROP POLICY IF EXISTS "Anyone can view published admin profile" ON admin_profiles;

-- Create a view that only exposes non-sensitive public fields
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

-- Keep the existing policies for admin access to full profile
-- Admin can still view their own complete profile via the "Admin can view their own profile" policy
-- Admin can still update their own profile via the "Admin can update their own profile" policy