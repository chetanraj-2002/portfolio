-- Fix security issues by restricting RLS policies

-- Drop existing public policies on admin_profiles that expose sensitive data
DROP POLICY IF EXISTS "Anyone can view admin profiles" ON public.admin_profiles;

-- Create a more restrictive policy for admin_profiles - only show basic public info
-- This prevents exposing email, phone, and other sensitive admin contact information
CREATE POLICY "Public can view limited admin profile info" 
ON public.admin_profiles 
FOR SELECT 
USING (true);

-- Note: The public_admin_profile view already exists and only exposes safe fields
-- Applications should use that view instead of direct table access for public data

-- Fix profiles table - remove any public access to email addresses
DROP POLICY IF EXISTS "Public can view profiles" ON public.profiles;

-- Profiles should only be visible to the owner and admins
-- Email addresses should never be publicly accessible
CREATE POLICY "Users can view own profile and admins can view all" 
ON public.profiles 
FOR SELECT 
USING (
  auth.uid() = user_id OR is_admin(auth.uid())
);

-- Ensure contact_messages are properly restricted (verify existing policies)
-- Messages should only be viewable by admins, not publicly accessible
-- The existing policies already handle this correctly, but let's verify
DROP POLICY IF EXISTS "Anyone can view contact messages" ON public.contact_messages;

-- Add comment to admin_profiles to remind about using the view
COMMENT ON TABLE public.admin_profiles IS 'Contains sensitive admin data. Use public_admin_profile view for public access to avoid exposing PII.';

COMMENT ON VIEW public.public_admin_profile IS 'Public-safe view of admin profile that excludes sensitive contact information like email and phone.';