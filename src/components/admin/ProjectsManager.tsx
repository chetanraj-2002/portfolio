import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AdminTable } from './AdminTable';
import { AdminForm } from './AdminForm';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

interface Project {
  id?: string;
  title: string;
  description: string;
  image_url: string;
  demo_link: string;
  repo_link: string;
  technologies: string[] | string;
  status: string;
  featured: boolean;
  start_date: string;
  end_date: string;
  order_index: number;
}

export const ProjectsManager = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<Project | null>(null);
  const [formData, setFormData] = useState<Project>({
    title: '',
    description: '',
    image_url: '',
    demo_link: '',
    repo_link: '',
    technologies: [],
    status: 'completed',
    featured: false,
    start_date: '',
    end_date: '',
    order_index: 0
  });
  const [adminProfile, setAdminProfile] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchAdminProfile();
    fetchProjects();
  }, []);

  const fetchAdminProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('admin_profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (error) throw error;
        setAdminProfile(data);
      }
    } catch (error) {
      console.error('Error fetching admin profile:', error);
      toast({
        title: "Error",
        description: "Failed to fetch admin profile",
        variant: "destructive",
      });
    }
  };

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('portfolio_projects')
        .select('*')
        .order('order_index', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast({
        title: "Error",
        description: "Failed to fetch projects",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminProfile) return;

    try {
      const projectData = {
        ...formData,
        admin_id: adminProfile.id,
        start_date: formData.start_date || null, // Convert empty string to null
        end_date: formData.end_date || null, // Convert empty string to null
        technologies: Array.isArray(formData.technologies) 
          ? formData.technologies 
          : String(formData.technologies || '').split(',').map(t => t.trim())
      };

      if (editingItem?.id) {
        const { error } = await supabase
          .from('portfolio_projects')
          .update(projectData)
          .eq('id', editingItem.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('portfolio_projects')
          .insert(projectData);
        if (error) throw error;
      }

      toast({
        title: "Success",
        description: `Project ${editingItem ? 'updated' : 'created'} successfully`,
      });

      resetForm();
      fetchProjects();
    } catch (error) {
      console.error('Error saving project:', error);
      toast({
        title: "Error",
        description: "Failed to save project",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (item: Project) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      const { error } = await supabase
        .from('portfolio_projects')
        .delete()
        .eq('id', item.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Project deleted successfully",
      });

      fetchProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
      toast({
        title: "Error",
        description: "Failed to delete project",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      image_url: '',
      demo_link: '',
      repo_link: '',
      technologies: [],
      status: 'completed',
      featured: false,
      start_date: '',
      end_date: '',
      order_index: 0
    });
    setEditingItem(null);
    setShowForm(false);
  };

  const handleEdit = (item: Project) => {
    setEditingItem(item);
    setFormData({
      ...item,
      technologies: Array.isArray(item.technologies) 
        ? item.technologies.join(', ') 
        : String(item.technologies || '')
    });
    setShowForm(true);
  };

  const columns = [
    { key: 'title', label: 'Title' },
    { 
      key: 'status', 
      label: 'Status',
      render: (value: string) => (
        <Badge variant={value === 'completed' ? 'default' : 'secondary'}>
          {value}
        </Badge>
      )
    },
    { 
      key: 'featured', 
      label: 'Featured',
      render: (value: boolean) => (
        <Badge variant={value ? 'default' : 'outline'}>
          {value ? 'Yes' : 'No'}
        </Badge>
      )
    },
    { 
      key: 'technologies', 
      label: 'Technologies',
      render: (value: string[]) => (
        <span className="text-sm text-muted-foreground">
          {Array.isArray(value) ? value.slice(0, 2).join(', ') : value}
          {Array.isArray(value) && value.length > 2 && '...'}
        </span>
      )
    }
  ];

  const formFields = [
    { name: 'title', label: 'Project Title', type: 'text' as const, required: true },
    { name: 'description', label: 'Description', type: 'textarea' as const, required: true },
    { name: 'image_url', label: 'Project Image', type: 'file' as const },
    { name: 'demo_link', label: 'Demo Link', type: 'url' as const },
    { name: 'repo_link', label: 'Repository Link', type: 'url' as const },
    { name: 'technologies', label: 'Technologies (comma-separated)', type: 'text' as const },
    { 
      name: 'status', 
      label: 'Status', 
      type: 'select' as const, 
      options: [
        { value: 'completed', label: 'Completed' },
        { value: 'in-progress', label: 'In Progress' },
        { value: 'planned', label: 'Planned' }
      ]
    },
    { name: 'featured', label: 'Featured Project', type: 'switch' as const },
    { name: 'start_date', label: 'Start Date', type: 'date' as const },
    { name: 'end_date', label: 'End Date', type: 'date' as const },
    { name: 'order_index', label: 'Display Order', type: 'number' as const }
  ];

  return (
    <div>
      <AdminTable
        data={projects}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAdd={() => setShowForm(true)}
        loading={loading}
        title="Projects"
      />

      {showForm && (
        <AdminForm
          fields={formFields}
          data={formData}
          onChange={(name, value) => setFormData(prev => ({ ...prev, [name]: value }))}
          onSubmit={handleSubmit}
          onCancel={resetForm}
          title={editingItem ? 'Edit Project' : 'Add Project'}
        />
      )}
    </div>
  );
};