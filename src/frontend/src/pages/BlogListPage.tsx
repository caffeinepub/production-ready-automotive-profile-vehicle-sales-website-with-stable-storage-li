import { Link } from '@tanstack/react-router';
import { useGetBlogPosts } from '../hooks/useQueries';

export default function BlogListPage() {
  const { data: blogPosts = [], isLoading } = useGetBlogPosts();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">Loading blog posts...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Blog</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogPosts.map((post) => (
          <Link key={Number(post.id)} to="/blog/$id" params={{ id: post.id.toString() }} className="group">
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <img
                src={post.imageUrl || '/assets/generated/blog-placeholder.dim_1200x630.png'}
                alt={post.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h2 className="text-xl font-bold mb-2 group-hover:text-[#C90010] transition-colors">{post.title}</h2>
                <p className="text-sm text-gray-600 mb-3">{post.publishDate}</p>
                <p className="text-gray-700 line-clamp-3">{post.content.substring(0, 150)}...</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
      {blogPosts.length === 0 && (
        <div className="text-center py-12 text-gray-500">No blog posts available yet.</div>
      )}
    </div>
  );
}
