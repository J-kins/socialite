import React, { useState, useCallback } from 'react';
import { Header } from '../organisms/Header';
import { Sidebar } from '../organisms/Sidebar';
import { MainContentPanel } from '../organisms/MainContentPanel';
import { CreatePost } from '../organisms/CreatePost';
import { Button } from '../atoms/Button';
import { Badge } from '../atoms/Badge';
import { Avatar } from '../atoms/Avatar';
import { GalleryUploader } from '../organisms/GalleryUploader';
import '../../../styles/templates/post-creation-page.css';

export interface PostCreationPageProps {
  user?: {
    id: string;
    name: string;
    avatar: string;
    username: string;
  };
  onPostCreate?: (post: PostData) => void;
  onSaveDraft?: (draft: PostData) => void;
  onSchedulePost?: (post: PostData, scheduledTime: Date) => void;
  maxImageSize?: number;
  maxVideoSize?: number;
  allowedFileTypes?: string[];
  className?: string;
}

export interface PostData {
  id?: string;
  content: string;
  visibility: 'public' | 'friends' | 'private';
  location?: string;
  tags: string[];
  mentions: string[];
  mediaFiles: MediaFile[];
  scheduledTime?: Date;
  isDraft: boolean;
}

export interface MediaFile {
  id: string;
  type: 'image' | 'video' | 'document';
  url: string;
  thumbnail?: string;
  name: string;
  size: number;
}

export const PostCreationPage: React.FC<PostCreationPageProps> = ({
  user = {
    id: 'user-1',
    name: 'John Smith',
    avatar: '/assets/images/avatars/avatar-1.jpg',
    username: 'johnsmith',
  },
  onPostCreate,
  onSaveDraft,
  onSchedulePost,
  maxImageSize = 10 * 1024 * 1024, // 10MB
  maxVideoSize = 100 * 1024 * 1024, // 100MB
  allowedFileTypes = ['image/*', 'video/*'],
  className,
}) => {
  const [postContent, setPostContent] = useState('');
  const [visibility, setVisibility] = useState<'public' | 'friends' | 'private'>('public');
  const [location, setLocation] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [mentions, setMentions] = useState<string[]>([]);
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledTime, setScheduledTime] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showMediaUpload, setShowMediaUpload] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  const handleContentChange = useCallback((content: string) => {
    setPostContent(content);

    // Extract mentions (@username)
    const mentionMatches = content.match(/@(\w+)/g);
    if (mentionMatches) {
      const newMentions = mentionMatches.map((match) => match.slice(1));
      setMentions(newMentions);
    }

    // Extract hashtags (#tag)
    const tagMatches = content.match(/#(\w+)/g);
    if (tagMatches) {
      const newTags = tagMatches.map((match) => match.slice(1));
      setTags(newTags);
    }
  }, []);

  const handleMediaUpload = useCallback((files: File[]) => {
    const newMediaFiles: MediaFile[] = files.map((file, index) => ({
      id: `media-${Date.now()}-${index}`,
      type: file.type.startsWith('image/')
        ? 'image'
        : file.type.startsWith('video/')
          ? 'video'
          : 'document',
      url: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
      thumbnail: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
    }));

    setMediaFiles((prev) => [...prev, ...newMediaFiles]);
    setShowMediaUpload(false);
  }, []);

  const handleRemoveMedia = useCallback((mediaId: string) => {
    setMediaFiles((prev) => prev.filter((m) => m.id !== mediaId));
  }, []);

  const createPostData = (): PostData => ({
    content: postContent,
    visibility,
    location,
    tags,
    mentions,
    mediaFiles,
    scheduledTime: scheduledTime || undefined,
    isDraft: false,
  });

  const handlePublishPost = async () => {
    if (!postContent.trim() && mediaFiles.length === 0) return;

    setIsLoading(true);
    try {
      const postData = createPostData();

      if (isScheduled && scheduledTime) {
        await onSchedulePost?.(postData, scheduledTime);
      } else {
        await onPostCreate?.(postData);
      }

      // Reset form
      setPostContent('');
      setMediaFiles([]);
      setLocation('');
      setTags([]);
      setMentions([]);
      setIsScheduled(false);
      setScheduledTime(null);
    } catch (error) {
      console.error('Error publishing post:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!postContent.trim() && mediaFiles.length === 0) return;

    setIsLoading(true);
    try {
      const draftData = { ...createPostData(), isDraft: true };
      await onSaveDraft?.(draftData);
    } catch (error) {
      console.error('Error saving draft:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case 'public':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z"
              clipRule="evenodd"
            />
          </svg>
        );
      case 'friends':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
          </svg>
        );
      case 'private':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
              clipRule="evenodd"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`post-creation-page ${className || ''}`}>
      <Header />
      <Sidebar />

      <MainContentPanel className="pt-16">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Create Post</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Share your thoughts, photos, and videos with your network
            </p>
          </div>

          {/* Main Post Creation Form */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            {/* User Info Header */}
            <div className="flex items-center p-6 border-b border-gray-200 dark:border-gray-700">
              <Avatar src={user.avatar} alt={user.name} size="lg" className="mr-4" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{user.name}</h3>
                <div className="flex items-center space-x-2">
                  <select
                    value={visibility}
                    onChange={(e) => setVisibility(e.target.value as any)}
                    className="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                  >
                    <option value="public">Public</option>
                    <option value="friends">Friends</option>
                    <option value="private">Only me</option>
                  </select>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    {getVisibilityIcon(visibility)}
                    <span className="ml-1 capitalize">{visibility}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Editor */}
            <div className="p-6">
              <textarea
                value={postContent}
                onChange={(e) => handleContentChange(e.target.value)}
                placeholder={`What's on your mind, ${user.name}?`}
                className="w-full min-h-[200px] p-4 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />

              {/* Character Counter */}
              <div className="flex justify-between items-center mt-2">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {postContent.length}/5000 characters
                </div>
                {(tags.length > 0 || mentions.length > 0) && (
                  <div className="flex flex-wrap gap-1">
                    {tags.map((tag, index) => (
                      <Badge key={`tag-${index}`} variant="primary" size="sm">
                        #{tag}
                      </Badge>
                    ))}
                    {mentions.map((mention, index) => (
                      <Badge key={`mention-${index}`} variant="secondary" size="sm">
                        @{mention}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Media Preview */}
            {mediaFiles.length > 0 && (
              <div className="px-6 pb-6">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Attached Media ({mediaFiles.length})
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {mediaFiles.map((media) => (
                    <div key={media.id} className="relative group">
                      <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                        {media.type === 'image' ? (
                          <img
                            src={media.url}
                            alt={media.name}
                            className="w-full h-full object-cover"
                          />
                        ) : media.type === 'video' ? (
                          <div className="w-full h-full bg-gray-900 flex items-center justify-center relative">
                            <video src={media.url} className="w-full h-full object-cover" muted />
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
                          <div className="w-full h-full flex items-center justify-center">
                            <svg
                              className="w-12 h-12 text-gray-400"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* Remove button */}
                      <button
                        onClick={() => handleRemoveMedia(media.id)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>

                      {/* File info */}
                      <div className="mt-2">
                        <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                          {media.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          {formatFileSize(media.size)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Options */}
            <div className="px-6 pb-6">
              {/* Location */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Add Location (Optional)
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Where are you?"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              {/* Schedule Post */}
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={isScheduled}
                    onChange={(e) => setIsScheduled(e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Schedule this post
                  </span>
                </label>

                {isScheduled && (
                  <input
                    type="datetime-local"
                    value={scheduledTime ? scheduledTime.toISOString().slice(0, 16) : ''}
                    onChange={(e) => setScheduledTime(new Date(e.target.value))}
                    min={new Date().toISOString().slice(0, 16)}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-700 dark:text-white"
                  />
                )}
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
              {/* Media and Options */}
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowMediaUpload(true)}
                  className="flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Photo/Video</span>
                </Button>

                <Button variant="outline" size="sm" className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Feeling/Activity</span>
                </Button>

                <Button variant="outline" size="sm" className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Check In</span>
                </Button>
              </div>

              {/* Post Actions */}
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  onClick={handleSaveDraft}
                  disabled={isLoading || (!postContent.trim() && mediaFiles.length === 0)}
                >
                  Save Draft
                </Button>
                <Button
                  variant="primary"
                  onClick={handlePublishPost}
                  disabled={isLoading || (!postContent.trim() && mediaFiles.length === 0)}
                  className="min-w-[100px]"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Publishing...</span>
                    </div>
                  ) : isScheduled ? (
                    'Schedule'
                  ) : (
                    'Post'
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Media Upload Modal */}
          {showMediaUpload && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full mx-4">
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Add Photos/Videos
                  </h2>
                  <Button variant="outline" size="sm" onClick={() => setShowMediaUpload(false)}>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </Button>
                </div>
                <div className="p-6">
                  <GalleryUploader
                    acceptedTypes={allowedFileTypes}
                    maxFileSize={maxVideoSize}
                    onFilesAdded={handleMediaUpload}
                    className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </MainContentPanel>
    </div>
  );
};

export type { PostCreationPageProps, PostData, MediaFile };
