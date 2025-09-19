-- Fix RLS policy to allow initial admin profile creation
-- Drop the existing INSERT policy that was preventing admin profile creation
DROP POLICY IF EXISTS "Admin can insert their own profile" ON public.admin_profiles;

-- Create a new policy that allows admin profile creation for authenticated users
-- This allows the initial admin setup to work
CREATE POLICY "Allow initial admin profile creation" 
ON public.admin_profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Also ensure we can handle the case where user already exists
-- Update the auth flow to work with existing unconfirmed users