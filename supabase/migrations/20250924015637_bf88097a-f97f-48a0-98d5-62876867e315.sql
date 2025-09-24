-- Drop the existing view that may bypass RLS
DROP VIEW IF EXISTS public.public_admin_profile;

-- Create a new view that properly respects RLS by using a security invoker function
-- This ensures the view runs with the querying user's permissions, not the creator's
CREATE OR REPLACE VIEW public.public_admin_profile 
WITH (security_invoker = true)
AS
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
FROM admin_profiles
WHERE true; -- This will be filtered by RLS policies

-- Grant public access to the view
GRANT SELECT ON public.public_admin_profile TO anon, authenticated;

-- Create a comment explaining the security approach
COMMENT ON VIEW public.public_admin_profile IS 'Public view of admin profiles with security_invoker to respect RLS policies';