import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, X } from 'lucide-react';
import type { Variant } from '../../../backend';

interface VariantsEditorProps {
  variants: Variant[];
  onChange: (variants: Variant[]) => void;
}

export default function VariantsEditor({ variants, onChange }: VariantsEditorProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [tempVariant, setTempVariant] = useState<Variant>({
    name: '',
    priceAdjustment: 0n,
    features: [],
    isPremium: false
  });
  const [newFeature, setNewFeature] = useState('');

  const handleAddVariant = () => {
    setEditingIndex(variants.length);
    setTempVariant({
      name: '',
      priceAdjustment: 0n,
      features: [],
      isPremium: false
    });
  };

  const handleSaveVariant = () => {
    if (editingIndex === null) return;
    
    const newVariants = [...variants];
    if (editingIndex >= newVariants.length) {
      newVariants.push(tempVariant);
    } else {
      newVariants[editingIndex] = tempVariant;
    }
    onChange(newVariants);
    setEditingIndex(null);
  };

  const handleDeleteVariant = (index: number) => {
    const newVariants = variants.filter((_, i) => i !== index);
    onChange(newVariants);
  };

  const handleAddFeature = () => {
    if (!newFeature.trim()) return;
    setTempVariant({
      ...tempVariant,
      features: [...tempVariant.features, newFeature.trim()]
    });
    setNewFeature('');
  };

  const handleRemoveFeature = (index: number) => {
    setTempVariant({
      ...tempVariant,
      features: tempVariant.features.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Variants</h3>
        <Button onClick={handleAddVariant} size="sm">
          <Plus className="h-4 w-4 mr-1" />
          Add Variant
        </Button>
      </div>

      {variants.map((variant, index) => (
        editingIndex === index ? null : (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-medium">
                {variant.name}
                {variant.isPremium && (
                  <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Premium</span>
                )}
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditingIndex(index);
                    setTempVariant(variant);
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteVariant(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Price Adjustment: Rp {Number(variant.priceAdjustment).toLocaleString('id-ID')}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Features: {variant.features.length} items
              </p>
            </CardContent>
          </Card>
        )
      ))}

      {editingIndex !== null && (
        <Card className="border-2 border-[#C90010]">
          <CardHeader>
            <CardTitle className="text-base">
              {editingIndex >= variants.length ? 'New Variant' : 'Edit Variant'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="variant-name">Variant Name</Label>
              <Input
                id="variant-name"
                value={tempVariant.name}
                onChange={(e) => setTempVariant({ ...tempVariant, name: e.target.value })}
                placeholder="e.g., Standard, Deluxe, Premium"
              />
            </div>

            <div>
              <Label htmlFor="price-adjustment">Price Adjustment (Rp)</Label>
              <Input
                id="price-adjustment"
                type="number"
                value={Number(tempVariant.priceAdjustment)}
                onChange={(e) => {
                  const value = e.target.value;
                  setTempVariant({ 
                    ...tempVariant, 
                    priceAdjustment: value ? BigInt(value) : 0n 
                  });
                }}
                placeholder="0"
              />
            </div>

            <div className="flex items-center gap-2">
              <Switch
                checked={tempVariant.isPremium}
                onCheckedChange={(checked) => setTempVariant({ ...tempVariant, isPremium: checked })}
              />
              <Label>Premium Variant</Label>
            </div>

            <div>
              <Label>Features</Label>
              <div className="space-y-2 mt-2">
                {tempVariant.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-gray-50 p-2 rounded">
                    <span className="flex-1 text-sm">{feature}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveFeature(idx)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <Input
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    placeholder="Add a feature..."
                    onKeyPress={(e) => e.key === 'Enter' && handleAddFeature()}
                  />
                  <Button onClick={handleAddFeature} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setEditingIndex(null)}>
                Cancel
              </Button>
              <Button onClick={handleSaveVariant} className="bg-[#C90010] hover:bg-[#a00010]">
                Save Variant
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {variants.length === 0 && editingIndex === null && (
        <div className="text-center py-8 text-gray-500 border-2 border-dashed rounded-lg">
          No variants added yet. Click "Add Variant" to create one.
        </div>
      )}
    </div>
  );
}
