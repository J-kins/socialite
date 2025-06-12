import React from 'react';

export interface PostTextProps extends React.HTMLAttributes<HTMLDivElement> {
  content: string;
  variant?: 'normal' | 'caption' | 'headline' | 'quote';
  size?: 'sm' | 'md' | 'lg';
  truncate?: boolean;
  expandable?: boolean;
  maxLines?: number;
  linkify?: boolean;
  highlightMentions?: boolean;
  highlightHashtags?: boolean;
  onMentionClick?: (mention: string) => void;
  onHashtagClick?: (hashtag: string) => void;
  onLinkClick?: (url: string) => void;
}

/**
 * PostText component for displaying formatted post content
 * Supports mentions, hashtags, links, and various text formatting options
 */
export const PostText: React.FC<PostTextProps> = ({
  content,
  variant = 'normal',
  size = 'md',
  truncate = false,
  expandable = false,
  maxLines,
  linkify = true,
  highlightMentions = true,
  highlightHashtags = true,
  onMentionClick,
  onHashtagClick,
  onLinkClick,
  className = '',
  ...props
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const baseClasses = [
    'post-text',
    `post-text-${variant}`,
    `post-text-${size}`,
    truncate && 'post-text-truncate',
    maxLines && `post-text-lines-${maxLines}`,
  ].filter(Boolean);

  const formatContent = (text: string): React.ReactNode => {
    if (!text) return null;

    let formattedText = text;
    const elements: Array<{ type: string; content: string; index: number; length: number }> = [];

    // Find URLs
    if (linkify) {
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      let match;
      while ((match = urlRegex.exec(text)) !== null) {
        elements.push({
          type: 'link',
          content: match[1],
          index: match.index,
          length: match[1].length,
        });
      }
    }

    // Find mentions
    if (highlightMentions) {
      const mentionRegex = /@(\w+)/g;
      let match;
      while ((match = mentionRegex.exec(text)) !== null) {
        elements.push({
          type: 'mention',
          content: match[1],
          index: match.index,
          length: match[0].length,
        });
      }
    }

    // Find hashtags
    if (highlightHashtags) {
      const hashtagRegex = /#(\w+)/g;
      let match;
      while ((match = hashtagRegex.exec(text)) !== null) {
        elements.push({
          type: 'hashtag',
          content: match[1],
          index: match.index,
          length: match[0].length,
        });
      }
    }

    // Sort elements by index to process them in order
    elements.sort((a, b) => a.index - b.index);

    if (elements.length === 0) {
      return <span>{text}</span>;
    }

    const result: React.ReactNode[] = [];
    let lastIndex = 0;

    elements.forEach((element, i) => {
      // Add text before this element
      if (element.index > lastIndex) {
        result.push(<span key={`text-${i}`}>{text.substring(lastIndex, element.index)}</span>);
      }

      // Add the formatted element
      switch (element.type) {
        case 'link':
          result.push(
            <a
              key={`link-${i}`}
              href={element.content}
              className="post-text-link"
              onClick={(e) => {
                e.preventDefault();
                onLinkClick?.(element.content);
              }}
              target="_blank"
              rel="noopener noreferrer"
            >
              {element.content}
            </a>
          );
          break;
        case 'mention':
          result.push(
            <span
              key={`mention-${i}`}
              className="post-text-mention"
              onClick={() => onMentionClick?.(element.content)}
            >
              @{element.content}
            </span>
          );
          break;
        case 'hashtag':
          result.push(
            <span
              key={`hashtag-${i}`}
              className="post-text-hashtag"
              onClick={() => onHashtagClick?.(element.content)}
            >
              #{element.content}
            </span>
          );
          break;
      }

      lastIndex = element.index + element.length;
    });

    // Add remaining text
    if (lastIndex < text.length) {
      result.push(<span key="text-end">{text.substring(lastIndex)}</span>);
    }

    return result;
  };

  const shouldShowExpand = expandable && content.length > 200;
  const displayContent =
    shouldShowExpand && !isExpanded ? content.substring(0, 200) + '...' : content;

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`${baseClasses.join(' ')} ${className}`} {...props}>
      <div className="post-text-content">{formatContent(displayContent)}</div>

      {shouldShowExpand && (
        <button type="button" onClick={handleToggleExpand} className="post-text-expand">
          {isExpanded ? 'Show less' : 'Show more'}
        </button>
      )}
    </div>
  );
};

export type { PostTextProps };
