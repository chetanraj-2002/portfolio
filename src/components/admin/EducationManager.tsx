import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AdminTable } from './AdminTable';
import { AdminForm } from './AdminForm';
import { useToast } from '@/hooks/use-toast';

interface Education {
  id?: string;
  institution_name: string;
  degree: string;
  field_of_study: string;
  grade: string;
  start_date: string;
  end_date: string;
  description: string;
  order_index: number;
}

export const EducationManager = () => {
  const [education, setEducation] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<Education | null>(null);
  const [formData, setFormData] = useState<Education>({
    institution_name: '',
    degree: '',
    field_of_study: '',
    grade: '',
    start_date: '',
    end_date: '',
    description: '',
    order_index: 0
  });
  const [adminProfile, setAdminProfile] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchAdminProfile();
    fetchEducation();
  }, []);

  const fetchAdminProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from('admin_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
      setAdminProfile(data);
    }
  };

  const fetchEducation = async () => {
    try {
      const { data, error } = await supabase
        .from('education')
        .select('*')
        .order('order_index', { ascending: false });

      if (error) throw error;
      setEducation(data || []);
    } catch (error) {
      console.error('Error fetching education:', error);
      toast({
        title: "Error",
        description: "Failed to fetch education records",
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
      const educationData = {
        ...formData,
        admin_id: adminProfile.id,
        end_date: formData.end_date || null // Convert empty string to null
      };

      if (editingItem?.id) {
        const { error } = await supabase
          .from('education')
          .update(educationData)
          .eq('id', editingItem.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('education')
          .insert(educationData);
        if (error) throw error;
      }

      toast({
        title: "Success",
        description: `Education record ${editingItem ? 'updated' : 'created'} successfully`,
      });

      resetForm();
      fetchEducation();
    } catch (error) {
      console.error('Error saving education:', error);
      toast({
        title: "Error",
        description: "Failed to save education record",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (item: Education) => {
    if (!confirm('Are you sure you want to delete this education record?')) return;

    try {
      const { error } = await supabase
        .from('education')
        .delete()
        .eq('id', item.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Education record deleted successfully",
      });

      fetchEducation();
    } catch (error) {
      console.error('Error deleting education:', error);
      toast({
        title: "Error",
        description: "Failed to delete education record",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      institution_name: '',
      degree: '',
      field_of_study: '',
      grade: '',
      start_date: '',
      end_date: '',
      description: '',
      order_index: 0
    });
    setEditingItem(null);
    setShowForm(false);
  };

  const handleEdit = (item: Education) => {
    setEditingItem(item);
    setFormData(item);
    setShowForm(true);
  };

  const columns = [
    { key: 'institution_name', label: 'Institution' },
    { key: 'degree', label: 'Degree' },
    { key: 'field_of_study', label: 'Field of Study' },
    { 
      key: 'start_date', 
      label: 'Duration',
      render: (value: string, row: Education) => (
        <span>
          {new Date(value).getFullYear()} - {new Date(row.end_date).getFullYear()}
        </span>
      )
    },
    { key: 'grade', label: 'Grade' }
  ];

  const formFields = [
    { name: 'institution_name', label: 'Institution Name', type: 'text' as const, required: true },
    { name: 'degree', label: 'Degree', type: 'text' as const, required: true },
    { name: 'field_of_study', label: 'Field of Study', type: 'text' as const },
    { name: 'grade', label: 'Grade/GPA', type: 'text' as const },
    { name: 'start_date', label: 'Start Date', type: 'date' as const, required: true },
    { name: 'end_date', label: 'End Date', type: 'date' as const },
    { name: 'description', label: 'Description', type: 'textarea' as const },
    { name: 'order_index', label: 'Display Order', type: 'number' as const }
  ];

  return (
    <div>
      <AdminTable
        data={education}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAdd={() => setShowForm(true)}
        loading={loading}
        title="Education"
      />

      {showForm && (
        <AdminForm
          fields={formFields}
          data={formData}
          onChange={(name, value) => setFormData(prev => ({ ...prev, [name]: value }))}
          onSubmit={handleSubmit}
          onCancel={resetForm}
          title={editingItem ? 'Edit Education' : 'Add Education'}
        />
      )}
    </div>
  );
};