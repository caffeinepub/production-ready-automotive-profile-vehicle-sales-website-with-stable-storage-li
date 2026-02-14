import ContactForm from '../components/forms/ContactForm';
import SectionTitle from '../components/public/SectionTitle';
import { Mail, MapPin, User } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <SectionTitle icon={Mail} className="mb-8">
        Hubungi Kami
      </SectionTitle>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Mail className="h-6 w-6 text-[#C90010]" />
            <h2 className="text-xl md:text-2xl font-bold">Kirim Pesan</h2>
          </div>
          <ContactForm />
        </div>

        <div className="space-y-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-6 w-6 text-[#C90010]" />
              <h3 className="text-lg md:text-xl font-bold">Informasi Kontak</h3>
            </div>
            <div className="space-y-2 text-gray-700">
              <p><strong>Nama:</strong> Fuad</p>
              <p><strong>WhatsApp:</strong> 0852-1234-0778</p>
              <p><strong>Email:</strong> fuadmitsubishi2025@gmail.com</p>
              <p><strong>Alamat:</strong> Jl. Raya Subang No. 123, Subang, Jawa Barat 41211</p>
              <p><strong>Jam Operasional:</strong> Senin - Sabtu, 09.00 - 18.00</p>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-6 w-6 text-[#C90010]" />
              <h3 className="text-lg md:text-xl font-bold">Lokasi</h3>
            </div>
            <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.0!2d107.76!3d-6.57!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMzQnMTIuMCJTIDEwN8KwNDUnMzYuMCJF!5e0!3m2!1sen!2sid!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-4">
              <User className="h-6 w-6 text-[#C90010]" />
              <h3 className="text-lg md:text-xl font-bold">Konsultan Penjualan</h3>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="font-bold text-lg mb-2">Fuad</h4>
              <p className="text-gray-600 mb-4">Konsultan otomotif terpercaya Anda</p>
              <p className="text-sm text-gray-700">
                Dengan pengalaman bertahun-tahun di industri otomotif, saya siap membantu Anda menemukan kendaraan yang sempurna sesuai kebutuhan Anda.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
