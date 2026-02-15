import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Trash2, Edit2, X, Save } from 'lucide-react';
import MediaPickerDialog from './media/MediaPickerDialog';
import { useGetBlogComments, useDeleteBlogComment, useUpdateBlogComment } from '../hooks/useAdminCmsQueries';
import { useGetBlogInteractionSummary } from '../../hooks/useQueries';
import type { BlogPost, BlogComment } from '../../backend';
import { toast } from 'sonner';

interface BlogFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  blogPost: BlogPost | null;
  onSave: (blogPost: BlogPost) => void;
  isSaving: boolean;
}

export default function BlogFormDialog({
  open,
  onOpenChange,
  blogPost,
  onSave,
  isSaving
}: BlogFormDialogProps) {
  const [formData, setFormData] = useState<Partial<BlogPost>>({
    title: '',
    content: '',
    author: '',
    publishDate: new Date().toISOString().split('T')[0],
    imageUrl: '',
    seoTitle: '',
    seoDescription: '',
    views: 0n,
    likes: 0n,
    published: false
  });
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<bigint | null>(null);
  const [editingContent, setEditingContent] = useState('');

  const { data: interactionSummary } = useGetBlogInteractionSummary(blogPost?.id);
  const { data: comments = [], isLoading: commentsLoading } = useGetBlogComments(blogPost?.id);
  const deleteComment = useDeleteBlogComment();
  const updateComment = useUpdateBlogComment();

  useEffect(() => {
    if (blogPost) {
      setFormData(blogPost);
    } else {
      setFormData({
        title: '',
        content: '',
        author: '',
        publishDate: new Date().toISOString().split('T')[0],
        imageUrl: '',
        seoTitle: '',
        seoDescription: '',
        views: 0n,
        likes: 0n,
        published: false
      });
    }
    setEditingCommentId(null);
    setEditingContent('');
  }, [blogPost, open]);

  const handleSubmit = () => {
    const blogPostData: BlogPost = {
      id: blogPost?.id || BigInt(Date.now()),
      title: formData.title || '',
      content: formData.content || '',
      author: formData.author || '',
      publishDate: formData.publishDate || new Date().toISOString().split('T')[0],
      imageUrl: formData.imageUrl || '',
      seoTitle: formData.seoTitle || formData.title || '',
      seoDescription: formData.seoDescription || '',
      views: formData.views || 0n,
      likes: formData.likes || 0n,
      published: formData.published || false
    };
    onSave(blogPostData);
  };

  const handleDeleteComment = async (commentId: bigint) => {
    if (!blogPost?.id) return;
    
    if (!confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    try {
      await deleteComment.mutateAsync({ blogPostId: blogPost.id, commentId });
      toast.success('Comment deleted successfully');
    } catch (error) {
      console.error('Delete comment error:', error);
      toast.error('Failed to delete comment');
    }
  };

  const handleEditComment = (comment: BlogComment) => {
    setEditingCommentId(comment.id);
    setEditingContent(comment.content);
  };

  const handleSaveComment = async (commentId: bigint) => {
    if (!blogPost?.id) return;

    try {
      await updateComment.mutateAsync({
        blogPostId: blogPost.id,
        commentId,
        content: editingContent
      });
      toast.success('Comment updated successfully');
      setEditingCommentId(null);
      setEditingContent('');
    } catch (error) {
      console.error('Update comment error:', error);
      toast.error('Failed to update comment');
    }
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditingContent('');
  };

  // Separate top-level comments and replies
  const topLevelComments = comments.filter(c => !c.parentId);
  const getReplies = (parentId: bigint) => 
    comments.filter(c => c.parentId?.toString() === parentId.toString());

  const renderComment = (comment: BlogComment, isReply: boolean = false) => {
    const isEditing = editingCommentId?.toString() === comment.id.toString();

    return (
      <div 
        key={comment.id.toString()} 
        className={`p-4 rounded-lg border ${isReply ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-300'}`}
      >
        <div className="flex justify-between items-start mb-2">
          <div>
            <p className="font-semibold">{comment.name}</p>
            <p className="text-xs text-gray-500">{comment.email}</p>
            <p className="text-xs text-gray-400">
              {new Date(Number(comment.createdAt) / 1000000).toLocaleString()}
            </p>
          </div>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleSaveComment(comment.id)}
                  disabled={updateComment.isPending}
                >
                  <Save className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleCancelEdit}
                  disabled={updateComment.isPending}
                >
                  <X className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleEditComment(comment)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDeleteComment(comment.id)}
                  disabled={deleteComment.isPending}
                >
                  <Trash2 className="h-4 w-4 text-red-600" />
                </Button>
              </>
            )}
          </div>
        </div>
        {isEditing ? (
          <Textarea
            value={editingContent}
            onChange={(e) => setEditingContent(e.target.value)}
            rows={3}
            className="mt-2"
          />
        ) : (
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{comment.content}</p>
        )}
      </div>
    );
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{blogPost ? 'Edit Blog Post' : 'Create Blog Post'}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Basic Info */}
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter blog post title"
              />
            </div>

            <div>
              <Label htmlFor="content">Content *</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Enter blog post content"
                rows={8}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="author">Author *</Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  placeholder="Author name"
                />
              </div>

              <div>
                <Label htmlFor="publishDate">Publish Date *</Label>
                <Input
                  id="publishDate"
                  type="date"
                  value={formData.publishDate}
                  onChange={(e) => setFormData({ ...formData, publishDate: e.target.value })}
                />
              </div>
            </div>

            {/* Image */}
            <div>
              <Label>Featured Image</Label>
              <div className="flex gap-2 items-center">
                <Input
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="Image URL"
                  readOnly
                />
                <Button type="button" onClick={() => setShowImagePicker(true)}>
                  Select
                </Button>
              </div>
              {formData.imageUrl && (
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  className="mt-2 w-full h-48 object-cover rounded"
                />
              )}
            </div>

            {/* SEO */}
            <Separator />
            <h3 className="font-semibold">SEO Settings</h3>

            <div>
              <Label htmlFor="seoTitle">SEO Title</Label>
              <Input
                id="seoTitle"
                value={formData.seoTitle}
                onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                placeholder="SEO title (defaults to title)"
              />
            </div>

            <div>
              <Label htmlFor="seoDescription">SEO Description</Label>
              <Textarea
                id="seoDescription"
                value={formData.seoDescription}
                onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                placeholder="SEO description"
                rows={3}
              />
            </div>

            {/* Publish Toggle */}
            <div className="flex items-center gap-2">
              <Switch
                id="published"
                checked={formData.published}
                onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
              />
              <Label htmlFor="published">Published</Label>
            </div>

            {/* Interaction Stats (for existing posts) */}
            {blogPost && interactionSummary && (
              <>
                <Separator />
                <h3 className="font-semibold">Interaction Statistics</h3>
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div className="p-3 bg-gray-50 rounded">
                    <p className="text-2xl font-bold">{Number(formData.views || 0)}</p>
                    <p className="text-sm text-gray-600">Views</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <p className="text-2xl font-bold">{Number(interactionSummary.likesCount)}</p>
                    <p className="text-sm text-gray-600">Likes</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <p className="text-2xl font-bold">{Number(interactionSummary.sharesCount)}</p>
                    <p className="text-sm text-gray-600">Shares</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <p className="text-2xl font-bold">{Number(interactionSummary.commentsCount)}</p>
                    <p className="text-sm text-gray-600">Comments</p>
                  </div>
                </div>
              </>
            )}

            {/* Comments Section (always show for existing posts) */}
            {blogPost && (
              <>
                <Separator />
                <h3 className="font-semibold">Comments</h3>
                {commentsLoading ? (
                  <p className="text-sm text-gray-500">Loading comments...</p>
                ) : comments.length === 0 ? (
                  <p className="text-sm text-gray-500">No comments yet.</p>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {topLevelComments.map((comment) => {
                      const replies = getReplies(comment.id);
                      return (
                        <div key={comment.id.toString()} className="space-y-2">
                          {renderComment(comment, false)}
                          {replies.length > 0 && (
                            <div className="ml-6 space-y-2">
                              {replies.map((reply) => renderComment(reply, true))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <MediaPickerDialog
        open={showImagePicker}
        onOpenChange={setShowImagePicker}
        onSelect={(url) => {
          setFormData({ ...formData, imageUrl: url });
          setShowImagePicker(false);
        }}
        currentUrl={formData.imageUrl}
      />
    </>
  );
}
