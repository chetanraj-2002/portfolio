import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AdminTable } from './AdminTable';
import { AdminForm } from './AdminForm';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

interface Skill {
  id?: string;
  skill_name: string;
  category: string;
  proficiency_level: number;
  order_index: number;
}

export const SkillsManager = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<Skill | null>(null);
  const [formData, setFormData] = useState<Skill>({
    skill_name: '',
    category: 'Frontend',
    proficiency_level: 3,
    order_index: 0
  });
  const [adminProfile, setAdminProfile] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchAdminProfile();
    fetchSkills();
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

  const fetchSkills = async () => {
    try {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      setSkills(data || []);
    } catch (error) {
      console.error('Error fetching skills:', error);
      toast({
        title: "Error",
        description: "Failed to fetch skills",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminProfile) {
      toast({
        title: "Error",
        description: "Admin profile not found. Please ensure you're logged in as an admin.",
        variant: "destructive",
      });
      return;
    }

    try {
      const skillData = {
        ...formData,
        admin_id: adminProfile.id
      };

      if (editingItem?.id) {
        const { error } = await supabase
          .from('skills')
          .update(skillData)
          .eq('id', editingItem.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('skills')
          .insert(skillData);
        if (error) throw error;
      }

      toast({
        title: "Success",
        description: `Skill ${editingItem ? 'updated' : 'created'} successfully`,
      });

      resetForm();
      fetchSkills();
    } catch (error) {
      console.error('Error saving skill:', error);
      toast({
        title: "Error",
        description: "Failed to save skill",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (item: Skill) => {
    if (!confirm('Are you sure you want to delete this skill?')) return;

    try {
      const { error } = await supabase
        .from('skills')
        .delete()
        .eq('id', item.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Skill deleted successfully",
      });

      fetchSkills();
    } catch (error) {
      console.error('Error deleting skill:', error);
      toast({
        title: "Error",
        description: "Failed to delete skill",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      skill_name: '',
      category: 'Frontend',
      proficiency_level: 3,
      order_index: 0
    });
    setEditingItem(null);
    setShowForm(false);
  };

  const handleEdit = (item: Skill) => {
    setEditingItem(item);
    setFormData(item);
    setShowForm(true);
  };

  const getProficiencyLabel = (level: number) => {
    const labels = ['', 'Beginner', 'Intermediate', 'Advanced', 'Expert', 'Master'];
    return labels[level] || 'Unknown';
  };

  const columns = [
    { key: 'skill_name', label: 'Skill' },
    { 
      key: 'category', 
      label: 'Category',
      render: (value: string) => (
        <Badge variant="outline">{value}</Badge>
      )
    },
    { 
      key: 'proficiency_level', 
      label: 'Proficiency',
      render: (value: number) => (
        <Badge variant={value >= 4 ? 'default' : 'outline'}>
          {getProficiencyLabel(value)}
        </Badge>
      )
    },
    { key: 'order_index', label: 'Order' }
  ];

  const formFields = [
    { name: 'skill_name', label: 'Skill Name', type: 'text' as const, required: true },
    { 
      name: 'category', 
      label: 'Category', 
      type: 'select' as const, 
      options: [
        { value: 'Frontend', label: 'Frontend' },
        { value: 'Backend', label: 'Backend' },
        { value: 'Database', label: 'Database' },
        { value: 'Mobile', label: 'Mobile' },
        { value: 'Cloud', label: 'Cloud' },
        { value: 'DevOps', label: 'DevOps' },
        { value: 'Tools', label: 'Tools' },
        { value: 'Other', label: 'Other' }
      ]
    },
    { 
      name: 'proficiency_level', 
      label: 'Proficiency Level', 
      type: 'select' as const,
      options: [
        { value: '1', label: 'Beginner' },
        { value: '2', label: 'Intermediate' },
        { value: '3', label: 'Advanced' },
        { value: '4', label: 'Expert' },
        { value: '5', label: 'Master' }
      ]
    },
    { name: 'order_index', label: 'Display Order', type: 'number' as const }
  ];

  return (
    <div>
      <AdminTable
        data={skills}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAdd={() => setShowForm(true)}
        loading={loading}
        title="Skills Management"
      />

      {showForm && (
        <AdminForm
          fields={formFields}
          data={formData}
          onChange={(name, value) => setFormData(prev => ({ ...prev, [name]: value }))}
          onSubmit={handleSubmit}
          onCancel={resetForm}
          title={editingItem ? 'Edit Skill' : 'Add Skill'}
        />
      )}
    </div>
  );
};