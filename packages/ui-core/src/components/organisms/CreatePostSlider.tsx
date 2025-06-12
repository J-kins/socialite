import React, { useState, useRef } from 'react';
import { FileUploader, MediaPlayer, ProgressBar, UserMention } from '../molecules';
import { Button, Icon, Avatar, TextArea, Badge } from '../atoms';

export interface CreatePostSliderProps {
  isOpen: boolean;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  onClose: () => void;
  onSubmit: (postData: PostData) => void;
  className?: string;
}

export interface PostData {
  content: string;
  files: File[];
  privacy: 'public' | 'friends' | 'private';
  tags: string[];
  mentions: string[];
  location?: string;
  scheduledDate?: Date;
}

export const CreatePostSlider: React.FC<CreatePostSliderProps> = ({
  isOpen,
  user,
  onClose,
  onSubmit,
  className = '',
}) => {
  const [content, setContent] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [privacy, setPrivacy] = useState<'public' | 'friends' | 'private'>('public');
  const [tags, setTags] = useState<string[]>([]);
  const [mentions, setMentions] = useState<string[]>([]);
  const [location, setLocation] = useState('');
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showMentions, setShowMentions] = useState(false);

  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async () => {
    if (!content.trim() && files.length === 0) return;

    setIsSubmitting(true);

    try {
      const postData: PostData = {
        content,
        files,
        privacy,
        tags,
        mentions,
        location: location || undefined,
        scheduledDate,
      };

      await onSubmit(postData);
      handleReset();
      onClose();
    } catch (error) {
      console.error('Failed to create post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setContent('');
    setFiles([]);
    setPrivacy('public');
    setTags([]);
    setMentions([]);
    setLocation('');
    setScheduledDate(undefined);
    setShowAdvanced(false);
    setUploadProgress(0);
  };

  const handleFileUpload = (uploadedFiles: File[]) => {
    setFiles((prev) => [...prev, ...uploadedFiles]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleEmojiSelect = (emoji: string) => {
    const textarea = textAreaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newContent = content.slice(0, start) + emoji + content.slice(end);
      setContent(newContent);

      // Reset cursor position
      setTimeout(() => {
        textarea.setSelectionRange(start + emoji.length, start + emoji.length);
        textarea.focus();
      }, 0);
    }
    setShowEmojiPicker(false);
  };

  const handleMention = (username: string) => {
    const textarea = textAreaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const beforeCursor = content.slice(0, start);
      const afterCursor = content.slice(end);

      // Find the last @ symbol before cursor
      const lastAtIndex = beforeCursor.lastIndexOf('@');
      if (lastAtIndex !== -1) {
        const beforeAt = beforeCursor.slice(0, lastAtIndex);
        const newContent = beforeAt + `@${username} ` + afterCursor;
        setContent(newContent);

        if (!mentions.includes(username)) {
          setMentions((prev) => [...prev, username]);
        }
      }
    }
    setShowMentions(false);
  };

  const addTag = (tag: string) => {
    if (tag && !tags.includes(tag)) {
      setTags((prev) => [...prev, tag]);
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  };

  const getCharacterCount = () => {
    return content.length;
  };

  const getCharacterLimit = () => {
    return 280; // Twitter-like limit
  };

  const isOverLimit = () => {
    return getCharacterCount() > getCharacterLimit();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Slider */}
      <div
        className={`
        fixed right-0 top-0 h-full w-full max-w-2xl bg-white dark:bg-gray-800 
        shadow-2xl z-50 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full'} ${className}
      `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Create Post</h2>
            <div className="flex items-center space-x-2">
              {isSubmitting && (
                <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                  <Icon name="refresh" className="w-4 h-4 animate-spin" />
                  <span>Publishing...</span>
                </div>
              )}
              <Button variant="ghost" size="sm" onClick={onClose} disabled={isSubmitting}>
                <Icon name="close" className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* User Info */}
            <div className="flex items-center space-x-3">
              <Avatar src={user.avatar} alt={user.name} size="md" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
                <select
                  value={privacy}
                  onChange={(e) => setPrivacy(e.target.value as any)}
                  className="text-sm text-gray-500 dark:text-gray-400 bg-transparent border-none focus:ring-0 p-0"
                >
                  <option value="public">🌍 Public</option>
                  <option value="friends">👥 Friends</option>
                  <option value="private">🔒 Only me</option>
                </select>
              </div>
            </div>

            {/* Post Content */}
            <div className="space-y-3">
              <div className="relative">
                <TextArea
                  ref={textAreaRef}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="What's on your mind?"
                  className="w-full min-h-32 resize-none border-none focus:ring-0 text-lg placeholder-gray-400"
                  rows={4}
                />

                {/* Character Count */}
                <div className="absolute bottom-2 right-2 flex items-center space-x-2">
                  {getCharacterCount() > 0 && (
                    <span className={`text-sm ${isOverLimit() ? 'text-red-500' : 'text-gray-400'}`}>
                      {getCharacterCount()}/{getCharacterLimit()}
                    </span>
                  )}
                </div>
              </div>

              {/* Tags */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="cursor-pointer hover:bg-red-100 dark:hover:bg-red-900/30"
                      onClick={() => removeTag(tag)}
                    >
                      #{tag}
                      <Icon name="close" className="w-3 h-3 ml-1" />
                    </Badge>
                  ))}
                </div>
              )}

              {/* Mentions */}
              {mentions.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {mentions.map((mention, index) => (
                    <UserMention
                      key={index}
                      user={{ id: mention, name: mention, username: mention }}
                      variant="pill"
                      size="sm"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* File Uploads */}
            {files.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900 dark:text-white">Attachments</h4>
                <div className="grid grid-cols-2 gap-3">
                  {files.map((file, index) => (
                    <div key={index} className="relative group">
                      {file.type.startsWith('image/') ? (
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      ) : file.type.startsWith('video/') ? (
                        <MediaPlayer
                          src={URL.createObjectURL(file)}
                          type="video"
                          variant="compact"
                        />
                      ) : (
                        <div className="w-full h-32 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                          <div className="text-center">
                            <Icon name="document" className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-500 truncate">{file.name}</p>
                          </div>
                        </div>
                      )}

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFile(index)}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Icon name="close" className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload Progress */}
            {uploadProgress > 0 && uploadProgress < 100 && (
              <ProgressBar
                value={uploadProgress}
                variant="default"
                showPercentage
                label="Uploading files..."
              />
            )}

            {/* Advanced Options */}
            {showAdvanced && (
              <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Icon name="location" className="w-4 h-4 inline mr-2" />
                    Location
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Add location..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                  />
                </div>

                {/* Schedule */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Icon name="time" className="w-4 h-4 inline mr-2" />
                    Schedule
                  </label>
                  <input
                    type="datetime-local"
                    value={scheduledDate ? scheduledDate.toISOString().slice(0, 16) : ''}
                    onChange={(e) =>
                      setScheduledDate(e.target.value ? new Date(e.target.value) : undefined)
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                  />
                </div>
              </div>
            )}

            {/* File Uploader */}
            <FileUploader
              accept="image/*,video/*,.pdf,.doc,.docx"
              multiple
              onUpload={handleFileUpload}
              className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4"
            />
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-4">
            {/* Action Buttons */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                >
                  <Icon name="happy" className="w-5 h-5" />
                </Button>

                <Button variant="ghost" size="sm" onClick={() => setShowMentions(!showMentions)}>
                  <Icon name="at" className="w-5 h-5" />
                </Button>

                <Button variant="ghost" size="sm" onClick={() => fileInputRef.current?.click()}>
                  <Icon name="image" className="w-5 h-5" />
                </Button>

                <Button variant="ghost" size="sm" onClick={() => setShowAdvanced(!showAdvanced)}>
                  <Icon name="settings" className="w-5 h-5" />
                </Button>
              </div>

              <Button variant="ghost" size="sm" onClick={handleReset} disabled={isSubmitting}>
                Clear
              </Button>
            </div>

            {/* Submit Button */}
            <Button
              variant="primary"
              className="w-full"
              onClick={handleSubmit}
              disabled={isSubmitting || isOverLimit() || (!content.trim() && files.length === 0)}
            >
              {isSubmitting ? (
                <>
                  <Icon name="refresh" className="w-4 h-4 mr-2 animate-spin" />
                  Publishing...
                </>
              ) : scheduledDate ? (
                'Schedule Post'
              ) : (
                'Publish Post'
              )}
            </Button>
          </div>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*,.pdf,.doc,.docx"
          className="hidden"
          onChange={(e) => {
            const files = Array.from(e.target.files || []);
            handleFileUpload(files);
            e.target.value = '';
          }}
        />
      </div>
    </>
  );
};
