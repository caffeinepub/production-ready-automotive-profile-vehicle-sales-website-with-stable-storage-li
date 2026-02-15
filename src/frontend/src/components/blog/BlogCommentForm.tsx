import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface BlogCommentFormProps {
  onSubmit: (data: { name: string; email: string; content: string }) => void;
  isSubmitting: boolean;
}

export default function BlogCommentForm({ onSubmit, isSubmitting }: BlogCommentFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [content, setContent] = useState('');
  const [errors, setErrors] = useState<{ name?: string; email?: string; content?: string }>({});

  const validateForm = () => {
    const newErrors: { name?: string; email?: string; content?: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!content.trim()) {
      newErrors.content = 'Comment is required';
    } else if (content.trim().length < 10) {
      newErrors.content = 'Comment must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSubmit({ name: name.trim(), email: email.trim(), content: content.trim() });
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setContent('');
    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-gray-50 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold mb-4">Leave a Comment</h3>

      <div>
        <Label htmlFor="comment-name">Name *</Label>
        <Input
          id="comment-name"
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (errors.name) setErrors({ ...errors, name: undefined });
          }}
          disabled={isSubmitting}
          className={errors.name ? 'border-red-500' : ''}
        />
        {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
      </div>

      <div>
        <Label htmlFor="comment-email">Email *</Label>
        <Input
          id="comment-email"
          type="email"
          placeholder="your.email@example.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (errors.email) setErrors({ ...errors, email: undefined });
          }}
          disabled={isSubmitting}
          className={errors.email ? 'border-red-500' : ''}
        />
        {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
      </div>

      <div>
        <Label htmlFor="comment-content">Comment *</Label>
        <Textarea
          id="comment-content"
          placeholder="Share your thoughts..."
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            if (errors.content) setErrors({ ...errors, content: undefined });
          }}
          disabled={isSubmitting}
          rows={4}
          className={errors.content ? 'border-red-500' : ''}
        />
        {errors.content && <p className="text-sm text-red-500 mt-1">{errors.content}</p>}
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={isSubmitting} className="bg-[#C90010] hover:bg-[#a00010]">
          {isSubmitting ? 'Submitting...' : 'Submit Comment'}
        </Button>
        <Button type="button" variant="outline" onClick={handleReset} disabled={isSubmitting}>
          Clear
        </Button>
      </div>

      <p className="text-xs text-gray-500">
        Your comment will be reviewed before being published.
      </p>
    </form>
  );
}
