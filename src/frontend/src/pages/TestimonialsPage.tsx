import { useGetTestimonials } from '../hooks/useQueries';
import SectionTitle from '../components/public/SectionTitle';
import { MessageSquare, Star } from 'lucide-react';

export default function TestimonialsPage() {
  const { data: testimonials = [], isLoading } = useGetTestimonials();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">Memuat testimoni...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <SectionTitle icon={MessageSquare} className="mb-8">
        Testimoni Pelanggan
      </SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((testimonial) => (
          <div key={Number(testimonial.id)} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-4 mb-4">
              <img
                src={testimonial.imageUrl || '/assets/generated/testimonial-placeholder.dim_600x600.png'}
                alt={testimonial.customerName}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <h3 className="font-bold">{testimonial.customerName}</h3>
                <p className="text-sm text-gray-600">{testimonial.city}</p>
              </div>
            </div>
            <div className="flex gap-1 mb-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < testimonial.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                />
              ))}
            </div>
            <p className="text-gray-700">{testimonial.review}</p>
          </div>
        ))}
      </div>
      {testimonials.length === 0 && (
        <div className="text-center py-12 text-gray-500">Belum ada testimoni tersedia.</div>
      )}
    </div>
  );
}
