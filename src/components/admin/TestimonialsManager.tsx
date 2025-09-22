import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AdminTable } from './AdminTable';
import { AdminForm } from './AdminForm';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

interface Testimonial {
  id?: string;
  client_name: string;
  client_title: string;
  client_company: string;
  testimonial_text: string;
  rating: number;
  client_image_url: string;
  featured: boolean;
  order_index: number;
}

export const TestimonialsManager = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null);
  const [formData, setFormData] = useState<Testimonial>({
    client_name: '',
    client_title: '',
    client_company: '',
    testimonial_text: '',
    rating: 5,
    client_image_url: '',
    featured: false,
    order_index: 0
  });
  const [adminProfile, setAdminProfile] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchAdminProfile();
    fetchTestimonials();
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

  const fetchTestimonials = async () => {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('order_index', { ascending: false });

      if (error) throw error;
      setTestimonials(data || []);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      toast({
        title: "Error",
        description: "Failed to fetch testimonials",
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
      const testimonialData = {
        ...formData,
        admin_id: adminProfile.id
      };

      if (editingItem?.id) {
        const { error } = await supabase
          .from('testimonials')
          .update(testimonialData)
          .eq('id', editingItem.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('testimonials')
          .insert(testimonialData);
        if (error) throw error;
      }

      toast({
        title: "Success",
        description: `Testimonial ${editingItem ? 'updated' : 'created'} successfully`,
      });

      resetForm();
      fetchTestimonials();
    } catch (error) {
      console.error('Error saving testimonial:', error);
      toast({
        title: "Error",
        description: "Failed to save testimonial",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (item: Testimonial) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;

    try {
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', item.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Testimonial deleted successfully",
      });

      fetchTestimonials();
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      toast({
        title: "Error",
        description: "Failed to delete testimonial",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      client_name: '',
      client_title: '',
      client_company: '',
      testimonial_text: '',
      rating: 5,
      client_image_url: '',
      featured: false,
      order_index: 0
    });
    setEditingItem(null);
    setShowForm(false);
  };

  const handleEdit = (item: Testimonial) => {
    setEditingItem(item);
    setFormData(item);
    setShowForm(true);
  };

  const columns = [
    { key: 'client_name', label: 'Client Name' },
    { key: 'client_company', label: 'Company' },
    { 
      key: 'rating', 
      label: 'Rating',
      render: (value: number) => (
        <span>{'★'.repeat(value)}{'☆'.repeat(5-value)}</span>
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
      key: 'testimonial_text', 
      label: 'Testimonial',
      render: (value: string) => (
        <span className="text-sm text-muted-foreground">
          {value.length > 50 ? `${value.substring(0, 50)}...` : value}
        </span>
      )
    }
  ];

  const formFields = [
    { name: 'client_name', label: 'Client Name', type: 'text' as const, required: true },
    { name: 'client_title', label: 'Client Title', type: 'text' as const },
    { name: 'client_company', label: 'Client Company', type: 'text' as const },
    { name: 'testimonial_text', label: 'Testimonial', type: 'textarea' as const, required: true },
    { 
      name: 'rating', 
      label: 'Rating (1-5)', 
      type: 'select' as const, 
      options: [
        { value: '1', label: '1 Star' },
        { value: '2', label: '2 Stars' },
        { value: '3', label: '3 Stars' },
        { value: '4', label: '4 Stars' },
        { value: '5', label: '5 Stars' }
      ]
    },
    { name: 'client_image_url', label: 'Client Image URL', type: 'url' as const },
    { name: 'featured', label: 'Featured Testimonial', type: 'switch' as const },
    { name: 'order_index', label: 'Display Order', type: 'number' as const }
  ];

  return (
    <div>
      <AdminTable
        data={testimonials}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAdd={() => setShowForm(true)}
        loading={loading}
        title="Testimonials"
      />

      {showForm && (
        <AdminForm
          fields={formFields}
          data={formData}
          onChange={(name, value) => setFormData(prev => ({ ...prev, [name]: value }))}
          onSubmit={handleSubmit}
          onCancel={resetForm}
          title={editingItem ? 'Edit Testimonial' : 'Add Testimonial'}
        />
      )}
    </div>
  );
};