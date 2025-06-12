/**
 * Post Utilities
 * Helper functions for handling social media posts
 */

const PostUtils = {
  // Format post content
  formatContent(content, options = {}) {
    const {
      maxLength = null,
      linkify = true,
      mentionify = true,
      hashtagify = true,
      allowHtml = false,
    } = options;

    if (!content) return "";

    let formatted = allowHtml ? content : this.escapeHtml(content);

    // Apply length limit
    if (maxLength && formatted.length > maxLength) {
      formatted = formatted.substring(0, maxLength) + "...";
    }

    // Convert URLs to links
    if (linkify) {
      formatted = this.linkifyUrls(formatted);
    }

    // Convert @mentions to links
    if (mentionify) {
      formatted = this.linkifyMentions(formatted);
    }

    // Convert #hashtags to links
    if (hashtagify) {
      formatted = this.linkifyHashtags(formatted);
    }

    return formatted;
  },

  // Escape HTML characters
  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  },

  // Convert URLs to clickable links
  linkifyUrls(text) {
    const urlRegex = /(https?:\/\/[^\s<>"]+)/gi;
    return text.replace(urlRegex, (url) => {
      return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline">${url}</a>`;
    });
  },

  // Convert @mentions to links
  linkifyMentions(text) {
    const mentionRegex = /@([a-zA-Z0-9_]+)/g;
    return text.replace(mentionRegex, (match, username) => {
      return `<a href="/profile/${username}" class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium">@${username}</a>`;
    });
  },

  // Convert #hashtags to links
  linkifyHashtags(text) {
    const hashtagRegex = /#([a-zA-Z0-9_]+)/g;
    return text.replace(hashtagRegex, (match, hashtag) => {
      return `<a href="/hashtag/${hashtag}" class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium">#${hashtag}</a>`;
    });
  },

  // Format timestamp relative to now
  formatTimestamp(timestamp) {
    if (!timestamp) return "";

    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (years > 0) return `${years}y`;
    if (months > 0) return `${months}mo`;
    if (weeks > 0) return `${weeks}w`;
    if (days > 0) return `${days}d`;
    if (hours > 0) return `${hours}h`;
    if (minutes > 0) return `${minutes}m`;
    if (seconds > 30) return `${seconds}s`;
    return "now";
  },

  // Format full timestamp
  formatFullTimestamp(timestamp) {
    if (!timestamp) return "";

    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (days === 1) {
      return (
        "Yesterday at " +
        date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
    } else if (days < 7) {
      return (
        date.toLocaleDateString([], { weekday: "long" }) +
        " at " +
        date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
    } else {
      return date.toLocaleDateString([], {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  },

  // Extract preview from post content
  extractPreview(content, maxLength = 150) {
    if (!content) return "";

    // Remove HTML tags
    const text = content.replace(/<[^>]*>/g, "");

    // Trim and truncate
    const trimmed = text.trim();
    if (trimmed.length <= maxLength) {
      return trimmed;
    }

    // Find last complete word within limit
    const truncated = trimmed.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(" ");

    return lastSpace > 0
      ? truncated.substring(0, lastSpace) + "..."
      : truncated + "...";
  },

  // Extract hashtags from content
  extractHashtags(content) {
    if (!content) return [];

    const hashtagRegex = /#([a-zA-Z0-9_]+)/g;
    const hashtags = [];
    let match;

    while ((match = hashtagRegex.exec(content)) !== null) {
      hashtags.push(match[1]);
    }

    return [...new Set(hashtags)]; // Remove duplicates
  },

  // Extract mentions from content
  extractMentions(content) {
    if (!content) return [];

    const mentionRegex = /@([a-zA-Z0-9_]+)/g;
    const mentions = [];
    let match;

    while ((match = mentionRegex.exec(content)) !== null) {
      mentions.push(match[1]);
    }

    return [...new Set(mentions)]; // Remove duplicates
  },

  // Format engagement count
  formatEngagementCount(count) {
    if (!count || count === 0) return "0";

    if (count < 1000) {
      return count.toString();
    } else if (count < 1000000) {
      const k = Math.floor(count / 100) / 10;
      return k === Math.floor(k) ? k + "K" : k.toFixed(1) + "K";
    } else {
      const m = Math.floor(count / 100000) / 10;
      return m === Math.floor(m) ? m + "M" : m.toFixed(1) + "M";
    }
  },

  // Generate post permalink
  generatePermalink(post) {
    if (!post || !post.id) return "";

    const baseUrl = window.location.origin;
    return `${baseUrl}/post/${post.id}`;
  },

  // Validate post content
  validatePost(post) {
    const errors = [];

    if (
      !post.content &&
      (!post.images || post.images.length === 0) &&
      (!post.videos || post.videos.length === 0)
    ) {
      errors.push("Post must have content, images, or videos");
    }

    if (post.content && post.content.length > 5000) {
      errors.push("Post content is too long (max 5000 characters)");
    }

    if (post.images && post.images.length > 10) {
      errors.push("Too many images (max 10)");
    }

    if (post.videos && post.videos.length > 5) {
      errors.push("Too many videos (max 5)");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  // Generate share data
  generateShareData(post) {
    const url = this.generatePermalink(post);
    const title = `${post.author.name} on Nexify`;
    const text = this.extractPreview(post.content, 100);

    return {
      url,
      title,
      text,
    };
  },

  // Check if post can be edited
  canEditPost(post, currentUser) {
    if (!post || !currentUser) return false;

    // Author can edit their own posts
    if (post.author.id === currentUser.id) {
      return true;
    }

    // Admins can edit any post
    if (currentUser.role === "admin") {
      return true;
    }

    return false;
  },

  // Check if post can be deleted
  canDeletePost(post, currentUser) {
    if (!post || !currentUser) return false;

    // Same rules as editing for now
    return this.canEditPost(post, currentUser);
  },

  // Generate post data for API
  serializePost(post) {
    return {
      id: post.id,
      content: post.content,
      images: post.images || [],
      videos: post.videos || [],
      location: post.location,
      privacy: post.privacy || "public",
      mentions: this.extractMentions(post.content),
      hashtags: this.extractHashtags(post.content),
      createdAt: post.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  },

  // Process post for display
  processPost(post) {
    return {
      ...post,
      formattedContent: this.formatContent(post.content),
      preview: this.extractPreview(post.content),
      relativeTime: this.formatTimestamp(post.timestamp),
      fullTime: this.formatFullTimestamp(post.timestamp),
      permalink: this.generatePermalink(post),
      shareData: this.generateShareData(post),
      hashtags: this.extractHashtags(post.content),
      mentions: this.extractMentions(post.content),
      formattedLikes: this.formatEngagementCount(post.likes),
      formattedComments: this.formatEngagementCount(post.comments),
      formattedShares: this.formatEngagementCount(post.shares),
    };
  },
};

export default PostUtils;
