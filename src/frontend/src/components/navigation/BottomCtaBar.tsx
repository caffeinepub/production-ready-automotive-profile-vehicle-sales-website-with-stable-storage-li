import { useState } from 'react';
import { Phone, MessageCircle, Calculator, Menu } from 'lucide-react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import MainMenuSheet from './MainMenuSheet';
import CreditSimulationForm from '../forms/CreditSimulationForm';

export default function BottomCtaBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [creditOpen, setCreditOpen] = useState(false);

  const handleCall = () => {
    window.location.href = 'tel:+6285212340778';
  };

  const handleWhatsApp = () => {
    window.open('https://wa.me/6285212340778', '_blank');
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white shadow-lg rounded-t-2xl border-t">
        <div className="grid grid-cols-4 h-16">
          <button
            onClick={handleCall}
            className="flex flex-col items-center justify-center gap-1 bg-[#C90010] text-white hover:opacity-90 transition-opacity rounded-tl-2xl"
          >
            <Phone className="h-5 w-5" />
            <span className="text-xs font-medium">Call</span>
          </button>

          <button
            onClick={handleWhatsApp}
            className="flex flex-col items-center justify-center gap-1 bg-[#398E3D] text-white hover:opacity-90 transition-opacity"
          >
            <MessageCircle className="h-5 w-5" />
            <span className="text-xs font-medium">WhatsApp</span>
          </button>

          <button
            onClick={() => setCreditOpen(true)}
            className="flex flex-col items-center justify-center gap-1 bg-[#FEA500] text-white hover:opacity-90 transition-opacity"
          >
            <Calculator className="h-5 w-5" />
            <span className="text-xs font-medium">Credit</span>
          </button>

          <button
            onClick={() => setMenuOpen(true)}
            className="flex flex-col items-center justify-center gap-1 bg-[#0166C0] text-white hover:opacity-90 transition-opacity rounded-tr-2xl"
          >
            <Menu className="h-5 w-5" />
            <span className="text-xs font-medium">Menu</span>
          </button>
        </div>
      </div>

      <MainMenuSheet open={menuOpen} onOpenChange={setMenuOpen} />

      <Sheet open={creditOpen} onOpenChange={setCreditOpen}>
        <SheetContent side="bottom" className="h-[90vh] overflow-y-auto">
          <div className="py-4">
            <h2 className="text-2xl font-bold mb-4">Credit Simulation</h2>
            <CreditSimulationForm onSuccess={() => setCreditOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
