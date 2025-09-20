import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AdminTable } from './AdminTable';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, CheckCircle } from 'lucide-react';

interface ContactMessage {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
  responded_at: string;
}

export const ContactMessagesManager = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Error",
        description: "Failed to fetch contact messages",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (message: ContactMessage) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ 
          status: 'read',
          responded_at: new Date().toISOString()
        })
        .eq('id', message.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Message marked as read",
      });

      fetchMessages();
    } catch (error) {
      console.error('Error updating message:', error);
      toast({
        title: "Error",
        description: "Failed to update message status",
        variant: "destructive",
      });
    }
  };

  const handleViewMessage = (message: ContactMessage) => {
    setSelectedMessage(message);
    if (message.status === 'unread') {
      handleMarkAsRead(message);
    }
  };

  const columns = [
    { 
      key: 'first_name', 
      label: 'Name',
      render: (value: string, row: ContactMessage) => (
        `${row.first_name} ${row.last_name}`
      )
    },
    { key: 'email', label: 'Email' },
    { key: 'subject', label: 'Subject' },
    { 
      key: 'status', 
      label: 'Status',
      render: (value: string) => (
        <Badge variant={value === 'unread' ? 'destructive' : 'default'}>
          {value}
        </Badge>
      )
    },
    { 
      key: 'created_at', 
      label: 'Date',
      render: (value: string) => (
        new Date(value).toLocaleDateString()
      )
    }
  ];

  const customActions = (item: ContactMessage) => (
    <div className="flex gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleViewMessage(item)}
      >
        <Eye className="w-4 h-4" />
      </Button>
      {item.status === 'unread' && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleMarkAsRead(item)}
        >
          <CheckCircle className="w-4 h-4" />
        </Button>
      )}
    </div>
  );

  return (
    <div>
      <AdminTable
        data={messages}
        columns={columns}
        onEdit={handleViewMessage}
        onDelete={() => {}} // No delete for contact messages
        onAdd={() => {}} // No add for contact messages
        loading={loading}
        title="Contact Messages"
      />

      {selectedMessage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background border rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium">Contact Message</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setSelectedMessage(null)}
              >
                ×
              </Button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Name</label>
                  <p className="text-sm text-muted-foreground">
                    {selectedMessage.first_name} {selectedMessage.last_name}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <p className="text-sm text-muted-foreground">
                    {selectedMessage.email}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Subject</label>
                <p className="text-sm text-muted-foreground">
                  {selectedMessage.subject}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium">Message</label>
                <div className="mt-2 p-4 bg-muted rounded-md">
                  <p className="text-sm whitespace-pre-wrap">
                    {selectedMessage.message}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                <div>
                  <label className="font-medium">Received</label>
                  <p>{new Date(selectedMessage.created_at).toLocaleString()}</p>
                </div>
                <div>
                  <label className="font-medium">Status</label>
                  <p>{selectedMessage.status}</p>
                </div>
              </div>

              <div className="pt-4">
                <Button 
                  onClick={() => window.open(`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`)}
                  className="w-full"
                >
                  Reply via Email
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};