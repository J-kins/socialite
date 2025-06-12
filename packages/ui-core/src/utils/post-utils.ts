/**
 * Post Utilities
 *
 * Provides comprehensive post management functionality including content formatting,
 * interaction tracking, sanitization, and social media features.
 */

export interface PostContent {
  id: string;
  content: string;
  media?: MediaItem[];
  mentions?: Mention[];
  hashtags?: string[];
  links?: LinkPreview[];
  location?: Location;
  privacy?: PrivacyLevel;
  createdAt: Date;
  updatedAt?: Date;
  authorId: string;
}

export interface MediaItem {
  id: string;
  type: 'image' | 'video' | 'audio' | 'document';
  url: string;
  thumbnailUrl?: string;
  alt?: string;
  caption?: string;
  width?: number;
  height?: number;
  duration?: number; // for video/audio
  size?: number; // file size in bytes
  mimeType?: string;
}

export interface Mention {
  id: string;
  username: string;
  displayName: string;
  startIndex: number;
  endIndex: number;
}

export interface LinkPreview {
  url: string;
  title?: string;
  description?: string;
  image?: string;
  siteName?: string;
  favicon?: string;
}

export interface Location {
  id: string;
  name: string;
  address?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface PostInteraction {
  id: string;
  postId: string;
  userId: string;
  type: InteractionType;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface PostStats {
  likes: number;
  comments: number;
  shares: number;
  views: number;
  saves: number;
  reactions: Record<ReactionType, number>;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  content: string;
  mentions?: Mention[];
  parentId?: string; // for nested comments
  createdAt: Date;
  updatedAt?: Date;
  likes: number;
  isEdited: boolean;
}

export type InteractionType =
  | 'like'
  | 'comment'
  | 'share'
  | 'save'
  | 'view'
  | 'reaction';
export type ReactionType = 'like' | 'love' | 'laugh' | 'wow' | 'sad' | 'angry';
export type PrivacyLevel = 'public' | 'friends' | 'private' | 'custom';

// Content formatting options
export interface FormatOptions {
  maxLength?: number;
  allowHtml?: boolean;
  stripHtml?: boolean;
  preserveWhitespace?: boolean;
  linkify?: boolean;
  mentionify?: boolean;
  hashtagify?: boolean;
  enableEmoji?: boolean;
  truncateWords?: boolean;
}

// Sanitization options
export interface SanitizeOptions {
  allowedTags?: string[];
  allowedAttributes?: Record<string, string[]>;
  removeEmptyElements?: boolean;
  stripComments?: boolean;
  convertLineBreaks?: boolean;
}

/**
 * Formats post content with various processing options
 */
export const formatPostContent = (
  content: string,
  options: FormatOptions = {},
): string => {
  const {
    maxLength,
    allowHtml = false,
    stripHtml = true,
    preserveWhitespace = false,
    linkify = true,
    mentionify = true,
    hashtagify = true,
    enableEmoji = true,
    truncateWords = true,
  } = options;

  let formatted = content;

  // Strip HTML if not allowed
  if (!allowHtml && stripHtml) {
    formatted = stripHtmlTags(formatted);
  }

  // Normalize whitespace
  if (!preserveWhitespace) {
    formatted = formatted.replace(/\s+/g, ' ').trim();
  }

  // Convert line breaks to <br> tags if HTML is allowed
  if (allowHtml) {
    formatted = formatted.replace(/\n/g, '<br>');
  }

  // Process mentions
  if (mentionify) {
    formatted = processMentions(formatted);
  }

  // Process hashtags
  if (hashtagify) {
    formatted = processHashtags(formatted);
  }

  // Process links
  if (linkify) {
    formatted = processLinks(formatted);
  }

  // Process emojis
  if (enableEmoji) {
    formatted = processEmojis(formatted);
  }

  // Truncate if needed
  if (maxLength && formatted.length > maxLength) {
    if (truncateWords) {
      formatted = truncateAtWord(formatted, maxLength);
    } else {
      formatted = formatted.substring(0, maxLength);
    }
    formatted += '...';
  }

  return formatted;
};

/**
 * Sanitizes HTML content to prevent XSS attacks
 */
export const sanitizeHtml = (
  html: string,
  options: SanitizeOptions = {},
): string => {
  const {
    allowedTags = ['p', 'br', 'strong', 'em', 'u', 'a', 'ul', 'ol', 'li'],
    allowedAttributes = {
      a: ['href', 'title', 'target'],
      img: ['src', 'alt', 'title', 'width', 'height'],
    },
    removeEmptyElements = true,
    stripComments = true,
    convertLineBreaks = true,
  } = options;

  let sanitized = html;

  // Strip HTML comments
  if (stripComments) {
    sanitized = sanitized.replace(/<!--[\s\S]*?-->/g, '');
  }

  // Convert line breaks
  if (convertLineBreaks) {
    sanitized = sanitized.replace(/\n/g, '<br>');
  }

  // Simple HTML sanitization (in production, use a library like DOMPurify)
  const allowedTagsRegex = new RegExp(
    `<(?!\/?(?:${allowedTags.join('|')})\s*\/?)[^>]+>`,
    'gi',
  );
  sanitized = sanitized.replace(allowedTagsRegex, '');

  // Remove empty elements
  if (removeEmptyElements) {
    sanitized = sanitized.replace(/<([^>]+)>\s*<\/\1>/g, '');
  }

  return sanitized;
};

/**
 * Extracts mentions from post content
 */
export const extractMentions = (content: string): Mention[] => {
  const mentionRegex = /@(\w+)/g;
  const mentions: Mention[] = [];
  let match;

  while ((match = mentionRegex.exec(content)) !== null) {
    mentions.push({
      id: generateId(),
      username: match[1],
      displayName: match[1], // Would typically fetch from user database
      startIndex: match.index,
      endIndex: match.index + match[0].length,
    });
  }

  return mentions;
};

/**
 * Extracts hashtags from post content
 */
export const extractHashtags = (content: string): string[] => {
  const hashtagRegex = /#(\w+)/g;
  const hashtags: string[] = [];
  let match;

  while ((match = hashtagRegex.exec(content)) !== null) {
    hashtags.push(match[1].toLowerCase());
  }

  return Array.from(new Set(hashtags)); // Remove duplicates
};

/**
 * Extracts URLs from post content
 */
export const extractUrls = (content: string): string[] => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const urls = content.match(urlRegex) || [];
  return Array.from(new Set(urls)); // Remove duplicates
};

/**
 * Processes mentions in content and makes them clickable
 */
export const processMentions = (content: string): string => {
  return content.replace(
    /@(\w+)/g,
    '<a href="/user/$1" class="mention text-blue-500 hover:text-blue-600">@$1</a>',
  );
};

/**
 * Processes hashtags in content and makes them clickable
 */
export const processHashtags = (content: string): string => {
  return content.replace(
    /#(\w+)/g,
    '<a href="/hashtag/$1" class="hashtag text-blue-500 hover:text-blue-600">#$1</a>',
  );
};

/**
 * Processes URLs in content and makes them clickable
 */
export const processLinks = (content: string): string => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return content.replace(
    urlRegex,
    '<a href="$1" target="_blank" rel="noopener noreferrer" class="link text-blue-500 hover:text-blue-600">$1</a>',
  );
};

/**
 * Processes emoji shortcodes (simple implementation)
 */
export const processEmojis = (content: string): string => {
  const emojiMap: Record<string, string> = {
    ':smile:': '😊',
    ':heart:': '❤️',
    ':thumbsup:': '👍',
    ':fire:': '🔥',
    ':clap:': '👏',
    ':eyes:': '👀',
    ':100:': '💯',
  };

  let processed = content;
  Object.entries(emojiMap).forEach(([shortcode, emoji]) => {
    processed = processed.replace(new RegExp(shortcode, 'g'), emoji);
  });

  return processed;
};

/**
 * Tracks post interactions
 */
export const trackInteraction = (
  postId: string,
  userId: string,
  type: InteractionType,
  metadata?: Record<string, any>,
): PostInteraction => {
  const interaction: PostInteraction = {
    id: generateId(),
    postId,
    userId,
    type,
    timestamp: new Date(),
    metadata,
  };

  // In a real app, this would save to database
  console.log('Interaction tracked:', interaction);

  return interaction;
};

/**
 * Calculates post engagement rate
 */
export const calculateEngagementRate = (
  stats: PostStats,
  followerCount: number,
): number => {
  const totalEngagement = stats.likes + stats.comments + stats.shares;
  return followerCount > 0 ? (totalEngagement / followerCount) * 100 : 0;
};

/**
 * Formats relative time (e.g., "2 hours ago")
 */
export const formatRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffSecs < 60) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffWeeks < 4) return `${diffWeeks}w ago`;
  if (diffMonths < 12) return `${diffMonths}mo ago`;
  return `${diffYears}y ago`;
};

/**
 * Formats absolute time for display
 */
export const formatPostTime = (
  date: Date,
  format: 'short' | 'long' = 'short',
): string => {
  const options: Intl.DateTimeFormatOptions =
    format === 'short'
      ? { month: 'short', day: 'numeric' }
      : {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        };

  return date.toLocaleDateString('en-US', options);
};

/**
 * Validates post content
 */
export const validatePostContent = (
  content: string,
  options: {
    minLength?: number;
    maxLength?: number;
    allowEmpty?: boolean;
    requireHashtag?: boolean;
    maxMentions?: number;
    maxHashtags?: number;
  } = {},
): { isValid: boolean; errors: string[] } => {
  const {
    minLength = 1,
    maxLength = 280,
    allowEmpty = false,
    requireHashtag = false,
    maxMentions = 10,
    maxHashtags = 10,
  } = options;

  const errors: string[] = [];
  const trimmedContent = content.trim();

  // Check empty content
  if (!allowEmpty && trimmedContent.length === 0) {
    errors.push('Post content cannot be empty');
  }

  // Check length
  if (trimmedContent.length < minLength) {
    errors.push(`Post must be at least ${minLength} characters`);
  }

  if (trimmedContent.length > maxLength) {
    errors.push(`Post cannot exceed ${maxLength} characters`);
  }

  // Check hashtag requirement
  if (requireHashtag && extractHashtags(content).length === 0) {
    errors.push('Post must contain at least one hashtag');
  }

  // Check mention limits
  const mentions = extractMentions(content);
  if (mentions.length > maxMentions) {
    errors.push(`Post cannot contain more than ${maxMentions} mentions`);
  }

  // Check hashtag limits
  const hashtags = extractHashtags(content);
  if (hashtags.length > maxHashtags) {
    errors.push(`Post cannot contain more than ${maxHashtags} hashtags`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Searches posts by content, hashtags, or mentions
 */
export const searchPosts = (
  posts: PostContent[],
  query: string,
  options: {
    searchContent?: boolean;
    searchHashtags?: boolean;
    searchMentions?: boolean;
    caseSensitive?: boolean;
  } = {},
): PostContent[] => {
  const {
    searchContent = true,
    searchHashtags = true,
    searchMentions = true,
    caseSensitive = false,
  } = options;

  const searchTerm = caseSensitive ? query : query.toLowerCase();

  return posts.filter(post => {
    const content = caseSensitive ? post.content : post.content.toLowerCase();

    // Search content
    if (searchContent && content.includes(searchTerm)) {
      return true;
    }

    // Search hashtags
    if (searchHashtags && post.hashtags) {
      const hashtagsToSearch = caseSensitive
        ? post.hashtags
        : post.hashtags.map(tag => tag.toLowerCase());

      if (hashtagsToSearch.some(tag => tag.includes(searchTerm))) {
        return true;
      }
    }

    // Search mentions
    if (searchMentions && post.mentions) {
      const mentionsToSearch = caseSensitive
        ? post.mentions.map(m => m.username)
        : post.mentions.map(m => m.username.toLowerCase());

      if (mentionsToSearch.some(username => username.includes(searchTerm))) {
        return true;
      }
    }

    return false;
  });
};

/**
 * Utility functions
 */

const stripHtmlTags = (html: string): string => {
  return html.replace(/<[^>]*>/g, '');
};

const truncateAtWord = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;

  const truncated = text.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');

  return lastSpace > 0 ? truncated.substring(0, lastSpace) : truncated;
};

const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Content moderation utilities
 */

export const flagInappropriateContent = (
  content: string,
): {
  flagged: boolean;
  reasons: string[];
  confidence: number;
} => {
  // Simple keyword-based flagging (in production, use AI moderation)
  const inappropriateWords = ['spam', 'scam', 'fake', 'hate', 'abuse'];

  const reasons: string[] = [];
  let flagged = false;

  inappropriateWords.forEach(word => {
    if (content.toLowerCase().includes(word)) {
      flagged = true;
      reasons.push(`Contains inappropriate content: ${word}`);
    }
  });

  return {
    flagged,
    reasons,
    confidence: flagged ? 0.8 : 0,
  };
};

/**
 * Post scheduling utilities
 */

export const schedulePost = (
  post: PostContent,
  scheduledTime: Date,
): {
  isValid: boolean;
  errors: string[];
  scheduledPost?: PostContent & { scheduledFor: Date };
} => {
  const errors: string[] = [];
  const now = new Date();

  if (scheduledTime <= now) {
    errors.push('Scheduled time must be in the future');
  }

  const maxScheduleTime = new Date();
  maxScheduleTime.setMonth(maxScheduleTime.getMonth() + 6); // 6 months max

  if (scheduledTime > maxScheduleTime) {
    errors.push('Cannot schedule posts more than 6 months in advance');
  }

  if (errors.length > 0) {
    return { isValid: false, errors };
  }

  return {
    isValid: true,
    errors: [],
    scheduledPost: {
      ...post,
      scheduledFor: scheduledTime,
    },
  };
};

export default {
  formatPostContent,
  sanitizeHtml,
  extractMentions,
  extractHashtags,
  extractUrls,
  processMentions,
  processHashtags,
  processLinks,
  processEmojis,
  trackInteraction,
  calculateEngagementRate,
  formatRelativeTime,
  formatPostTime,
  validatePostContent,
  searchPosts,
  flagInappropriateContent,
  schedulePost,
};
