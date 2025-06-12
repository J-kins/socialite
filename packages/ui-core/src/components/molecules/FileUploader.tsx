import React, { useState, useCallback } from 'react';
import { FileInput, UploadButton, FilePreview } from '../atoms';

export interface FileUploaderProps {
  accept?: string;
  maxFiles?: number;
  maxSize?: number;
  multiple?: boolean;
  variant?: 'dropzone' | 'button' | 'minimal';
  size?: 'sm' | 'md' | 'lg';
  showPreview?: boolean;
  onFilesChange?: (files: File[]) => void;
  onUpload?: (files: File[]) => Promise<void>;
  onError?: (error: string) => void;
  className?: string;
}

/**
 * FileUploader component - combines file input, preview, and upload functionality
 * Provides a complete file upload experience with drag & drop, preview, and progress
 */
export const FileUploader: React.FC<FileUploaderProps> = ({
  accept = 'image/*,video/*',
  maxFiles = 5,
  maxSize = 10 * 1024 * 1024, // 10MB
  multiple = true,
  variant = 'dropzone',
  size = 'md',
  showPreview = true,
  onFilesChange,
  onUpload,
  onError,
  className = '',
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});

  const baseClasses = [
    'file-uploader',
    `file-uploader-${variant}`,
    `file-uploader-${size}`,
    uploading && 'file-uploader-uploading',
  ].filter(Boolean);

  const handleFileSelect = useCallback(
    (selectedFiles: FileList | null) => {
      if (!selectedFiles) return;

      const newFiles = Array.from(selectedFiles);

      // Validate file count
      if (files.length + newFiles.length > maxFiles) {
        onError?.(`Maximum ${maxFiles} files allowed`);
        return;
      }

      // Validate file sizes
      const oversizedFiles = newFiles.filter((file) => file.size > maxSize);
      if (oversizedFiles.length > 0) {
        onError?.(
          `File(s) too large: ${oversizedFiles.map((f) => f.name).join(', ')}. Max size: ${Math.round(maxSize / 1024 / 1024)}MB`
        );
        return;
      }

      const updatedFiles = multiple ? [...files, ...newFiles] : newFiles;
      setFiles(updatedFiles);
      onFilesChange?.(updatedFiles);
    },
    [files, maxFiles, maxSize, multiple, onFilesChange, onError]
  );

  const handleRemoveFile = useCallback(
    (index: number) => {
      const updatedFiles = files.filter((_, i) => i !== index);
      setFiles(updatedFiles);
      onFilesChange?.(updatedFiles);
    },
    [files, onFilesChange]
  );

  const handleUpload = useCallback(async () => {
    if (!onUpload || files.length === 0) return;

    setUploading(true);
    try {
      await onUpload(files);
      setFiles([]);
      setUploadProgress({});
    } catch (error) {
      onError?.(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  }, [files, onUpload, onError]);

  const handleClearAll = useCallback(() => {
    setFiles([]);
    setUploadProgress({});
    onFilesChange?.([]);
  }, [onFilesChange]);

  const renderFileInput = () => {
    switch (variant) {
      case 'button':
        return (
          <UploadButton
            accept={accept}
            multiple={multiple}
            maxSize={maxSize}
            onFileSelect={handleFileSelect}
            onError={onError}
            loading={uploading}
            size={size}
            className="file-uploader-input"
          />
        );

      case 'minimal':
        return (
          <div className="file-uploader-minimal">
            <FileInput
              variant="button"
              accept={accept}
              multiple={multiple}
              maxSize={maxSize}
              onFileSelect={handleFileSelect}
              onError={onError}
              size={size}
              label="Choose files"
              className="file-uploader-input"
            />
          </div>
        );

      default: // dropzone
        return (
          <FileInput
            variant="dropzone"
            accept={accept}
            multiple={multiple}
            maxSize={maxSize}
            onFileSelect={handleFileSelect}
            onError={onError}
            size={size}
            label="Upload files"
            description={`Drop files here or click to browse. Max ${maxFiles} files, ${Math.round(maxSize / 1024 / 1024)}MB each.`}
            className="file-uploader-input"
          />
        );
    }
  };

  const renderPreview = () => {
    if (!showPreview || files.length === 0) return null;

    return (
      <div className="file-uploader-preview">
        <div className="file-uploader-preview-header">
          <h3 className="file-uploader-preview-title">Selected Files ({files.length})</h3>

          <div className="file-uploader-preview-actions">
            <button
              type="button"
              onClick={handleClearAll}
              className="file-uploader-clear"
              disabled={uploading}
            >
              Clear All
            </button>
          </div>
        </div>

        <div className="file-uploader-preview-list">
          {files.map((file, index) => (
            <div key={`${file.name}-${index}`} className="file-uploader-preview-item">
              <FilePreview
                file={file}
                variant="list"
                size="sm"
                showName
                showSize
                removable={!uploading}
                onRemove={() => handleRemoveFile(index)}
              />

              {uploadProgress[file.name] !== undefined && (
                <div className="file-uploader-progress">
                  <div
                    className="file-uploader-progress-bar"
                    style={{ width: `${uploadProgress[file.name]}%` }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderUploadActions = () => {
    if (files.length === 0 || !onUpload) return null;

    return (
      <div className="file-uploader-actions">
        <button
          type="button"
          onClick={handleUpload}
          disabled={uploading}
          className="file-uploader-upload-btn"
        >
          {uploading ? 'Uploading...' : `Upload ${files.length} file${files.length > 1 ? 's' : ''}`}
        </button>
      </div>
    );
  };

  return (
    <div className={`${baseClasses.join(' ')} ${className}`}>
      <div className="file-uploader-content">
        {renderFileInput()}
        {renderPreview()}
        {renderUploadActions()}
      </div>
    </div>
  );
};

export type { FileUploaderProps };
