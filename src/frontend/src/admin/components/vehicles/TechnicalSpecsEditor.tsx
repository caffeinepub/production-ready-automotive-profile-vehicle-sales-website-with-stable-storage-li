import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, X } from 'lucide-react';
import type { TechnicalSpecs } from '../../../backend';

interface TechnicalSpecsEditorProps {
  specs: TechnicalSpecs;
  onChange: (specs: TechnicalSpecs) => void;
}

export default function TechnicalSpecsEditor({ specs, onChange }: TechnicalSpecsEditorProps) {
  const [newFeature, setNewFeature] = useState('');

  const handleAddFeature = () => {
    if (!newFeature.trim()) return;
    onChange({
      ...specs,
      additionalFeatures: [...specs.additionalFeatures, newFeature.trim()]
    });
    setNewFeature('');
  };

  const handleRemoveFeature = (index: number) => {
    onChange({
      ...specs,
      additionalFeatures: specs.additionalFeatures.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Technical Specifications</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="engine">Engine</Label>
          <Input
            id="engine"
            value={specs.engine}
            onChange={(e) => onChange({ ...specs, engine: e.target.value })}
            placeholder="e.g., 2.0L Turbo"
          />
        </div>

        <div>
          <Label htmlFor="transmission">Transmission</Label>
          <Input
            id="transmission"
            value={specs.transmission}
            onChange={(e) => onChange({ ...specs, transmission: e.target.value })}
            placeholder="e.g., 6-Speed Automatic"
          />
        </div>

        <div>
          <Label htmlFor="dimensions">Dimensions</Label>
          <Input
            id="dimensions"
            value={specs.dimensions}
            onChange={(e) => onChange({ ...specs, dimensions: e.target.value })}
            placeholder="e.g., 4500 x 1800 x 1600 mm"
          />
        </div>

        <div>
          <Label htmlFor="weight">Weight</Label>
          <Input
            id="weight"
            value={specs.weight}
            onChange={(e) => onChange({ ...specs, weight: e.target.value })}
            placeholder="e.g., 1500 kg"
          />
        </div>

        <div>
          <Label htmlFor="fuelCapacity">Fuel Capacity</Label>
          <Input
            id="fuelCapacity"
            value={specs.fuelCapacity}
            onChange={(e) => onChange({ ...specs, fuelCapacity: e.target.value })}
            placeholder="e.g., 50 liters"
          />
        </div>

        <div>
          <Label htmlFor="suspension">Suspension</Label>
          <Input
            id="suspension"
            value={specs.suspension}
            onChange={(e) => onChange({ ...specs, suspension: e.target.value })}
            placeholder="e.g., Independent Front, Multi-link Rear"
          />
        </div>
      </div>

      <div className="mt-6">
        <Label>Additional Features</Label>
        <div className="space-y-2 mt-2">
          {specs.additionalFeatures.map((feature, idx) => (
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
              placeholder="Add an additional feature..."
              onKeyPress={(e) => e.key === 'Enter' && handleAddFeature()}
            />
            <Button onClick={handleAddFeature} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
