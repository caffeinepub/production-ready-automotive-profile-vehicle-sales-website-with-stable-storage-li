import { Button } from '@/components/ui/button';
import { Phone, MessageCircle } from 'lucide-react';

export default function BottomCTASection() {
  const handleWhatsApp = () => {
    window.open('https://wa.me/6285212340778', '_blank');
  };

  return (
    <section className="bg-gradient-to-r from-[#C90010] to-[#a00010] py-12 md:py-16">
      <div className="container mx-auto px-4 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <MessageCircle className="h-8 w-8 text-white" />
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">Siap Untuk Memulai?</h2>
        </div>
        <p className="text-white/90 text-base md:text-lg mb-6">Hubungi kami hari ini untuk penawaran dan layanan terbaik</p>
        <Button onClick={handleWhatsApp} size="lg" className="bg-white text-[#C90010] hover:bg-gray-100">
          <Phone className="mr-2 h-5 w-5" />
          Hubungi Kami via WhatsApp
        </Button>
      </div>
    </section>
  );
}
