import { useState, useEffect } from 'react';
import { Plus, Award, Edit, Trash2, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { AdminTable } from './AdminTable';

interface Certificate {
  id: string;
  certificate_name: string;
  issuing_organization: string;
  issue_date: string;
  expiry_date?: string;
  credential_id?: string;
  credential_url?: string;
  certificate_image_url?: string;
  description?: string;
  skills_demonstrated?: string[];
  featured: boolean;
  order_index: number;
}

interface CertificatesManagerProps {
  adminId: string;
}

const CertificatesManager = ({ adminId }: CertificatesManagerProps) => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    certificate_name: '',
    issuing_organization: '',
    issue_date: '',
    expiry_date: '',
    credential_id: '',
    credential_url: '',
    certificate_image_url: '',
    description: '',
    skills_demonstrated: '',
    featured: false,
    order_index: 0
  });

  useEffect(() => {
    fetchCertificates();
  }, [adminId]);

  const fetchCertificates = async () => {
    try {
      const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .eq('admin_id', adminId)
        .order('order_index');

      if (error) throw error;
      setCertificates(data || []);
    } catch (error) {
      console.error('Error fetching certificates:', error);
      toast({
        title: "Error",
        description: "Failed to fetch certificates",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      certificate_name: '',
      issuing_organization: '',
      issue_date: '',
      expiry_date: '',
      credential_id: '',
      credential_url: '',
      certificate_image_url: '',
      description: '',
      skills_demonstrated: '',
      featured: false,
      order_index: certificates.length
    });
  };

  const handleEdit = (certificate: Certificate) => {
    setFormData({
      certificate_name: certificate.certificate_name,
      issuing_organization: certificate.issuing_organization,
      issue_date: certificate.issue_date,
      expiry_date: certificate.expiry_date || '',
      credential_id: certificate.credential_id || '',
      credential_url: certificate.credential_url || '',
      certificate_image_url: certificate.certificate_image_url || '',
      description: certificate.description || '',
      skills_demonstrated: certificate.skills_demonstrated?.join(', ') || '',
      featured: certificate.featured,
      order_index: certificate.order_index
    });
    setEditingId(certificate.id);
    setIsAdding(false);
  };

  const handleSave = async () => {
    try {
      if (!formData.certificate_name || !formData.issuing_organization || !formData.issue_date) {
        toast({
          title: "Validation Error",
          description: "Certificate name, organization, and issue date are required",
          variant: "destructive",
        });
        return;
      }

      const skillsArray = formData.skills_demonstrated
        ? formData.skills_demonstrated.split(',').map(s => s.trim()).filter(s => s)
        : [];

      const certificateData = {
        admin_id: adminId,
        certificate_name: formData.certificate_name,
        issuing_organization: formData.issuing_organization,
        issue_date: formData.issue_date,
        expiry_date: formData.expiry_date || null,
        credential_id: formData.credential_id || null,
        credential_url: formData.credential_url || null,
        certificate_image_url: formData.certificate_image_url || null,
        description: formData.description || null,
        skills_demonstrated: skillsArray.length > 0 ? skillsArray : null,
        featured: formData.featured,
        order_index: formData.order_index
      };

      let error;
      if (editingId) {
        const result = await supabase
          .from('certificates')
          .update(certificateData)
          .eq('id', editingId);
        error = result.error;
      } else {
        const result = await supabase
          .from('certificates')
          .insert([certificateData]);
        error = result.error;
      }

      if (error) throw error;

      toast({
        title: "Success",
        description: `Certificate ${editingId ? 'updated' : 'added'} successfully`,
      });

      await fetchCertificates();
      setEditingId(null);
      setIsAdding(false);
      resetForm();
    } catch (error) {
      console.error('Error saving certificate:', error);
      toast({
        title: "Error",
        description: `Failed to ${editingId ? 'update' : 'add'} certificate`,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this certificate?')) return;

    try {
      const { error } = await supabase
        .from('certificates')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Certificate deleted successfully",
      });

      await fetchCertificates();
    } catch (error) {
      console.error('Error deleting certificate:', error);
      toast({
        title: "Error",
        description: "Failed to delete certificate",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsAdding(false);
    resetForm();
  };

  const columns = [
    { key: 'certificate_name', label: 'Certificate' },
    { key: 'issuing_organization', label: 'Organization' },
    { key: 'issue_date', label: 'Issue Date', type: 'date' as const },
    { key: 'featured', label: 'Featured', type: 'boolean' as const },
  ];

  const formatCertificateForTable = (cert: Certificate) => ({
    ...cert,
    issue_date: new Date(cert.issue_date).toLocaleDateString(),
  });

  if (loading) {
    return <div>Loading certificates...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-semibold flex items-center gap-2">
          <Award className="w-6 h-6" />
          Certificates & Achievements
        </h3>
        <Button 
          onClick={() => {
            setIsAdding(true);
            setEditingId(null);
            resetForm();
          }}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Certificate
        </Button>
      </div>

      {(isAdding || editingId) && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? 'Edit Certificate' : 'Add New Certificate'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="certificate_name">Certificate Name *</Label>
                <Input
                  id="certificate_name"
                  value={formData.certificate_name}
                  onChange={(e) => setFormData({ ...formData, certificate_name: e.target.value })}
                  placeholder="e.g., AWS Solutions Architect"
                />
              </div>
              <div>
                <Label htmlFor="issuing_organization">Issuing Organization *</Label>
                <Input
                  id="issuing_organization"
                  value={formData.issuing_organization}
                  onChange={(e) => setFormData({ ...formData, issuing_organization: e.target.value })}
                  placeholder="e.g., Amazon Web Services"
                />
              </div>
              <div>
                <Label htmlFor="issue_date">Issue Date *</Label>
                <Input
                  id="issue_date"
                  type="date"
                  value={formData.issue_date}
                  onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="expiry_date">Expiry Date</Label>
                <Input
                  id="expiry_date"
                  type="date"
                  value={formData.expiry_date}
                  onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="credential_id">Credential ID</Label>
                <Input
                  id="credential_id"
                  value={formData.credential_id}
                  onChange={(e) => setFormData({ ...formData, credential_id: e.target.value })}
                  placeholder="Certificate ID or number"
                />
              </div>
              <div>
                <Label htmlFor="credential_url">Credential URL</Label>
                <Input
                  id="credential_url"
                  value={formData.credential_url}
                  onChange={(e) => setFormData({ ...formData, credential_url: e.target.value })}
                  placeholder="Link to verify certificate"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="certificate_image_url">Certificate Image URL</Label>
              <Input
                id="certificate_image_url"
                value={formData.certificate_image_url}
                onChange={(e) => setFormData({ ...formData, certificate_image_url: e.target.value })}
                placeholder="URL to certificate image"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of the certificate"
              />
            </div>

            <div>
              <Label htmlFor="skills_demonstrated">Skills Demonstrated</Label>
              <Input
                id="skills_demonstrated"
                value={formData.skills_demonstrated}
                onChange={(e) => setFormData({ ...formData, skills_demonstrated: e.target.value })}
                placeholder="Comma-separated skills (e.g., AWS, Cloud Computing, DevOps)"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="featured"
                checked={formData.featured}
                onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
              />
              <Label htmlFor="featured">Featured Certificate</Label>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSave} className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                {editingId ? 'Update' : 'Add'} Certificate
              </Button>
              <Button variant="outline" onClick={handleCancel} className="flex items-center gap-2">
                <X className="w-4 h-4" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {certificates.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <Award className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No certificates added yet</p>
          </CardContent>
        </Card>
      ) : (
        <AdminTable
          data={certificates.map(formatCertificateForTable)}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAdd={() => {
            setIsAdding(true);
            setEditingId(null);
            resetForm();
          }}
          title="Certificates"
        />
      )}
    </div>
  );
};

export default CertificatesManager;