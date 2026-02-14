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
import MediaPickerDialog from './media/MediaPickerDialog';
import type { BlogPost } from '../../backend';

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

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{blogPost ? 'Edit Blog Post' : 'Add Blog Post'}</DialogTitle>
          </DialogHeader>

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
