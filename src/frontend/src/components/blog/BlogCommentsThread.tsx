import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import BlogCommentForm from './BlogCommentForm';
import type { BlogComment } from '../../backend';

interface BlogCommentsThreadProps {
  comments: BlogComment[];
  onReply: (data: { name: string; email: string; content: string; parentId?: bigint }) => void;
  isSubmitting: boolean;
  resetKey: number;
}

export default function BlogCommentsThread({ 
  comments, 
  onReply, 
  isSubmitting,
  resetKey 
}: BlogCommentsThreadProps) {
  const [replyingTo, setReplyingTo] = useState<bigint | null>(null);

  // Separate top-level comments and replies
  const topLevelComments = comments.filter(c => !c.parentId);
  const getReplies = (parentId: bigint) => 
    comments.filter(c => c.parentId?.toString() === parentId.toString());

  const handleReplySubmit = (data: { name: string; email: string; content: string; parentId?: bigint }) => {
    onReply(data);
    setReplyingTo(null);
  };

  // Hide empty state when no comments
  if (comments.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold">Comments ({comments.length})</h3>
      
      {topLevelComments.map((comment) => {
        const replies = getReplies(comment.id);
        
        return (
          <div key={comment.id.toString()} className="space-y-4">
            {/* Top-level comment */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-semibold text-lg">{comment.name}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(Number(comment.createdAt) / 1000000).toLocaleString()}
                  </p>
                </div>
              </div>
              <p className="text-gray-700 mb-3 whitespace-pre-wrap">{comment.content}</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setReplyingTo(comment.id)}
                className="text-blue-600 hover:text-blue-700"
              >
                <MessageCircle className="h-4 w-4 mr-1" />
                Reply
              </Button>
            </div>

            {/* Replies */}
            {replies.length > 0 && (
              <div className="ml-8 space-y-3">
                {replies.map((reply) => (
                  <div key={reply.id.toString()} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold">{reply.name}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(Number(reply.createdAt) / 1000000).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm whitespace-pre-wrap">{reply.content}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Reply form */}
            {replyingTo?.toString() === comment.id.toString() && (
              <div className="ml-8">
                <BlogCommentForm
                  onSubmit={handleReplySubmit}
                  isSubmitting={isSubmitting}
                  resetKey={resetKey}
                  parentId={comment.id}
                  parentAuthor={comment.name}
                  onCancel={() => setReplyingTo(null)}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
