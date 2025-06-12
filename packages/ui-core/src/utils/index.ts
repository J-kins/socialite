// Animation utilities
export * from './animations/ripple-effect';
export * from './animations/hover-effect';
export * from './animations/scroll-animation';

// General utilities
export * from './file-upload';
export * from './post-utils';
export * from './dom-utils';
export * from './format-utils';

// Hooks
export * from './hooks/use-modal';
export * from './hooks/use-toggle';
export * from './hooks/use-slider';
export * from './hooks/use-lightbox';
export * from './hooks/useFileUpload';
export * from './hooks/usePostInteraction';
export * from './hooks/useDragDrop';
export * from './hooks/useScrollSpy';
export * from './hooks/useTheme';

// All hooks through index
export * from './hooks';

// Types
export * from './hooks/types/component-props';
export * from './hooks/types/file-upload-props';
export * from './hooks/types/post-props';
export * from './hooks/types/drag-drop-props';
export * from './hooks/types/scroll-spy-props';
export * from './hooks/types/theme-props';

// Re-export all hooks for convenience
export { default as useModal } from './hooks/use-modal';
export { default as useToggle } from './hooks/use-toggle';
export { default as useSlider } from './hooks/use-slider';
export { default as useLightbox } from './hooks/use-lightbox';
export { default as useFileUpload } from './hooks/useFileUpload';
export { default as usePostInteraction } from './hooks/usePostInteraction';
export { default as useDragDrop } from './hooks/useDragDrop';
export { default as useScrollSpy } from './hooks/useScrollSpy';
export { default as useTheme } from './hooks/useTheme';

// Animation utilities with default exports
export { default as rippleEffect } from './animations/ripple-effect';
export { default as hoverEffect } from './animations/hover-effect';
export { default as scrollAnimation } from './animations/scroll-animation';

// General utilities with default exports
export { default as fileUpload } from './file-upload';
export { default as postUtils } from './post-utils';
export { default as domUtils } from './dom-utils';
export { default as formatUtils } from './format-utils';
