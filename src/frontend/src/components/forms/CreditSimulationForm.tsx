import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAddCreditSimulation } from '../../hooks/useQueries';
import { toast } from 'sonner';
import type { CreditSimulation } from '../../backend';

interface CreditSimulationFormProps {
  onSuccess?: () => void;
}

export default function CreditSimulationForm({ onSuccess }: CreditSimulationFormProps) {
  const addSimulation = useAddCreditSimulation();
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phoneNumber: '',
    email: '',
    message: '',
    unit: '',
    downPayment: '',
    tenor: '',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.phoneNumber || !formData.unit) {
      toast.error('Mohon isi semua kolom yang wajib diisi');
      return;
    }

    const simulation: CreditSimulation = {
      name: formData.name,
      address: formData.address,
      phoneNumber: formData.phoneNumber,
      email: formData.email,
      message: formData.message,
      unit: formData.unit,
      downPayment: formData.downPayment ? parseFloat(formData.downPayment) : undefined,
      tenor: formData.tenor ? BigInt(formData.tenor) : undefined,
      notes: formData.notes || undefined,
      date: new Date().toISOString()
    };

    try {
      await addSimulation.mutateAsync(simulation);
      toast.success('Permintaan simulasi kredit berhasil dikirim!');
      setFormData({
        name: '',
        address: '',
        phoneNumber: '',
        email: '',
        message: '',
        unit: '',
        downPayment: '',
        tenor: '',
        notes: ''
      });
      onSuccess?.();
    } catch (error) {
      toast.error('Gagal mengirim permintaan. Silakan coba lagi.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Nama *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="phoneNumber">Nomor Telepon *</Label>
        <Input
          id="phoneNumber"
          type="tel"
          value={formData.phoneNumber}
          onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </div>

      <div>
        <Label htmlFor="unit">Unit Kendaraan *</Label>
        <Input
          id="unit"
          value={formData.unit}
          onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="downPayment">Uang Muka (Rp)</Label>
          <Input
            id="downPayment"
            type="number"
            value={formData.downPayment}
            onChange={(e) => setFormData({ ...formData, downPayment: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="tenor">Tenor (bulan)</Label>
          <Input
            id="tenor"
            type="number"
            value={formData.tenor}
            onChange={(e) => setFormData({ ...formData, tenor: e.target.value })}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="message">Informasi Tambahan</Label>
        <Textarea
          id="message"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          rows={3}
        />
      </div>

      <Button type="submit" className="w-full bg-[#FEA500] hover:bg-[#e59400]" disabled={addSimulation.isPending}>
        {addSimulation.isPending ? 'Mengirim...' : 'Kirim Permintaan Simulasi'}
      </Button>
    </form>
  );
}
