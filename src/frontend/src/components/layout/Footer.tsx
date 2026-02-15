import { SiFacebook, SiInstagram, SiX, SiTiktok, SiYoutube } from 'react-icons/si';
import { Heart, Phone, Mail, MapPin, Users, Eye, TrendingUp, Activity } from 'lucide-react';
import { useGetFooterVisitorStats } from '../../hooks/useQueries';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const appIdentifier = encodeURIComponent(window.location.hostname || 'automotive-dealer');
  const { data: stats } = useGetFooterVisitorStats();

  return (
    <footer className="bg-[#262729] text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <img src="/assets/logomitsubishi.png" alt="Mitsubishi Logo" className="h-12 mb-4" />
            <p className="text-sm text-gray-300">
              Dealer resmi Mitsubishi di Subang, Jawa Barat. Melayani penjualan mobil keluarga dan niaga dengan layanan terbaik.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Hubungi Kami</h3>
            <div className="space-y-3 text-sm text-gray-300">
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-[#C90010] flex-shrink-0 mt-0.5" />
                <span>0852-1234-0778</span>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-[#C90010] flex-shrink-0 mt-0.5" />
                <span>fuadmitsubishi2025@gmail.com</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-[#C90010] flex-shrink-0 mt-0.5" />
                <span>Jl. Otto Iskandardinata No.314, Subang, Jawa Barat 41211</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Ikuti Kami</h3>
            <div className="flex gap-3">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full bg-[#C90010] flex items-center justify-center hover:bg-[#a00010] transition-colors"
              >
                <SiFacebook size={20} className="text-white" />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full bg-[#C90010] flex items-center justify-center hover:bg-[#a00010] transition-colors"
              >
                <SiInstagram size={20} className="text-white" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full bg-[#C90010] flex items-center justify-center hover:bg-[#a00010] transition-colors"
              >
                <SiX size={20} className="text-white" />
              </a>
              <a 
                href="https://tiktok.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full bg-[#C90010] flex items-center justify-center hover:bg-[#a00010] transition-colors"
              >
                <SiTiktok size={20} className="text-white" />
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full bg-[#C90010] flex items-center justify-center hover:bg-[#a00010] transition-colors"
              >
                <SiYoutube size={20} className="text-white" />
              </a>
            </div>
            <p className="text-xs text-gray-400 mt-4">
              Jam Operasional: Senin - Sabtu: 08:30 - 16:00
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Statistik Pengunjung</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-[#C90010]" />
                <span>Total: {stats ? Number(stats.totalVisitors).toLocaleString() : '...'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-[#C90010]" />
                <span>Views: {stats ? Number(stats.pageViews).toLocaleString() : '...'}</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-[#C90010]" />
                <span>Hari Ini: {stats ? Number(stats.todayTraffic).toLocaleString() : '...'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-[#C90010]" />
                <span>Online: {stats ? Number(stats.onlineVisitors).toLocaleString() : '...'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6 text-center text-sm text-gray-400">
          <p>
            © {currentYear} Mitsubishi Motors Subang. All rights reserved.
          </p>
          <p className="mt-2">
            Built with <Heart className="inline h-4 w-4 text-[#C90010]" /> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appIdentifier}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#C90010] hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
