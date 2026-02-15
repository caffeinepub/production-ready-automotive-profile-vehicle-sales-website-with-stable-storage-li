import { useEffect, useState } from 'react';
import { Heart, Share2, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { BlogInteractionSummary } from '../../backend';

interface BlogInteractionsBarProps {
  blogPostId: bigint;
  summary: BlogInteractionSummary;
  onLike: () => void;
  onShare: () => void;
  onCommentToggle: () => void;
  isCommentOpen: boolean;
  isLiking?: boolean;
  isSharing?: boolean;
}

export default function BlogInteractionsBar({
  blogPostId,
  summary,
  onLike,
  onShare,
  onCommentToggle,
  isCommentOpen,
  isLiking = false,
  isSharing = false
}: BlogInteractionsBarProps) {
  const [hasLiked, setHasLiked] = useState(false);

  // Check if user has already liked this article
  useEffect(() => {
    const likedKey = `blog_liked_${blogPostId.toString()}`;
    const liked = localStorage.getItem(likedKey) === 'true';
    setHasLiked(liked);
  }, [blogPostId]);

  const handleLike = () => {
    if (hasLiked) return;
    
    const likedKey = `blog_liked_${blogPostId.toString()}`;
    localStorage.setItem(likedKey, 'true');
    setHasLiked(true);
    onLike();
  };

  return (
    <div className="flex items-center gap-4 py-4 border-t border-b border-gray-200">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              disabled={isLiking || hasLiked}
              className={`flex items-center gap-2 transition-colors ${
                hasLiked ? 'text-red-600' : 'hover:text-red-600'
              }`}
            >
              <Heart 
                className={`h-5 w-5 transition-colors ${hasLiked ? 'fill-red-600 text-red-600' : ''}`}
              />
              <span className="text-sm">Like ({Number(summary.likesCount)})</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{hasLiked ? 'You already liked this article' : 'Like this article'}</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={onShare}
              disabled={isSharing}
              className="flex items-center gap-2 hover:text-blue-600 transition-colors"
            >
              <Share2 className="h-5 w-5" />
              <span className="text-sm">Share ({Number(summary.sharesCount)})</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Share this article</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={onCommentToggle}
              className={`flex items-center gap-2 transition-colors ${
                isCommentOpen ? 'text-green-600' : 'hover:text-green-600'
              }`}
            >
              <MessageCircle className="h-5 w-5" />
              <span className="text-sm">Comment ({Number(summary.commentsCount)})</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Leave a comment</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
