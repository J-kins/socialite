import { useState, useCallback, useRef, useEffect } from 'react';

export interface DragDropOptions {
  onDragStart?: (event: React.DragEvent, data: any) => void;
  onDragEnd?: (event: React.DragEvent, data: any) => void;
  onDrop?: (data: any, dropZone?: string) => void;
  onDragEnter?: (event: React.DragEvent) => void;
  onDragLeave?: (event: React.DragEvent) => void;
  onDragOver?: (event: React.DragEvent) => void;
  accept?: string[]; // MIME types or data types to accept
  dropEffect?: 'copy' | 'move' | 'link' | 'none';
  dragEffect?: 'copy' | 'move' | 'link' | 'none';
  disabled?: boolean;
  multiple?: boolean;
  preview?: boolean | HTMLElement | ((data: any) => HTMLElement);
}

export interface DragDropState {
  isDragging: boolean;
  isDragOver: boolean;
  canDrop: boolean;
  dragData: any;
  dropZone: string | null;
}

export interface DragDropHandlers {
  // Draggable element handlers
  onDragStart: (event: React.DragEvent) => void;
  onDrag: (event: React.DragEvent) => void;
  onDragEnd: (event: React.DragEvent) => void;

  // Drop zone handlers
  onDragEnter: (event: React.DragEvent) => void;
  onDragLeave: (event: React.DragEvent) => void;
  onDragOver: (event: React.DragEvent) => void;
  onDrop: (event: React.DragEvent) => void;
}

export interface UseDragDropReturn {
  // State
  state: DragDropState;

  // Methods
  startDrag: (data: any) => void;
  endDrag: () => void;
  setDropZone: (zone: string | null) => void;

  // Event handlers
  dragHandlers: DragDropHandlers;

  // Helper functions
  getDragProps: (data: any) => {
    draggable: true;
    onDragStart: (event: React.DragEvent) => void;
    onDrag: (event: React.DragEvent) => void;
    onDragEnd: (event: React.DragEvent) => void;
  };

  getDropProps: (dropZone?: string) => {
    onDragEnter: (event: React.DragEvent) => void;
    onDragLeave: (event: React.DragEvent) => void;
    onDragOver: (event: React.DragEvent) => void;
    onDrop: (event: React.DragEvent) => void;
  };
}

/**
 * Comprehensive drag and drop hook for React components
 */
export const useDragDrop = (
  options: DragDropOptions = {},
): UseDragDropReturn => {
  const {
    onDragStart,
    onDragEnd,
    onDrop,
    onDragEnter,
    onDragLeave,
    onDragOver,
    accept = [],
    dropEffect = 'move',
    dragEffect = 'move',
    disabled = false,
    multiple = false,
    preview = true,
  } = options;

  // State
  const [state, setState] = useState<DragDropState>({
    isDragging: false,
    isDragOver: false,
    canDrop: false,
    dragData: null,
    dropZone: null,
  });

  // Refs
  const dragDataRef = useRef<any>(null);
  const dragCounterRef = useRef(0);
  const previewElementRef = useRef<HTMLElement | null>(null);

  /**
   * Checks if the dragged data type is accepted
   */
  const isAcceptedType = useCallback(
    (dataTransfer: DataTransfer): boolean => {
      if (accept.length === 0) return true;

      const types = Array.from(dataTransfer.types);
      return accept.some(
        acceptedType =>
          types.includes(acceptedType) ||
          types.some(type => type.startsWith(acceptedType)),
      );
    },
    [accept],
  );

  /**
   * Creates a custom drag preview
   */
  const createDragPreview = useCallback(
    (data: any): HTMLElement | null => {
      if (preview === false) return null;

      if (preview === true) {
        // Create default preview
        const element = document.createElement('div');
        element.className = 'drag-preview';
        element.style.cssText = `
        padding: 8px 12px;
        background: #3b82f6;
        color: white;
        border-radius: 6px;
        font-size: 14px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        pointer-events: none;
        position: absolute;
        top: -1000px;
        left: -1000px;
        z-index: 1000;
      `;
        element.textContent = typeof data === 'string' ? data : 'Dragging...';
        return element;
      }

      if (preview instanceof HTMLElement) {
        return preview.cloneNode(true) as HTMLElement;
      }

      if (typeof preview === 'function') {
        return preview(data);
      }

      return null;
    },
    [preview],
  );

  /**
   * Starts a drag operation
   */
  const startDrag = useCallback(
    (data: any) => {
      if (disabled) return;

      dragDataRef.current = data;
      setState(prev => ({
        ...prev,
        isDragging: true,
        dragData: data,
      }));
    },
    [disabled],
  );

  /**
   * Ends a drag operation
   */
  const endDrag = useCallback(() => {
    dragDataRef.current = null;
    setState(prev => ({
      ...prev,
      isDragging: false,
      isDragOver: false,
      canDrop: false,
      dragData: null,
      dropZone: null,
    }));

    // Clean up preview element
    if (previewElementRef.current && previewElementRef.current.parentNode) {
      previewElementRef.current.parentNode.removeChild(
        previewElementRef.current,
      );
      previewElementRef.current = null;
    }
  }, []);

  /**
   * Sets the current drop zone
   */
  const setDropZone = useCallback((zone: string | null) => {
    setState(prev => ({
      ...prev,
      dropZone: zone,
    }));
  }, []);

  /**
   * Drag start handler
   */
  const handleDragStart = useCallback(
    (event: React.DragEvent, data?: any) => {
      if (disabled) {
        event.preventDefault();
        return;
      }

      const dragData = data || dragDataRef.current;

      // Set drag effect
      event.dataTransfer.effectAllowed = dragEffect;

      // Set drag data
      if (typeof dragData === 'string') {
        event.dataTransfer.setData('text/plain', dragData);
      } else {
        event.dataTransfer.setData(
          'application/json',
          JSON.stringify(dragData),
        );
      }

      // Create custom preview
      const previewElement = createDragPreview(dragData);
      if (previewElement) {
        document.body.appendChild(previewElement);
        previewElementRef.current = previewElement;
        event.dataTransfer.setDragImage(previewElement, 0, 0);
      }

      startDrag(dragData);
      onDragStart?.(event, dragData);
    },
    [disabled, dragEffect, createDragPreview, startDrag, onDragStart],
  );

  /**
   * Drag handler
   */
  const handleDrag = useCallback((event: React.DragEvent) => {
    // Update preview position if custom preview is used
    if (previewElementRef.current) {
      previewElementRef.current.style.left = `${event.clientX + 10}px`;
      previewElementRef.current.style.top = `${event.clientY + 10}px`;
    }
  }, []);

  /**
   * Drag end handler
   */
  const handleDragEnd = useCallback(
    (event: React.DragEvent) => {
      const dragData = dragDataRef.current;
      endDrag();
      onDragEnd?.(event, dragData);
    },
    [endDrag, onDragEnd],
  );

  /**
   * Drag enter handler
   */
  const handleDragEnter = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      event.stopPropagation();

      dragCounterRef.current++;

      if (dragCounterRef.current === 1) {
        const canDrop = !disabled && isAcceptedType(event.dataTransfer);

        setState(prev => ({
          ...prev,
          isDragOver: true,
          canDrop,
        }));

        if (canDrop) {
          event.dataTransfer.dropEffect = dropEffect;
        }

        onDragEnter?.(event);
      }
    },
    [disabled, isAcceptedType, dropEffect, onDragEnter],
  );

  /**
   * Drag leave handler
   */
  const handleDragLeave = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      event.stopPropagation();

      dragCounterRef.current--;

      if (dragCounterRef.current === 0) {
        setState(prev => ({
          ...prev,
          isDragOver: false,
          canDrop: false,
        }));

        onDragLeave?.(event);
      }
    },
    [onDragLeave],
  );

  /**
   * Drag over handler
   */
  const handleDragOver = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      event.stopPropagation();

      if (!disabled && isAcceptedType(event.dataTransfer)) {
        event.dataTransfer.dropEffect = dropEffect;
        onDragOver?.(event);
      }
    },
    [disabled, isAcceptedType, dropEffect, onDragOver],
  );

  /**
   * Drop handler
   */
  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      event.stopPropagation();

      dragCounterRef.current = 0;

      if (disabled || !isAcceptedType(event.dataTransfer)) {
        setState(prev => ({
          ...prev,
          isDragOver: false,
          canDrop: false,
        }));
        return;
      }

      // Extract dropped data
      let droppedData: any = null;

      // Try to get JSON data first
      try {
        const jsonData = event.dataTransfer.getData('application/json');
        if (jsonData) {
          droppedData = JSON.parse(jsonData);
        }
      } catch (error) {
        // Fallback to text data
        droppedData = event.dataTransfer.getData('text/plain');
      }

      // Handle file drops
      if (event.dataTransfer.files.length > 0) {
        const files = Array.from(event.dataTransfer.files);
        droppedData = multiple ? files : files[0];
      }

      setState(prev => ({
        ...prev,
        isDragOver: false,
        canDrop: false,
      }));

      onDrop?.(droppedData, state.dropZone);
    },
    [disabled, isAcceptedType, multiple, state.dropZone, onDrop],
  );

  /**
   * Get props for draggable elements
   */
  const getDragProps = useCallback(
    (data: any) => ({
      draggable: true,
      onDragStart: (event: React.DragEvent) => handleDragStart(event, data),
      onDrag: handleDrag,
      onDragEnd: handleDragEnd,
    }),
    [handleDragStart, handleDrag, handleDragEnd],
  );

  /**
   * Get props for drop zones
   */
  const getDropProps = useCallback(
    (dropZone?: string) => {
      const handleDropWithZone = (event: React.DragEvent) => {
        setDropZone(dropZone || null);
        handleDrop(event);
      };

      return {
        onDragEnter: handleDragEnter,
        onDragLeave: handleDragLeave,
        onDragOver: handleDragOver,
        onDrop: handleDropWithZone,
      };
    },
    [handleDragEnter, handleDragLeave, handleDragOver, handleDrop, setDropZone],
  );

  // Drag handlers object
  const dragHandlers: DragDropHandlers = {
    onDragStart: (event: React.DragEvent) => handleDragStart(event),
    onDrag: handleDrag,
    onDragEnd: handleDragEnd,
    onDragEnter: handleDragEnter,
    onDragLeave: handleDragLeave,
    onDragOver: handleDragOver,
    onDrop: handleDrop,
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (previewElementRef.current && previewElementRef.current.parentNode) {
        previewElementRef.current.parentNode.removeChild(
          previewElementRef.current,
        );
      }
    };
  }, []);

  return {
    state,
    startDrag,
    endDrag,
    setDropZone,
    dragHandlers,
    getDragProps,
    getDropProps,
  };
};

/**
 * Hook for file drop functionality
 */
export const useFileDrop = (
  onDrop: (files: File[]) => void,
  options: {
    accept?: string[];
    multiple?: boolean;
    disabled?: boolean;
    onDragEnter?: () => void;
    onDragLeave?: () => void;
    onError?: (error: string) => void;
  } = {},
) => {
  const {
    accept = [],
    multiple = true,
    disabled = false,
    onDragEnter,
    onDragLeave,
    onError,
  } = options;

  const validateFiles = useCallback(
    (files: File[]): File[] => {
      if (!multiple && files.length > 1) {
        onError?.('Only one file is allowed');
        return [files[0]];
      }

      if (accept.length > 0) {
        const validFiles = files.filter(file =>
          accept.some(
            type =>
              file.type.startsWith(type.replace('*', '')) || file.type === type,
          ),
        );

        if (validFiles.length !== files.length) {
          onError?.('Some files have invalid types');
        }

        return validFiles;
      }

      return files;
    },
    [accept, multiple, onError],
  );

  const { state, getDropProps } = useDragDrop({
    accept: accept.length > 0 ? accept : ['*'],
    disabled,
    onDragEnter,
    onDragLeave,
    onDrop: data => {
      if (data instanceof File) {
        const validFiles = validateFiles([data]);
        if (validFiles.length > 0) {
          onDrop(validFiles);
        }
      } else if (
        Array.isArray(data) &&
        data.every(item => item instanceof File)
      ) {
        const validFiles = validateFiles(data);
        if (validFiles.length > 0) {
          onDrop(validFiles);
        }
      }
    },
  });

  return {
    isDragOver: state.isDragOver,
    canDrop: state.canDrop,
    dropProps: getDropProps(),
  };
};

/**
 * Hook for sortable lists with drag and drop
 */
export const useSortable = <T>(
  items: T[],
  onReorder: (fromIndex: number, toIndex: number) => void,
  options: {
    disabled?: boolean;
    keyExtractor?: (item: T, index: number) => string;
    preview?: boolean | ((item: T) => HTMLElement);
  } = {},
) => {
  const { disabled = false, keyExtractor, preview = true } = options;
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [targetIndex, setTargetIndex] = useState<number | null>(null);

  const { getDragProps, getDropProps, state } = useDragDrop({
    disabled,
    preview,
    onDragStart: (_, data) => {
      setDraggedIndex(data.index);
    },
    onDragEnd: () => {
      if (
        draggedIndex !== null &&
        targetIndex !== null &&
        draggedIndex !== targetIndex
      ) {
        onReorder(draggedIndex, targetIndex);
      }
      setDraggedIndex(null);
      setTargetIndex(null);
    },
  });

  const getSortableItemProps = useCallback(
    (item: T, index: number) => {
      const key = keyExtractor ? keyExtractor(item, index) : index.toString();

      return {
        key,
        ...getDragProps({ item, index }),
        ...getDropProps(),
        onDragEnter: () => {
          setTargetIndex(index);
        },
        style: {
          opacity: draggedIndex === index ? 0.5 : 1,
          transform:
            draggedIndex !== null &&
            index > draggedIndex &&
            index <= (targetIndex || -1)
              ? 'translateY(-100%)'
              : draggedIndex !== null &&
                  index < draggedIndex &&
                  index >= (targetIndex || Infinity)
                ? 'translateY(100%)'
                : 'translateY(0)',
          transition: 'all 0.2s ease',
        },
      };
    },
    [getDragProps, getDropProps, draggedIndex, targetIndex, keyExtractor],
  );

  return {
    getSortableItemProps,
    isDragging: state.isDragging,
    draggedIndex,
    targetIndex,
  };
};

export default useDragDrop;
