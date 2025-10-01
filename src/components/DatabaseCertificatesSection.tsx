import { useEffect, useState, useRef } from 'react';
import { Award, Calendar, ExternalLink, GraduationCap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

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

const DatabaseCertificatesSection = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchCertificates();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), 300);
        }
      },
      { threshold: 0.05 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const fetchCertificates = async () => {
    try {
      const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .order('featured', { ascending: false })
        .order('order_index');

      if (!error && data) {
        setCertificates(data);
      }
    } catch (error) {
      console.error('Error fetching certificates:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    });
  };

  const isExpiringSoon = (expiryDate?: string) => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const today = new Date();
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(today.getMonth() + 3);
    return expiry <= threeMonthsFromNow && expiry > today;
  };

  const isExpired = (expiryDate?: string) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  if (loading) {
    return (
      <section id="certificates" className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gradient mb-4">Certifications & Achievements</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Professional certifications and achievements that validate my expertise in various technologies.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-64 bg-muted rounded-lg"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (certificates.length === 0) {
    return (
      <section id="certificates" className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gradient mb-4">Certifications & Achievements</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Professional certifications and achievements that validate my expertise in various technologies.
            </p>
          </div>
          <div className="text-center py-12">
            <GraduationCap className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No certificates added yet.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section 
      id="certificates" 
      className={`py-20 transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      ref={sectionRef}
    >
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gradient mb-4">Certifications & Achievements</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Professional certifications and achievements that validate my expertise in various technologies.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((certificate, index) => (
            <Card 
              key={certificate.id} 
              className={`card-glass hover-lift overflow-hidden transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: `${(index % 3) * 200 + 200}ms` }}
            >
              {certificate.certificate_image_url && (
                <div className="aspect-video bg-muted">
                  <img
                    src={certificate.certificate_image_url}
                    alt={certificate.certificate_name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg leading-tight">
                    {certificate.certificate_name}
                  </CardTitle>
                  {certificate.featured && (
                    <Badge variant="secondary" className="shrink-0">
                      <Award className="w-3 h-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                </div>
                <p className="text-primary font-medium">
                  {certificate.issuing_organization}
                </p>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Issued: {formatDate(certificate.issue_date)}</span>
                </div>

                {certificate.expiry_date && (
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4" />
                    <span className={`
                      ${isExpired(certificate.expiry_date) ? 'text-destructive' : ''}
                      ${isExpiringSoon(certificate.expiry_date) ? 'text-yellow-500' : ''}
                      ${!isExpired(certificate.expiry_date) && !isExpiringSoon(certificate.expiry_date) ? 'text-muted-foreground' : ''}
                    `}>
                      Expires: {formatDate(certificate.expiry_date)}
                      {isExpired(certificate.expiry_date) && ' (Expired)'}
                      {isExpiringSoon(certificate.expiry_date) && ' (Expiring Soon)'}
                    </span>
                  </div>
                )}

                {certificate.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {certificate.description}
                  </p>
                )}

                {certificate.skills_demonstrated && certificate.skills_demonstrated.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {certificate.skills_demonstrated.slice(0, 3).map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {certificate.skills_demonstrated.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{certificate.skills_demonstrated.length - 3}
                      </Badge>
                    )}
                  </div>
                )}

                {certificate.credential_url && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => window.open(certificate.credential_url, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Credential
                  </Button>
                )}

                {certificate.credential_id && (
                  <p className="text-xs text-muted-foreground">
                    ID: {certificate.credential_id}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DatabaseCertificatesSection;