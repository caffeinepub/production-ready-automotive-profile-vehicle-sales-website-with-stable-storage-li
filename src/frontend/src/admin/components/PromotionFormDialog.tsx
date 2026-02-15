import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import MediaPickerDialog from './media/MediaPickerDialog';
import type { Promotion } from '../../backend';

interface PromotionFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  promotion: Promotion | null;
  onSave: (promotion: Promotion) => void;
  isSaving: boolean;
}

export default function PromotionFormDialog({
  open,
  onOpenChange,
  promotion,
  onSave,
  isSaving
}: PromotionFormDialogProps) {
  const [formData, setFormData] = useState<Partial<Promotion>>({
    title: '',
    description: '',
    terms: '',
    validUntil: '',
    imageUrl: '',
    published: false
  });
  const [showImagePicker, setShowImagePicker] = useState(false);

  useEffect(() => {
    if (promotion) {
      setFormData(promotion);
    } else {
      setFormData({
        title: '',
        description: '',
        terms: '',
        validUntil: '',
        imageUrl: '',
        published: false
      });
    }
  }, [promotion, open]);

  const handleSubmit = () => {
    const promotionData: Promotion = {
      id: promotion?.id || BigInt(Date.now()),
      title: formData.title || '',
      description: formData.description || '',
      terms: formData.terms || '',
      validUntil: formData.validUntil || '',
      imageUrl: formData.imageUrl || '',
      published: formData.published || false
    };
    onSave(promotionData);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{promotion ? 'Edit Promotion' : 'Add Promotion'}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="terms">Terms & Conditions</Label>
              <Textarea
                id="terms"
                value={formData.terms}
                onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="validUntil">Valid Until</Label>
              <Input
                id="validUntil"
                type="date"
                value={formData.validUntil}
                onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
              />
            </div>

            <div>
              <Label>Image</Label>
              <div className="flex gap-2">
                <Input value={formData.imageUrl} readOnly />
                <Button type="button" onClick={() => setShowImagePicker(true)}>
                  Select
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                id="published"
                checked={formData.published}
                onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
              />
              <Label htmlFor="published">Published</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <MediaPickerDialog
        open={showImagePicker}
        onOpenChange={setShowImagePicker}
        onSelect={(url) => {
          setFormData({ ...formData, imageUrl: url });
          setShowImagePicker(false);
        }}
      />
    </>
  );
}
