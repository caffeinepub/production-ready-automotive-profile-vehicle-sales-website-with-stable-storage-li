import { SiFacebook, SiInstagram, SiX, SiTiktok, SiYoutube } from 'react-icons/si';
import { Heart, Phone, Mail } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const appIdentifier = encodeURIComponent(window.location.hostname || 'automotive-dealer');

  return (
    <footer className="bg-[#262729] text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          <div>
            <img src="/assets/generated/dealer-logo.dim_512x512.png" alt="Logo" className="h-12 mb-4" />
            <p className="text-sm text-gray-300">
              Dealer otomotif terpercaya di Subang, menyediakan kendaraan berkualitas dan layanan terbaik.
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-4">
              <Phone className="h-5 w-5 text-[#C90010]" />
              <h3 className="font-bold text-lg">Hubungi Kami</h3>
            </div>
            <div className="space-y-2 text-sm text-gray-300">
              <p>Jl. Raya Subang No. 123</p>
              <p>Subang, Jawa Barat 41211</p>
              <p>WhatsApp: 0852-1234-0778</p>
              <p>Email: fuadmitsubishi2025@gmail.com</p>
              <p>Jam Operasional: Senin-Sabtu 09.00-18.00</p>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-4">
              <Mail className="h-5 w-5 text-[#C90010]" />
              <h3 className="font-bold text-lg">Ikuti Kami</h3>
            </div>
            <div className="flex gap-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
                <SiFacebook size={24} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-pink-400 transition-colors">
                <SiInstagram size={24} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-300 transition-colors">
                <SiX size={24} />
              </a>
              <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition-colors">
                <SiTiktok size={24} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-red-400 transition-colors">
                <SiYoutube size={24} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6 text-center text-sm text-gray-400">
          <p>
            © {currentYear} Automotive Dealer. Hak cipta dilindungi. | Dibuat dengan{' '}
            <Heart className="inline h-4 w-4 text-red-500" /> menggunakan{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appIdentifier}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
