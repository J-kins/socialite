import { ReactNode } from 'react';

/**
 * Drag and Drop Component Props Types
 *
 * Comprehensive type definitions for drag and drop components including
 * draggable items, drop zones, sortable lists, and file drop areas.
 */

// Base drag and drop props
export interface BaseDragDropProps {
  /** Unique identifier for the component */
  id?: string;
  /** CSS class names */
  className?: string;
  /** Test identifier */
  'data-testid'?: string;
  /** Whether drag and drop is disabled */
  disabled?: boolean;
  /** Loading state */
  loading?: boolean;
}

// Draggable item props
export interface DraggableProps extends BaseDragDropProps {
  /** Data to be transferred when dragging */
  data: any;
  /** Drag effect (copy, move, link, none) */
  dragEffect?: 'copy' | 'move' | 'link' | 'none';
  /** Whether to show custom drag preview */
  showPreview?: boolean;
  /** Custom drag preview element or function */
  preview?: HTMLElement | ((data: any) => HTMLElement) | false;
  /** Drag handle selector (if only specific area should be draggable) */
  handle?: string;
  /** Whether dragging is currently active */
  isDragging?: boolean;
  /** Children elements */
  children?: ReactNode;

  // Event handlers
  /** Called when drag starts */
  onDragStart?: (data: any, event: React.DragEvent) => void;
  /** Called during drag */
  onDrag?: (data: any, event: React.DragEvent) => void;
  /** Called when drag ends */
  onDragEnd?: (data: any, event: React.DragEvent) => void;
}

// Drop zone props
export interface DropZoneProps extends BaseDragDropProps {
  /** Data types that this drop zone accepts */
  accept?: string[];
  /** Drop effect to display */
  dropEffect?: 'copy' | 'move' | 'link' | 'none';
  /** Whether multiple items can be dropped */
  multiple?: boolean;
  /** Whether drop zone is currently active (being dragged over) */
  isActive?: boolean;
  /** Whether drop zone can accept current drag */
  canDrop?: boolean;
  /** Unique identifier for this drop zone */
  dropZoneId?: string;
  /** Content to show when not dragging */
  children?: ReactNode;
  /** Content to show when dragging over */
  activeContent?: ReactNode;
  /** Content to show when cannot drop */
  rejectContent?: ReactNode;
  /** Height of the drop zone */
  height?: string | number;
  /** Border style when active */
  activeBorderStyle?: 'solid' | 'dashed' | 'dotted';
  /** Background color when active */
  activeBackgroundColor?: string;
  /** Animation when items are dropped */
  dropAnimation?: 'none' | 'bounce' | 'fade' | 'scale';

  // Event handlers
  /** Called when drag enters the zone */
  onDragEnter?: (event: React.DragEvent) => void;
  /** Called when drag leaves the zone */
  onDragLeave?: (event: React.DragEvent) => void;
  /** Called when dragging over the zone */
  onDragOver?: (event: React.DragEvent) => void;
  /** Called when items are dropped */
  onDrop?: (data: any, dropZoneId?: string) => void;
  /** Called to validate if drop is allowed */
  onValidateDrop?: (data: any) => boolean;
}

// Sortable list props
export interface SortableListProps<T = any> extends BaseDragDropProps {
  /** Array of items to be sorted */
  items: T[];
  /** Function to extract unique key from item */
  keyExtractor: (item: T, index: number) => string;
  /** Function to render each item */
  renderItem: (item: T, index: number, isDragging: boolean) => ReactNode;
  /** Direction of the list */
  direction?: 'vertical' | 'horizontal';
  /** Whether sorting is enabled */
  sortable?: boolean;
  /** Animation duration for reordering */
  animationDuration?: number;
  /** Gap between items */
  gap?: string | number;
  /** Maximum number of items */
  maxItems?: number;
  /** Whether to show drag handles */
  showDragHandles?: boolean;
  /** Custom drag handle component */
  dragHandle?: ReactNode;
  /** Whether to show drop indicators */
  showDropIndicators?: boolean;
  /** Drop indicator style */
  dropIndicatorStyle?: 'line' | 'highlight' | 'space';

  // Event handlers
  /** Called when items are reordered */
  onReorder?: (fromIndex: number, toIndex: number) => void;
  /** Called when item drag starts */
  onItemDragStart?: (item: T, index: number) => void;
  /** Called when item drag ends */
  onItemDragEnd?: (item: T, index: number) => void;
  /** Called when item is clicked */
  onItemClick?: (item: T, index: number) => void;
  /** Called when item is double-clicked */
  onItemDoubleClick?: (item: T, index: number) => void;
}

// Sortable item props
export interface SortableItemProps<T = any> extends BaseDragDropProps {
  /** Item data */
  item: T;
  /** Item index in the list */
  index: number;
  /** Whether item is currently being dragged */
  isDragging?: boolean;
  /** Whether item is being dragged over */
  isDraggedOver?: boolean;
  /** Direction of sorting */
  direction?: 'vertical' | 'horizontal';
  /** Whether to show drag handle */
  showDragHandle?: boolean;
  /** Custom drag handle component */
  dragHandle?: ReactNode;
  /** Children content */
  children?: ReactNode;

  // Event handlers
  /** Called when item drag starts */
  onDragStart?: (item: T, index: number) => void;
  /** Called when item drag ends */
  onDragEnd?: (item: T, index: number) => void;
  /** Called when item is clicked */
  onClick?: (item: T, index: number) => void;
}

// File drop zone props
export interface FileDropZoneProps
  extends Omit<DropZoneProps, 'accept' | 'onDrop'> {
  /** Accepted file types (MIME types or extensions) */
  acceptedFileTypes?: string[];
  /** Maximum file size in bytes */
  maxFileSize?: number;
  /** Minimum file size in bytes */
  minFileSize?: number;
  /** Maximum number of files */
  maxFiles?: number;
  /** Whether to show file previews */
  showPreviews?: boolean;
  /** Whether to show upload progress */
  showProgress?: boolean;
  /** Whether to auto-upload files when dropped */
  autoUpload?: boolean;
  /** Upload endpoint URL */
  uploadUrl?: string;
  /** Custom upload headers */
  uploadHeaders?: Record<string, string>;
  /** Icon to show in drop zone */
  icon?: ReactNode;
  /** Title text */
  title?: string;
  /** Description text */
  description?: string;
  /** Browse button text */
  browseButtonText?: string;
  /** Error message for invalid files */
  errorMessage?: string;

  // Event handlers
  /** Called when files are dropped or selected */
  onFilesDrop?: (files: File[]) => void;
  /** Called when file validation fails */
  onValidationError?: (errors: string[], files: File[]) => void;
  /** Called when upload starts */
  onUploadStart?: (files: File[]) => void;
  /** Called when upload progresses */
  onUploadProgress?: (progress: number, file: File) => void;
  /** Called when upload completes */
  onUploadComplete?: (responses: any[], files: File[]) => void;
  /** Called when upload fails */
  onUploadError?: (error: string, file: File) => void;
}

// Drag overlay props
export interface DragOverlayProps extends BaseDragDropProps {
  /** Whether overlay is visible */
  visible?: boolean;
  /** Data being dragged */
  dragData?: any;
  /** Custom overlay content */
  children?: ReactNode;
  /** Overlay position */
  position?: { x: number; y: number };
  /** Overlay size */
  size?: { width: number; height: number };
  /** Overlay opacity */
  opacity?: number;
  /** Whether to follow cursor */
  followCursor?: boolean;
  /** Offset from cursor */
  cursorOffset?: { x: number; y: number };
  /** Animation type */
  animation?: 'none' | 'fade' | 'scale' | 'bounce';
  /** Z-index for overlay */
  zIndex?: number;
}

// Drag preview props
export interface DragPreviewProps extends BaseDragDropProps {
  /** Data being dragged */
  data: any;
  /** Preview content */
  children?: ReactNode;
  /** Whether to show item count (for multiple items) */
  showCount?: boolean;
  /** Item count */
  count?: number;
  /** Preview size */
  size?: 'sm' | 'md' | 'lg';
  /** Preview style */
  style?: 'card' | 'badge' | 'minimal';
  /** Whether to show shadow */
  showShadow?: boolean;
  /** Border radius */
  borderRadius?: string;
  /** Background color */
  backgroundColor?: string;
  /** Text color */
  textColor?: string;
}

// Droppable container props
export interface DroppableContainerProps extends BaseDragDropProps {
  /** Items in the container */
  items?: any[];
  /** Container layout */
  layout?: 'grid' | 'list' | 'flow';
  /** Number of columns (for grid layout) */
  columns?: number;
  /** Gap between items */
  gap?: string | number;
  /** Padding inside container */
  padding?: string | number;
  /** Whether container can accept drops */
  acceptsDrops?: boolean;
  /** Data types that container accepts */
  acceptedTypes?: string[];
  /** Whether to show drop indicators */
  showDropIndicators?: boolean;
  /** Empty state content */
  emptyContent?: ReactNode;
  /** Maximum number of items */
  maxItems?: number;
  /** Whether items can be reordered within container */
  allowReorder?: boolean;
  /** Children elements */
  children?: ReactNode;

  // Event handlers
  /** Called when items are added to container */
  onItemsAdd?: (items: any[], index?: number) => void;
  /** Called when items are removed from container */
  onItemsRemove?: (items: any[]) => void;
  /** Called when items are reordered within container */
  onItemsReorder?: (fromIndex: number, toIndex: number) => void;
  /** Called when container is cleared */
  onClear?: () => void;
}

// Drag context props
export interface DragContextProps {
  /** Children components */
  children: ReactNode;
  /** Global drag and drop options */
  options?: {
    /** Whether to enable keyboard navigation */
    enableKeyboardNavigation?: boolean;
    /** Whether to announce drag and drop actions to screen readers */
    announceToScreenReader?: boolean;
    /** Collision detection strategy */
    collisionDetection?:
      | 'closest-center'
      | 'closest-corners'
      | 'pointer-within'
      | 'rectangle-intersection';
    /** Auto-scroll options */
    autoScroll?: {
      enabled?: boolean;
      threshold?: number;
      speed?: number;
    };
  };

  // Event handlers
  /** Called when drag starts */
  onDragStart?: (event: any) => void;
  /** Called when drag ends */
  onDragEnd?: (event: any) => void;
  /** Called when drag is cancelled */
  onDragCancel?: () => void;
}

// Trash/delete drop zone props
export interface TrashDropZoneProps extends Omit<DropZoneProps, 'onDrop'> {
  /** Icon to show in trash zone */
  icon?: ReactNode;
  /** Confirmation message before deleting */
  confirmMessage?: string;
  /** Whether to show confirmation dialog */
  showConfirmation?: boolean;
  /** Animation when item is deleted */
  deleteAnimation?: 'none' | 'shrink' | 'fade' | 'slide';

  // Event handlers
  /** Called when items are dropped for deletion */
  onDelete?: (data: any) => void;
  /** Called when deletion is confirmed */
  onDeleteConfirm?: (data: any) => void;
  /** Called when deletion is cancelled */
  onDeleteCancel?: (data: any) => void;
}

// Reorder handle props
export interface ReorderHandleProps extends BaseDragDropProps {
  /** Handle icon */
  icon?: ReactNode;
  /** Handle size */
  size?: 'sm' | 'md' | 'lg';
  /** Handle position */
  position?: 'start' | 'end';
  /** Handle orientation */
  orientation?: 'vertical' | 'horizontal';
  /** Whether handle is active */
  isActive?: boolean;
  /** Cursor style when hovering */
  cursor?: string;

  // Event handlers
  /** Called when handle is pressed */
  onPress?: () => void;
  /** Called when handle is released */
  onRelease?: () => void;
}

// Export all types
export type {
  BaseDragDropProps,
  DraggableProps,
  DropZoneProps,
  SortableListProps,
  SortableItemProps,
  FileDropZoneProps,
  DragOverlayProps,
  DragPreviewProps,
  DroppableContainerProps,
  DragContextProps,
  TrashDropZoneProps,
  ReorderHandleProps,
};
