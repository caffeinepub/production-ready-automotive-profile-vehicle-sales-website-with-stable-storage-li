import { useState } from 'react';
import { Phone, MessageCircle, Calculator, Menu } from 'lucide-react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Link } from '@tanstack/react-router';
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

  const menuItems = [
    { label: 'Beranda', path: '/' },
    { label: 'Mobil Keluarga', path: '/mobil-keluarga' },
    { label: 'Mobil Niaga', path: '/mobil-niaga' },
    { label: 'Promo', path: '/promo' },
    { label: 'Testimoni', path: '/testimoni' },
    { label: 'Blog', path: '/blog' },
    { label: 'Kontak', path: '/kontak' }
  ];

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white shadow-lg border-t">
        <div className="grid grid-cols-4" style={{ height: '50px' }}>
          <button
            onClick={handleCall}
            className="flex flex-col items-center justify-center gap-0.5 bg-[#C90010] text-white hover:opacity-90 transition-opacity"
          >
            <Phone className="h-4 w-4" />
            <span className="text-[10px] font-medium">Telepon</span>
          </button>

          <button
            onClick={handleWhatsApp}
            className="flex flex-col items-center justify-center gap-0.5 bg-[#398E3D] text-white hover:opacity-90 transition-opacity"
          >
            <MessageCircle className="h-4 w-4" />
            <span className="text-[10px] font-medium">WhatsApp</span>
          </button>

          <button
            onClick={() => setCreditOpen(true)}
            className="flex flex-col items-center justify-center gap-0.5 bg-[#FEA500] text-white hover:opacity-90 transition-opacity"
          >
            <Calculator className="h-4 w-4" />
            <span className="text-[10px] font-medium">Kredit</span>
          </button>

          <Popover open={menuOpen} onOpenChange={setMenuOpen}>
            <PopoverTrigger asChild>
              <button
                className="flex flex-col items-center justify-center gap-0.5 bg-[#0166C0] text-white hover:opacity-90 transition-opacity"
              >
                <Menu className="h-4 w-4" />
                <span className="text-[10px] font-medium">Menu</span>
              </button>
            </PopoverTrigger>
            <PopoverContent 
              side="top" 
              align="end" 
              className="w-64 p-2 mb-2 mr-2 bg-white border border-gray-200 shadow-xl rounded-xl"
              sideOffset={8}
            >
              <div className="flex flex-col gap-1">
                <div className="px-3 py-2 border-b border-gray-100">
                  <h3 className="font-semibold text-sm text-gray-900">Menu Navigasi</h3>
                </div>
                {menuItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMenuOpen(false)}
                    className="text-sm font-medium hover:bg-gray-100 transition-colors px-3 py-2.5 rounded-lg text-gray-700 hover:text-[#C90010]"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <Sheet open={creditOpen} onOpenChange={setCreditOpen}>
        <SheetContent side="bottom" className="h-[90vh] overflow-y-auto rounded-t-2xl">
          <div className="py-4">
            <div className="flex items-center gap-3 mb-4">
              <Calculator className="h-6 w-6 text-[#FEA500]" />
              <h2 className="text-2xl font-bold">Simulasi Kredit</h2>
            </div>
            <CreditSimulationForm onSuccess={() => setCreditOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
