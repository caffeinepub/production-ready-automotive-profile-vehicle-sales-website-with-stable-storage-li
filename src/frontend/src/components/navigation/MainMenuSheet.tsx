import { Link } from '@tanstack/react-router';
import { Sheet, SheetContent } from '@/components/ui/sheet';

interface MainMenuSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function MainMenuSheet({ open, onOpenChange }: MainMenuSheetProps) {
  const menuItems = [
    { label: 'Home', path: '/' },
    { label: 'Passenger Vehicles', path: '/mobil-keluarga' },
    { label: 'Commercial Vehicles', path: '/mobil-niaga' },
    { label: 'Promotions', path: '/promo' },
    { label: 'Testimonials', path: '/testimoni' },
    { label: 'Blog', path: '/blog' },
    { label: 'Contact', path: '/kontak' }
  ];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[70vh] rounded-t-3xl">
        <div className="py-6">
          <h2 className="text-2xl font-bold mb-6">Menu</h2>
          <div className="flex flex-col gap-4">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => onOpenChange(false)}
                className="text-lg font-medium hover:text-[#C90010] transition-colors py-2 border-b"
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
