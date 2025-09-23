-- Fix RLS policy for contact messages - the issue is that is_admin function needs to check admin_profiles table instead of profiles table

-- Drop the existing policy
DROP POLICY IF EXISTS "Admins can view all contact messages" ON contact_messages;

-- Create a corrected policy that checks admin_profiles table
CREATE POLICY "Admins can view all contact messages" 
ON contact_messages 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM admin_profiles 
    WHERE user_id = auth.uid()
  )
);

-- Also update the update policy to use the same logic
DROP POLICY IF EXISTS "Admins can update contact messages" ON contact_messages;

CREATE POLICY "Admins can update contact messages" 
ON contact_messages 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM admin_profiles 
    WHERE user_id = auth.uid()
  )
);

-- Add delete policy as well since we have delete functionality
CREATE POLICY "Admins can delete contact messages" 
ON contact_messages 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM admin_profiles 
    WHERE user_id = auth.uid()
  )
);