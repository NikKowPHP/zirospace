import { useState, useEffect } from 'react';
import { Banner } from '@/domain/models/banner.model';
import { Modal } from '@/components/ui/modal/modal';
import { Input } from '@/components/ui/input/input';
import { Textarea } from '@/components/ui/textarea/textarea';
import { Button } from '@/components/ui/button/button';
import { Label } from '@/components/ui/label/label';
import { Switch } from '@/components/ui/switch/switch';

interface BannerModalProps {
  banner?: Banner | null;
  isOpen: boolean;
  onSave: (banner: Partial<Banner>) => void;
  onClose: () => void;
}

export const BannerModal = ({ banner, isOpen, onSave, onClose }: BannerModalProps) => {
  const [localBanner, setLocalBanner] = useState<Partial<Banner>>(banner || {});

  useEffect(() => {
    if (banner) {
      setLocalBanner(banner);
    }
  }, [banner]);

  const handleChange = (field: keyof Banner, value: any) => {
    setLocalBanner(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Banner Details">
      <div className="space-y-4">
        {/* Title */}
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={localBanner.title || ''}
            onChange={(e) => handleChange('title', e.target.value)}
          />
        </div>

        {/* Subtitle */}
        <div>
          <Label htmlFor="subtitle">Subtitle</Label>
          <Input
            id="subtitle"
            value={localBanner.subtitle || ''}
            onChange={(e) => handleChange('subtitle', e.target.value)}
          />
        </div>

        {/* Content */}
        <div>
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            value={localBanner.content || ''}
            onChange={(e) => handleChange('content', e.target.value)}
            rows={4}
          />
        </div>

        {/* Image URL */}
        <div>
          <Label htmlFor="imageUrl">Image URL</Label>
          <Input
            id="imageUrl"
            value={localBanner.imageUrl || ''}
            onChange={(e) => handleChange('imageUrl', e.target.value)}
          />
          {localBanner.imageUrl && (
            <div className="mt-2">
              <img 
                src={localBanner.imageUrl} 
                alt="Banner preview" 
                className="max-h-40 object-cover rounded-md"
              />
            </div>
          )}
        </div>

        {/* Active Dates */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              type="datetime-local"
              value={localBanner.startDate?.toISOString().slice(0, 16) || ''}
              onChange={(e) => handleChange('startDate', new Date(e.target.value))}
            />
          </div>
          <div>
            <Label htmlFor="endDate">End Date</Label>
            <Input
              id="endDate"
              type="datetime-local"
              value={localBanner.endDate?.toISOString().slice(0, 16) || ''}
              onChange={(e) => handleChange('endDate', new Date(e.target.value))}
            />
          </div>
        </div>

        {/* CTA Section */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="ctaButtonText">CTA Button Text</Label>
            <Input
              id="ctaButtonText"
              value={localBanner.ctaButtonText || ''}
              onChange={(e) => handleChange('ctaButtonText', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="ctaButtonLink">CTA Button Link</Label>
            <Input
              id="ctaButtonLink"
              value={localBanner.ctaButtonLink || ''}
              onChange={(e) => handleChange('ctaButtonLink', e.target.value)}
            />
          </div>
        </div>

        {/* Active Status */}
        <div className="flex items-center gap-2">
          <Switch 
            id="isActive" 
            checked={localBanner.isActive || false}
            onCheckedChange={(checked) => handleChange('isActive', checked)}
          />
          <Label htmlFor="isActive">Active Banner</Label>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={() => onSave(localBanner)}>
            Save Changes
          </Button>
        </div>
      </div>
    </Modal>
  );
};
