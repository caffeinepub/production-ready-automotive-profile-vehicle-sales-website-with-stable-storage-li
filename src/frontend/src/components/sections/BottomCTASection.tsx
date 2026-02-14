import { Button } from '@/components/ui/button';
import { Phone } from 'lucide-react';

export default function BottomCTASection() {
  const handleWhatsApp = () => {
    window.open('https://wa.me/6285212340778', '_blank');
  };

  return (
    <section className="bg-gradient-to-r from-[#C90010] to-[#a00010] py-12 md:py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Get Started?</h2>
        <p className="text-white/90 text-lg mb-6">Contact us today for the best deals and service</p>
        <Button onClick={handleWhatsApp} size="lg" className="bg-white text-[#C90010] hover:bg-gray-100">
          <Phone className="mr-2 h-5 w-5" />
          Contact Us on WhatsApp
        </Button>
      </div>
    </section>
  );
}
