import { ReactNode } from 'react';
import {
  FileValidationOptions,
  FileCompressionOptions,
  FilePreviewOptions,
  FileUploadResult,
} from '../../file-upload';

/**
 * File Upload Component Props Types
 *
 * Comprehensive type definitions for file upload components including
 * drag-and-drop, validation, compression, and upload functionality.
 */

// Base file upload props
export interface BaseFileUploadProps {
  /** Unique identifier for the component */
  id?: string;
  /** CSS class names */
  className?: string;
  /** Test identifier */
  'data-testid'?: string;
  /** Whether the component is disabled */
  disabled?: boolean;
  /** Whether multiple files can be selected */
  multiple?: boolean;
  /** Whether to show upload progress */
  showProgress?: boolean;
  /** Whether to show file previews */
  showPreview?: boolean;
}

// File uploader component props
export interface FileUploaderProps extends BaseFileUploadProps {
  /** Validation options for uploaded files */
  validation?: FileValidationOptions;
  /** Compression options for image files */
  compression?: FileCompressionOptions;
  /** Preview generation options */
  preview?: FilePreviewOptions;
  /** Whether to automatically upload files when selected */
  autoUpload?: boolean;
  /** API endpoint for file upload */
  uploadEndpoint?: string;
  /** Maximum number of files allowed */
  maxFiles?: number;
  /** Accept attribute for file input */
  accept?: string;
  /** Placeholder text when no files are selected */
  placeholder?: ReactNode;
  /** Content to show in drop zone */
  dropZoneContent?: ReactNode;
  /** Content to show when dragging files over drop zone */
  dragOverContent?: ReactNode;
  /** Whether to show file list */
  showFileList?: boolean;
  /** Whether to show upload statistics */
  showStats?: boolean;
  /** Layout variant */
  variant?: 'default' | 'compact' | 'minimal' | 'card';
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Color theme */
  theme?: 'light' | 'dark' | 'auto';

  // Event handlers
  /** Called when files are selected */
  onFilesSelected?: (files: File[]) => void;
  /** Called when files are processed (validated, compressed, etc.) */
  onFilesProcessed?: (results: FileUploadResult[]) => void;
  /** Called when upload starts */
  onUploadStart?: (files: File[]) => void;
  /** Called when upload progress changes */
  onUploadProgress?: (progress: number, file: File) => void;
  /** Called when upload completes successfully */
  onUploadComplete?: (result: FileUploadResult) => void;
  /** Called when upload fails */
  onUploadError?: (error: string, file: File) => void;
  /** Called when file validation fails */
  onValidationError?: (errors: string[], file: File) => void;
  /** Called when files are removed */
  onFilesRemoved?: (removedFiles: File[]) => void;
  /** Called when all files are cleared */
  onClear?: () => void;
}

// File input component props
export interface FileInputProps extends BaseFileUploadProps {
  /** Input name attribute */
  name?: string;
  /** Input value */
  value?: string;
  /** Accept attribute */
  accept?: string;
  /** Whether input is required */
  required?: boolean;
  /** Form attribute */
  form?: string;
  /** Tab index */
  tabIndex?: number;
  /** Auto focus */
  autoFocus?: boolean;
  /** Input variant */
  variant?: 'default' | 'outline' | 'filled' | 'ghost';
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Error state */
  error?: boolean;
  /** Success state */
  success?: boolean;
  /** Label text */
  label?: ReactNode;
  /** Helper text */
  helperText?: ReactNode;
  /** Error message */
  errorMessage?: ReactNode;
  /** Icon to show in input */
  icon?: ReactNode;
  /** Button text */
  buttonText?: string;

  // Event handlers
  /** Called when files are selected */
  onChange?: (files: FileList | null) => void;
  /** Called when input is focused */
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  /** Called when input loses focus */
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  /** Called when input value changes */
  onInput?: (event: React.FormEvent<HTMLInputElement>) => void;
}

// File preview component props
export interface FilePreviewProps {
  /** File to preview */
  file: File;
  /** Preview URL */
  previewUrl?: string;
  /** Whether preview is loading */
  loading?: boolean;
  /** Error message if preview failed */
  error?: string;
  /** Size of the preview */
  size?: 'sm' | 'md' | 'lg' | number;
  /** Shape of the preview */
  shape?: 'square' | 'circle' | 'rounded';
  /** Whether to show file info */
  showInfo?: boolean;
  /** Whether to show remove button */
  showRemove?: boolean;
  /** Whether to show download button */
  showDownload?: boolean;
  /** Whether preview is selectable */
  selectable?: boolean;
  /** Whether preview is selected */
  selected?: boolean;
  /** Custom overlay content */
  overlay?: ReactNode;
  /** Alt text for images */
  alt?: string;
  /** CSS class names */
  className?: string;

  // Event handlers
  /** Called when preview is clicked */
  onClick?: (file: File) => void;
  /** Called when remove button is clicked */
  onRemove?: (file: File) => void;
  /** Called when download button is clicked */
  onDownload?: (file: File) => void;
  /** Called when preview selection changes */
  onSelectionChange?: (file: File, selected: boolean) => void;
}

// Upload button component props
export interface UploadButtonProps extends BaseFileUploadProps {
  /** Button text */
  children?: ReactNode;
  /** Button variant */
  variant?: 'solid' | 'outline' | 'ghost' | 'link';
  /** Color scheme */
  colorScheme?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  /** Size variant */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Whether button is loading */
  loading?: boolean;
  /** Loading text */
  loadingText?: string;
  /** Icon to show in button */
  icon?: ReactNode;
  /** Icon position */
  iconPosition?: 'left' | 'right';
  /** Button shape */
  shape?: 'square' | 'circle' | 'rounded';
  /** Whether button takes full width */
  fullWidth?: boolean;
  /** Accept attribute for file input */
  accept?: string;

  // Event handlers
  /** Called when files are selected */
  onFilesSelected?: (files: FileList | null) => void;
  /** Called when button is clicked */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

// Drag and drop zone props
export interface DropZoneProps extends BaseFileUploadProps {
  /** Content to show in drop zone */
  children?: ReactNode;
  /** Content to show when dragging over */
  dragOverContent?: ReactNode;
  /** Height of the drop zone */
  height?: string | number;
  /** Whether drop zone is active */
  active?: boolean;
  /** Whether files are being dragged over */
  dragOver?: boolean;
  /** Error state */
  error?: boolean;
  /** Success state */
  success?: boolean;
  /** Border style */
  borderStyle?: 'solid' | 'dashed' | 'dotted';
  /** Border radius */
  borderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /** Background pattern */
  pattern?: 'none' | 'dots' | 'grid' | 'diagonal';
  /** Accept attribute */
  accept?: string;

  // Event handlers
  /** Called when files are dropped */
  onDrop?: (files: FileList) => void;
  /** Called when drag enters the zone */
  onDragEnter?: (event: React.DragEvent) => void;
  /** Called when drag leaves the zone */
  onDragLeave?: (event: React.DragEvent) => void;
  /** Called when dragging over the zone */
  onDragOver?: (event: React.DragEvent) => void;
  /** Called when drop zone is clicked */
  onClick?: (event: React.MouseEvent) => void;
}

// File list component props
export interface FileListProps {
  /** Files to display */
  files: FileUploadResult[];
  /** Whether list is loading */
  loading?: boolean;
  /** Error message */
  error?: string;
  /** Whether to show previews */
  showPreviews?: boolean;
  /** Whether to show progress bars */
  showProgress?: boolean;
  /** Whether to show file details */
  showDetails?: boolean;
  /** Whether files can be removed */
  removable?: boolean;
  /** Whether files can be reordered */
  reorderable?: boolean;
  /** Layout variant */
  variant?: 'list' | 'grid' | 'compact';
  /** Maximum height of the list */
  maxHeight?: string | number;
  /** Empty state content */
  emptyContent?: ReactNode;
  /** CSS class names */
  className?: string;

  // Event handlers
  /** Called when file is removed */
  onRemove?: (index: number, file: File) => void;
  /** Called when files are reordered */
  onReorder?: (fromIndex: number, toIndex: number) => void;
  /** Called when file is clicked */
  onFileClick?: (file: FileUploadResult, index: number) => void;
  /** Called when retry upload is requested */
  onRetry?: (index: number, file: File) => void;
}

// Upload progress component props
export interface UploadProgressProps {
  /** Files being uploaded */
  files: FileUploadResult[];
  /** Overall upload progress (0-100) */
  progress?: number;
  /** Whether upload is in progress */
  uploading?: boolean;
  /** Whether upload is complete */
  complete?: boolean;
  /** Error message */
  error?: string;
  /** Whether to show individual file progress */
  showFileProgress?: boolean;
  /** Whether to show upload speed */
  showSpeed?: boolean;
  /** Whether to show estimated time */
  showTimeRemaining?: boolean;
  /** Whether progress can be cancelled */
  cancellable?: boolean;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Shape variant */
  shape?: 'rounded' | 'square';
  /** Color scheme */
  colorScheme?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  /** Animation type */
  animation?: 'none' | 'pulse' | 'bounce' | 'fade';
  /** CSS class names */
  className?: string;

  // Event handlers
  /** Called when upload is cancelled */
  onCancel?: () => void;
  /** Called when retry is requested */
  onRetry?: () => void;
}

// Gallery uploader props
export interface GalleryUploaderProps extends FileUploaderProps {
  /** Whether to show thumbnails */
  showThumbnails?: boolean;
  /** Thumbnail size */
  thumbnailSize?: number;
  /** Number of columns in grid */
  columns?: number;
  /** Gap between items */
  gap?: string | number;
  /** Maximum items to show */
  maxItems?: number;
  /** Whether items can be reordered */
  reorderable?: boolean;
  /** Whether to show lightbox on click */
  lightbox?: boolean;
  /** Aspect ratio for thumbnails */
  aspectRatio?: number;
  /** Crop mode for thumbnails */
  cropMode?: 'cover' | 'contain' | 'fill';

  // Event handlers
  /** Called when items are reordered */
  onItemsReorder?: (fromIndex: number, toIndex: number) => void;
  /** Called when item is clicked */
  onItemClick?: (file: FileUploadResult, index: number) => void;
}

// Document uploader props
export interface DocumentUploaderProps extends FileUploaderProps {
  /** Whether to show file icons */
  showIcons?: boolean;
  /** Whether to show file sizes */
  showSizes?: boolean;
  /** Whether to show file types */
  showTypes?: boolean;
  /** Whether to show upload dates */
  showDates?: boolean;
  /** Whether documents can be previewed */
  previewable?: boolean;
  /** Maximum file size display */
  maxSizeDisplay?: string;
  /** Document categories */
  categories?: string[];
  /** Default category */
  defaultCategory?: string;

  // Event handlers
  /** Called when document is previewed */
  onPreview?: (file: FileUploadResult) => void;
  /** Called when category changes */
  onCategoryChange?: (file: FileUploadResult, category: string) => void;
}

// File upload statistics props
export interface FileUploadStatsProps {
  /** Files being processed */
  files: FileUploadResult[];
  /** Whether to show total count */
  showCount?: boolean;
  /** Whether to show total size */
  showSize?: boolean;
  /** Whether to show file types breakdown */
  showTypes?: boolean;
  /** Whether to show upload speed */
  showSpeed?: boolean;
  /** Whether to show errors count */
  showErrors?: boolean;
  /** Layout variant */
  variant?: 'inline' | 'card' | 'minimal';
  /** CSS class names */
  className?: string;
}

// Export all types
export type {
  BaseFileUploadProps,
  FileUploaderProps,
  FileInputProps,
  FilePreviewProps,
  UploadButtonProps,
  DropZoneProps,
  FileListProps,
  UploadProgressProps,
  GalleryUploaderProps,
  DocumentUploaderProps,
  FileUploadStatsProps,
};
