import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Camera, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ProfilePhotoUploadProps {
  currentPhotoUrl?: string;
  onPhotoUpdate?: (photoUrl: string) => void;
  size?: 'sm' | 'md' | 'lg';
  editable?: boolean;
}

const ProfilePhotoUpload = ({ 
  currentPhotoUrl, 
  onPhotoUpdate, 
  size = 'md',
  editable = true 
}: ProfilePhotoUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Generate a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/profile-photo.${fileExt}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('media-uploads')
        .upload(fileName, file, {
          upsert: true, // Replace existing file
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('media-uploads')
        .getPublicUrl(fileName);

      if (onPhotoUpdate) {
        onPhotoUpdate(publicUrl);
      }

      toast({
        title: "Photo updated",
        description: "Your profile photo has been updated successfully",
      });
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast({
        title: "Upload failed",
        description: "Failed to update profile photo. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="relative inline-block">
      <Avatar className={`${sizeClasses[size]} border-2 border-primary/20`}>
        <AvatarImage 
          src={currentPhotoUrl} 
          alt="Profile Photo"
          className="object-cover"
        />
        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
          {/* Show first letter of name as fallback */}
          CJ
        </AvatarFallback>
      </Avatar>
      
      {editable && (
        <>
          <Button
            size="sm"
            variant="secondary"
            className="absolute -bottom-2 -right-2 rounded-full p-2 h-8 w-8 shadow-lg"
            onClick={handleUploadClick}
            disabled={isUploading}
          >
            {isUploading ? (
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            ) : (
              <Camera className="w-3 h-3" />
            )}
          </Button>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </>
      )}
    </div>
  );
};

export default ProfilePhotoUpload;