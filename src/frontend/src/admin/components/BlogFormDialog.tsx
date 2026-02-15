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
import { Trash2, CheckCircle, Edit2, X } from 'lucide-react';
import MediaPickerDialog from './media/MediaPickerDialog';
import { useGetBlogCommentsAdmin, useDeleteBlogComment, useApproveBlogComment, useUpdateBlogComment } from '../hooks/useAdminCmsQueries';
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
  const { data: comments = [] } = useGetBlogCommentsAdmin(blogPost?.id);
  const deleteComment = useDeleteBlogComment();
  const approveComment = useApproveBlogComment();
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
    try {
      await deleteComment.mutateAsync(commentId);
      toast.success('Comment deleted successfully');
    } catch (error) {
      console.error('Delete comment error:', error);
      toast.error('Failed to delete comment');
    }
  };

  const handleApproveComment = async (commentId: bigint) => {
    try {
      await approveComment.mutateAsync(commentId);
      toast.success('Comment approved successfully');
    } catch (error) {
      console.error('Approve comment error:', error);
      toast.error('Failed to approve comment');
    }
  };

  const handleEditComment = (comment: BlogComment) => {
    setEditingCommentId(comment.id);
    setEditingContent(comment.content);
  };

  const handleSaveEdit = async (commentId: bigint) => {
    try {
      await updateComment.mutateAsync({ commentId, content: editingContent });
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

  // Organize comments into threaded structure
  const topLevelComments = comments.filter(c => !c.parentId);
  const getReplies = (parentId: bigint) => 
    comments.filter(c => c.parentId?.toString() === parentId.toString());

  const renderComment = (comment: BlogComment, isReply: boolean = false) => {
    const isEditing = editingCommentId?.toString() === comment.id.toString();
    const replies = getReplies(comment.id);

    return (
      <div key={comment.id.toString()} className={isReply ? 'ml-8' : ''}>
        <div
          className={`p-4 rounded-lg border ${
            comment.approved ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
          } ${isReply ? 'mb-2' : 'mb-3'}`}
        >
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="font-semibold">{comment.name}</p>
              <p className="text-sm text-gray-600">{comment.email}</p>
              <p className="text-xs text-gray-500">
                {new Date(Number(comment.createdAt) / 1000000).toLocaleString()}
              </p>
              {comment.parentId && (
                <p className="text-xs text-blue-600 mt-1">↳ Reply</p>
              )}
            </div>
            <div className="flex gap-2">
              {!isEditing && (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEditComment(comment)}
                    disabled={updateComment.isPending}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  {!comment.approved && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleApproveComment(comment.id)}
                      disabled={approveComment.isPending}
                      className="text-green-600 hover:text-green-700"
                    >
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteComment(comment.id)}
                    disabled={deleteComment.isPending}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
          
          {isEditing ? (
            <div className="space-y-2">
              <Textarea
                value={editingContent}
                onChange={(e) => setEditingContent(e.target.value)}
                rows={3}
                className="text-sm"
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => handleSaveEdit(comment.id)}
                  disabled={updateComment.isPending}
                  className="bg-[#C90010] hover:bg-[#a00010]"
                >
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCancelEdit}
                  disabled={updateComment.isPending}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
              {comment.approved && (
                <p className="text-xs text-green-600 mt-2">✓ Approved</p>
              )}
            </>
          )}
        </div>
        
        {/* Render replies */}
        {replies.length > 0 && (
          <div className="space-y-2">
            {replies.map(reply => renderComment(reply, true))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{blogPost ? 'Edit Blog Post' : 'Add Blog Post'}</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Basic Info Section */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="publishDate">Publish Date</Label>
                <Input
                  id="publishDate"
                  type="date"
                  value={formData.publishDate}
                  onChange={(e) => setFormData({ ...formData, publishDate: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={8}
                />
              </div>

              <div>
                <Label>Featured Image</Label>
                <div className="flex gap-2">
                  <Input value={formData.imageUrl} readOnly />
                  <Button type="button" onClick={() => setShowImagePicker(true)}>
                    Select
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="seoTitle">SEO Title</Label>
                <Input
                  id="seoTitle"
                  value={formData.seoTitle}
                  onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="seoDescription">SEO Description</Label>
                <Textarea
                  id="seoDescription"
                  value={formData.seoDescription}
                  onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                  rows={2}
                />
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.published}
                  onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
                />
                <Label>Published</Label>
              </div>
            </div>

            {/* Interaction Stats Section (only for existing posts) */}
            {blogPost && interactionSummary && (
              <>
                <Separator />
                <div>
                  <h3 className="text-lg font-semibold mb-3">Interaction Statistics</h3>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Views</p>
                      <p className="text-2xl font-bold">{Number(blogPost.views)}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Likes</p>
                      <p className="text-2xl font-bold">{Number(interactionSummary.likesCount)}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Shares</p>
                      <p className="text-2xl font-bold">{Number(interactionSummary.sharesCount)}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Comments</p>
                      <p className="text-2xl font-bold">{Number(interactionSummary.commentsCount)}</p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Comments Moderation Section (only for existing posts) */}
            {blogPost && comments.length > 0 && (
              <>
                <Separator />
                <div>
                  <h3 className="text-lg font-semibold mb-3">Comments ({comments.length})</h3>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {topLevelComments.map(comment => renderComment(comment))}
                  </div>
                </div>
              </>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSaving} className="bg-[#C90010] hover:bg-[#a00010]">
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <MediaPickerDialog
        open={showImagePicker}
        onOpenChange={setShowImagePicker}
        onSelect={(url) => setFormData({ ...formData, imageUrl: url })}
        currentUrl={formData.imageUrl}
      />
    </>
  );
}
