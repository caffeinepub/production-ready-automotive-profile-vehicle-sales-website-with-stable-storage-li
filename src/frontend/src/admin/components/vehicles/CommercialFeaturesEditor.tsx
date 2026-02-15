import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import type { CommercialVehicleFeatures } from '../../../backend';

interface CommercialFeaturesEditorProps {
  features: CommercialVehicleFeatures | undefined;
  onChange: (features: CommercialVehicleFeatures | undefined) => void;
}

export default function CommercialFeaturesEditor({ features, onChange }: CommercialFeaturesEditorProps) {
  const currentFeatures: CommercialVehicleFeatures = features || {
    economical: false,
    power: false,
    speed: false,
    capacity: false,
    bus: false,
    fourByTwo: false,
    sixByTwo: false,
    sixByFour: false
  };

  const handleToggle = (key: keyof CommercialVehicleFeatures) => {
    onChange({
      ...currentFeatures,
      [key]: !currentFeatures[key]
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Commercial Vehicle Features</h3>
      <p className="text-sm text-gray-600">Select the features that apply to this commercial vehicle.</p>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="economical"
            checked={currentFeatures.economical}
            onCheckedChange={() => handleToggle('economical')}
          />
          <Label htmlFor="economical" className="cursor-pointer">Economical</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="power"
            checked={currentFeatures.power}
            onCheckedChange={() => handleToggle('power')}
          />
          <Label htmlFor="power" className="cursor-pointer">Power</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="speed"
            checked={currentFeatures.speed}
            onCheckedChange={() => handleToggle('speed')}
          />
          <Label htmlFor="speed" className="cursor-pointer">Speed</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="capacity"
            checked={currentFeatures.capacity}
            onCheckedChange={() => handleToggle('capacity')}
          />
          <Label htmlFor="capacity" className="cursor-pointer">Capacity</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="bus"
            checked={currentFeatures.bus}
            onCheckedChange={() => handleToggle('bus')}
          />
          <Label htmlFor="bus" className="cursor-pointer">Bus</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="fourByTwo"
            checked={currentFeatures.fourByTwo}
            onCheckedChange={() => handleToggle('fourByTwo')}
          />
          <Label htmlFor="fourByTwo" className="cursor-pointer">4x2</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="sixByTwo"
            checked={currentFeatures.sixByTwo}
            onCheckedChange={() => handleToggle('sixByTwo')}
          />
          <Label htmlFor="sixByTwo" className="cursor-pointer">6x2</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="sixByFour"
            checked={currentFeatures.sixByFour}
            onCheckedChange={() => handleToggle('sixByFour')}
          />
          <Label htmlFor="sixByFour" className="cursor-pointer">6x4</Label>
        </div>
      </div>
    </div>
  );
}
