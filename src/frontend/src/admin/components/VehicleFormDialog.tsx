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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MediaPickerDialog from './media/MediaPickerDialog';
import VariantsEditor from './vehicles/VariantsEditor';
import TechnicalSpecsEditor from './vehicles/TechnicalSpecsEditor';
import CommercialFeaturesEditor from './vehicles/CommercialFeaturesEditor';
import type { Vehicle } from '../../backend';

interface VehicleFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicle: Vehicle | null;
  onSave: (vehicle: Vehicle) => void;
  isSaving: boolean;
}

export default function VehicleFormDialog({
  open,
  onOpenChange,
  vehicle,
  onSave,
  isSaving
}: VehicleFormDialogProps) {
  const [formData, setFormData] = useState<Partial<Vehicle>>({
    name: '',
    description: '',
    price: 0n,
    imageUrl: '',
    videoUrl: '',
    variants: [],
    isCommercial: false,
    brochure: '',
    specs: {
      engine: '',
      transmission: '',
      dimensions: '',
      weight: '',
      fuelCapacity: '',
      suspension: '',
      additionalFeatures: []
    },
    commercialFeatures: undefined,
    published: false
  });
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [showBrochurePicker, setShowBrochurePicker] = useState(false);

  useEffect(() => {
    if (vehicle) {
      setFormData(vehicle);
    } else {
      setFormData({
        name: '',
        description: '',
        price: 0n,
        imageUrl: '',
        videoUrl: '',
        variants: [],
        isCommercial: false,
        brochure: '',
        specs: {
          engine: '',
          transmission: '',
          dimensions: '',
          weight: '',
          fuelCapacity: '',
          suspension: '',
          additionalFeatures: []
        },
        commercialFeatures: undefined,
        published: false
      });
    }
  }, [vehicle, open]);

  const handleSubmit = () => {
    const vehicleData: Vehicle = {
      id: vehicle?.id || BigInt(Date.now()),
      name: formData.name || '',
      description: formData.description || '',
      price: formData.price || 0n,
      imageUrl: formData.imageUrl || '',
      videoUrl: formData.videoUrl || undefined,
      variants: formData.variants || [],
      isCommercial: formData.isCommercial || false,
      brochure: formData.brochure || '',
      specs: formData.specs || {
        engine: '',
        transmission: '',
        dimensions: '',
        weight: '',
        fuelCapacity: '',
        suspension: '',
        additionalFeatures: []
      },
      commercialFeatures: formData.commercialFeatures,
      published: formData.published || false
    };
    onSave(vehicleData);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{vehicle ? 'Edit Vehicle' : 'Add Vehicle'}</DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="variants">Variants</TabsTrigger>
              <TabsTrigger value="specs">Technical Specs</TabsTrigger>
              <TabsTrigger value="commercial">Commercial</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="price">Base Price (IDR)</Label>
                <Input
                  id="price"
                  type="number"
                  value={Number(formData.price)}
                  onChange={(e) => setFormData({ ...formData, price: BigInt(e.target.value || 0) })}
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

              <div>
                <Label>Brochure</Label>
                <div className="flex gap-2">
                  <Input value={formData.brochure} readOnly />
                  <Button type="button" onClick={() => setShowBrochurePicker(true)}>
                    Select
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="videoUrl">Video URL (optional)</Label>
                <Input
                  id="videoUrl"
                  value={formData.videoUrl || ''}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value || undefined })}
                  placeholder="https://youtube.com/..."
                />
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  id="isCommercial"
                  checked={formData.isCommercial}
                  onCheckedChange={(checked) => setFormData({ ...formData, isCommercial: checked })}
                />
                <Label htmlFor="isCommercial">Commercial Vehicle</Label>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  id="published"
                  checked={formData.published}
                  onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
                />
                <Label htmlFor="published">Published</Label>
              </div>
            </TabsContent>

            <TabsContent value="variants">
              <VariantsEditor
                variants={formData.variants || []}
                onChange={(variants) => setFormData({ ...formData, variants })}
              />
            </TabsContent>

            <TabsContent value="specs">
              <TechnicalSpecsEditor
                specs={formData.specs || {
                  engine: '',
                  transmission: '',
                  dimensions: '',
                  weight: '',
                  fuelCapacity: '',
                  suspension: '',
                  additionalFeatures: []
                }}
                onChange={(specs) => setFormData({ ...formData, specs })}
              />
            </TabsContent>

            <TabsContent value="commercial">
              <CommercialFeaturesEditor
                features={formData.commercialFeatures}
                onChange={(features) => setFormData({ ...formData, commercialFeatures: features })}
              />
            </TabsContent>
          </Tabs>

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

      <MediaPickerDialog
        open={showBrochurePicker}
        onOpenChange={setShowBrochurePicker}
        onSelect={(url) => {
          setFormData({ ...formData, brochure: url });
          setShowBrochurePicker(false);
        }}
      />
    </>
  );
}
