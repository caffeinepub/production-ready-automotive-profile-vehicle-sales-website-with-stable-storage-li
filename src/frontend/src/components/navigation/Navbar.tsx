import { useState } from 'react';
import { Link, useLocation } from '@tanstack/react-router';
import { Menu, X, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Passenger Vehicles', path: '/mobil-keluarga' },
    { label: 'Commercial Vehicles', path: '/mobil-niaga' },
    { label: 'Promotions', path: '/promo' },
    { label: 'Testimonials', path: '/testimoni' },
    { label: 'Blog', path: '/blog' },
    { label: 'Contact', path: '/kontak' }
  ];

  const handleWhatsApp = () => {
    window.open('https://wa.me/6285212340778', '_blank');
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#262729] text-white h-16 md:h-20">
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img src="/assets/generated/dealer-logo.dim_512x512.png" alt="Logo" className="h-10 md:h-12" />
        </Link>

        <div className="hidden lg:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-sm font-medium hover:text-gray-300 transition-colors ${
                location.pathname === item.path ? 'text-white' : 'text-gray-400'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="hidden lg:block">
          <Button onClick={handleWhatsApp} className="bg-[#398E3D] hover:bg-[#2d7030]">
            <Phone className="mr-2 h-4 w-4" />
            Contact Us
          </Button>
        </div>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="ghost" size="icon">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] bg-[#262729] text-white border-gray-700">
            <div className="flex flex-col gap-4 mt-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`text-lg font-medium hover:text-gray-300 transition-colors ${
                    location.pathname === item.path ? 'text-white' : 'text-gray-400'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <Button onClick={handleWhatsApp} className="bg-[#398E3D] hover:bg-[#2d7030] mt-4">
                <Phone className="mr-2 h-4 w-4" />
                Contact Us
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
