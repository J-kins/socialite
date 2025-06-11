import React, { useState } from "react";
import { MainLayout } from "./MainLayout";
import { CreatePost, PostCard, StoryViewer } from "../organisms";
import { Button, Icon, Badge } from "../atoms";
import type { MainLayoutProps } from "./MainLayout";
import type { CreatePostProps, PostCardProps } from "../organisms";

export interface Story {
  id: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  content: {
    type: "image" | "video";
    url: string;
    duration?: number;
  };
  timestamp: string;
  isViewed?: boolean;
}

export interface FeedPageProps extends Omit<MainLayoutProps, "children"> {
  posts: PostCardProps["post"][];
  stories?: Story[];
  currentUser?: CreatePostProps["user"];
  onCreatePost?: CreatePostProps["onSubmit"];
  onPostInteraction?: {
    onLike?: (postId: string) => void;
    onComment?: (postId: string) => void;
    onShare?: (postId: string) => void;
    onSave?: (postId: string) => void;
  };
  onStoryClick?: (story: Story) => void;
  feedFilter?: "all" | "friends" | "following";
  onFilterChange?: (filter: "all" | "friends" | "following") => void;
  isLoading?: boolean;
  hasMorePosts?: boolean;
  onLoadMore?: () => void;
  className?: string;
}

export const FeedPage: React.FC<FeedPageProps> = ({
  posts,
  stories = [],
  currentUser,
  onCreatePost,
  onPostInteraction = {},
  onStoryClick,
  feedFilter = "all",
  onFilterChange,
  isLoading = false,
  hasMorePosts = false,
  onLoadMore,
  className = "",
  ...layoutProps
}) => {
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [storyIndex, setStoryIndex] = useState(0);

  const handleStoryClick = (story: Story) => {
    const index = stories.findIndex((s) => s.id === story.id);
    setStoryIndex(index);
    setSelectedStory(story);
    onStoryClick?.(story);
  };

  const handleNextStory = () => {
    if (storyIndex < stories.length - 1) {
      const nextIndex = storyIndex + 1;
      setStoryIndex(nextIndex);
      setSelectedStory(stories[nextIndex]);
    } else {
      setSelectedStory(null);
    }
  };

  const handlePreviousStory = () => {
    if (storyIndex > 0) {
      const prevIndex = storyIndex - 1;
      setStoryIndex(prevIndex);
      setSelectedStory(stories[prevIndex]);
    }
  };

  const feedFilters = [
    { id: "all", label: "All Posts", icon: "globe" },
    { id: "friends", label: "Friends", icon: "people" },
    { id: "following", label: "Following", icon: "heart" },
  ];

  return (
    <MainLayout {...layoutProps} className={className}>
      <div className="max-w-2xl mx-auto py-6 px-4">
        {/* Stories Section */}
        {stories.length > 0 && (
          <div className="mb-6">
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-3">
                <Icon
                  name="images"
                  className="w-5 h-5 text-gray-500 dark:text-gray-400"
                />
                <h2 className="font-medium text-gray-900 dark:text-white">
                  Stories
                </h2>
              </div>

              <div className="flex space-x-3 overflow-x-auto pb-2">
                {/* Add Story */}
                {currentUser && (
                  <button className="flex-shrink-0 flex flex-col items-center space-y-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center">
                        <Icon name="add" className="w-6 h-6 text-gray-400" />
                      </div>
                    </div>
                    <span className="text-xs text-gray-600 dark:text-gray-400 max-w-[60px] truncate">
                      Add Story
                    </span>
                  </button>
                )}

                {/* Stories */}
                {stories.map((story) => (
                  <button
                    key={story.id}
                    onClick={() => handleStoryClick(story)}
                    className="flex-shrink-0 flex flex-col items-center space-y-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="relative">
                      <div
                        className={`w-16 h-16 rounded-full p-0.5 ${
                          story.isViewed
                            ? "bg-gray-300 dark:bg-gray-600"
                            : "bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500"
                        }`}
                      >
                        <img
                          src={story.author.avatar}
                          alt={story.author.name}
                          className="w-full h-full rounded-full object-cover border-2 border-white dark:border-gray-900"
                        />
                      </div>
                      {story.content.type === "video" && (
                        <div className="absolute bottom-0 right-0 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-900">
                          <Icon name="play" className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-gray-600 dark:text-gray-400 max-w-[60px] truncate">
                      {story.author.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Feed Filters */}
        <div className="mb-6">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <h2 className="font-medium text-gray-900 dark:text-white">
                Your Feed
              </h2>

              <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                {feedFilters.map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => onFilterChange?.(filter.id as any)}
                    className={`
                      flex items-center space-x-2 px-3 py-1 text-sm font-medium rounded-md transition-colors
                      ${
                        feedFilter === filter.id
                          ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                          : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                      }
                    `}
                  >
                    <Icon name={filter.icon} className="w-4 h-4" />
                    <span>{filter.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Create Post */}
        {currentUser && (
          <div className="mb-6">
            <CreatePost
              user={currentUser}
              onSubmit={onCreatePost}
              placeholder={`What's on your mind, ${currentUser.name}?`}
            />
          </div>
        )}

        {/* Posts Feed */}
        <div className="space-y-6">
          {posts.length === 0 && !isLoading ? (
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-12 text-center">
              <Icon
                name="document-text"
                className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4"
              />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No posts yet
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                {feedFilter === "friends"
                  ? "Your friends haven't posted anything yet. Be the first to share something!"
                  : feedFilter === "following"
                    ? "People you follow haven't posted anything yet."
                    : "Your feed is empty. Start following people or join groups to see posts."}
              </p>
              {currentUser && (
                <Button variant="primary">
                  <Icon name="add" className="w-4 h-4 mr-2" />
                  Create your first post
                </Button>
              )}
            </div>
          ) : (
            <>
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onLike={onPostInteraction.onLike}
                  onComment={onPostInteraction.onComment}
                  onShare={onPostInteraction.onShare}
                  onSave={onPostInteraction.onSave}
                />
              ))}

              {/* Loading Skeleton */}
              {isLoading && (
                <div className="space-y-6">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4 animate-pulse"
                    >
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full" />
                        <div className="flex-1">
                          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/4 mb-2" />
                          <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/6" />
                        </div>
                      </div>
                      <div className="space-y-2 mb-4">
                        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full" />
                        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4" />
                      </div>
                      <div className="h-48 bg-gray-300 dark:bg-gray-600 rounded-lg mb-4" />
                      <div className="flex space-x-4">
                        <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-20" />
                        <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-20" />
                        <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-20" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Load More */}
              {hasMorePosts && !isLoading && (
                <div className="text-center py-6">
                  <Button variant="outline" onClick={onLoadMore}>
                    <Icon name="refresh" className="w-4 h-4 mr-2" />
                    Load more posts
                  </Button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Floating Action Button for Mobile */}
        {currentUser && (
          <button className="lg:hidden fixed bottom-20 right-4 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center z-40">
            <Icon name="add" className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Story Viewer */}
      {selectedStory && (
        <StoryViewer
          stories={stories}
          currentStoryIndex={storyIndex}
          onNext={handleNextStory}
          onPrevious={handlePreviousStory}
          onClose={() => setSelectedStory(null)}
        />
      )}
    </MainLayout>
  );
};
