import React, { useState } from 'react';
import { Icon } from './Icon';

export interface ShareButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  url?: string;
  title?: string;
  text?: string;
  variant?: 'minimal' | 'filled' | 'outlined' | 'floating';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  platforms?: Array<
    'facebook' | 'twitter' | 'linkedin' | 'whatsapp' | 'telegram' | 'copy' | 'email'
  >;
  onShare?: (platform: string, success: boolean) => void;
  onCopy?: (success: boolean) => void;
}

/**
 * ShareButton component for social sharing
 * Supports multiple platforms and native Web Share API
 */
export const ShareButton: React.FC<ShareButtonProps> = ({
  url = typeof window !== 'undefined' ? window.location.href : '',
  title = '',
  text = '',
  variant = 'minimal',
  size = 'md',
  showLabel = false,
  platforms = ['facebook', 'twitter', 'linkedin', 'copy'],
  onShare,
  onCopy,
  className = '',
  disabled,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const baseClasses = [
    'share-button',
    `share-button-${variant}`,
    `share-button-${size}`,
    disabled && 'share-button-disabled',
    isOpen && 'share-button-open',
  ].filter(Boolean);

  // Check if Web Share API is available
  const canUseWebShare = typeof navigator !== 'undefined' && 'share' in navigator;

  const handleNativeShare = async () => {
    if (!canUseWebShare) return false;

    try {
      await navigator.share({
        url,
        title,
        text,
      });
      onShare?.('native', true);
      return true;
    } catch (error) {
      onShare?.('native', false);
      return false;
    }
  };

  const handlePlatformShare = (platform: string) => {
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);
    const encodedText = encodeURIComponent(text || title);

    let shareUrl = '';

    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
        break;
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${encodedTitle}&body=${encodedText}%20${encodedUrl}`;
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
      onShare?.(platform, true);
    }
  };

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      onCopy?.(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      onCopy?.(false);
    }
  };

  const handleMainClick = async () => {
    if (disabled) return;

    // If Web Share API is available, use it first
    if (canUseWebShare) {
      const shared = await handleNativeShare();
      if (shared) return;
    }

    // Otherwise, toggle dropdown
    setIsOpen(!isOpen);
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'facebook':
        return <Icon name="facebook" className="share-platform-icon" />;
      case 'twitter':
        return <Icon name="twitter" className="share-platform-icon" />;
      case 'linkedin':
        return <Icon name="linkedin" className="share-platform-icon" />;
      case 'whatsapp':
        return <Icon name="send" className="share-platform-icon" />;
      case 'telegram':
        return <Icon name="send" className="share-platform-icon" />;
      case 'email':
        return <Icon name="mail" className="share-platform-icon" />;
      case 'copy':
        return <Icon name={copied ? 'check' : 'copy'} className="share-platform-icon" />;
      default:
        return <Icon name="share" className="share-platform-icon" />;
    }
  };

  const getPlatformLabel = (platform: string) => {
    switch (platform) {
      case 'facebook':
        return 'Facebook';
      case 'twitter':
        return 'Twitter';
      case 'linkedin':
        return 'LinkedIn';
      case 'whatsapp':
        return 'WhatsApp';
      case 'telegram':
        return 'Telegram';
      case 'email':
        return 'Email';
      case 'copy':
        return copied ? 'Copied!' : 'Copy Link';
      default:
        return 'Share';
    }
  };

  const handlePlatformClick = (platform: string) => {
    if (platform === 'copy') {
      handleCopyToClipboard();
    } else {
      handlePlatformShare(platform);
    }
    setIsOpen(false);
  };

  return (
    <div className="share-button-container">
      <button
        type="button"
        onClick={handleMainClick}
        disabled={disabled}
        className={`${baseClasses.join(' ')} ${className}`}
        aria-label="Share this content"
        aria-expanded={isOpen}
        {...props}
      >
        <span className="share-button-content">
          <Icon name="share" className="share-button-icon" />
          {showLabel && <span className="share-button-label">Share</span>}
        </span>
      </button>

      {isOpen && (
        <div className="share-button-dropdown">
          <div className="share-button-dropdown-content">
            {platforms.map((platform) => (
              <button
                key={platform}
                type="button"
                onClick={() => handlePlatformClick(platform)}
                className={`share-platform-button share-platform-${platform}`}
                aria-label={`Share on ${getPlatformLabel(platform)}`}
              >
                {getPlatformIcon(platform)}
                <span className="share-platform-label">{getPlatformLabel(platform)}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Backdrop to close dropdown */}
      {isOpen && <div className="share-button-backdrop" onClick={() => setIsOpen(false)} />}
    </div>
  );
};

export type { ShareButtonProps };
