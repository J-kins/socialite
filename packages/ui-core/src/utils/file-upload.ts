/**
 * File Upload Utilities
 *
 * Provides comprehensive file handling functionality including validation,
 * compression, preview generation, and type checking for upload components.
 */

export interface FileValidationOptions {
  allowedTypes?: string[];
  allowedExtensions?: string[];
  maxSize?: number; // in bytes
  minSize?: number; // in bytes
  maxFiles?: number;
  requireImageDimensions?: boolean;
  maxWidth?: number;
  maxHeight?: number;
  minWidth?: number;
  minHeight?: number;
}

export interface FileCompressionOptions {
  quality?: number; // 0-1 for JPEG/WebP
  maxWidth?: number;
  maxHeight?: number;
  format?: 'jpeg' | 'webp' | 'png';
  enableResize?: boolean;
}

export interface FilePreviewOptions {
  thumbnailSize?: number;
  videoPreviewTime?: number; // seconds
  enableVideoThumbnail?: boolean;
  previewFormat?: 'jpeg' | 'webp' | 'png';
}

export interface FileUploadResult {
  file: File;
  preview?: string;
  thumbnail?: string;
  compressed?: File;
  metadata?: FileMetadata;
  error?: string;
}

export interface FileMetadata {
  name: string;
  size: number;
  type: string;
  lastModified: number;
  width?: number;
  height?: number;
  duration?: number; // for videos
  aspectRatio?: number;
  orientation?: 'landscape' | 'portrait' | 'square';
}

// Supported MIME types
export const SUPPORTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/bmp',
  'image/svg+xml',
];

export const SUPPORTED_VIDEO_TYPES = [
  'video/mp4',
  'video/webm',
  'video/ogg',
  'video/quicktime',
  'video/x-msvideo',
  'video/3gpp',
];

export const SUPPORTED_DOCUMENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/plain',
  'text/csv',
  'application/json',
];

export const SUPPORTED_AUDIO_TYPES = [
  'audio/mpeg',
  'audio/wav',
  'audio/ogg',
  'audio/mp4',
  'audio/aac',
  'audio/webm',
];

/**
 * Validates a single file against provided options
 */
export const validateFile = (
  file: File,
  options: FileValidationOptions = {},
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  const {
    allowedTypes = [],
    allowedExtensions = [],
    maxSize = 50 * 1024 * 1024, // 50MB default
    minSize = 0,
    requireImageDimensions = false,
    maxWidth,
    maxHeight,
    minWidth,
    minHeight,
  } = options;

  // Check file type
  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    errors.push(`File type ${file.type} is not allowed`);
  }

  // Check file extension
  if (allowedExtensions.length > 0) {
    const extension = getFileExtension(file.name);
    if (!allowedExtensions.includes(extension)) {
      errors.push(`File extension ${extension} is not allowed`);
    }
  }

  // Check file size
  if (file.size > maxSize) {
    errors.push(
      `File size ${formatFileSize(file.size)} exceeds maximum of ${formatFileSize(maxSize)}`,
    );
  }

  if (file.size < minSize) {
    errors.push(
      `File size ${formatFileSize(file.size)} is below minimum of ${formatFileSize(minSize)}`,
    );
  }

  // Additional image dimension validation (async, handled separately)
  if (requireImageDimensions && isImageFile(file)) {
    // This will be handled in the async validation function
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validates multiple files
 */
export const validateFiles = (
  files: FileList | File[],
  options: FileValidationOptions = {},
): {
  isValid: boolean;
  errors: string[];
  fileResults: Array<{ file: File; isValid: boolean; errors: string[] }>;
} => {
  const fileArray = Array.from(files);
  const { maxFiles = Infinity } = options;
  const errors: string[] = [];

  if (fileArray.length > maxFiles) {
    errors.push(
      `Maximum ${maxFiles} files allowed, but ${fileArray.length} files selected`,
    );
  }

  const fileResults = fileArray.map(file => ({
    file,
    ...validateFile(file, options),
  }));

  const allFileErrors = fileResults.flatMap(result => result.errors);
  const allErrors = [...errors, ...allFileErrors];

  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
    fileResults,
  };
};

/**
 * Asynchronously validates files including image dimensions
 */
export const validateFileAsync = async (
  file: File,
  options: FileValidationOptions = {},
): Promise<{ isValid: boolean; errors: string[]; metadata?: FileMetadata }> => {
  const syncValidation = validateFile(file, options);
  const errors = [...syncValidation.errors];

  try {
    const metadata = await getFileMetadata(file);

    if (options.requireImageDimensions && isImageFile(file)) {
      const { maxWidth, maxHeight, minWidth, minHeight } = options;

      if (maxWidth && metadata.width && metadata.width > maxWidth) {
        errors.push(
          `Image width ${metadata.width}px exceeds maximum of ${maxWidth}px`,
        );
      }

      if (maxHeight && metadata.height && metadata.height > maxHeight) {
        errors.push(
          `Image height ${metadata.height}px exceeds maximum of ${maxHeight}px`,
        );
      }

      if (minWidth && metadata.width && metadata.width < minWidth) {
        errors.push(
          `Image width ${metadata.width}px is below minimum of ${minWidth}px`,
        );
      }

      if (minHeight && metadata.height && metadata.height < minHeight) {
        errors.push(
          `Image height ${metadata.height}px is below minimum of ${minHeight}px`,
        );
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      metadata,
    };
  } catch (error) {
    errors.push(
      `Failed to validate file: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
    return {
      isValid: false,
      errors,
    };
  }
};

/**
 * Compresses an image file
 */
export const compressImage = async (
  file: File,
  options: FileCompressionOptions = {},
): Promise<File> => {
  if (!isImageFile(file)) {
    throw new Error('File is not an image');
  }

  const {
    quality = 0.8,
    maxWidth = 1920,
    maxHeight = 1080,
    format = 'jpeg',
    enableResize = true,
  } = options;

  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    if (!ctx) {
      reject(new Error('Canvas context not available'));
      return;
    }

    img.onload = () => {
      let { width, height } = img;

      // Resize if needed
      if (enableResize) {
        const aspectRatio = width / height;

        if (width > maxWidth) {
          width = maxWidth;
          height = width / aspectRatio;
        }

        if (height > maxHeight) {
          height = maxHeight;
          width = height * aspectRatio;
        }
      }

      canvas.width = width;
      canvas.height = height;

      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        blob => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: `image/${format}`,
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          } else {
            reject(new Error('Failed to compress image'));
          }
        },
        `image/${format}`,
        quality,
      );
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Generates a preview/thumbnail for a file
 */
export const generatePreview = async (
  file: File,
  options: FilePreviewOptions = {},
): Promise<string> => {
  const {
    thumbnailSize = 200,
    videoPreviewTime = 1,
    enableVideoThumbnail = true,
    previewFormat = 'jpeg',
  } = options;

  if (isImageFile(file)) {
    return generateImagePreview(file, thumbnailSize, previewFormat);
  }

  if (isVideoFile(file) && enableVideoThumbnail) {
    return generateVideoThumbnail(file, videoPreviewTime, thumbnailSize);
  }

  // Return a data URL for document/file icons based on file type
  return generateFileTypeIcon(file.type);
};

/**
 * Generates an image preview/thumbnail
 */
export const generateImagePreview = async (
  file: File,
  size: number = 200,
  format: 'jpeg' | 'webp' | 'png' = 'jpeg',
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    if (!ctx) {
      reject(new Error('Canvas context not available'));
      return;
    }

    img.onload = () => {
      const { width, height } = img;
      const aspectRatio = width / height;

      let canvasWidth = size;
      let canvasHeight = size;

      if (aspectRatio > 1) {
        canvasHeight = size / aspectRatio;
      } else {
        canvasWidth = size * aspectRatio;
      }

      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);

      const dataUrl = canvas.toDataURL(`image/${format}`, 0.8);
      resolve(dataUrl);
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Generates a video thumbnail
 */
export const generateVideoThumbnail = async (
  file: File,
  timeOffset: number = 1,
  size: number = 200,
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Canvas context not available'));
      return;
    }

    video.onloadedmetadata = () => {
      video.currentTime = Math.min(timeOffset, video.duration);
    };

    video.onseeked = () => {
      const { videoWidth, videoHeight } = video;
      const aspectRatio = videoWidth / videoHeight;

      let canvasWidth = size;
      let canvasHeight = size;

      if (aspectRatio > 1) {
        canvasHeight = size / aspectRatio;
      } else {
        canvasWidth = size * aspectRatio;
      }

      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      ctx.drawImage(video, 0, 0, canvasWidth, canvasHeight);

      const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
      resolve(dataUrl);
    };

    video.onerror = () => reject(new Error('Failed to load video'));
    video.src = URL.createObjectURL(file);
  });
};

/**
 * Gets comprehensive file metadata
 */
export const getFileMetadata = async (file: File): Promise<FileMetadata> => {
  const metadata: FileMetadata = {
    name: file.name,
    size: file.size,
    type: file.type,
    lastModified: file.lastModified,
  };

  if (isImageFile(file)) {
    try {
      const dimensions = await getImageDimensions(file);
      metadata.width = dimensions.width;
      metadata.height = dimensions.height;
      metadata.aspectRatio = dimensions.width / dimensions.height;
      metadata.orientation = getOrientation(
        dimensions.width,
        dimensions.height,
      );
    } catch (error) {
      console.warn('Failed to get image dimensions:', error);
    }
  }

  if (isVideoFile(file)) {
    try {
      const videoDimensions = await getVideoDimensions(file);
      metadata.width = videoDimensions.width;
      metadata.height = videoDimensions.height;
      metadata.duration = videoDimensions.duration;
      metadata.aspectRatio = videoDimensions.width / videoDimensions.height;
      metadata.orientation = getOrientation(
        videoDimensions.width,
        videoDimensions.height,
      );
    } catch (error) {
      console.warn('Failed to get video dimensions:', error);
    }
  }

  return metadata;
};

/**
 * Gets image dimensions
 */
export const getImageDimensions = (
  file: File,
): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Gets video dimensions and duration
 */
export const getVideoDimensions = (
  file: File,
): Promise<{ width: number; height: number; duration: number }> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.onloadedmetadata = () => {
      resolve({
        width: video.videoWidth,
        height: video.videoHeight,
        duration: video.duration,
      });
    };
    video.onerror = () => reject(new Error('Failed to load video'));
    video.src = URL.createObjectURL(file);
  });
};

/**
 * Utility functions
 */

export const isImageFile = (file: File): boolean => {
  return SUPPORTED_IMAGE_TYPES.includes(file.type);
};

export const isVideoFile = (file: File): boolean => {
  return SUPPORTED_VIDEO_TYPES.includes(file.type);
};

export const isDocumentFile = (file: File): boolean => {
  return SUPPORTED_DOCUMENT_TYPES.includes(file.type);
};

export const isAudioFile = (file: File): boolean => {
  return SUPPORTED_AUDIO_TYPES.includes(file.type);
};

export const getFileExtension = (filename: string): string => {
  return filename.split('.').pop()?.toLowerCase() || '';
};

export const getFileType = (
  file: File,
): 'image' | 'video' | 'document' | 'audio' | 'other' => {
  if (isImageFile(file)) return 'image';
  if (isVideoFile(file)) return 'video';
  if (isDocumentFile(file)) return 'document';
  if (isAudioFile(file)) return 'audio';
  return 'other';
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const getOrientation = (
  width: number,
  height: number,
): 'landscape' | 'portrait' | 'square' => {
  if (width > height) return 'landscape';
  if (height > width) return 'portrait';
  return 'square';
};

export const generateFileTypeIcon = (mimeType: string): string => {
  // Generate SVG data URLs for different file types
  const iconMap: Record<string, string> = {
    'application/pdf':
      'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTcgMThIMTdWMTZIN1YxOFpNNyAxNEgxN1YxMkg3VjE0Wk03IDEwSDE3VjhIN1YxMFpNNiA0VjIwQzYgMjEuMSA2LjkgMjIgOCAyMkgxNkMxNy4xIDIyIDE4IDIxLjEgMTggMjBWOEwxMiAySDhDNi45IDIgNiAyLjkgNiA0WiIgZmlsbD0iIzMzMzMzMyIvPgo8L3N2Zz4K',
    'application/msword':
      'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTQgMkMyLjkgMiAyIDIuOSAyIDRWMjBDMiAyMS4xIDIuOSAyMiA0IDIySDE2TDIwIDE4VjRDMjAgMi45IDE5LjEgMiAxOCAySDRaTTE4IDIwSDE2VjE4SDE4VjIwWiIgZmlsbD0iIzMzMzMzMyIvPgo8L3N2Zz4K',
    default:
      'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTggMkM2LjkgMiA2IDIuOSA2IDRWMjBDNiAyMS4xIDYuOSAyMiA4IDIySDE2QzE3LjEgMjIgMTggMjEuMSAxOCAyMFY4TDEyIDJIOFoiIGZpbGw9IiMzMzMzMzMiLz4KPC9zdmc+Cg==',
  };

  return iconMap[mimeType] || iconMap['default'];
};

/**
 * Processes multiple files with validation, compression, and preview generation
 */
export const processFiles = async (
  files: FileList | File[],
  validationOptions: FileValidationOptions = {},
  compressionOptions: FileCompressionOptions = {},
  previewOptions: FilePreviewOptions = {},
): Promise<FileUploadResult[]> => {
  const fileArray = Array.from(files);
  const results: FileUploadResult[] = [];

  for (const file of fileArray) {
    try {
      const validation = await validateFileAsync(file, validationOptions);

      if (!validation.isValid) {
        results.push({
          file,
          error: validation.errors.join('; '),
          metadata: validation.metadata,
        });
        continue;
      }

      const result: FileUploadResult = {
        file,
        metadata: validation.metadata,
      };

      // Generate preview
      try {
        result.preview = await generatePreview(file, previewOptions);
      } catch (error) {
        console.warn('Failed to generate preview:', error);
      }

      // Compress if it's an image
      if (isImageFile(file)) {
        try {
          result.compressed = await compressImage(file, compressionOptions);
        } catch (error) {
          console.warn('Failed to compress image:', error);
        }
      }

      results.push(result);
    } catch (error) {
      results.push({
        file,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      });
    }
  }

  return results;
};

/**
 * Creates a drag and drop handler
 */
export const createDropHandler = (
  onDrop: (files: File[]) => void,
  validationOptions: FileValidationOptions = {},
) => {
  return {
    onDragOver: (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    },
    onDragEnter: (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    },
    onDragLeave: (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    },
    onDrop: (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const files = Array.from(e.dataTransfer.files);
      const validation = validateFiles(files, validationOptions);

      if (validation.isValid) {
        onDrop(files);
      } else {
        console.error('File validation failed:', validation.errors);
        // You might want to call an error handler here
      }
    },
  };
};

export default {
  validateFile,
  validateFiles,
  validateFileAsync,
  compressImage,
  generatePreview,
  generateImagePreview,
  generateVideoThumbnail,
  getFileMetadata,
  getImageDimensions,
  getVideoDimensions,
  processFiles,
  createDropHandler,
  isImageFile,
  isVideoFile,
  isDocumentFile,
  isAudioFile,
  getFileType,
  formatFileSize,
  getOrientation,
  SUPPORTED_IMAGE_TYPES,
  SUPPORTED_VIDEO_TYPES,
  SUPPORTED_DOCUMENT_TYPES,
  SUPPORTED_AUDIO_TYPES,
};
