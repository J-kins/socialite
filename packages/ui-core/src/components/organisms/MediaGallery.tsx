import React, { useState } from "react";
import { Button, Icon, Badge } from "../atoms";

export interface MediaItem {
  id: string;
  type: "image" | "video" | "audio";
  url: string;
  thumbnail?: string;
  title?: string;
  description?: string;
  duration?: number; // for video/audio in seconds
  size?: number; // file size in bytes
  dimensions?: {
    width: number;
    height: number;
  };
  uploadDate: string;
  author?: {
    id: string;
    name: string;
    avatar?: string;
  };
  tags?: string[];
  likes?: number;
  isLiked?: boolean;
}

export interface MediaGalleryProps {
  items: MediaItem[];
  viewMode?: "grid" | "list" | "masonry";
  allowDownload?: boolean;
  allowDelete?: boolean;
  allowUpload?: boolean;
  onItemClick?: (item: MediaItem) => void;
  onDownload?: (item: MediaItem) => void;
  onDelete?: (itemId: string) => void;
  onUpload?: (files: FileList) => void;
  onLike?: (itemId: string) => void;
  onFilter?: (filters: { type?: MediaItem["type"]; tags?: string[] }) => void;
  className?: string;
}

export const MediaGallery: React.FC<MediaGalleryProps> = ({
  items,
  viewMode = "grid",
  allowDownload = true,
  allowDelete = false,
  allowUpload = false,
  onItemClick,
  onDownload,
  onDelete,
  onUpload,
  onLike,
  onFilter,
  className = "",
}) => {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [lightboxItem, setLightboxItem] = useState<MediaItem | null>(null);
  const [filterType, setFilterType] = useState<MediaItem["type"] | "all">(
    "all",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "name" | "size">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString([], {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const toggleSelection = (itemId: string) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const filteredAndSortedItems = React.useMemo(() => {
    let filtered = items;

    // Filter by type
    if (filterType !== "all") {
      filtered = filtered.filter((item) => item.type === filterType);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (item) =>
          item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.tags?.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
      );
    }

    // Sort items
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortBy) {
        case "name":
          aValue = a.title || "";
          bValue = b.title || "";
          break;
        case "size":
          aValue = a.size || 0;
          bValue = b.size || 0;
          break;
        case "date":
        default:
          aValue = new Date(a.uploadDate);
          bValue = new Date(b.uploadDate);
          break;
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [items, filterType, searchQuery, sortBy, sortOrder]);

  const MediaCard: React.FC<{ item: MediaItem }> = ({ item }) => (
    <div className="relative group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      {/* Selection Checkbox */}
      <div className="absolute top-2 left-2 z-10">
        <input
          type="checkbox"
          checked={selectedItems.has(item.id)}
          onChange={() => toggleSelection(item.id)}
          className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
        />
      </div>

      {/* Media Preview */}
      <div
        className="relative aspect-square bg-gray-100 dark:bg-gray-800 cursor-pointer"
        onClick={() => onItemClick?.(item)}
      >
        {item.type === "image" ? (
          <img
            src={item.thumbnail || item.url}
            alt={item.title}
            className="w-full h-full object-cover"
          />
        ) : item.type === "video" ? (
          <div className="relative w-full h-full">
            <img
              src={item.thumbnail}
              alt={item.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-black/50 rounded-full p-3">
                <Icon name="play" className="w-8 h-8 text-white" />
              </div>
            </div>
            {item.duration && (
              <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                {formatDuration(item.duration)}
              </div>
            )}
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Icon name="musical-notes" className="w-16 h-16 text-gray-400" />
            {item.duration && (
              <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                {formatDuration(item.duration)}
              </div>
            )}
          </div>
        )}

        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setLightboxItem(item);
            }}
            className="p-2 bg-white/20 text-white rounded-full hover:bg-white/30 transition-colors"
          >
            <Icon name="eye" className="w-5 h-5" />
          </button>

          {allowDownload && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDownload?.(item);
              }}
              className="p-2 bg-white/20 text-white rounded-full hover:bg-white/30 transition-colors"
            >
              <Icon name="download" className="w-5 h-5" />
            </button>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              onLike?.(item.id);
            }}
            className="p-2 bg-white/20 text-white rounded-full hover:bg-white/30 transition-colors"
          >
            <Icon
              name={item.isLiked ? "heart" : "heart-outline"}
              className="w-5 h-5"
            />
          </button>
        </div>
      </div>

      {/* Media Info */}
      <div className="p-3">
        <h3 className="font-medium text-gray-900 dark:text-white truncate">
          {item.title || `${item.type}_${item.id}`}
        </h3>

        <div className="flex items-center justify-between mt-2 text-sm text-gray-500 dark:text-gray-400">
          <span>{formatDate(item.uploadDate)}</span>
          {item.size && <span>{formatFileSize(item.size)}</span>}
        </div>

        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {item.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" size="sm">
                {tag}
              </Badge>
            ))}
            {item.tags.length > 3 && (
              <Badge variant="secondary" size="sm">
                +{item.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center space-x-2">
            {item.likes && (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {item.likes} likes
              </span>
            )}
          </div>

          {allowDelete && (
            <button
              onClick={() => onDelete?.(item.id)}
              className="p-1 text-red-500 hover:text-red-700 transition-colors"
            >
              <Icon name="trash" className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );

  const Lightbox = () => {
    if (!lightboxItem) return null;

    return (
      <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
        <button
          onClick={() => setLightboxItem(null)}
          className="absolute top-4 right-4 text-white p-2 hover:bg-white/20 rounded-full transition-colors"
        >
          <Icon name="close" className="w-6 h-6" />
        </button>

        <div className="max-w-4xl max-h-full p-4">
          {lightboxItem.type === "image" ? (
            <img
              src={lightboxItem.url}
              alt={lightboxItem.title}
              className="max-w-full max-h-full object-contain"
            />
          ) : lightboxItem.type === "video" ? (
            <video
              src={lightboxItem.url}
              controls
              className="max-w-full max-h-full"
              autoPlay
            />
          ) : (
            <audio
              src={lightboxItem.url}
              controls
              autoPlay
              className="w-full"
            />
          )}

          {lightboxItem.title && (
            <div className="text-white text-center mt-4">
              <h3 className="text-lg font-medium">{lightboxItem.title}</h3>
              {lightboxItem.description && (
                <p className="text-gray-300 mt-2">{lightboxItem.description}</p>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div
      className={`bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg ${className}`}
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Media Gallery
          </h2>

          {allowUpload && (
            <Button variant="primary">
              <Icon name="add" className="w-4 h-4 mr-2" />
              Upload Media
            </Button>
          )}
        </div>

        {/* Filters and Search */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="all">All Media</option>
              <option value="image">Images</option>
              <option value="video">Videos</option>
              <option value="audio">Audio</option>
            </select>

            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [sort, order] = e.target.value.split("-");
                setSortBy(sort as any);
                setSortOrder(order as any);
              }}
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
              <option value="size-desc">Largest First</option>
              <option value="size-asc">Smallest First</option>
            </select>
          </div>

          <div className="flex-1 max-w-md">
            <div className="relative">
              <Icon
                name="search"
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
              />
              <input
                type="text"
                placeholder="Search media..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          {selectedItems.size > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {selectedItems.size} selected
              </span>
              {allowDelete && (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => {
                    selectedItems.forEach((id) => onDelete?.(id));
                    setSelectedItems(new Set());
                  }}
                >
                  Delete Selected
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Media Grid */}
      <div className="p-6">
        {filteredAndSortedItems.length === 0 ? (
          <div className="text-center py-12">
            <Icon
              name="images"
              className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4"
            />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No media found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {searchQuery || filterType !== "all"
                ? "Try adjusting your search or filters"
                : "Upload some media to get started"}
            </p>
          </div>
        ) : (
          <div
            className={`
            grid gap-4
            ${
              viewMode === "grid"
                ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
                : viewMode === "list"
                  ? "grid-cols-1"
                  : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
            }
          `}
          >
            {filteredAndSortedItems.map((item) => (
              <MediaCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <Lightbox />
    </div>
  );
};
