import { supabase } from '@/integrations/supabase/client';

// Function to create admin user if it doesn't exist
export const setupAdminUser = async () => {
  try {
    // Try to sign up the admin user
    const { data, error } = await supabase.auth.signUp({
      email: 'ABC@gmail.com',
      password: 'Raja_2002',
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: {
          full_name: 'CHETANRAJ JAKANUR'
        }
      }
    });

    if (error && !error.message.includes('already registered')) {
      console.error('Error creating admin user:', error);
      return { success: false, error };
    }

    // If user was created or already exists, create/update profile
    if (data.user) {
      const profileData = {
        user_id: data.user.id,
        full_name: 'CHETANRAJ JAKANUR',
        email: 'chetanrajjakanur2002@gmail.com',
        title: 'Full Stack Developer — Cloud Engineer — Database Engineer',
        bio: 'Proficient Full Stack Developer with hands-on experience in building dynamic web applications using MERN stack, Flask, and Flutter. Skilled in integrating AI/ML models, real-time data systems, and cloud-based services to deliver scalable, user-centric solutions.',
        phone: '7022929504',
        location: 'Bengaluru, Karnataka, India',
        linkedin_url: 'https://www.linkedin.com/in/chetanraj-jakanur-1425451b4/',
        github_url: 'https://github.com/chetanraj-2002',
        resume_url: '/ChetanrajJakanur_Resume.pdf',
        profile_image_url: '/src/assets/chetanraj-profile.jpg'
      };

      const { error: profileError } = await supabase
        .from('admin_profiles')
        .upsert(profileData);

      if (profileError) {
        console.error('Error creating admin profile:', profileError);
        return { success: false, error: profileError };
      }
    }

    return { success: true };
  } catch (err) {
    console.error('Error in setupAdminUser:', err);
    return { success: false, error: err };
  }
};