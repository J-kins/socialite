import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '../atoms/Button';
import { Icon } from '../atoms/Icon';
import { Badge } from '../atoms/Badge';
import { LoadingSpinner } from '../atoms/LoadingSpinner';

export interface UploadedFile {
  id: string;
  file: File;
  preview: string;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
  metadata?: {
    width?: number;
    height?: number;
    size: number;
    type: string;
    name: string;
  };
}

export interface GalleryUploaderProps {
  /**
   * Upload settings
   */
  multiple?: boolean;
  maxFiles?: number;
  maxFileSize?: number; // in bytes
  acceptedFileTypes?: string[];
  /**
   * Upload behavior
   */
  autoUpload?: boolean;
  uploadUrl?: string;
  uploadMethod?: 'POST' | 'PUT';
  uploadHeaders?: Record<string, string>;
  /**
   * Validation
   */
  validateFile?: (file: File) => string | null;
  validateDimensions?: (width: number, height: number) => string | null;
  /**
   * UI customization
   */
  variant?: 'default' | 'compact' | 'grid' | 'list';
  showPreviews?: boolean;
  showProgress?: boolean;
  showFileInfo?: boolean;
  dragAndDrop?: boolean;
  /**
   * Grid layout
   */
  gridColumns?: number;
  thumbnailSize?: 'sm' | 'md' | 'lg';
  /**
   * Event handlers
   */
  onFilesSelect?: (files: File[]) => void;
  onFileUpload?: (file: UploadedFile) => void;
  onFileRemove?: (fileId: string) => void;
  onUploadProgress?: (fileId: string, progress: number) => void;
  onUploadComplete?: (files: UploadedFile[]) => void;
  onUploadError?: (fileId: string, error: string) => void;
  /**
   * Custom upload function
   */
  customUpload?: (file: File, onProgress: (progress: number) => void) => Promise<any>;
  /**
   * Accessibility
   */
  ariaLabel?: string;
  /**
   * Initial files
   */
  initialFiles?: UploadedFile[];
  /**
   * Customization
   */
  className?: string;
}

export const GalleryUploader: React.FC<GalleryUploaderProps> = ({
  multiple = true,
  maxFiles = 10,
  maxFileSize = 10 * 1024 * 1024, // 10MB
  acceptedFileTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  autoUpload = false,
  uploadUrl,
  uploadMethod = 'POST',
  uploadHeaders = {},
  validateFile,
  validateDimensions,
  variant = 'default',
  showPreviews = true,
  showProgress = true,
  showFileInfo = true,
  dragAndDrop = true,
  gridColumns = 3,
  thumbnailSize = 'md',
  onFilesSelect,
  onFileUpload,
  onFileRemove,
  onUploadProgress,
  onUploadComplete,
  onUploadError,
  customUpload,
  ariaLabel = 'Gallery file uploader',
  initialFiles = [],
  className = '',
}) => {
  const [files, setFiles] = useState<UploadedFile[]>(initialFiles);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [globalProgress, setGlobalProgress] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  // Calculate global progress
  useEffect(() => {
    if (files.length === 0) {
      setGlobalProgress(0);
      return;
    }

    const totalProgress = files.reduce((sum, file) => sum + file.progress, 0);
    const averageProgress = totalProgress / files.length;
    setGlobalProgress(averageProgress);

    // Check if all uploads are complete
    const allComplete = files.every(
      (file) => file.status === 'completed' || file.status === 'error'
    );

    if (allComplete && isUploading) {
      setIsUploading(false);
      onUploadComplete?.(files.filter((f) => f.status === 'completed'));
    }
  }, [files, isUploading, onUploadComplete]);

  // Validate file
  const validateFileInternal = useCallback(
    async (file: File): Promise<string | null> => {
      // Check file type
      if (!acceptedFileTypes.includes(file.type)) {
        return `File type ${file.type} is not supported`;
      }

      // Check file size
      if (file.size > maxFileSize) {
        return `File size must be less than ${Math.round(maxFileSize / 1024 / 1024)}MB`;
      }

      // Custom validation
      if (validateFile) {
        const customError = validateFile(file);
        if (customError) return customError;
      }

      // Validate image dimensions if it's an image
      if (file.type.startsWith('image/') && validateDimensions) {
        return new Promise((resolve) => {
          const img = new Image();
          img.onload = () => {
            const error = validateDimensions(img.width, img.height);
            resolve(error);
          };
          img.onerror = () => resolve('Invalid image file');
          img.src = URL.createObjectURL(file);
        });
      }

      return null;
    },
    [acceptedFileTypes, maxFileSize, validateFile, validateDimensions]
  );

  // Create file preview
  const createPreview = useCallback((file: File): Promise<string> => {
    return new Promise((resolve) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(file);
      } else {
        resolve(''); // No preview for non-images
      }
    });
  }, []);

  // Get image metadata
  const getImageMetadata = useCallback((file: File): Promise<{ width: number; height: number }> => {
    return new Promise((resolve) => {
      if (file.type.startsWith('image/')) {
        const img = new Image();
        img.onload = () => resolve({ width: img.width, height: img.height });
        img.onerror = () => resolve({ width: 0, height: 0 });
        img.src = URL.createObjectURL(file);
      } else {
        resolve({ width: 0, height: 0 });
      }
    });
  }, []);

  // Process selected files
  const processFiles = useCallback(
    async (fileList: FileList | File[]) => {
      const filesArray = Array.from(fileList);

      // Check max files limit
      if (files.length + filesArray.length > maxFiles) {
        alert(`Maximum ${maxFiles} files allowed`);
        return;
      }

      const newFiles: UploadedFile[] = [];

      for (const file of filesArray) {
        const error = await validateFileInternal(file);
        if (error) {
          alert(`Error with file ${file.name}: ${error}`);
          continue;
        }

        const preview = await createPreview(file);
        const dimensions = await getImageMetadata(file);

        const uploadedFile: UploadedFile = {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          file,
          preview,
          progress: 0,
          status: 'pending',
          metadata: {
            width: dimensions.width,
            height: dimensions.height,
            size: file.size,
            type: file.type,
            name: file.name,
          },
        };

        newFiles.push(uploadedFile);
      }

      setFiles((prev) => [...prev, ...newFiles]);
      onFilesSelect?.(newFiles.map((f) => f.file));

      if (autoUpload && newFiles.length > 0) {
        uploadFiles(newFiles.map((f) => f.id));
      }
    },
    [
      files.length,
      maxFiles,
      validateFileInternal,
      createPreview,
      getImageMetadata,
      onFilesSelect,
      autoUpload,
    ]
  );

  // Handle file input change
  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files) {
        processFiles(files);
      }
    },
    [processFiles]
  );

  // Handle drag and drop
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        processFiles(files);
      }
    },
    [processFiles]
  );

  // Upload files
  const uploadFiles = useCallback(
    async (fileIds?: string[]) => {
      const filesToUpload = fileIds
        ? files.filter((f) => fileIds.includes(f.id) && f.status === 'pending')
        : files.filter((f) => f.status === 'pending');

      if (filesToUpload.length === 0) return;

      setIsUploading(true);

      // Update status to uploading
      setFiles((prev) =>
        prev.map((file) =>
          filesToUpload.some((f) => f.id === file.id)
            ? { ...file, status: 'uploading' as const }
            : file
        )
      );

      for (const fileData of filesToUpload) {
        try {
          if (customUpload) {
            // Use custom upload function
            await customUpload(fileData.file, (progress) => {
              setFiles((prev) => prev.map((f) => (f.id === fileData.id ? { ...f, progress } : f)));
              onUploadProgress?.(fileData.id, progress);
            });
          } else if (uploadUrl) {
            // Use default upload
            await uploadFile(fileData);
          }

          // Mark as completed
          setFiles((prev) =>
            prev.map((f) =>
              f.id === fileData.id ? { ...f, status: 'completed', progress: 100 } : f
            )
          );

          onFileUpload?.(fileData);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Upload failed';

          setFiles((prev) =>
            prev.map((f) =>
              f.id === fileData.id ? { ...f, status: 'error', error: errorMessage } : f
            )
          );

          onUploadError?.(fileData.id, errorMessage);
        }
      }
    },
    [files, customUpload, uploadUrl, onUploadProgress, onFileUpload, onUploadError]
  );

  // Default upload implementation
  const uploadFile = useCallback(
    async (fileData: UploadedFile) => {
      if (!uploadUrl) throw new Error('Upload URL not provided');

      const formData = new FormData();
      formData.append('file', fileData.file);

      const xhr = new XMLHttpRequest();

      return new Promise((resolve, reject) => {
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const progress = Math.round((e.loaded / e.total) * 100);
            setFiles((prev) => prev.map((f) => (f.id === fileData.id ? { ...f, progress } : f)));
            onUploadProgress?.(fileData.id, progress);
          }
        });

        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(xhr.response);
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        });

        xhr.addEventListener('error', () => {
          reject(new Error('Upload failed'));
        });

        xhr.open(uploadMethod, uploadUrl);

        // Set headers
        Object.entries(uploadHeaders).forEach(([key, value]) => {
          xhr.setRequestHeader(key, value);
        });

        xhr.send(formData);
      });
    },
    [uploadUrl, uploadMethod, uploadHeaders, onUploadProgress]
  );

  // Remove file
  const removeFile = useCallback(
    (fileId: string) => {
      setFiles((prev) => prev.filter((f) => f.id !== fileId));
      onFileRemove?.(fileId);
    },
    [onFileRemove]
  );

  // Trigger file selection
  const triggerFileSelect = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  // Format file size
  const formatFileSize = useCallback((bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }, []);

  // Render file item
  const renderFileItem = useCallback(
    (file: UploadedFile) => {
      const itemClasses = [
        'gallery-uploader__item',
        `gallery-uploader__item--${file.status}`,
        variant === 'grid' && 'gallery-uploader__item--grid',
        variant === 'list' && 'gallery-uploader__item--list',
      ]
        .filter(Boolean)
        .join(' ');

      return (
        <div key={file.id} className={itemClasses}>
          {/* Preview */}
          {showPreviews && file.preview && (
            <div className="gallery-uploader__preview">
              <img src={file.preview} alt={file.metadata?.name} />

              {file.status === 'uploading' && (
                <div className="gallery-uploader__uploading-overlay">
                  <LoadingSpinner size="sm" />
                </div>
              )}

              {file.status === 'completed' && (
                <div className="gallery-uploader__status-overlay">
                  <Icon name="check-circle" size="md" className="gallery-uploader__success-icon" />
                </div>
              )}

              {file.status === 'error' && (
                <div className="gallery-uploader__status-overlay">
                  <Icon name="alert-circle" size="md" className="gallery-uploader__error-icon" />
                </div>
              )}
            </div>
          )}

          {/* File Info */}
          {showFileInfo && (
            <div className="gallery-uploader__info">
              <div className="gallery-uploader__name" title={file.metadata?.name}>
                {file.metadata?.name}
              </div>

              <div className="gallery-uploader__meta">
                <span className="gallery-uploader__size">
                  {file.metadata && formatFileSize(file.metadata.size)}
                </span>

                {file.metadata?.width && file.metadata?.height && (
                  <span className="gallery-uploader__dimensions">
                    {file.metadata.width} × {file.metadata.height}
                  </span>
                )}
              </div>

              {file.error && <div className="gallery-uploader__error">{file.error}</div>}
            </div>
          )}

          {/* Progress */}
          {showProgress && file.status === 'uploading' && (
            <div className="gallery-uploader__progress">
              <div
                className="gallery-uploader__progress-bar"
                style={{ width: `${file.progress}%` }}
              />
            </div>
          )}

          {/* Actions */}
          <div className="gallery-uploader__actions">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeFile(file.id)}
              className="gallery-uploader__remove"
              aria-label="Remove file"
            >
              <Icon name="close" size="sm" />
            </Button>
          </div>
        </div>
      );
    },
    [showPreviews, showFileInfo, showProgress, formatFileSize, removeFile, variant]
  );

  const containerClasses = [
    'gallery-uploader',
    `gallery-uploader--${variant}`,
    `gallery-uploader--thumb-${thumbnailSize}`,
    isDragOver && 'gallery-uploader--drag-over',
    isUploading && 'gallery-uploader--uploading',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={containerClasses} aria-label={ariaLabel}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple={multiple}
        accept={acceptedFileTypes.join(',')}
        onChange={handleFileInputChange}
        style={{ display: 'none' }}
      />

      {/* Drop zone */}
      {dragAndDrop && (
        <div
          ref={dropZoneRef}
          className="gallery-uploader__dropzone"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={triggerFileSelect}
          role="button"
          tabIndex={0}
          aria-label="Click to select files or drag and drop"
        >
          <Icon name="upload" size="xl" className="gallery-uploader__dropzone-icon" />
          <h3 className="gallery-uploader__dropzone-title">Drag and drop images here</h3>
          <p className="gallery-uploader__dropzone-subtitle">or click to select files</p>
          <div className="gallery-uploader__dropzone-info">
            <p>Supports: {acceptedFileTypes.map((type) => type.split('/')[1]).join(', ')}</p>
            <p>Max size: {Math.round(maxFileSize / 1024 / 1024)}MB per file</p>
            <p>Max files: {maxFiles}</p>
          </div>
        </div>
      )}

      {/* Files grid/list */}
      {files.length > 0 && (
        <div className="gallery-uploader__files">
          {/* Header with controls */}
          <div className="gallery-uploader__header">
            <div className="gallery-uploader__file-count">
              <Badge variant="secondary" count={files.length} />
              <span>files selected</span>
            </div>

            <div className="gallery-uploader__controls">
              {!autoUpload && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => uploadFiles()}
                  disabled={isUploading || files.every((f) => f.status !== 'pending')}
                  loading={isUploading}
                >
                  Upload All
                </Button>
              )}

              <Button variant="ghost" size="sm" onClick={() => setFiles([])} disabled={isUploading}>
                Clear All
              </Button>
            </div>
          </div>

          {/* Global progress */}
          {showProgress && isUploading && (
            <div className="gallery-uploader__global-progress">
              <div className="gallery-uploader__global-progress-info">
                <span>Uploading... {Math.round(globalProgress)}%</span>
              </div>
              <div className="gallery-uploader__global-progress-bar">
                <div
                  className="gallery-uploader__global-progress-fill"
                  style={{ width: `${globalProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Files list/grid */}
          <div
            className="gallery-uploader__list"
            style={{
              gridTemplateColumns: variant === 'grid' ? `repeat(${gridColumns}, 1fr)` : undefined,
            }}
          >
            {files.map(renderFileItem)}
          </div>
        </div>
      )}

      {/* Manual upload button when drag and drop is disabled */}
      {!dragAndDrop && (
        <div className="gallery-uploader__manual">
          <Button variant="primary" size="lg" onClick={triggerFileSelect}>
            <Icon name="upload" size="sm" />
            Select Files
          </Button>
        </div>
      )}
    </div>
  );
};

export default GalleryUploader;
