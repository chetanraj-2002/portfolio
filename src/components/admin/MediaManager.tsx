import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AdminTable } from './AdminTable';
import { AdminForm } from './AdminForm';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

interface Media {
  id?: string;
  title: string;
  description: string;
  media_url: string;
  media_type: string;
  thumbnail_url: string;
  tags: string[] | string;
  featured: boolean;
  order_index: number;
}

export const MediaManager = () => {
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<Media | null>(null);
  const [formData, setFormData] = useState<Media>({
    title: '',
    description: '',
    media_url: '',
    media_type: 'image',
    thumbnail_url: '',
    tags: [],
    featured: false,
    order_index: 0
  });
  const [adminProfile, setAdminProfile] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchAdminProfile();
    fetchMedia();
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

  const fetchMedia = async () => {
    try {
      const { data, error } = await supabase
        .from('media_gallery')
        .select('*')
        .order('order_index', { ascending: false });

      if (error) throw error;
      setMedia(data || []);
    } catch (error) {
      console.error('Error fetching media:', error);
      toast({
        title: "Error",
        description: "Failed to fetch media",
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
      const mediaData = {
        ...formData,
        admin_id: adminProfile.id,
        tags: Array.isArray(formData.tags) 
          ? formData.tags 
          : String(formData.tags || '').split(',').map(t => t.trim())
      };

      if (editingItem?.id) {
        const { error } = await supabase
          .from('media_gallery')
          .update(mediaData)
          .eq('id', editingItem.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('media_gallery')
          .insert(mediaData);
        if (error) throw error;
      }

      toast({
        title: "Success",
        description: `Media ${editingItem ? 'updated' : 'created'} successfully`,
      });

      resetForm();
      fetchMedia();
    } catch (error) {
      console.error('Error saving media:', error);
      toast({
        title: "Error",
        description: "Failed to save media",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (item: Media) => {
    if (!confirm('Are you sure you want to delete this media item?')) return;

    try {
      const { error } = await supabase
        .from('media_gallery')
        .delete()
        .eq('id', item.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Media deleted successfully",
      });

      fetchMedia();
    } catch (error) {
      console.error('Error deleting media:', error);
      toast({
        title: "Error",
        description: "Failed to delete media",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      media_url: '',
      media_type: 'image',
      thumbnail_url: '',
      tags: [],
      featured: false,
      order_index: 0
    });
    setEditingItem(null);
    setShowForm(false);
  };

  const handleEdit = (item: Media) => {
    setEditingItem(item);
    setFormData({
      ...item,
      tags: Array.isArray(item.tags) ? item.tags.join(', ') : String(item.tags || '')
    });
    setShowForm(true);
  };

  const columns = [
    { key: 'title', label: 'Title' },
    { 
      key: 'media_type', 
      label: 'Type',
      render: (value: string) => (
        <Badge variant="outline">{value}</Badge>
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
      key: 'tags', 
      label: 'Tags',
      render: (value: string[]) => (
        <span className="text-sm text-muted-foreground">
          {Array.isArray(value) ? value.slice(0, 2).join(', ') : value}
          {Array.isArray(value) && value.length > 2 && '...'}
        </span>
      )
    }
  ];

  const formFields = [
    { name: 'title', label: 'Title', type: 'text' as const, required: true },
    { name: 'description', label: 'Description', type: 'textarea' as const },
    { name: 'media_url', label: 'Media File', type: 'file' as const, required: true },
    { 
      name: 'media_type', 
      label: 'Media Type', 
      type: 'select' as const, 
      options: [
        { value: 'image', label: 'Image' },
        { value: 'video', label: 'Video' },
        { value: 'audio', label: 'Audio' }
      ]
    },
    { name: 'thumbnail_url', label: 'Thumbnail Image', type: 'file' as const },
    { name: 'tags', label: 'Tags (comma-separated)', type: 'text' as const },
    { name: 'featured', label: 'Featured Media', type: 'switch' as const },
    { name: 'order_index', label: 'Display Order', type: 'number' as const }
  ];

  return (
    <div>
      <AdminTable
        data={media}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAdd={() => setShowForm(true)}
        loading={loading}
        title="Media Gallery"
      />

      {showForm && (
        <AdminForm
          fields={formFields}
          data={formData}
          onChange={(name, value) => setFormData(prev => ({ ...prev, [name]: value }))}
          onSubmit={handleSubmit}
          onCancel={resetForm}
          title={editingItem ? 'Edit Media' : 'Add Media'}
        />
      )}
    </div>
  );
};