import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { X } from 'lucide-react';
import { FileUpload } from '@/components/FileUpload';

interface Field {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'date' | 'select' | 'switch' | 'number' | 'email' | 'url' | 'file';
  options?: { value: string; label: string }[];
  required?: boolean;
  placeholder?: string;
}

interface AdminFormProps {
  fields: Field[];
  data: any;
  onChange: (name: string, value: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  loading?: boolean;
  title: string;
}

export const AdminForm = ({
  fields,
  data,
  onChange,
  onSubmit,
  onCancel,
  loading = false,
  title
}: AdminFormProps) => {
  const renderField = (field: Field) => {
    const value = data[field.name] || '';

    switch (field.type) {
      case 'textarea':
        return (
          <Textarea
            value={value}
            onChange={(e) => onChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            rows={4}
          />
        );
      
      case 'select':
        return (
          <Select value={value} onValueChange={(val) => onChange(field.name, val)}>
            <SelectTrigger>
              <SelectValue placeholder={field.placeholder || `Select ${field.label}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      
      case 'switch':
        return (
          <Switch
            checked={value}
            onCheckedChange={(checked) => onChange(field.name, checked)}
          />
        );
      
      case 'file':
        return (
          <FileUpload
            onFileUploaded={(url) => onChange(field.name, url)}
            currentFile={value}
            placeholder="Upload file"
          />
        );
      
      default:
        return (
          <Input
            type={field.type}
            value={value}
            onChange={(e) => onChange(field.name, e.target.value)}
            placeholder={field.placeholder}
          />
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background border rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium">{title}</h3>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          {fields.map((field) => (
            <div key={field.name} className="space-y-2">
              <Label htmlFor={field.name}>
                {field.label}
                {field.required && <span className="text-destructive ml-1">*</span>}
              </Label>
              {renderField(field)}
            </div>
          ))}

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};