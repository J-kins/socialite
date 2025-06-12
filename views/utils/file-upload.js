/**
 * File Upload Utilities
 * Helper functions for handling file uploads and validation
 */

const FileUploadUtils = {
  // Supported file types
  SUPPORTED_TYPES: {
    images: ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"],
    videos: ["video/mp4", "video/webm", "video/mov", "video/avi"],
    documents: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
    audio: ["audio/mp3", "audio/wav", "audio/ogg"],
  },

  // File size limits (in bytes)
  SIZE_LIMITS: {
    image: 10 * 1024 * 1024, // 10MB
    video: 100 * 1024 * 1024, // 100MB
    document: 25 * 1024 * 1024, // 25MB
    audio: 50 * 1024 * 1024, // 50MB
    default: 10 * 1024 * 1024, // 10MB
  },

  // Validate file type
  validateFileType(file, allowedTypes = []) {
    if (!file || !file.type) {
      return { valid: false, error: "Invalid file" };
    }

    if (allowedTypes.length === 0) {
      // Allow all supported types
      const allTypes = Object.values(this.SUPPORTED_TYPES).flat();
      allowedTypes = allTypes;
    }

    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: `File type ${file.type} is not supported`,
      };
    }

    return { valid: true };
  },

  // Validate file size
  validateFileSize(file, maxSize = null) {
    if (!file) {
      return { valid: false, error: "Invalid file" };
    }

    const fileType = this.getFileCategory(file.type);
    const limit =
      maxSize || this.SIZE_LIMITS[fileType] || this.SIZE_LIMITS.default;

    if (file.size > limit) {
      return {
        valid: false,
        error: `File size exceeds limit of ${this.formatFileSize(limit)}`,
      };
    }

    return { valid: true };
  },

  // Get file category
  getFileCategory(mimeType) {
    for (const [category, types] of Object.entries(this.SUPPORTED_TYPES)) {
      if (types.includes(mimeType)) {
        return category.slice(0, -1); // Remove 's' from plural
      }
    }
    return "unknown";
  },

  // Format file size
  formatFileSize(bytes) {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  },

  // Generate file preview
  async generatePreview(file) {
    return new Promise((resolve, reject) => {
      const category = this.getFileCategory(file.type);

      if (category === "image") {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve({
            type: "image",
            url: e.target.result,
            width: null,
            height: null,
          });
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      } else if (category === "video") {
        const video = document.createElement("video");
        const url = URL.createObjectURL(file);

        video.onloadedmetadata = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;

          video.currentTime = 1; // Get frame at 1 second
        };

        video.onseeked = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          ctx.drawImage(video, 0, 0);

          const thumbnailUrl = canvas.toDataURL();
          URL.revokeObjectURL(url);

          resolve({
            type: "video",
            url: thumbnailUrl,
            duration: video.duration,
            width: video.videoWidth,
            height: video.videoHeight,
          });
        };

        video.onerror = () => {
          URL.revokeObjectURL(url);
          reject(new Error("Failed to load video"));
        };

        video.src = url;
      } else {
        // For other file types, return basic info
        resolve({
          type: category,
          url: null,
          icon: this.getFileIcon(file.type),
        });
      }
    });
  },

  // Get appropriate icon for file type
  getFileIcon(mimeType) {
    const category = this.getFileCategory(mimeType);

    const icons = {
      image: "image-outline",
      video: "videocam-outline",
      document: "document-text-outline",
      audio: "musical-notes-outline",
      unknown: "document-outline",
    };

    return icons[category] || icons.unknown;
  },

  // Compress image
  async compressImage(file, options = {}) {
    const {
      maxWidth = 1920,
      maxHeight = 1080,
      quality = 0.8,
      format = "image/jpeg",
    } = options;

    return new Promise((resolve, reject) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }

        // Set canvas dimensions
        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: format,
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              reject(new Error("Failed to compress image"));
            }
          },
          format,
          quality,
        );
      };

      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  },

  // Upload file with progress
  async uploadFile(file, url, options = {}) {
    const {
      onProgress = null,
      headers = {},
      method = "POST",
      fieldName = "file",
    } = options;

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const formData = new FormData();

      formData.append(fieldName, file);

      // Upload progress
      if (onProgress) {
        xhr.upload.addEventListener("progress", (e) => {
          if (e.lengthComputable) {
            const percentComplete = (e.loaded / e.total) * 100;
            onProgress(percentComplete, e.loaded, e.total);
          }
        });
      }

      // Response handlers
      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve(response);
          } catch (e) {
            resolve(xhr.responseText);
          }
        } else {
          reject(new Error(`Upload failed: ${xhr.status} ${xhr.statusText}`));
        }
      });

      xhr.addEventListener("error", () => {
        reject(new Error("Upload failed: Network error"));
      });

      xhr.addEventListener("abort", () => {
        reject(new Error("Upload aborted"));
      });

      // Set headers
      Object.entries(headers).forEach(([key, value]) => {
        xhr.setRequestHeader(key, value);
      });

      // Start upload
      xhr.open(method, url);
      xhr.send(formData);
    });
  },

  // Batch upload files
  async uploadFiles(files, url, options = {}) {
    const {
      concurrent = 3,
      onFileProgress = null,
      onOverallProgress = null,
      ...uploadOptions
    } = options;

    const results = [];
    const total = files.length;
    let completed = 0;

    // Create upload promises with concurrency limit
    const uploadPromises = files.map((file, index) => {
      return this.uploadFile(file, url, {
        ...uploadOptions,
        onProgress: (percent, loaded, total) => {
          if (onFileProgress) {
            onFileProgress(index, percent, loaded, total);
          }
        },
      })
        .then((result) => {
          completed++;
          if (onOverallProgress) {
            onOverallProgress((completed / total) * 100, completed, total);
          }
          return { index, result, success: true };
        })
        .catch((error) => {
          completed++;
          if (onOverallProgress) {
            onOverallProgress((completed / total) * 100, completed, total);
          }
          return { index, error, success: false };
        });
    });

    // Execute with concurrency limit
    const chunked = this.chunkArray(uploadPromises, concurrent);

    for (const chunk of chunked) {
      const chunkResults = await Promise.all(chunk);
      results.push(...chunkResults);
    }

    // Sort results by original index
    results.sort((a, b) => a.index - b.index);

    return results;
  },

  // Helper: chunk array for concurrency
  chunkArray(array, size) {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  },

  // Validate multiple files
  validateFiles(files, options = {}) {
    const { maxFiles = 10, allowedTypes = [], maxTotalSize = null } = options;

    const errors = [];
    const validFiles = [];
    let totalSize = 0;

    // Check file count
    if (files.length > maxFiles) {
      errors.push(`Too many files. Maximum ${maxFiles} allowed.`);
      return { valid: false, errors, validFiles };
    }

    // Validate each file
    for (const file of files) {
      const typeValidation = this.validateFileType(file, allowedTypes);
      const sizeValidation = this.validateFileSize(file);

      if (!typeValidation.valid) {
        errors.push(`${file.name}: ${typeValidation.error}`);
        continue;
      }

      if (!sizeValidation.valid) {
        errors.push(`${file.name}: ${sizeValidation.error}`);
        continue;
      }

      validFiles.push(file);
      totalSize += file.size;
    }

    // Check total size
    if (maxTotalSize && totalSize > maxTotalSize) {
      errors.push(
        `Total file size exceeds limit of ${this.formatFileSize(maxTotalSize)}`,
      );
      return { valid: false, errors, validFiles: [] };
    }

    return {
      valid: errors.length === 0,
      errors,
      validFiles,
      totalSize,
    };
  },
};

export default FileUploadUtils;
