import { useState } from 'react';
import { useParams } from '@tanstack/react-router';
import { useGetBlogPost, useGetBlogInteractionSummary, useIncrementBlogLike, useIncrementBlogShare, useAddBlogComment, useGetBlogComments } from '../hooks/useQueries';
import BlogInteractionsBar from '../components/blog/BlogInteractionsBar';
import BlogCommentForm from '../components/blog/BlogCommentForm';
import BlogCommentsThread from '../components/blog/BlogCommentsThread';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

export default function BlogDetailPage() {
  const { id } = useParams({ from: '/blog/$id' });
  const blogPostId = BigInt(id);
  
  const { data: blogPost, isLoading } = useGetBlogPost(blogPostId);
  const { data: interactionSummary } = useGetBlogInteractionSummary(blogPostId);
  const { data: comments = [] } = useGetBlogComments(blogPostId);
  const incrementLike = useIncrementBlogLike();
  const incrementShare = useIncrementBlogShare();
  const addComment = useAddBlogComment();

  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [commentResetKey, setCommentResetKey] = useState(0);

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8 text-center">Memuat artikel...</div>;
  }

  if (!blogPost) {
    return <div className="container mx-auto px-4 py-8 text-center">Artikel tidak ditemukan.</div>;
  }

  const handleLike = async () => {
    try {
      await incrementLike.mutateAsync(blogPostId);
    } catch (error) {
      console.error('Like error:', error);
      toast.error('Failed to like article');
    }
  };

  const handleShare = async () => {
    try {
      // Default to generic share
      await incrementShare.mutateAsync({ blogPostId, platform: 'generic' });
      
      // Try to use Web Share API if available
      if (navigator.share) {
        await navigator.share({
          title: blogPost.title,
          text: blogPost.seoDescription || blogPost.title,
          url: window.location.href,
        });
      } else {
        // Fallback: copy link to clipboard
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Share error:', error);
      // Ignore user cancellation of share dialog
      if (error instanceof Error && error.name !== 'AbortError') {
        toast.error('Failed to share article');
      }
    }
  };

  const handleCommentSubmit = async (data: { name: string; email: string; content: string; parentId?: bigint }) => {
    try {
      await addComment.mutateAsync({
        blogPostId,
        name: data.name,
        email: data.email,
        content: data.content,
        parentId: data.parentId
      });
      toast.success('Comment submitted successfully!');
      setCommentResetKey(prev => prev + 1);
    } catch (error) {
      console.error('Comment error:', error);
      toast.error('Failed to submit comment');
      throw error;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <article className="max-w-4xl mx-auto">
        <Card>
          <img
            src={blogPost.imageUrl}
            alt={blogPost.title}
            className="w-full h-96 object-cover rounded-t-lg"
          />
          <CardContent className="p-8">
            <h1 className="text-4xl font-bold mb-4">{blogPost.title}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
              <span>Oleh {blogPost.author}</span>
              <span>•</span>
              <span>{blogPost.publishDate}</span>
              <span>•</span>
              <span>{Number(blogPost.views)} views</span>
            </div>

            <div className="prose max-w-none mb-8" dangerouslySetInnerHTML={{ __html: blogPost.content }} />

            {interactionSummary && (
              <BlogInteractionsBar
                blogPostId={blogPostId}
                summary={interactionSummary}
                onLike={handleLike}
                onShare={handleShare}
                onCommentToggle={() => setIsCommentOpen(!isCommentOpen)}
                isCommentOpen={isCommentOpen}
                isLiking={incrementLike.isPending}
                isSharing={incrementShare.isPending}
              />
            )}
          </CardContent>
        </Card>

        <div className="mt-8 space-y-6">
          <h2 className="text-2xl font-bold">Komentar</h2>
          <BlogCommentForm 
            onSubmit={handleCommentSubmit} 
            isSubmitting={addComment.isPending}
            resetKey={commentResetKey}
          />
          <BlogCommentsThread 
            comments={comments} 
            onReply={handleCommentSubmit}
            isSubmitting={addComment.isPending}
            resetKey={commentResetKey}
          />
        </div>
      </article>
    </div>
  );
}
