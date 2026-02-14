import ContactForm from '../components/forms/ContactForm';

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Contact Us</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <h2 className="text-2xl font-bold mb-4">Get in Touch</h2>
          <ContactForm />
        </div>

        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Information</h3>
            <div className="space-y-2 text-gray-700">
              <p><strong>Name:</strong> Fuad</p>
              <p><strong>WhatsApp:</strong> 0852-1234-0778</p>
              <p><strong>Email:</strong> fuadmitsubishi2025@gmail.com</p>
              <p><strong>Address:</strong> Jl. Raya Subang No. 123, Subang, Jawa Barat 41211</p>
              <p><strong>Operating Hours:</strong> Monday - Saturday, 9:00 AM - 6:00 PM</p>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Location</h3>
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
            <h3 className="text-xl font-bold mb-4">Sales Consultant</h3>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="font-bold text-lg mb-2">Fuad</h4>
              <p className="text-gray-600 mb-4">Your trusted automotive consultant</p>
              <p className="text-sm text-gray-700">
                With years of experience in the automotive industry, I'm here to help you find the perfect vehicle for your needs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
