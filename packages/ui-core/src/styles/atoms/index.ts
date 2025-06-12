// Core Atomic Component Styles
import './button.css';
import './input.css';
import './icon.css';
import './avatar.css';
import './image.css';
import './label.css';
import './text.css';
import './badge.css';
import './link.css';
import './tooltip.css';
import './divider.css';
import './switch.css';
import './close-button.css';
import './tab-item.css';
import './notification-dot.css';
import './countdown-timer.css';
import './progress-bar.css';
import './list-item.css';

// File Upload Component Styles
import './file-input.css';
import './upload-button.css';
import './file-preview.css';

// Post Component Styles
import './post-text.css';
import './post-image.css';
import './post-video.css';

// Social Interaction Component Styles
import './like-button.css';
import './comment-button.css';
import './share-button.css';

// Export CSS files for build tools that need explicit imports
export const atomicStyles = [
  // Core Components
  'button.css',
  'input.css',
  'icon.css',
  'avatar.css',
  'image.css',
  'label.css',
  'text.css',
  'badge.css',
  'link.css',
  'tooltip.css',
  'divider.css',
  'switch.css',
  'close-button.css',
  'tab-item.css',
  'notification-dot.css',
  'countdown-timer.css',
  'progress-bar.css',
  'list-item.css',

  // File Upload Components
  'file-input.css',
  'upload-button.css',
  'file-preview.css',

  // Post Components
  'post-text.css',
  'post-image.css',
  'post-video.css',

  // Social Interaction Components
  'like-button.css',
  'comment-button.css',
  'share-button.css',
] as const;

export type AtomicStylesType = (typeof atomicStyles)[number];
