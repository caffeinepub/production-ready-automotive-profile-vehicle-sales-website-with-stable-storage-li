import { Link } from '@tanstack/react-router';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';

interface MainMenuSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function MainMenuSheet({ open, onOpenChange }: MainMenuSheetProps) {
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
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[70vh] rounded-t-3xl">
        <div className="py-6">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
            <Menu className="h-6 w-6 text-[#C90010]" />
            <h2 className="text-2xl font-bold">Menu</h2>
          </div>
          <div className="flex flex-col gap-1">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => onOpenChange(false)}
                className="text-base font-medium hover:bg-gray-100 hover:text-[#C90010] transition-colors py-3 px-4 rounded-lg border-b border-gray-100 last:border-0"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
