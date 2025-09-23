import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AdminTable } from './AdminTable';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, CheckCircle, Trash2, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

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

  const handleDelete = async (message: ContactMessage) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', message.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Message deleted successfully",
      });

      fetchMessages();
    } catch (error) {
      console.error('Error deleting message:', error);
      toast({
        title: "Error",
        description: "Failed to delete message",
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
      label: 'Date & Time',
      render: (value: string) => (
        <div className="text-xs">
          <div>{new Date(value).toLocaleDateString()}</div>
          <div className="text-muted-foreground">{new Date(value).toLocaleTimeString()}</div>
        </div>
      )
    }
  ];

  const customActions = (item: ContactMessage) => (
    <div className="flex gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleViewMessage(item)}
        title="View Message"
      >
        <Eye className="w-4 h-4" />
      </Button>
      {item.status === 'unread' && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleMarkAsRead(item)}
          title="Mark as Read"
        >
          <CheckCircle className="w-4 h-4" />
        </Button>
      )}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleDelete(item)}
        className="text-destructive hover:text-destructive"
        title="Delete Message"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );

  return (
    <div>
      <AdminTable
        data={messages}
        columns={columns}
        onEdit={handleViewMessage}
        onDelete={handleDelete}
        onAdd={() => {}} // No add for contact messages
        loading={loading}
        title="Contact Messages"
        customActions={customActions}
        hideAddButton={true}
      />

      <Dialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedMessage && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-display flex items-center justify-between">
                  <span>Contact Message</span>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setSelectedMessage(null)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Sender Information */}
                <div className="bg-card p-4 rounded-lg border">
                  <h4 className="font-medium mb-3 text-primary">Sender Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Full Name</label>
                      <p className="text-sm text-muted-foreground">
                        {selectedMessage.first_name} {selectedMessage.last_name}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Email Address</label>
                      <p className="text-sm text-muted-foreground">
                        {selectedMessage.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Message Details */}
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Subject</label>
                    <p className="text-sm text-muted-foreground mt-1 p-3 bg-muted rounded-md">
                      {selectedMessage.subject}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Message</label>
                    <div className="mt-2 p-4 bg-muted rounded-md border">
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">
                        {selectedMessage.message}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Metadata */}
                <div className="bg-card p-4 rounded-lg border">
                  <h4 className="font-medium mb-3 text-primary">Message Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <label className="font-medium">Received Date</label>
                      <p className="text-muted-foreground">
                        {new Date(selectedMessage.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <label className="font-medium">Received Time</label>
                      <p className="text-muted-foreground">
                        {new Date(selectedMessage.created_at).toLocaleTimeString()}
                      </p>
                    </div>
                    <div>
                      <label className="font-medium">Status</label>
                      <Badge variant={selectedMessage.status === 'unread' ? 'destructive' : 'default'}>
                        {selectedMessage.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t">
                  <Button 
                    onClick={() => window.open(`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`)}
                    className="flex-1"
                  >
                    Reply via Email
                  </Button>
                  {selectedMessage.status === 'unread' && (
                    <Button 
                      variant="outline"
                      onClick={() => {
                        handleMarkAsRead(selectedMessage);
                        setSelectedMessage(null);
                      }}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Mark as Read
                    </Button>
                  )}
                  <Button 
                    variant="destructive"
                    onClick={() => {
                      handleDelete(selectedMessage);
                      setSelectedMessage(null);
                    }}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};