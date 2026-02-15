import { useParams } from '@tanstack/react-router';
import { useGetBlogPost, useGetBlogInteractionSummary, useIncrementBlogLike, useIncrementBlogShare, useAddBlogComment } from '../hooks/useQueries';
import { useEffect, useState } from 'react';
import BlogInteractionsBar from '../components/blog/BlogInteractionsBar';
import BlogCommentForm from '../components/blog/BlogCommentForm';
import { toast } from 'sonner';

export default function BlogDetailPage() {
  const { id } = useParams({ from: '/blog/$id' });
  const blogPostId = BigInt(id);
  const { data: post, isLoading } = useGetBlogPost(blogPostId);
  const { data: interactionSummary } = useGetBlogInteractionSummary(blogPostId);
  const incrementLike = useIncrementBlogLike();
  const incrementShare = useIncrementBlogShare();
  const addComment = useAddBlogComment();

  const [isCommentFormOpen, setIsCommentFormOpen] = useState(false);

  useEffect(() => {
    if (post) {
      document.title = post.seoTitle || post.title;
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', post.seoDescription || post.content.substring(0, 160));
      }
    }
  }, [post]);

  const handleLike = async () => {
    try {
      await incrementLike.mutateAsync(blogPostId);
      toast.success('Thank you for liking this article!');
    } catch (error) {
      console.error('Like error:', error);
      toast.error('Failed to like article');
    }
  };

  const handleShare = async () => {
    try {
      // Try native share API first
      if (navigator.share) {
        await navigator.share({
          title: post?.title || 'Blog Article',
          text: post?.seoDescription || post?.content.substring(0, 160) || '',
          url: window.location.href
        });
        await incrementShare.mutateAsync({ blogPostId, platform: 'native' });
        toast.success('Article shared successfully!');
      } else {
        // Fallback: copy link to clipboard
        await navigator.clipboard.writeText(window.location.href);
        await incrementShare.mutateAsync({ blogPostId, platform: 'clipboard' });
        toast.success('Link copied to clipboard!');
      }
    } catch (error) {
      // User cancelled share or clipboard failed
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error('Share error:', error);
        toast.error('Failed to share article');
      }
    }
  };

  const handleCommentSubmit = async (data: { name: string; email: string; content: string }) => {
    try {
      await addComment.mutateAsync({
        blogPostId,
        name: data.name,
        email: data.email,
        content: data.content
      });
      toast.success('Comment submitted! It will be reviewed before being published.');
      setIsCommentFormOpen(false);
    } catch (error) {
      console.error('Comment error:', error);
      toast.error('Failed to submit comment');
    }
  };

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
        <div className="prose max-w-none mb-8">
          <p className="whitespace-pre-wrap">{post.content}</p>
        </div>

        {/* Blog Interactions Bar */}
        {interactionSummary && (
          <BlogInteractionsBar
            blogPostId={blogPostId}
            summary={interactionSummary}
            onLike={handleLike}
            onShare={handleShare}
            onCommentToggle={() => setIsCommentFormOpen(!isCommentFormOpen)}
            isCommentOpen={isCommentFormOpen}
            isLiking={incrementLike.isPending}
            isSharing={incrementShare.isPending}
          />
        )}

        {/* Comment Form */}
        {isCommentFormOpen && (
          <div className="mt-6">
            <BlogCommentForm
              onSubmit={handleCommentSubmit}
              isSubmitting={addComment.isPending}
            />
          </div>
        )}
      </article>
    </div>
  );
}
