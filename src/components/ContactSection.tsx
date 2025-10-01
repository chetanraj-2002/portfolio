import React, { useState, useEffect, useRef } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const { toast } = useToast();
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkInitialVisibility = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
        if (isInViewport) {
          setIsVisible(true);
          return true;
        }
      }
      return false;
    };

    if (checkInitialVisibility()) return;

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

  const contactInfo = [
    {
      icon: Mail,
      label: 'Email',
      value: 'chetanrajjakanur2002@gmail.com',
      href: 'mailto:chetanrajjakanur2002@gmail.com'
    },
    {
      icon: Phone,
      label: 'Phone',
      value: '+91 7022929504',
      href: 'tel:+917022929504'
    },
    {
      icon: MapPin,
      label: 'Location',
      value: 'Bengaluru, Karnataka, India',
      href: '#'
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Save to database
      const { error: dbError } = await supabase
        .from('contact_messages')
        .insert({
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          status: 'unread'
        });

      if (dbError) throw dbError;

      // Send email
      const { error: emailError } = await supabase.functions.invoke('send-contact-email', {
        body: formData
      });

      if (emailError) {
        console.error('Email sending failed:', emailError);
        // Don't throw error, message was still saved to database
      }

      toast({
        title: "Message sent successfully!",
        description: "Thank you for your message. I'll get back to you soon.",
      });

      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        subject: '',
        message: ''
      });

    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section 
      id="contact" 
      className={`py-20 transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      ref={sectionRef}
    >
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gradient mb-4">Get In Touch</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            I'm always open to discussing new opportunities and interesting projects. Let's connect!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <h3 className="text-2xl font-semibold mb-6">Contact Information</h3>
            
            <div className="space-y-6">
              {contactInfo.map((contact, index) => {
                const Icon = contact.icon;
                return (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{contact.label}</p>
                      <a
                        href={contact.href}
                        className="text-foreground hover:text-primary transition-colors"
                      >
                        {contact.value}
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-8">
              <h4 className="text-lg font-semibold mb-4">Let's Connect</h4>
              <p className="text-muted-foreground">
                Whether you're looking to collaborate on a project, need help with development, 
                or just want to chat about technology, I'd love to hear from you.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <Card className="card-glass">
            <CardHeader>
              <CardTitle>Send me a message</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                      placeholder="John"
                      className="bg-background/50"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                      placeholder="Doe"
                      className="bg-background/50"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="john.doe@example.com"
                    className="bg-background/50"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                    placeholder="Project Inquiry"
                    className="bg-background/50"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Tell me about your project or just say hello!"
                    rows={5}
                    className="bg-background/50"
                    required
                  />
                </div>
                
                <Button type="submit" disabled={loading} className="btn-hero w-full group">
                  <Send className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                  {loading ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;