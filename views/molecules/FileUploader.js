/**
 * FileUploader Component
 * Complete file upload interface with drag & drop, preview, and progress
 */

import FileInput from "../atoms/FileInput.js";
import FilePreview from "../atoms/FilePreview.js";
import Button from "../atoms/Button.js";
import Icon from "../atoms/Icon.js";
import ProgressBar from "../atoms/ProgressBar.js";

const FileUploader = ({
  id = "",
  accept = "",
  multiple = true,
  maxFiles = 10,
  maxSize = 10 * 1024 * 1024, // 10MB
  className = "",
  onUpload = "",
  onFileAdd = "",
  onFileRemove = "",
  onProgress = "",
  ...props
} = {}) => {
  const uploaderId =
    id || `file-uploader-${Math.random().toString(36).substr(2, 9)}`;
  const inputId = `${uploaderId}-input`;
  const previewId = `${uploaderId}-preview`;

  const baseClasses = ["file-uploader", "space-y-4", className]
    .filter(Boolean)
    .join(" ");

  // Format file size
  const formatSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Default file handling
  const defaultFileAdd =
    onFileAdd ||
    `
        console.log('File added:', file.name);
    `;

  const defaultFileRemove =
    onFileRemove ||
    `
        console.log('File removed:', fileName);
    `;

  const defaultUpload =
    onUpload ||
    `
        console.log('Starting upload...');
        // Simulate upload progress
        const progressBar = document.getElementById('${uploaderId}-progress');
        if (progressBar) {
            let progress = 0;
            const interval = setInterval(() => {
                progress += 10;
                progressBar.style.width = progress + '%';
                if (progress >= 100) {
                    clearInterval(interval);
                    console.log('Upload complete!');
                }
            }, 200);
        }
    `;

  // Create additional attributes string
  const attrs = Object.entries(props)
    .map(([key, value]) => `${key}="${value}"`)
    .join(" ");

  return `
        <div 
            ${id ? `id="${uploaderId}"` : ""}
            class="${baseClasses}"
            ${attrs}
        >
            <!-- Upload Area -->
            <div class="upload-area relative">
                ${FileInput({
                  id: inputId,
                  accept: accept,
                  multiple: multiple,
                  dragDrop: true,
                  placeholder: `Drop files here or click to browse (Max ${maxFiles} files, ${formatSize(maxSize)} each)`,
                  onChange: `handleFileSelect(event, '${uploaderId}')`,
                })}
            </div>

            <!-- Upload Progress -->
            <div id="${uploaderId}-progress-container" class="hidden">
                <div class="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <span>Uploading files...</span>
                    <span id="${uploaderId}-progress-text">0%</span>
                </div>
                ${ProgressBar({
                  id: `${uploaderId}-progress`,
                  progress: 0,
                  variant: "primary",
                  animated: true,
                })}
            </div>

            <!-- File Previews -->
            <div id="${previewId}" class="file-previews grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"></div>

            <!-- Upload Actions -->
            <div id="${uploaderId}-actions" class="hidden flex items-center justify-between">
                <div class="text-sm text-gray-600 dark:text-gray-400">
                    <span id="${uploaderId}-file-count">0</span> files selected
                </div>
                <div class="flex space-x-3">
                    ${Button({
                      variant: "outline",
                      size: "sm",
                      label: "Clear All",
                      onClick: `clearAllFiles('${uploaderId}')`,
                    })}
                    ${Button({
                      variant: "primary",
                      size: "sm",
                      label: "Upload Files",
                      onClick: `uploadFiles('${uploaderId}')`,
                    })}
                </div>
            </div>
        </div>

        <script>
        // File uploader functionality
        let uploaderFiles = new Map();

        function handleFileSelect(event, uploaderId) {
            const files = Array.from(event.target.files);
            const maxFiles = ${maxFiles};
            const maxSize = ${maxSize};
            
            if (!uploaderFiles.has(uploaderId)) {
                uploaderFiles.set(uploaderId, []);
            }
            
            const currentFiles = uploaderFiles.get(uploaderId);
            const validFiles = [];

            files.forEach(file => {
                // Check file count limit
                if (currentFiles.length + validFiles.length >= maxFiles) {
                    alert(\`Maximum \${maxFiles} files allowed\`);
                    return;
                }

                // Check file size limit
                if (file.size > maxSize) {
                    alert(\`File "\${file.name}" is too large. Maximum size is ${formatSize(maxSize)}\`);
                    return;
                }

                // Check for duplicates
                if (currentFiles.some(f => f.name === file.name && f.size === file.size)) {
                    alert(\`File "\${file.name}" is already selected\`);
                    return;
                }

                validFiles.push(file);
            });

            if (validFiles.length > 0) {
                currentFiles.push(...validFiles);
                uploaderFiles.set(uploaderId, currentFiles);
                updateFilePreview(uploaderId);
                showUploadActions(uploaderId);
                
                validFiles.forEach(file => {
                    (${defaultFileAdd})(file);
                });
            }

            // Clear input
            event.target.value = '';
        }

        function updateFilePreview(uploaderId) {
            const previewContainer = document.getElementById(uploaderId + '-preview');
            const files = uploaderFiles.get(uploaderId) || [];
            
            previewContainer.innerHTML = files.map((file, index) => {
                const fileUrl = URL.createObjectURL(file);
                return \`
                    \${FilePreview({
                        id: \`\${uploaderId}-file-\${index}\`,
                        fileName: file.name,
                        fileSize: file.size,
                        fileType: file.type,
                        src: file.type.startsWith('image/') ? fileUrl : '',
                        removable: true,
                        onRemove: \`removeFile('\${uploaderId}', \${index})\`
                    })}
                \`;
            }).join('');

            // Update file count
            const countElement = document.getElementById(uploaderId + '-file-count');
            if (countElement) {
                countElement.textContent = files.length;
            }
        }

        function removeFile(uploaderId, index) {
            const files = uploaderFiles.get(uploaderId) || [];
            const removedFile = files[index];
            
            files.splice(index, 1);
            uploaderFiles.set(uploaderId, files);
            
            updateFilePreview(uploaderId);
            
            if (files.length === 0) {
                hideUploadActions(uploaderId);
            }
            
            if (removedFile) {
                (${defaultFileRemove})(removedFile.name);
            }
        }

        function clearAllFiles(uploaderId) {
            uploaderFiles.set(uploaderId, []);
            updateFilePreview(uploaderId);
            hideUploadActions(uploaderId);
        }

        function showUploadActions(uploaderId) {
            const actions = document.getElementById(uploaderId + '-actions');
            if (actions) {
                actions.classList.remove('hidden');
            }
        }

        function hideUploadActions(uploaderId) {
            const actions = document.getElementById(uploaderId + '-actions');
            if (actions) {
                actions.classList.add('hidden');
            }
        }

        function uploadFiles(uploaderId) {
            const files = uploaderFiles.get(uploaderId) || [];
            if (files.length === 0) return;

            const progressContainer = document.getElementById(uploaderId + '-progress-container');
            const progressBar = document.getElementById(uploaderId + '-progress');
            const progressText = document.getElementById(uploaderId + '-progress-text');

            if (progressContainer) {
                progressContainer.classList.remove('hidden');
            }

            (${defaultUpload})(files);
        }
        </script>
    `;
};

export default FileUploader;
