import { useState } from 'react';
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
  return (
    <div className="flex items-center gap-4 py-4 border-t border-b border-gray-200">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={onLike}
              disabled={isLiking}
              className="flex items-center gap-2 hover:text-red-600 transition-colors"
            >
              <Heart className="h-5 w-5" />
              <span className="text-sm">❤️ ({Number(summary.likesCount)})</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Like this article</p>
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
