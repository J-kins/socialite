import { ReactNode } from 'react';
import {
  PostContent,
  PostStats,
  Comment,
  MediaItem,
  ReactionType,
  InteractionType,
  PrivacyLevel,
} from '../../post-utils';

/**
 * Post Component Props Types
 *
 * Comprehensive type definitions for post-related components including
 * post cards, comments, interactions, and creation interfaces.
 */

// Base post props
export interface BasePostProps {
  /** Unique identifier for the component */
  id?: string;
  /** CSS class names */
  className?: string;
  /** Test identifier */
  'data-testid'?: string;
  /** Whether the component is disabled */
  disabled?: boolean;
  /** Whether the component is loading */
  loading?: boolean;
}

// Post card component props
export interface PostCardProps extends BasePostProps {
  /** Post content and metadata */
  post: PostContent;
  /** Post statistics */
  stats: PostStats;
  /** Current user ID */
  currentUserId?: string;
  /** User's interaction state */
  userInteractions?: {
    liked: boolean;
    saved: boolean;
    shared: boolean;
    reaction?: ReactionType | null;
  };
  /** Layout variant */
  variant?: 'default' | 'compact' | 'detailed' | 'minimal';
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Whether to show author information */
  showAuthor?: boolean;
  /** Whether to show timestamp */
  showTimestamp?: boolean;
  /** Whether to show interaction buttons */
  showInteractions?: boolean;
  /** Whether to show media attachments */
  showMedia?: boolean;
  /** Whether to show comments */
  showComments?: boolean;
  /** Maximum number of comments to show */
  maxComments?: number;
  /** Whether content can be expanded */
  expandable?: boolean;
  /** Maximum content length before truncation */
  maxContentLength?: number;
  /** Whether post can be edited */
  editable?: boolean;
  /** Whether post can be deleted */
  deletable?: boolean;
  /** Whether to show privacy indicator */
  showPrivacy?: boolean;
  /** Whether to show share options */
  showShare?: boolean;
  /** Whether to enable lightbox for media */
  enableLightbox?: boolean;
  /** Custom action buttons */
  customActions?: ReactNode;
  /** Theme variant */
  theme?: 'light' | 'dark' | 'auto';

  // Event handlers
  /** Called when post is clicked */
  onClick?: (post: PostContent) => void;
  /** Called when author is clicked */
  onAuthorClick?: (authorId: string) => void;
  /** Called when like button is clicked */
  onLike?: (postId: string) => void;
  /** Called when save button is clicked */
  onSave?: (postId: string) => void;
  /** Called when share button is clicked */
  onShare?: (postId: string, platform?: string) => void;
  /** Called when reaction is added */
  onReaction?: (postId: string, reaction: ReactionType) => void;
  /** Called when comment is added */
  onComment?: (postId: string, content: string, parentId?: string) => void;
  /** Called when post is edited */
  onEdit?: (postId: string) => void;
  /** Called when post is deleted */
  onDelete?: (postId: string) => void;
  /** Called when media is clicked */
  onMediaClick?: (media: MediaItem, index: number) => void;
  /** Called when hashtag is clicked */
  onHashtagClick?: (hashtag: string) => void;
  /** Called when mention is clicked */
  onMentionClick?: (username: string) => void;
  /** Called when link is clicked */
  onLinkClick?: (url: string) => void;
}

// Comment component props
export interface CommentProps extends BasePostProps {
  /** Comment data */
  comment: Comment;
  /** Current user ID */
  currentUserId?: string;
  /** Whether comment is liked by current user */
  isLiked?: boolean;
  /** Nesting level for replies */
  level?: number;
  /** Maximum nesting level */
  maxLevel?: number;
  /** Whether replies are shown */
  showReplies?: boolean;
  /** Number of replies to show */
  maxReplies?: number;
  /** Whether to show timestamp */
  showTimestamp?: boolean;
  /** Whether to show like button */
  showLike?: boolean;
  /** Whether to show reply button */
  showReply?: boolean;
  /** Whether comment can be edited */
  editable?: boolean;
  /** Whether comment can be deleted */
  deletable?: boolean;
  /** Whether comment is being edited */
  isEditing?: boolean;
  /** Layout variant */
  variant?: 'default' | 'compact' | 'minimal';
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';

  // Event handlers
  /** Called when comment is clicked */
  onClick?: (comment: Comment) => void;
  /** Called when author is clicked */
  onAuthorClick?: (authorId: string) => void;
  /** Called when like button is clicked */
  onLike?: (commentId: string) => void;
  /** Called when reply button is clicked */
  onReply?: (commentId: string) => void;
  /** Called when edit button is clicked */
  onEdit?: (commentId: string) => void;
  /** Called when delete button is clicked */
  onDelete?: (commentId: string) => void;
  /** Called when comment update is saved */
  onSave?: (commentId: string, content: string) => void;
  /** Called when edit is cancelled */
  onCancel?: (commentId: string) => void;
  /** Called when mention is clicked */
  onMentionClick?: (username: string) => void;
}

// Comment list component props
export interface CommentListProps extends BasePostProps {
  /** List of comments */
  comments: Comment[];
  /** Current user ID */
  currentUserId?: string;
  /** Post ID the comments belong to */
  postId: string;
  /** Whether list is loading */
  loading?: boolean;
  /** Whether there are more comments to load */
  hasMore?: boolean;
  /** Total number of comments */
  total?: number;
  /** Number of comments to show initially */
  initialCount?: number;
  /** Whether to show nested replies */
  showReplies?: boolean;
  /** Maximum nesting level */
  maxNestingLevel?: number;
  /** Sorting option */
  sortBy?: 'newest' | 'oldest' | 'popular';
  /** Layout variant */
  variant?: 'default' | 'compact' | 'threaded';
  /** Whether comments can be added */
  allowComments?: boolean;
  /** Placeholder for comment input */
  commentPlaceholder?: string;
  /** Whether to show comment count */
  showCount?: boolean;
  /** Empty state content */
  emptyContent?: ReactNode;

  // Event handlers
  /** Called when new comment is added */
  onAddComment?: (content: string, parentId?: string) => void;
  /** Called when comment is edited */
  onEditComment?: (commentId: string, content: string) => void;
  /** Called when comment is deleted */
  onDeleteComment?: (commentId: string) => void;
  /** Called when comment is liked */
  onLikeComment?: (commentId: string) => void;
  /** Called when more comments should be loaded */
  onLoadMore?: () => void;
  /** Called when sort option changes */
  onSortChange?: (sortBy: 'newest' | 'oldest' | 'popular') => void;
}

// Comment input component props
export interface CommentInputProps extends BasePostProps {
  /** Placeholder text */
  placeholder?: string;
  /** Current value */
  value?: string;
  /** Whether input is focused */
  focused?: boolean;
  /** Whether to show emoji picker */
  showEmoji?: boolean;
  /** Whether to show attachment button */
  showAttachment?: boolean;
  /** Whether to show mention suggestions */
  showMentions?: boolean;
  /** Maximum character count */
  maxLength?: number;
  /** Minimum character count */
  minLength?: number;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Layout variant */
  variant?: 'default' | 'compact' | 'expanded';
  /** Whether input can be submitted */
  canSubmit?: boolean;
  /** Submit button text */
  submitText?: string;
  /** Whether submission is in progress */
  submitting?: boolean;
  /** Error message */
  error?: string;
  /** Success message */
  success?: string;

  // Event handlers
  /** Called when value changes */
  onChange?: (value: string) => void;
  /** Called when input is focused */
  onFocus?: () => void;
  /** Called when input loses focus */
  onBlur?: () => void;
  /** Called when comment is submitted */
  onSubmit?: (content: string) => void;
  /** Called when emoji is selected */
  onEmojiSelect?: (emoji: string) => void;
  /** Called when mention is triggered */
  onMentionTrigger?: (query: string) => void;
  /** Called when attachment is added */
  onAttachment?: (files: FileList) => void;
  /** Called when input is cancelled */
  onCancel?: () => void;
}

// Post creation component props
export interface PostCreationProps extends BasePostProps {
  /** Current user ID */
  currentUserId?: string;
  /** Initial content */
  initialContent?: string;
  /** Initial media */
  initialMedia?: MediaItem[];
  /** Whether post is being created */
  creating?: boolean;
  /** Whether post can include media */
  allowMedia?: boolean;
  /** Whether post can include location */
  allowLocation?: boolean;
  /** Whether post can be scheduled */
  allowScheduling?: boolean;
  /** Available privacy levels */
  privacyLevels?: PrivacyLevel[];
  /** Default privacy level */
  defaultPrivacy?: PrivacyLevel;
  /** Maximum content length */
  maxLength?: number;
  /** Supported media types */
  supportedMediaTypes?: string[];
  /** Maximum number of media items */
  maxMediaItems?: number;
  /** Layout variant */
  variant?: 'modal' | 'inline' | 'page';
  /** Size variant */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Whether to show character count */
  showCharacterCount?: boolean;
  /** Whether to show privacy selector */
  showPrivacySelector?: boolean;
  /** Whether to show scheduling options */
  showScheduling?: boolean;
  /** Whether to show location selector */
  showLocation?: boolean;
  /** Whether to show emoji picker */
  showEmoji?: boolean;
  /** Whether to show hashtag suggestions */
  showHashtagSuggestions?: boolean;
  /** Whether to show mention suggestions */
  showMentionSuggestions?: boolean;

  // Event handlers
  /** Called when post is created */
  onCreatePost?: (post: Partial<PostContent>) => void;
  /** Called when post creation is cancelled */
  onCancel?: () => void;
  /** Called when content changes */
  onContentChange?: (content: string) => void;
  /** Called when media is added */
  onMediaAdd?: (media: MediaItem[]) => void;
  /** Called when media is removed */
  onMediaRemove?: (mediaId: string) => void;
  /** Called when privacy changes */
  onPrivacyChange?: (privacy: PrivacyLevel) => void;
  /** Called when location is selected */
  onLocationSelect?: (location: any) => void;
  /** Called when post is scheduled */
  onSchedule?: (date: Date) => void;
  /** Called when draft is saved */
  onSaveDraft?: (content: string) => void;
}

// Post interaction buttons props
export interface PostInteractionButtonsProps extends BasePostProps {
  /** Post ID */
  postId: string;
  /** Post statistics */
  stats: PostStats;
  /** User's interaction state */
  userInteractions: {
    liked: boolean;
    saved: boolean;
    shared: boolean;
    reaction?: ReactionType | null;
  };
  /** Layout variant */
  variant?: 'default' | 'compact' | 'minimal' | 'expanded';
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Orientation */
  orientation?: 'horizontal' | 'vertical';
  /** Which buttons to show */
  buttons?: {
    like?: boolean;
    comment?: boolean;
    share?: boolean;
    save?: boolean;
    reactions?: boolean;
  };
  /** Whether to show counts */
  showCounts?: boolean;
  /** Whether to show labels */
  showLabels?: boolean;
  /** Available reactions */
  availableReactions?: ReactionType[];
  /** Share platforms */
  sharePlatforms?: string[];
  /** Theme variant */
  theme?: 'light' | 'dark' | 'auto';

  // Event handlers
  /** Called when like button is clicked */
  onLike?: () => void;
  /** Called when comment button is clicked */
  onComment?: () => void;
  /** Called when share button is clicked */
  onShare?: (platform?: string) => void;
  /** Called when save button is clicked */
  onSave?: () => void;
  /** Called when reaction is selected */
  onReaction?: (reaction: ReactionType) => void;
}

// Post media gallery props
export interface PostMediaGalleryProps extends BasePostProps {
  /** Media items to display */
  media: MediaItem[];
  /** Layout variant */
  variant?: 'grid' | 'carousel' | 'stack' | 'masonry';
  /** Maximum number of items to show */
  maxItems?: number;
  /** Aspect ratio for items */
  aspectRatio?: number;
  /** Gap between items */
  gap?: string | number;
  /** Whether to show navigation */
  showNavigation?: boolean;
  /** Whether to show indicators */
  showIndicators?: boolean;
  /** Whether to enable lightbox */
  enableLightbox?: boolean;
  /** Whether to show captions */
  showCaptions?: boolean;
  /** Whether to show download button */
  showDownload?: boolean;
  /** Whether to enable zoom */
  enableZoom?: boolean;
  /** Auto play for videos */
  autoPlay?: boolean;
  /** Mute videos by default */
  muted?: boolean;
  /** Loop videos */
  loop?: boolean;

  // Event handlers
  /** Called when media item is clicked */
  onMediaClick?: (media: MediaItem, index: number) => void;
  /** Called when media item is downloaded */
  onMediaDownload?: (media: MediaItem) => void;
  /** Called when navigation changes */
  onNavigationChange?: (index: number) => void;
}

// Post stats display props
export interface PostStatsDisplayProps extends BasePostProps {
  /** Post statistics */
  stats: PostStats;
  /** Layout variant */
  variant?: 'default' | 'compact' | 'detailed' | 'minimal';
  /** Which stats to show */
  showStats?: {
    likes?: boolean;
    comments?: boolean;
    shares?: boolean;
    views?: boolean;
    saves?: boolean;
    reactions?: boolean;
  };
  /** Number format */
  numberFormat?: 'short' | 'long' | 'none';
  /** Whether to show labels */
  showLabels?: boolean;
  /** Whether to show separators */
  showSeparators?: boolean;
  /** Orientation */
  orientation?: 'horizontal' | 'vertical';
  /** Alignment */
  alignment?: 'left' | 'center' | 'right';

  // Event handlers
  /** Called when stat is clicked */
  onStatClick?: (type: keyof PostStats) => void;
}

// Export all types
export type {
  BasePostProps,
  PostCardProps,
  CommentProps,
  CommentListProps,
  CommentInputProps,
  PostCreationProps,
  PostInteractionButtonsProps,
  PostMediaGalleryProps,
  PostStatsDisplayProps,
};
