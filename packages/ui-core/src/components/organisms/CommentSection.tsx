import React, { useState } from "react";
import { Avatar, Button, Icon, Input } from "../atoms";
import { AvatarWithName } from "../molecules";

export interface Comment {
  id: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  content: string;
  timestamp: string;
  likes: number;
  isLiked?: boolean;
  replies?: Comment[];
  parentId?: string;
}

export interface CommentSectionProps {
  postId: string;
  comments?: Comment[];
  currentUser?: {
    id: string;
    name: string;
    avatar?: string;
  };
  onAddComment?: (postId: string, content: string, parentId?: string) => void;
  onLikeComment?: (commentId: string) => void;
  onDeleteComment?: (commentId: string) => void;
  onUserClick?: (userId: string) => void;
  className?: string;
}

export const CommentSection: React.FC<CommentSectionProps> = ({
  postId,
  comments = [],
  currentUser,
  onAddComment,
  onLikeComment,
  onDeleteComment,
  onUserClick,
  className = "",
}) => {
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [showAllComments, setShowAllComments] = useState(false);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60),
    );

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d`;
    return date.toLocaleDateString();
  };

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      onAddComment?.(postId, newComment.trim());
      setNewComment("");
    }
  };

  const handleSubmitReply = (parentId: string) => {
    if (replyContent.trim()) {
      onAddComment?.(postId, replyContent.trim(), parentId);
      setReplyContent("");
      setReplyingTo(null);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      action();
    }
  };

  const topLevelComments = comments.filter((comment) => !comment.parentId);
  const displayedComments = showAllComments
    ? topLevelComments
    : topLevelComments.slice(0, 3);

  const CommentItem: React.FC<{ comment: Comment; isReply?: boolean }> = ({
    comment,
    isReply = false,
  }) => (
    <div className={`flex space-x-3 ${isReply ? "ml-12" : ""}`}>
      <button onClick={() => onUserClick?.(comment.author.id)}>
        <Avatar
          src={comment.author.avatar}
          alt={comment.author.name}
          size="sm"
        />
      </button>

      <div className="flex-1 min-w-0">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-2">
          <button
            onClick={() => onUserClick?.(comment.author.id)}
            className="font-medium text-gray-900 dark:text-white hover:underline text-sm"
          >
            {comment.author.name}
          </button>
          <p className="text-gray-900 dark:text-white text-sm mt-1 whitespace-pre-wrap">
            {comment.content}
          </p>
        </div>

        <div className="flex items-center space-x-4 mt-1 px-4">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {formatTime(comment.timestamp)}
          </span>

          <button
            onClick={() => onLikeComment?.(comment.id)}
            className={`
              text-xs font-medium transition-colors
              ${
                comment.isLiked
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }
            `}
          >
            {comment.isLiked ? "Liked" : "Like"}
            {comment.likes > 0 && ` (${comment.likes})`}
          </button>

          {!isReply && (
            <button
              onClick={() =>
                setReplyingTo(replyingTo === comment.id ? null : comment.id)
              }
              className="text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              Reply
            </button>
          )}

          {currentUser && comment.author.id === currentUser.id && (
            <button
              onClick={() => onDeleteComment?.(comment.id)}
              className="text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            >
              Delete
            </button>
          )}
        </div>

        {/* Reply Input */}
        {replyingTo === comment.id && currentUser && (
          <div className="flex space-x-2 mt-3">
            <Avatar src={currentUser.avatar} alt={currentUser.name} size="xs" />
            <div className="flex-1">
              <Input
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder={`Reply to ${comment.author.name}...`}
                onKeyPress={(e) =>
                  handleKeyPress(e, () => handleSubmitReply(comment.id))
                }
                className="text-sm"
              />
              <div className="flex justify-end space-x-2 mt-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    setReplyingTo(null);
                    setReplyContent("");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => handleSubmitReply(comment.id)}
                  disabled={!replyContent.trim()}
                >
                  Reply
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-3 space-y-3">
            {comment.replies.map((reply) => (
              <CommentItem key={reply.id} comment={reply} isReply />
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Add Comment */}
      {currentUser && (
        <div className="flex space-x-3 p-4 border-t border-gray-200 dark:border-gray-700">
          <Avatar src={currentUser.avatar} alt={currentUser.name} size="sm" />
          <div className="flex-1">
            <Input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              onKeyPress={(e) => handleKeyPress(e, handleSubmitComment)}
              className="bg-gray-100 dark:bg-gray-800 border-none rounded-full"
            />
            {newComment.trim() && (
              <div className="flex justify-end mt-2">
                <Button
                  size="sm"
                  variant="primary"
                  onClick={handleSubmitComment}
                >
                  <Icon name="send" className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Comments List */}
      {comments.length > 0 && (
        <div className="px-4 space-y-4">
          {displayedComments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}

          {/* Show More Comments */}
          {topLevelComments.length > 3 && !showAllComments && (
            <button
              onClick={() => setShowAllComments(true)}
              className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors px-4"
            >
              View {topLevelComments.length - 3} more comments
            </button>
          )}

          {showAllComments && topLevelComments.length > 3 && (
            <button
              onClick={() => setShowAllComments(false)}
              className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors px-4"
            >
              Show fewer comments
            </button>
          )}
        </div>
      )}

      {comments.length === 0 && (
        <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
          <Icon
            name="chatbubble-outline"
            className="w-8 h-8 mx-auto mb-2 opacity-50"
          />
          <p className="text-sm">No comments yet. Be the first to comment!</p>
        </div>
      )}
    </div>
  );
};
