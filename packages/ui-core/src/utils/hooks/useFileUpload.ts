import { useState, useCallback, useRef, useEffect } from 'react';
import {
  validateFiles,
  processFiles,
  createDropHandler,
  FileValidationOptions,
  FileCompressionOptions,
  FilePreviewOptions,
  FileUploadResult,
  formatFileSize,
} from '../file-upload';

export interface UseFileUploadOptions {
  validation?: FileValidationOptions;
  compression?: FileCompressionOptions;
  preview?: FilePreviewOptions;
  autoUpload?: boolean;
  uploadEndpoint?: string;
  onUploadProgress?: (progress: number, file: File) => void;
  onUploadComplete?: (result: FileUploadResult) => void;
  onUploadError?: (error: string, file: File) => void;
  onValidationError?: (errors: string[], file: File) => void;
  multiple?: boolean;
  disabled?: boolean;
}

export interface UseFileUploadReturn {
  // State
  files: FileUploadResult[];
  isUploading: boolean;
  isDragOver: boolean;
  progress: Record<string, number>;
  errors: Record<string, string>;

  // Actions
  selectFiles: (fileList: FileList | File[]) => Promise<void>;
  removeFile: (index: number) => void;
  clearFiles: () => void;
  uploadFiles: () => Promise<void>;
  retryUpload: (index: number) => Promise<void>;

  // Drag and drop handlers
  dragHandlers: {
    onDragEnter: (e: React.DragEvent) => void;
    onDragLeave: (e: React.DragEvent) => void;
    onDragOver: (e: React.DragEvent) => void;
    onDrop: (e: React.DragEvent) => void;
  };

  // File input props
  inputProps: {
    type: 'file';
    multiple: boolean;
    disabled: boolean;
    accept: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  };

  // Utility functions
  getTotalSize: () => number;
  getFormattedTotalSize: () => string;
  hasErrors: () => boolean;
  canUpload: () => boolean;
}

/**
 * Comprehensive file upload hook with drag-and-drop, validation, compression, and upload functionality
 */
export const useFileUpload = (
  options: UseFileUploadOptions = {},
): UseFileUploadReturn => {
  const {
    validation = {},
    compression = {},
    preview = {},
    autoUpload = false,
    uploadEndpoint,
    onUploadProgress,
    onUploadComplete,
    onUploadError,
    onValidationError,
    multiple = true,
    disabled = false,
  } = options;

  // State
  const [files, setFiles] = useState<FileUploadResult[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Refs
  const dragCounterRef = useRef(0);
  const uploadAbortControllersRef = useRef<Record<string, AbortController>>({});

  /**
   * Processes and adds files to the upload queue
   */
  const selectFiles = useCallback(
    async (fileList: FileList | File[]) => {
      if (disabled) return;

      const fileArray = Array.from(fileList);

      // If not multiple, replace existing files
      if (!multiple && fileArray.length > 0) {
        setFiles([]);
        setErrors({});
        setProgress({});
      }

      // Validate files first
      const validationResult = validateFiles(fileArray, validation);

      if (!validationResult.isValid) {
        // Handle validation errors for each file
        validationResult.fileResults.forEach((result, index) => {
          if (!result.isValid) {
            const fileKey = `${result.file.name}-${index}`;
            setErrors(prev => ({
              ...prev,
              [fileKey]: result.errors.join('; '),
            }));
            onValidationError?.(result.errors, result.file);
          }
        });
        return;
      }

      try {
        // Process files (validation, compression, preview generation)
        const processedFiles = await processFiles(
          fileArray,
          validation,
          compression,
          preview,
        );

        setFiles(prev => {
          const newFiles = multiple
            ? [...prev, ...processedFiles]
            : processedFiles;
          return newFiles;
        });

        // Auto upload if enabled
        if (autoUpload && uploadEndpoint) {
          setTimeout(() => uploadFiles(), 100);
        }
      } catch (error) {
        console.error('Error processing files:', error);
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to process files';

        fileArray.forEach((file, index) => {
          const fileKey = `${file.name}-${index}`;
          setErrors(prev => ({
            ...prev,
            [fileKey]: errorMessage,
          }));
          onUploadError?.(errorMessage, file);
        });
      }
    },
    [
      disabled,
      multiple,
      validation,
      compression,
      preview,
      autoUpload,
      uploadEndpoint,
      onValidationError,
      onUploadError,
    ],
  );

  /**
   * Removes a file from the upload queue
   */
  const removeFile = useCallback((index: number) => {
    setFiles(prev => {
      const newFiles = [...prev];
      const removedFile = newFiles[index];

      if (removedFile) {
        const fileKey = `${removedFile.file.name}-${index}`;

        // Cancel upload if in progress
        const controller = uploadAbortControllersRef.current[fileKey];
        if (controller) {
          controller.abort();
          delete uploadAbortControllersRef.current[fileKey];
        }

        // Clean up state
        setProgress(prev => {
          const newProgress = { ...prev };
          delete newProgress[fileKey];
          return newProgress;
        });

        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[fileKey];
          return newErrors;
        });

        newFiles.splice(index, 1);
      }

      return newFiles;
    });
  }, []);

  /**
   * Clears all files from the upload queue
   */
  const clearFiles = useCallback(() => {
    // Cancel all uploads
    Object.values(uploadAbortControllersRef.current).forEach(controller => {
      controller.abort();
    });

    uploadAbortControllersRef.current = {};
    setFiles([]);
    setProgress({});
    setErrors({});
    setIsUploading(false);
  }, []);

  /**
   * Uploads all files to the server
   */
  const uploadFiles = useCallback(async () => {
    if (!uploadEndpoint || files.length === 0 || isUploading) return;

    setIsUploading(true);

    const uploadPromises = files.map(async (fileResult, index) => {
      const fileKey = `${fileResult.file.name}-${index}`;

      if (fileResult.error) {
        return; // Skip files with errors
      }

      try {
        const controller = new AbortController();
        uploadAbortControllersRef.current[fileKey] = controller;

        // Use compressed file if available, otherwise original
        const fileToUpload = fileResult.compressed || fileResult.file;

        const formData = new FormData();
        formData.append('file', fileToUpload);

        // Add metadata if available
        if (fileResult.metadata) {
          formData.append('metadata', JSON.stringify(fileResult.metadata));
        }

        const xhr = new XMLHttpRequest();

        // Track upload progress
        xhr.upload.addEventListener('progress', e => {
          if (e.lengthComputable) {
            const progressPercent = Math.round((e.loaded / e.total) * 100);
            setProgress(prev => ({
              ...prev,
              [fileKey]: progressPercent,
            }));
            onUploadProgress?.(progressPercent, fileResult.file);
          }
        });

        // Handle completion
        const uploadPromise = new Promise<void>((resolve, reject) => {
          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              setProgress(prev => ({
                ...prev,
                [fileKey]: 100,
              }));
              onUploadComplete?.(fileResult);
              resolve();
            } else {
              reject(new Error(`Upload failed with status ${xhr.status}`));
            }
          };

          xhr.onerror = () => {
            reject(new Error('Upload failed due to network error'));
          };

          xhr.onabort = () => {
            reject(new Error('Upload was cancelled'));
          };
        });

        // Start upload
        xhr.open('POST', uploadEndpoint);
        xhr.send(formData);

        // Handle abort signal
        controller.signal.addEventListener('abort', () => {
          xhr.abort();
        });

        await uploadPromise;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Upload failed';
        setErrors(prev => ({
          ...prev,
          [fileKey]: errorMessage,
        }));
        onUploadError?.(errorMessage, fileResult.file);
      } finally {
        delete uploadAbortControllersRef.current[fileKey];
      }
    });

    await Promise.allSettled(uploadPromises);
    setIsUploading(false);
  }, [
    uploadEndpoint,
    files,
    isUploading,
    onUploadProgress,
    onUploadComplete,
    onUploadError,
  ]);

  /**
   * Retries upload for a specific file
   */
  const retryUpload = useCallback(
    async (index: number) => {
      const fileResult = files[index];
      if (!fileResult || !uploadEndpoint) return;

      const fileKey = `${fileResult.file.name}-${index}`;

      // Clear previous error
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fileKey];
        return newErrors;
      });

      // Reset progress
      setProgress(prev => ({
        ...prev,
        [fileKey]: 0,
      }));

      // Upload single file
      try {
        const controller = new AbortController();
        uploadAbortControllersRef.current[fileKey] = controller;

        const fileToUpload = fileResult.compressed || fileResult.file;
        const formData = new FormData();
        formData.append('file', fileToUpload);

        if (fileResult.metadata) {
          formData.append('metadata', JSON.stringify(fileResult.metadata));
        }

        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener('progress', e => {
          if (e.lengthComputable) {
            const progressPercent = Math.round((e.loaded / e.total) * 100);
            setProgress(prev => ({
              ...prev,
              [fileKey]: progressPercent,
            }));
            onUploadProgress?.(progressPercent, fileResult.file);
          }
        });

        const uploadPromise = new Promise<void>((resolve, reject) => {
          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              setProgress(prev => ({
                ...prev,
                [fileKey]: 100,
              }));
              onUploadComplete?.(fileResult);
              resolve();
            } else {
              reject(new Error(`Upload failed with status ${xhr.status}`));
            }
          };

          xhr.onerror = () => {
            reject(new Error('Upload failed due to network error'));
          };

          xhr.onabort = () => {
            reject(new Error('Upload was cancelled'));
          };
        });

        xhr.open('POST', uploadEndpoint);
        xhr.send(formData);

        controller.signal.addEventListener('abort', () => {
          xhr.abort();
        });

        await uploadPromise;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Upload failed';
        setErrors(prev => ({
          ...prev,
          [fileKey]: errorMessage,
        }));
        onUploadError?.(errorMessage, fileResult.file);
      } finally {
        delete uploadAbortControllersRef.current[fileKey];
      }
    },
    [files, uploadEndpoint, onUploadProgress, onUploadComplete, onUploadError],
  );

  /**
   * Drag and drop handlers
   */
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    dragCounterRef.current++;
    if (dragCounterRef.current === 1) {
      setIsDragOver(true);
    }
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    dragCounterRef.current--;
    if (dragCounterRef.current === 0) {
      setIsDragOver(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      dragCounterRef.current = 0;
      setIsDragOver(false);

      if (disabled) return;

      const droppedFiles = Array.from(e.dataTransfer.files);
      if (droppedFiles.length > 0) {
        selectFiles(droppedFiles);
      }
    },
    [disabled, selectFiles],
  );

  /**
   * File input change handler
   */
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = e.target.files;
      if (selectedFiles && selectedFiles.length > 0) {
        selectFiles(selectedFiles);
      }
      // Reset input value to allow selecting the same file again
      e.target.value = '';
    },
    [selectFiles],
  );

  /**
   * Utility functions
   */
  const getTotalSize = useCallback(() => {
    return files.reduce((total, fileResult) => total + fileResult.file.size, 0);
  }, [files]);

  const getFormattedTotalSize = useCallback(() => {
    return formatFileSize(getTotalSize());
  }, [getTotalSize]);

  const hasErrors = useCallback(() => {
    return Object.keys(errors).length > 0 || files.some(f => f.error);
  }, [errors, files]);

  const canUpload = useCallback(() => {
    return files.length > 0 && !hasErrors() && !isUploading && !!uploadEndpoint;
  }, [files.length, hasErrors, isUploading, uploadEndpoint]);

  // Generate accept string for file input
  const acceptString = validation.allowedTypes?.join(',') || '';

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      Object.values(uploadAbortControllersRef.current).forEach(controller => {
        controller.abort();
      });
    };
  }, []);

  return {
    // State
    files,
    isUploading,
    isDragOver,
    progress,
    errors,

    // Actions
    selectFiles,
    removeFile,
    clearFiles,
    uploadFiles,
    retryUpload,

    // Drag and drop handlers
    dragHandlers: {
      onDragEnter: handleDragEnter,
      onDragLeave: handleDragLeave,
      onDragOver: handleDragOver,
      onDrop: handleDrop,
    },

    // File input props
    inputProps: {
      type: 'file' as const,
      multiple,
      disabled,
      accept: acceptString,
      onChange: handleInputChange,
    },

    // Utility functions
    getTotalSize,
    getFormattedTotalSize,
    hasErrors,
    canUpload,
  };
};

export default useFileUpload;
