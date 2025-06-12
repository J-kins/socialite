import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '../atoms/Button';
import { Icon } from '../atoms/Icon';
import { Badge } from '../atoms/Badge';
import { LoadingSpinner } from '../atoms/LoadingSpinner';

export interface UploadedDocument {
  id: string;
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
  url?: string;
  metadata?: {
    size: number;
    type: string;
    name: string;
    pages?: number;
    lastModified: number;
  };
}

export interface DocumentUploaderProps {
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
  scanForViruses?: boolean;
  extractMetadata?: boolean;
  /**
   * UI customization
   */
  variant?: 'default' | 'compact' | 'detailed';
  showProgress?: boolean;
  showFileInfo?: boolean;
  showFilePreview?: boolean;
  dragAndDrop?: boolean;
  /**
   * Security features
   */
  encryptFiles?: boolean;
  requirePassword?: boolean;
  allowedUsers?: string[];
  /**
   * Event handlers
   */
  onFilesSelect?: (files: File[]) => void;
  onFileUpload?: (file: UploadedDocument) => void;
  onFileRemove?: (fileId: string) => void;
  onUploadProgress?: (fileId: string, progress: number) => void;
  onUploadComplete?: (files: UploadedDocument[]) => void;
  onUploadError?: (fileId: string, error: string) => void;
  onVirusDetected?: (fileId: string, virusInfo: string) => void;
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
  initialFiles?: UploadedDocument[];
  /**
   * Customization
   */
  className?: string;
}

export const DocumentUploader: React.FC<DocumentUploaderProps> = ({
  multiple = true,
  maxFiles = 5,
  maxFileSize = 50 * 1024 * 1024, // 50MB
  acceptedFileTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain',
    'text/csv',
  ],
  autoUpload = false,
  uploadUrl,
  uploadMethod = 'POST',
  uploadHeaders = {},
  validateFile,
  scanForViruses = false,
  extractMetadata = true,
  variant = 'default',
  showProgress = true,
  showFileInfo = true,
  showFilePreview = false,
  dragAndDrop = true,
  encryptFiles = false,
  requirePassword = false,
  allowedUsers = [],
  onFilesSelect,
  onFileUpload,
  onFileRemove,
  onUploadProgress,
  onUploadComplete,
  onUploadError,
  onVirusDetected,
  customUpload,
  ariaLabel = 'Document file uploader',
  initialFiles = [],
  className = '',
}) => {
  const [files, setFiles] = useState<UploadedDocument[]>(initialFiles);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [globalProgress, setGlobalProgress] = useState(0);
  const [password, setPassword] = useState('');
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);

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

  // Get file type icon
  const getFileTypeIcon = useCallback((mimeType: string): string => {
    if (mimeType.includes('pdf')) return 'file-text';
    if (mimeType.includes('word') || mimeType.includes('document')) return 'file-text';
    if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return 'grid';
    if (mimeType.includes('powerpoint') || mimeType.includes('presentation')) return 'monitor';
    if (mimeType.includes('text')) return 'file-text';
    if (mimeType.includes('csv')) return 'grid';
    return 'file';
  }, []);

  // Get file type label
  const getFileTypeLabel = useCallback((mimeType: string): string => {
    if (mimeType.includes('pdf')) return 'PDF';
    if (mimeType.includes('word') || mimeType.includes('document')) return 'Word';
    if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return 'Excel';
    if (mimeType.includes('powerpoint') || mimeType.includes('presentation')) return 'PowerPoint';
    if (mimeType.includes('text/plain')) return 'Text';
    if (mimeType.includes('csv')) return 'CSV';
    return 'Document';
  }, []);

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

      return null;
    },
    [acceptedFileTypes, maxFileSize, validateFile]
  );

  // Extract file metadata
  const extractFileMetadata = useCallback(
    async (file: File): Promise<any> => {
      if (!extractMetadata) return {};

      // Basic metadata
      const metadata = {
        size: file.size,
        type: file.type,
        name: file.name,
        lastModified: file.lastModified,
      };

      // For PDFs, try to extract page count (simplified)
      if (file.type === 'application/pdf') {
        try {
          const text = await file.text();
          const pageMatches = text.match(/\/Count\s+(\d+)/);
          if (pageMatches) {
            metadata.pages = parseInt(pageMatches[1], 10);
          }
        } catch {
          // Ignore extraction errors
        }
      }

      return metadata;
    },
    [extractMetadata]
  );

  // Simulate virus scanning
  const scanFileForViruses = useCallback(
    async (file: File): Promise<string | null> => {
      if (!scanForViruses) return null;

      // Simulate virus scan delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Simulate virus detection (very rare, for demo purposes)
      if (Math.random() < 0.01) {
        return 'Potential threat detected';
      }

      return null;
    },
    [scanForViruses]
  );

  // Process selected files
  const processFiles = useCallback(
    async (fileList: FileList | File[]) => {
      const filesArray = Array.from(fileList);

      // Check max files limit
      if (files.length + filesArray.length > maxFiles) {
        alert(`Maximum ${maxFiles} files allowed`);
        return;
      }

      // Check if password is required
      if (requirePassword && !password) {
        setShowPasswordDialog(true);
        return;
      }

      const newFiles: UploadedDocument[] = [];

      for (const file of filesArray) {
        const error = await validateFileInternal(file);
        if (error) {
          alert(`Error with file ${file.name}: ${error}`);
          continue;
        }

        // Virus scan
        const virusInfo = await scanFileForViruses(file);
        if (virusInfo) {
          onVirusDetected?.(file.name, virusInfo);
          alert(`Virus detected in ${file.name}: ${virusInfo}`);
          continue;
        }

        const metadata = await extractFileMetadata(file);

        const uploadedFile: UploadedDocument = {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          file,
          progress: 0,
          status: 'pending',
          metadata,
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
      requirePassword,
      password,
      validateFileInternal,
      scanFileForViruses,
      extractFileMetadata,
      onFilesSelect,
      onVirusDetected,
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
            const result = await customUpload(fileData.file, (progress) => {
              setFiles((prev) => prev.map((f) => (f.id === fileData.id ? { ...f, progress } : f)));
              onUploadProgress?.(fileData.id, progress);
            });

            // Update with result URL if provided
            if (result?.url) {
              setFiles((prev) =>
                prev.map((f) => (f.id === fileData.id ? { ...f, url: result.url } : f))
              );
            }
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
    async (fileData: UploadedDocument) => {
      if (!uploadUrl) throw new Error('Upload URL not provided');

      const formData = new FormData();
      formData.append('file', fileData.file);

      if (encryptFiles) {
        formData.append('encrypt', 'true');
      }

      if (password) {
        formData.append('password', password);
      }

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
            try {
              const response = JSON.parse(xhr.responseText);
              resolve(response);
            } catch {
              resolve(xhr.responseText);
            }
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
    [uploadUrl, uploadMethod, uploadHeaders, encryptFiles, password, onUploadProgress]
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

  // Handle password submission
  const handlePasswordSubmit = useCallback(() => {
    if (password.trim()) {
      setShowPasswordDialog(false);
      // Re-trigger file processing
      if (fileInputRef.current?.files) {
        processFiles(fileInputRef.current.files);
      }
    }
  }, [password, processFiles]);

  // Render file item
  const renderFileItem = useCallback(
    (file: UploadedDocument) => {
      const itemClasses = [
        'document-uploader__item',
        `document-uploader__item--${file.status}`,
        `document-uploader__item--${variant}`,
      ]
        .filter(Boolean)
        .join(' ');

      const fileIcon = getFileTypeIcon(file.metadata?.type || '');
      const fileLabel = getFileTypeLabel(file.metadata?.type || '');

      return (
        <div key={file.id} className={itemClasses}>
          {/* File Icon */}
          <div className="document-uploader__icon">
            <Icon name={fileIcon} size="lg" />
            <span className="document-uploader__type-label">{fileLabel}</span>
          </div>

          {/* File Info */}
          {showFileInfo && (
            <div className="document-uploader__info">
              <div className="document-uploader__name" title={file.metadata?.name}>
                {file.metadata?.name}
              </div>

              <div className="document-uploader__meta">
                <span className="document-uploader__size">
                  {file.metadata && formatFileSize(file.metadata.size)}
                </span>

                {file.metadata?.pages && (
                  <span className="document-uploader__pages">{file.metadata.pages} pages</span>
                )}

                <span className="document-uploader__modified">
                  {file.metadata && new Date(file.metadata.lastModified).toLocaleDateString()}
                </span>
              </div>

              {file.error && <div className="document-uploader__error">{file.error}</div>}
            </div>
          )}

          {/* Progress */}
          {showProgress && file.status === 'uploading' && (
            <div className="document-uploader__progress">
              <div className="document-uploader__progress-info">
                <span>Uploading... {file.progress}%</span>
              </div>
              <div className="document-uploader__progress-bar">
                <div
                  className="document-uploader__progress-fill"
                  style={{ width: `${file.progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Status Icons */}
          <div className="document-uploader__status">
            {file.status === 'uploading' && <LoadingSpinner size="sm" />}
            {file.status === 'completed' && (
              <Icon name="check-circle" size="md" className="document-uploader__success-icon" />
            )}
            {file.status === 'error' && (
              <Icon name="alert-circle" size="md" className="document-uploader__error-icon" />
            )}
          </div>

          {/* Actions */}
          <div className="document-uploader__actions">
            {file.status === 'completed' && file.url && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open(file.url, '_blank')}
                aria-label="View document"
              >
                <Icon name="external-link" size="sm" />
              </Button>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeFile(file.id)}
              className="document-uploader__remove"
              aria-label="Remove file"
            >
              <Icon name="trash" size="sm" />
            </Button>
          </div>
        </div>
      );
    },
    [
      showFileInfo,
      showProgress,
      formatFileSize,
      getFileTypeIcon,
      getFileTypeLabel,
      removeFile,
      variant,
    ]
  );

  const containerClasses = [
    'document-uploader',
    `document-uploader--${variant}`,
    isDragOver && 'document-uploader--drag-over',
    isUploading && 'document-uploader--uploading',
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

      {/* Password Dialog */}
      {showPasswordDialog && (
        <div className="document-uploader__password-dialog">
          <div className="document-uploader__password-content">
            <h3>Password Required</h3>
            <p>Please enter a password to encrypt your documents:</p>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="document-uploader__password-input"
            />
            <div className="document-uploader__password-actions">
              <Button variant="ghost" onClick={() => setShowPasswordDialog(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handlePasswordSubmit}>
                Continue
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Drop zone */}
      {dragAndDrop && (
        <div
          ref={dropZoneRef}
          className="document-uploader__dropzone"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={triggerFileSelect}
          role="button"
          tabIndex={0}
          aria-label="Click to select documents or drag and drop"
        >
          <Icon name="upload" size="xl" className="document-uploader__dropzone-icon" />
          <h3 className="document-uploader__dropzone-title">Drag and drop documents here</h3>
          <p className="document-uploader__dropzone-subtitle">or click to select files</p>
          <div className="document-uploader__dropzone-info">
            <p>Supports: PDF, Word, Excel, PowerPoint, Text files</p>
            <p>Max size: {Math.round(maxFileSize / 1024 / 1024)}MB per file</p>
            <p>Max files: {maxFiles}</p>
            {encryptFiles && <p>Files will be encrypted</p>}
            {scanForViruses && <p>Files will be scanned for viruses</p>}
          </div>
        </div>
      )}

      {/* Files list */}
      {files.length > 0 && (
        <div className="document-uploader__files">
          {/* Header with controls */}
          <div className="document-uploader__header">
            <div className="document-uploader__file-count">
              <Badge variant="secondary" count={files.length} />
              <span>documents selected</span>
            </div>

            <div className="document-uploader__controls">
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
            <div className="document-uploader__global-progress">
              <div className="document-uploader__global-progress-info">
                <span>Uploading documents... {Math.round(globalProgress)}%</span>
              </div>
              <div className="document-uploader__global-progress-bar">
                <div
                  className="document-uploader__global-progress-fill"
                  style={{ width: `${globalProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Files list */}
          <div className="document-uploader__list">{files.map(renderFileItem)}</div>
        </div>
      )}

      {/* Manual upload button when drag and drop is disabled */}
      {!dragAndDrop && (
        <div className="document-uploader__manual">
          <Button variant="primary" size="lg" onClick={triggerFileSelect}>
            <Icon name="upload" size="sm" />
            Select Documents
          </Button>
        </div>
      )}
    </div>
  );
};

export default DocumentUploader;
