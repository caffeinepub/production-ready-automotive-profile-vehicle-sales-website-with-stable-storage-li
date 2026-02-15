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
import type { Testimonial } from '../../backend';

interface TestimonialFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  testimonial: Testimonial | null;
  onSave: (testimonial: Testimonial) => void;
  isSaving: boolean;
}

export default function TestimonialFormDialog({
  open,
  onOpenChange,
  testimonial,
  onSave,
  isSaving
}: TestimonialFormDialogProps) {
  const [formData, setFormData] = useState<Partial<Testimonial>>({
    customerName: '',
    city: '',
    review: '',
    rating: 5,
    imageUrl: '',
    published: false
  });
  const [showImagePicker, setShowImagePicker] = useState(false);

  useEffect(() => {
    if (testimonial) {
      setFormData(testimonial);
    } else {
      setFormData({
        customerName: '',
        city: '',
        review: '',
        rating: 5,
        imageUrl: '',
        published: false
      });
    }
  }, [testimonial, open]);

  const handleSubmit = () => {
    const testimonialData: Testimonial = {
      id: testimonial?.id || BigInt(Date.now()),
      customerName: formData.customerName || '',
      city: formData.city || '',
      review: formData.review || '',
      rating: formData.rating || 5,
      imageUrl: formData.imageUrl || '',
      published: formData.published || false
    };
    onSave(testimonialData);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{testimonial ? 'Edit Testimonial' : 'Add Testimonial'}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="customerName">Customer Name</Label>
              <Input
                id="customerName"
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="review">Review</Label>
              <Textarea
                id="review"
                value={formData.review}
                onChange={(e) => setFormData({ ...formData, review: e.target.value })}
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="rating">Rating (1-5)</Label>
              <Input
                id="rating"
                type="number"
                min="1"
                max="5"
                step="0.5"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
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
