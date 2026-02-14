import { Sparkles } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="bg-[#C90010] h-[150px] md:h-[200px] flex items-center justify-center">
      <div className="container mx-auto px-4 text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Sparkles className="h-6 w-6 md:h-10 md:w-10 text-white" />
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white">Selamat Datang di Dealer Kami</h1>
        </div>
        <p className="text-white/90 mt-2 text-base md:text-lg">Mitra otomotif terpercaya Anda</p>
      </div>
    </section>
  );
}
