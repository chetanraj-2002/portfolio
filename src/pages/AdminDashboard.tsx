import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User, Session } from '@supabase/supabase-js';
import { 
  Settings, 
  FileText, 
  Briefcase, 
  GraduationCap, 
  Code, 
  Upload,
  LogOut,
  User as UserIcon,
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const AdminDashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (!session?.user) {
          navigate('/auth');
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      if (!session?.user) {
        navigate('/auth');
      } else {
        loadProfile(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const loadProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('admin_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading profile:', error);
        return;
      }

      if (data) {
        setProfile(data);
      } else {
        // Create default profile if none exists
        await createDefaultProfile(userId);
      }
    } catch (err) {
      console.error('Error in loadProfile:', err);
    }
  };

  const createDefaultProfile = async (userId: string) => {
    try {
      const defaultProfile = {
        user_id: userId,
        full_name: 'CHETANRAJ JAKANUR',
        email: 'chetanrajjakanur2002@gmail.com',
        title: 'Full Stack Developer — Cloud Engineer — Database Engineer',
        bio: 'Proficient Full Stack Developer with hands-on experience in building dynamic web applications using MERN stack, Flask, and Flutter. Skilled in integrating AI/ML models, real-time data systems, and cloud-based services to deliver scalable, user-centric solutions.',
        phone: '+91 7022929504',
        location: 'Davangere, India',
        linkedin_url: 'https://www.linkedin.com/in/chetanraj-jakanur-1425451b4/',
        github_url: 'https://github.com/chetanraj-2002',
        resume_url: '/ChetanrajJakanur_Resume.pdf',
        profile_image_url: '/src/assets/profile-image.jpg'
      };

      const { data, error } = await supabase
        .from('admin_profiles')
        .insert([defaultProfile])
        .select()
        .single();

      if (error) {
        console.error('Error creating default profile:', error);
        return;
      }

      setProfile(data);
      toast({
        title: "Profile Created",
        description: "Default profile has been set up with your information.",
      });
    } catch (err) {
      console.error('Error creating default profile:', err);
    }
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    } else {
      navigate('/');
    }
  };

  const updateProfile = async (updates: any) => {
    if (!profile) return;

    try {
      const { data, error } = await supabase
        .from('admin_profiles')
        .update(updates)
        .eq('id', profile.id)
        .select()
        .single();

      if (error) {
        toast({
          title: "Error",
          description: "Failed to update profile",
          variant: "destructive",
        });
        return;
      }

      setProfile(data);
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (err) {
      console.error('Error updating profile:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your portfolio content
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate('/')}>
              View Portfolio
            </Button>
            <Button variant="destructive" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <UserIcon className="w-4 h-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="experience" className="flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              Experience
            </TabsTrigger>
            <TabsTrigger value="projects" className="flex items-center gap-2">
              <Code className="w-4 h-4" />
              Projects
            </TabsTrigger>
            <TabsTrigger value="education" className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              Education
            </TabsTrigger>
            <TabsTrigger value="resume" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Resume
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Profile Information
                </CardTitle>
                <CardDescription>
                  Update your personal information and contact details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {profile && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="full_name">Full Name</Label>
                      <Input
                        id="full_name"
                        value={profile.full_name || ''}
                        onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                        onBlur={() => updateProfile({ full_name: profile.full_name })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="title">Professional Title</Label>
                      <Input
                        id="title"
                        value={profile.title || ''}
                        onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                        onBlur={() => updateProfile({ title: profile.title })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          value={profile.email || ''}
                          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                          onBlur={() => updateProfile({ email: profile.email })}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          value={profile.phone || ''}
                          onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                          onBlur={() => updateProfile({ phone: profile.phone })}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="location"
                          value={profile.location || ''}
                          onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                          onBlur={() => updateProfile({ location: profile.location })}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="linkedin_url">LinkedIn URL</Label>
                      <div className="relative">
                        <Linkedin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="linkedin_url"
                          value={profile.linkedin_url || ''}
                          onChange={(e) => setProfile({ ...profile, linkedin_url: e.target.value })}
                          onBlur={() => updateProfile({ linkedin_url: profile.linkedin_url })}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="github_url">GitHub URL</Label>
                      <div className="relative">
                        <Github className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="github_url"
                          value={profile.github_url || ''}
                          onChange={(e) => setProfile({ ...profile, github_url: e.target.value })}
                          onBlur={() => updateProfile({ github_url: profile.github_url })}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="bio">Professional Bio</Label>
                      <Textarea
                        id="bio"
                        value={profile.bio || ''}
                        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                        onBlur={() => updateProfile({ bio: profile.bio })}
                        rows={4}
                        placeholder="Write a brief professional summary..."
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="experience">
            <Card>
              <CardHeader>
                <CardTitle>Work Experience</CardTitle>
                <CardDescription>
                  Manage your professional experience and career history
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Experience management coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projects">
            <Card>
              <CardHeader>
                <CardTitle>Projects</CardTitle>
                <CardDescription>
                  Showcase your portfolio projects and work samples
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Code className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Project management coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="education">
            <Card>
              <CardHeader>
                <CardTitle>Education</CardTitle>
                <CardDescription>
                  Manage your educational background and qualifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <GraduationCap className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Education management coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resume">
            <Card>
              <CardHeader>
                <CardTitle>Resume Management</CardTitle>
                <CardDescription>
                  Upload, update, or replace your resume file
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Current Resume</h3>
                  <p className="text-muted-foreground mb-4">
                    {profile?.resume_url ? 'ChetanrajJakanur_Resume.pdf' : 'No resume uploaded'}
                  </p>
                  {profile?.resume_url && (
                    <div className="flex items-center justify-center gap-4">
                      <Button variant="outline" asChild>
                        <a href={profile.resume_url} target="_blank" rel="noopener noreferrer">
                          <FileText className="w-4 h-4 mr-2" />
                          View Current
                        </a>
                      </Button>
                      <Button>
                        <Upload className="w-4 h-4 mr-2" />
                        Upload New
                      </Button>
                    </div>
                  )}
                  {!profile?.resume_url && (
                    <Button>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Resume
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;