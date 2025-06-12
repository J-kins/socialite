import React, { useState, useCallback } from 'react';
import { Header } from '../organisms/Header';
import { Sidebar } from '../organisms/Sidebar';
import { MainContentPanel } from '../organisms/MainContentPanel';
import { GalleryUploader } from '../organisms/GalleryUploader';
import { Button } from '../atoms/Button';
import { Badge } from '../atoms/Badge';
import { FilePreview } from '../atoms/FilePreview';
import '../../../styles/templates/media-upload-page.css';

export interface MediaFile {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  thumbnail?: string;
  uploadProgress?: number;
  status: 'uploading' | 'completed' | 'error';
  metadata?: {
    width?: number;
    height?: number;
    duration?: number;
  };
}

export interface MediaUploadPageProps {
  acceptedTypes?: string[];
  maxFileSize?: number;
  maxFiles?: number;
  allowedFormats?: string[];
  onUpload?: (files: File[]) => void;
  onDelete?: (fileId: string) => void;
  uploadedFiles?: MediaFile[];
  className?: string;
}

export const MediaUploadPage: React.FC<MediaUploadPageProps> = ({
  acceptedTypes = ['image/*', 'video/*'],
  maxFileSize = 100 * 1024 * 1024, // 100MB
  maxFiles = 20,
  allowedFormats = ['JPEG', 'PNG', 'GIF', 'MP4', 'MOV', 'AVI'],
  onUpload,
  onDelete,
  uploadedFiles = [],
  className,
}) => {
  const [files, setFiles] = useState<MediaFile[]>(uploadedFiles);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterType, setFilterType] = useState<'all' | 'images' | 'videos'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size'>('date');

  const handleFilesAdded = useCallback(
    (newFiles: File[]) => {
      const mediaFiles: MediaFile[] = newFiles.map((file, index) => ({
        id: `file-${Date.now()}-${index}`,
        name: file.name,
        type: file.type,
        size: file.size,
        url: URL.createObjectURL(file),
        status: 'uploading' as const,
        uploadProgress: 0,
      }));

      setFiles((prev) => [...prev, ...mediaFiles]);

      // Simulate upload progress
      mediaFiles.forEach((file, index) => {
        const interval = setInterval(() => {
          setFiles((prev) =>
            prev.map((f) => {
              if (f.id === file.id) {
                const newProgress = Math.min(100, (f.uploadProgress || 0) + Math.random() * 20);
                if (newProgress >= 100) {
                  clearInterval(interval);
                  return { ...f, uploadProgress: 100, status: 'completed' as const };
                }
                return { ...f, uploadProgress: newProgress };
              }
              return f;
            })
          );
        }, 200);
      });

      onUpload?.(newFiles);
    },
    [onUpload]
  );

  const handleFileDelete = useCallback(
    (fileId: string) => {
      setFiles((prev) => prev.filter((f) => f.id !== fileId));
      setSelectedFiles((prev) => prev.filter((id) => id !== fileId));
      onDelete?.(fileId);
    },
    [onDelete]
  );

  const handleFileSelect = useCallback((fileId: string) => {
    setSelectedFiles((prev) =>
      prev.includes(fileId) ? prev.filter((id) => id !== fileId) : [...prev, fileId]
    );
  }, []);

  const handleSelectAll = useCallback(() => {
    if (selectedFiles.length === filteredFiles.length) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(filteredFiles.map((f) => f.id));
    }
  }, [selectedFiles.length]);

  const handleBulkDelete = useCallback(() => {
    selectedFiles.forEach((fileId) => handleFileDelete(fileId));
  }, [selectedFiles, handleFileDelete]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) {
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
            clipRule="evenodd"
          />
        </svg>
      );
    } else if (type.startsWith('video/')) {
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
        </svg>
      );
    }
    return (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
          clipRule="evenodd"
        />
      </svg>
    );
  };

  const filteredFiles = files
    .filter((file) => {
      if (filterType === 'images') return file.type.startsWith('image/');
      if (filterType === 'videos') return file.type.startsWith('video/');
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'size':
          return b.size - a.size;
        case 'date':
        default:
          return b.id.localeCompare(a.id);
      }
    });

  const stats = {
    total: files.length,
    images: files.filter((f) => f.type.startsWith('image/')).length,
    videos: files.filter((f) => f.type.startsWith('video/')).length,
    totalSize: files.reduce((sum, f) => sum + f.size, 0),
  };

  return (
    <div className={`media-upload-page ${className || ''}`}>
      <Header />
      <Sidebar />

      <MainContentPanel className="pt-16">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Media Library</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Upload and manage your photos and videos
            </p>
          </div>

          {/* Upload Section */}
          <div className="mb-8">
            <GalleryUploader
              acceptedTypes={acceptedTypes}
              maxFileSize={maxFileSize}
              maxFiles={maxFiles}
              onFilesAdded={handleFilesAdded}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border-2 border-dashed border-gray-300 dark:border-gray-600"
            />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Files</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.images}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Images</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.videos}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Videos</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {formatFileSize(stats.totalSize)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Size</div>
            </div>
          </div>

          {/* Controls */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              {/* Selection Info */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={
                      selectedFiles.length === filteredFiles.length && filteredFiles.length > 0
                    }
                    onChange={handleSelectAll}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    {selectedFiles.length > 0 ? `${selectedFiles.length} selected` : 'Select all'}
                  </label>
                </div>

                {selectedFiles.length > 0 && (
                  <Button variant="danger" size="sm" onClick={handleBulkDelete}>
                    Delete Selected
                  </Button>
                )}
              </div>

              {/* Filters and View Controls */}
              <div className="flex items-center space-x-4">
                {/* Filter by type */}
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-700 dark:text-white"
                >
                  <option value="all">All Files</option>
                  <option value="images">Images</option>
                  <option value="videos">Videos</option>
                </select>

                {/* Sort by */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-700 dark:text-white"
                >
                  <option value="date">Date</option>
                  <option value="name">Name</option>
                  <option value="size">Size</option>
                </select>

                {/* View mode toggle */}
                <div className="flex rounded-md shadow-sm">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`px-3 py-2 rounded-l-md border text-sm ${
                      viewMode === 'grid'
                        ? 'bg-primary-50 border-primary-500 text-primary-700 dark:bg-primary-900 dark:text-primary-200'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-3 py-2 rounded-r-md border-t border-r border-b text-sm ${
                      viewMode === 'list'
                        ? 'bg-primary-50 border-primary-500 text-primary-700 dark:bg-primary-900 dark:text-primary-200'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Files Display */}
          {filteredFiles.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
              <svg
                className="w-16 h-16 text-gray-400 mx-auto mb-4"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                  clipRule="evenodd"
                />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No media files
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Start by uploading some photos or videos
              </p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {filteredFiles.map((file) => (
                <div
                  key={file.id}
                  className={`relative group bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm border-2 transition-all ${
                    selectedFiles.includes(file.id)
                      ? 'border-primary-500 ring-2 ring-primary-500/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="aspect-square">
                    {file.type.startsWith('image/') ? (
                      <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
                    ) : file.type.startsWith('video/') ? (
                      <div className="w-full h-full bg-gray-900 flex items-center justify-center relative">
                        <video src={file.url} className="w-full h-full object-cover" muted />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <svg
                            className="w-12 h-12 text-white/80"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                        {getFileIcon(file.type)}
                      </div>
                    )}

                    {/* Upload progress overlay */}
                    {file.status === 'uploading' && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="text-white text-center">
                          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                          <div className="text-sm">{Math.round(file.uploadProgress || 0)}%</div>
                        </div>
                      </div>
                    )}

                    {/* Status badge */}
                    {file.status === 'completed' && (
                      <div className="absolute top-2 right-2">
                        <Badge variant="success" size="sm">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </Badge>
                      </div>
                    )}

                    {file.status === 'error' && (
                      <div className="absolute top-2 right-2">
                        <Badge variant="danger" size="sm">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Overlay controls */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleFileSelect(file.id)}
                      className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                    >
                      {selectedFiles.includes(file.id) ? 'Deselect' : 'Select'}
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleFileDelete(file.id)}
                      className="bg-red-500/80 hover:bg-red-600"
                    >
                      Delete
                    </Button>
                  </div>

                  {/* File info */}
                  <div className="p-3">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {file.name}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        <input
                          type="checkbox"
                          checked={
                            selectedFiles.length === filteredFiles.length &&
                            filteredFiles.length > 0
                          }
                          onChange={handleSelectAll}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Preview
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Size
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredFiles.map((file) => (
                      <tr key={file.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedFiles.includes(file.id)}
                            onChange={() => handleFileSelect(file.id)}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                            {file.type.startsWith('image/') ? (
                              <img
                                src={file.url}
                                alt={file.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                {getFileIcon(file.type)}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {file.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant="secondary" size="sm">
                            {file.type.split('/')[1].toUpperCase()}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {formatFileSize(file.size)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {file.status === 'uploading' && (
                            <Badge variant="warning" size="sm">
                              Uploading {Math.round(file.uploadProgress || 0)}%
                            </Badge>
                          )}
                          {file.status === 'completed' && (
                            <Badge variant="success" size="sm">
                              Completed
                            </Badge>
                          )}
                          {file.status === 'error' && (
                            <Badge variant="danger" size="sm">
                              Error
                            </Badge>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(file.url, '_blank')}
                            >
                              View
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleFileDelete(file.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </MainContentPanel>
    </div>
  );
};

export type { MediaUploadPageProps, MediaFile };
