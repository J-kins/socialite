// Core Molecule Component Styles
import './search-box.css';
import './avatar-with-name.css';
import './dropdown-item.css';
import './notification-item.css';
import './chat-preview.css';
import './profile-card.css';
import './slider-nav.css';
import './toggle-theme-switch.css';
import './sidebar-link.css';
import './create-post-option.css';
import './tab-switcher.css';
import './accordion-item.css';
import './toast.css';
import './recent-search-item.css';
import './social-action-button.css';

// New File Upload & Post Component Styles
import './file-uploader.css';
import './post-card.css';
import './comment-input.css';

// Additional Molecule Component Styles from HTML Analysis
import './gallery-item.css';
import './comment-list-item.css';
import './form-group.css';
import './social-login-button.css';

// Export CSS files for build tools that need explicit imports
export const moleculeStyles = [
  // Core Components
  'search-box.css',
  'avatar-with-name.css',
  'dropdown-item.css',
  'notification-item.css',
  'chat-preview.css',
  'profile-card.css',
  'slider-nav.css',
  'toggle-theme-switch.css',
  'sidebar-link.css',
  'create-post-option.css',
  'tab-switcher.css',
  'accordion-item.css',
  'toast.css',
  'recent-search-item.css',
  'social-action-button.css',

  // New File Upload & Post Components
  'file-uploader.css',
  'post-card.css',
  'comment-input.css',

  // Additional Components from HTML Analysis
  'gallery-item.css',
  'comment-list-item.css',
  'form-group.css',
  'social-login-button.css',
] as const;

export type MoleculeStylesType = (typeof moleculeStyles)[number];
