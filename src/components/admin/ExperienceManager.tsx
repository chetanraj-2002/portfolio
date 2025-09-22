import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AdminTable } from './AdminTable';
import { AdminForm } from './AdminForm';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

interface Experience {
  id?: string;
  company_name: string;
  position: string;
  location: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
  description: string;
  technologies: string[] | string;
  order_index: number;
}

export const ExperienceManager = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<Experience | null>(null);
  const [formData, setFormData] = useState<Experience>({
    company_name: '',
    position: '',
    location: '',
    start_date: '',
    end_date: '',
    is_current: false,
    description: '',
    technologies: [],
    order_index: 0
  });
  const [adminProfile, setAdminProfile] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchAdminProfile();
    fetchExperiences();
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

  const fetchExperiences = async () => {
    try {
      const { data, error } = await supabase
        .from('work_experiences')
        .select('*')
        .order('order_index', { ascending: false });

      if (error) throw error;
      setExperiences(data || []);
    } catch (error) {
      console.error('Error fetching experiences:', error);
      toast({
        title: "Error",
        description: "Failed to fetch work experiences",
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
      const experienceData = {
        ...formData,
        admin_id: adminProfile.id,
        end_date: formData.end_date || null, // Convert empty string to null
        technologies: Array.isArray(formData.technologies) 
          ? formData.technologies 
          : String(formData.technologies || '').split(',').map(t => t.trim())
      };

      if (editingItem?.id) {
        const { error } = await supabase
          .from('work_experiences')
          .update(experienceData)
          .eq('id', editingItem.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('work_experiences')
          .insert(experienceData);
        if (error) throw error;
      }

      toast({
        title: "Success",
        description: `Work experience ${editingItem ? 'updated' : 'created'} successfully`,
      });

      resetForm();
      fetchExperiences();
    } catch (error) {
      console.error('Error saving experience:', error);
      toast({
        title: "Error",
        description: "Failed to save work experience",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (item: Experience) => {
    if (!confirm('Are you sure you want to delete this experience?')) return;

    try {
      const { error } = await supabase
        .from('work_experiences')
        .delete()
        .eq('id', item.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Work experience deleted successfully",
      });

      fetchExperiences();
    } catch (error) {
      console.error('Error deleting experience:', error);
      toast({
        title: "Error",
        description: "Failed to delete work experience",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      company_name: '',
      position: '',
      location: '',
      start_date: '',
      end_date: '',
      is_current: false,
      description: '',
      technologies: [],
      order_index: 0
    });
    setEditingItem(null);
    setShowForm(false);
  };

  const handleEdit = (item: Experience) => {
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
    { key: 'company_name', label: 'Company' },
    { key: 'position', label: 'Position' },
    { 
      key: 'is_current', 
      label: 'Status',
      render: (value: boolean) => (
        <Badge variant={value ? 'default' : 'secondary'}>
          {value ? 'Current' : 'Past'}
        </Badge>
      )
    },
    { 
      key: 'start_date', 
      label: 'Duration',
      render: (value: string, row: Experience) => (
        <span>
          {new Date(value).getFullYear()} - {row.is_current ? 'Present' : new Date(row.end_date).getFullYear()}
        </span>
      )
    }
  ];

  const formFields = [
    { name: 'company_name', label: 'Company Name', type: 'text' as const, required: true },
    { name: 'position', label: 'Position', type: 'text' as const, required: true },
    { name: 'location', label: 'Location', type: 'text' as const },
    { name: 'start_date', label: 'Start Date', type: 'date' as const, required: true },
    { name: 'end_date', label: 'End Date', type: 'date' as const },
    { name: 'is_current', label: 'Currently Working Here', type: 'switch' as const },
    { name: 'description', label: 'Description', type: 'textarea' as const },
    { name: 'technologies', label: 'Technologies (comma-separated)', type: 'text' as const },
    { name: 'order_index', label: 'Display Order', type: 'number' as const }
  ];

  return (
    <div>
      <AdminTable
        data={experiences}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAdd={() => setShowForm(true)}
        loading={loading}
        title="Work Experiences"
      />

      {showForm && (
        <AdminForm
          fields={formFields}
          data={formData}
          onChange={(name, value) => setFormData(prev => ({ ...prev, [name]: value }))}
          onSubmit={handleSubmit}
          onCancel={resetForm}
          title={editingItem ? 'Edit Experience' : 'Add Experience'}
        />
      )}
    </div>
  );
};