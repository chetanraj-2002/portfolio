import React, { useState, useCallback } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface MultiFileUploadProps {
  onFilesUploaded: (urls: string[]) => void;
  accept?: string;
  maxSize?: number; // in MB
  className?: string;
  placeholder?: string;
  currentFiles?: string[];
}

export const MultiFileUpload: React.FC<MultiFileUploadProps> = ({
  onFilesUploaded,
  accept = "image/jpeg,image/jpg,image/png,image/gif,image/webp,image/svg+xml,image/bmp,image/tiff",
  maxSize = 10,
  className = "",
  placeholder = "Click to upload or drag and drop (Multiple files)",
  currentFiles = []
}) => {
  const [uploading, setUploading] = useState(false);
  const [previews, setPreviews] = useState<string[]>(currentFiles);
  const { toast } = useToast();

  const uploadFiles = async (files: File[]) => {
    try {
      setUploading(true);
      const uploadedUrls: string[] = [];

      for (const file of files) {
        // Validate file size
        if (file.size > maxSize * 1024 * 1024) {
          throw new Error(`File ${file.name} size must be less than ${maxSize}MB`);
        }

        // Create unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        const filePath = `media-uploads/${fileName}`;

        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('media-uploads')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data } = supabase.storage
          .from('media-uploads')
          .getPublicUrl(filePath);

        uploadedUrls.push(data.publicUrl);
      }

      const allUrls = [...previews, ...uploadedUrls];
      setPreviews(allUrls);
      onFilesUploaded(allUrls);

      toast({
        title: "Success",
        description: `${uploadedUrls.length} file(s) uploaded successfully`,
      });

    } catch (error) {
      console.error('Error uploading files:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload files",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = useCallback((files: File[]) => {
    uploadFiles(files);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files);
    }
  }, [handleFileSelect]);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(Array.from(files));
    }
  };

  const removeFile = (index: number) => {
    const newPreviews = previews.filter((_, i) => i !== index);
    setPreviews(newPreviews);
    onFilesUploaded(newPreviews);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {previews.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {previews.map((preview, index) => (
            <div key={index} className="relative">
              <div className="border border-border rounded-lg overflow-hidden">
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-24 object-cover"
                />
              </div>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-1 right-1 h-6 w-6 p-0"
                onClick={() => removeFile(index)}
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <div
        className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => document.getElementById('multi-file-input')?.click()}
      >
        <input
          id="multi-file-input"
          type="file"
          accept={accept}
          multiple
          onChange={handleFileInputChange}
          className="hidden"
        />
        
        <div className="space-y-2">
          {uploading ? (
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
          ) : (
            <ImageIcon className="w-8 h-8 text-muted-foreground mx-auto" />
          )}
          
          <div className="space-y-1">
            <p className="text-sm font-medium">
              {uploading ? 'Uploading...' : placeholder}
            </p>
            <p className="text-xs text-muted-foreground">
              Max size: {maxSize}MB per file
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
