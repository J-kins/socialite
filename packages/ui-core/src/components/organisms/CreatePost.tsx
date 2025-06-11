import React, { useState, useRef } from "react";
import { Avatar, Button, Icon, Input } from "../atoms";

export interface CreatePostProps {
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  onSubmit?: (postData: {
    content: string;
    media?: File[];
    privacy: "public" | "friends" | "private";
    location?: string;
    feeling?: string;
    tags?: string[];
  }) => void;
  onCancel?: () => void;
  placeholder?: string;
  maxLength?: number;
  allowMedia?: boolean;
  allowLocation?: boolean;
  allowFeeling?: boolean;
  allowTags?: boolean;
  className?: string;
}

export const CreatePost: React.FC<CreatePostProps> = ({
  user,
  onSubmit,
  onCancel,
  placeholder = "What's on your mind?",
  maxLength = 2000,
  allowMedia = true,
  allowLocation = true,
  allowFeeling = true,
  allowTags = true,
  className = "",
}) => {
  const [content, setContent] = useState("");
  const [selectedMedia, setSelectedMedia] = useState<File[]>([]);
  const [privacy, setPrivacy] = useState<"public" | "friends" | "private">(
    "public",
  );
  const [location, setLocation] = useState("");
  const [feeling, setFeeling] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [showPrivacyMenu, setShowPrivacyMenu] = useState(false);
  const [showFeelingMenu, setShowFeelingMenu] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const feelings = [
    { id: "happy", label: "Happy", emoji: "😊" },
    { id: "excited", label: "Excited", emoji: "🎉" },
    { id: "grateful", label: "Grateful", emoji: "🙏" },
    { id: "loved", label: "Loved", emoji: "❤️" },
    { id: "blessed", label: "Blessed", emoji: "✨" },
    { id: "accomplished", label: "Accomplished", emoji: "🏆" },
    { id: "relaxed", label: "Relaxed", emoji: "😌" },
    { id: "motivated", label: "Motivated", emoji: "💪" },
  ];

  const privacyOptions = [
    {
      id: "public",
      label: "Public",
      icon: "globe",
      description: "Anyone can see this post",
    },
    {
      id: "friends",
      label: "Friends",
      icon: "people",
      description: "Only your friends can see this",
    },
    {
      id: "private",
      label: "Only me",
      icon: "lock-closed",
      description: "Only you can see this post",
    },
  ];

  const handleMediaSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedMedia((prev) => [...prev, ...files].slice(0, 10)); // Max 10 files
  };

  const removeMedia = (index: number) => {
    setSelectedMedia((prev) => prev.filter((_, i) => i !== index));
  };

  const handleTagAdd = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const tag = tagInput.trim().replace(/^#/, "");
      if (tag && !tags.includes(tag)) {
        setTags((prev) => [...prev, tag]);
        setTagInput("");
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = () => {
    if (!content.trim() && selectedMedia.length === 0) return;

    onSubmit?.({
      content: content.trim(),
      media: selectedMedia.length > 0 ? selectedMedia : undefined,
      privacy,
      location: location.trim() || undefined,
      feeling: feeling || undefined,
      tags: tags.length > 0 ? tags : undefined,
    });

    // Reset form
    setContent("");
    setSelectedMedia([]);
    setLocation("");
    setFeeling("");
    setTags([]);
    setIsExpanded(false);
  };

  const getPrivacyIcon = (privacyType: string) => {
    const option = privacyOptions.find((p) => p.id === privacyType);
    return option?.icon || "globe";
  };

  const canSubmit = content.trim().length > 0 || selectedMedia.length > 0;

  return (
    <div
      className={`
      bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700
      rounded-lg p-4 shadow-sm
      ${className}
    `}
    >
      {/* Header */}
      <div className="flex items-center space-x-3 mb-4">
        <Avatar src={user.avatar} alt={user.name} size="md" />
        <div>
          <h3 className="font-medium text-gray-900 dark:text-white">
            {user.name}
          </h3>

          {/* Privacy Selector */}
          <div className="relative">
            <button
              onClick={() => setShowPrivacyMenu(!showPrivacyMenu)}
              className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              <Icon name={getPrivacyIcon(privacy)} className="w-4 h-4" />
              <span className="capitalize">{privacy}</span>
              <Icon name="chevron-down" className="w-3 h-3" />
            </button>

            {showPrivacyMenu && (
              <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 min-w-48">
                {privacyOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => {
                      setPrivacy(option.id as any);
                      setShowPrivacyMenu(false);
                    }}
                    className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                  >
                    <Icon
                      name={option.icon}
                      className="w-5 h-5 text-gray-400"
                    />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {option.label}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {option.description}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content Input */}
      <div className="mb-4">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={placeholder}
          className="w-full resize-none border-none outline-none text-lg placeholder-gray-400 dark:placeholder-gray-500 bg-transparent text-gray-900 dark:text-white"
          rows={isExpanded ? 6 : 3}
          maxLength={maxLength}
          onFocus={() => setIsExpanded(true)}
        />

        {content.length > 0 && (
          <div className="flex justify-end mt-2">
            <span
              className={`text-sm ${
                content.length > maxLength * 0.9
                  ? "text-red-500"
                  : "text-gray-400 dark:text-gray-500"
              }`}
            >
              {content.length}/{maxLength}
            </span>
          </div>
        )}
      </div>

      {/* Selected Media Preview */}
      {selectedMedia.length > 0 && (
        <div className="mb-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {selectedMedia.map((file, index) => (
              <div key={index} className="relative group">
                {file.type.startsWith("image/") ? (
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-24 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                    <Icon name="document" className="w-8 h-8 text-gray-400" />
                  </div>
                )}
                <button
                  onClick={() => removeMedia(index)}
                  className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Icon name="close" className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tags */}
      {allowTags && tags.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center space-x-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 text-sm rounded-full"
              >
                <span>#{tag}</span>
                <button
                  onClick={() => removeTag(tag)}
                  className="hover:text-blue-600 dark:hover:text-blue-300"
                >
                  <Icon name="close" className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Additional Options */}
      {isExpanded && (
        <div className="space-y-3 mb-4">
          {/* Location */}
          {allowLocation && (
            <div className="flex items-center space-x-2">
              <Icon name="location" className="w-5 h-5 text-gray-400" />
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Add location..."
                className="flex-1 border-none bg-gray-50 dark:bg-gray-800"
              />
            </div>
          )}

          {/* Feeling */}
          {allowFeeling && (
            <div className="relative">
              <button
                onClick={() => setShowFeelingMenu(!showFeelingMenu)}
                className="flex items-center space-x-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <Icon name="happy" className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700 dark:text-gray-300">
                  {feeling ? `Feeling ${feeling}` : "How are you feeling?"}
                </span>
                <Icon name="chevron-down" className="w-4 h-4 text-gray-400" />
              </button>

              {showFeelingMenu && (
                <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 p-2 grid grid-cols-4 gap-1">
                  {feelings.map((feeling) => (
                    <button
                      key={feeling.id}
                      onClick={() => {
                        setFeeling(feeling.label);
                        setShowFeelingMenu(false);
                      }}
                      className="p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors text-center"
                    >
                      <div className="text-2xl mb-1">{feeling.emoji}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        {feeling.label}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tags Input */}
          {allowTags && (
            <div className="flex items-center space-x-2">
              <Icon name="pricetag" className="w-5 h-5 text-gray-400" />
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagAdd}
                placeholder="Add tags... (press Enter or comma)"
                className="flex-1 border-none bg-gray-50 dark:bg-gray-800"
              />
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-4">
          {/* Media Upload */}
          {allowMedia && (
            <>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleMediaSelect}
                multiple
                accept="image/*,video/*"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center space-x-2 p-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <Icon name="images" className="w-5 h-5" />
                <span className="text-sm font-medium">Photo/Video</span>
              </button>
            </>
          )}

          {/* Live Video */}
          <button className="flex items-center space-x-2 p-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
            <Icon name="videocam" className="w-5 h-5" />
            <span className="text-sm font-medium">Live</span>
          </button>

          {/* Poll */}
          <button className="flex items-center space-x-2 p-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
            <Icon name="bar-chart" className="w-5 h-5" />
            <span className="text-sm font-medium">Poll</span>
          </button>
        </div>

        <div className="flex items-center space-x-2">
          {onCancel && (
            <Button variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={!canSubmit}
          >
            Post
          </Button>
        </div>
      </div>
    </div>
  );
};
