import { useParams } from '@tanstack/react-router';
import { useGetBlogPost } from '../hooks/useQueries';
import { useEffect } from 'react';

export default function BlogDetailPage() {
  const { id } = useParams({ from: '/blog/$id' });
  const { data: post, isLoading } = useGetBlogPost(BigInt(id));

  useEffect(() => {
    if (post) {
      document.title = post.seoTitle || post.title;
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', post.seoDescription || post.content.substring(0, 160));
      }
    }
  }, [post]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">Memuat artikel...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">Artikel tidak ditemukan</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <article className="max-w-4xl mx-auto">
        <img
          src={post.imageUrl || '/assets/generated/blog-placeholder.dim_1200x630.png'}
          alt={post.title}
          className="w-full h-96 object-cover rounded-lg mb-8"
        />
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <div className="flex items-center gap-4 text-gray-600 mb-8">
          <span>Oleh {post.author}</span>
          <span>•</span>
          <span>{post.publishDate}</span>
          <span>•</span>
          <span>{Number(post.views)} tayangan</span>
        </div>
        <div className="prose max-w-none">
          <p className="whitespace-pre-wrap">{post.content}</p>
        </div>
      </article>
    </div>
  );
}
