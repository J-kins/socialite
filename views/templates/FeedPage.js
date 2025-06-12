/**
 * FeedPage Template
 * Social media feed page with posts and interactions
 */

import MainLayout from "./MainLayout.js";
import PostCard from "../molecules/PostCard.js";
import Button from "../atoms/Button.js";
import Icon from "../atoms/Icon.js";
import AvatarWithName from "../molecules/AvatarWithName.js";

const FeedPage = ({
  id = "",
  user = {},
  posts = [],
  stories = [],
  friends = [],
  suggestions = [],
  className = "",
  ...props
} = {}) => {
  const pageId = id || `feed-page-${Math.random().toString(36).substr(2, 9)}`;

  // Sample data if not provided
  const defaultPosts =
    posts.length > 0
      ? posts
      : [
          {
            id: "1",
            author: {
              id: "user1",
              name: "Jesse Steeve",
              avatar: "/assets/images/avatars/avatar-2.jpg",
            },
            content:
              "Just had an amazing day at the beach! The sunset was absolutely breathtaking. 🌅 #BeachLife #Sunset #Nature",
            images: [
              {
                url: "/assets/images/posts/beach-sunset.jpg",
                caption: "Beautiful sunset",
              },
            ],
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            likes: 24,
            comments: 8,
            shares: 3,
            liked: false,
            location: "Malibu Beach",
            privacy: "public",
          },
          {
            id: "2",
            author: {
              id: "user2",
              name: "Martin Gray",
              avatar: "/assets/images/avatars/avatar-3.jpg",
            },
            content:
              "Working on a new project! Excited to share it with everyone soon. Thanks to my team for all the hard work! 💪 #TeamWork #Project #Excited",
            timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
            likes: 15,
            comments: 5,
            shares: 2,
            liked: true,
            privacy: "friends",
          },
          {
            id: "3",
            author: {
              id: "user3",
              name: "Sarah Johnson",
              avatar: "/assets/images/avatars/avatar-4.jpg",
            },
            content:
              "Amazing food at this new restaurant! Highly recommend the pasta. 🍝",
            images: [
              {
                url: "/assets/images/posts/food-1.jpg",
                caption: "Delicious pasta",
              },
              {
                url: "/assets/images/posts/food-2.jpg",
                caption: "Great atmosphere",
              },
            ],
            timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
            likes: 32,
            comments: 12,
            shares: 6,
            liked: false,
            location: "Downtown Bistro",
            privacy: "public",
          },
        ];

  const defaultFriends =
    friends.length > 0
      ? friends
      : [
          {
            id: "1",
            name: "Alex Chen",
            avatar: "/assets/images/avatars/avatar-5.jpg",
            isOnline: true,
          },
          {
            id: "2",
            name: "Emma Wilson",
            avatar: "/assets/images/avatars/avatar-6.jpg",
            isOnline: false,
          },
          {
            id: "3",
            name: "David Brown",
            avatar: "/assets/images/avatars/avatar-7.jpg",
            isOnline: true,
          },
          {
            id: "4",
            name: "Lisa Davis",
            avatar: "/assets/images/avatars/avatar-8.jpg",
            isOnline: false,
          },
        ];

  // Create post content
  const postsHTML = defaultPosts
    .map((post) =>
      PostCard({
        id: `post-${post.id}`,
        post: post,
        className: "mb-6",
        onLike: `handlePostLike('${post.id}')`,
        onComment: `handlePostComment('${post.id}')`,
        onShare: `handlePostShare('${post.id}')`,
      }),
    )
    .join("");

  // Create stories section
  const storiesHTML = `
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
            <div class="flex items-center space-x-4 overflow-x-auto scrollbar-thin">
                <!-- Add Story -->
                <div class="flex-shrink-0 text-center">
                    <div class="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                        ${Icon({ name: "add", type: "svg", size: "lg", className: "text-gray-600 dark:text-gray-400" })}
                    </div>
                    <span class="text-xs text-gray-600 dark:text-gray-400">Add Story</span>
                </div>

                <!-- Friend Stories -->
                ${defaultFriends
                  .slice(0, 6)
                  .map(
                    (friend) => `
                    <div class="flex-shrink-0 text-center cursor-pointer">
                        <div class="w-16 h-16 p-1 bg-gradient-to-tr from-yellow-400 to-pink-600 rounded-full mb-2">
                            <img src="${friend.avatar}" alt="${friend.name}" class="w-full h-full rounded-full border-2 border-white" />
                        </div>
                        <span class="text-xs text-gray-600 dark:text-gray-400 truncate w-16 block">${friend.name.split(" ")[0]}</span>
                    </div>
                `,
                  )
                  .join("")}
            </div>
        </div>
    `;

  // Create quick post section
  const quickPostHTML = `
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
            <div class="flex items-start space-x-3">
                <img src="${user.avatar || "/assets/images/avatars/default.jpg"}" alt="${user.name}" class="w-10 h-10 rounded-full" />
                <div class="flex-1">
                    <div class="bg-gray-100 dark:bg-gray-700 rounded-full px-4 py-3 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors" onclick="openCreatePost()">
                        <span class="text-gray-500 dark:text-gray-400">What's on your mind, ${user.name?.split(" ")[0] || "there"}?</span>
                    </div>
                    <div class="flex items-center justify-between mt-3">
                        <div class="flex items-center space-x-4">
                            <button type="button" class="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors" onclick="openCreatePost('photo')">
                                ${Icon({ name: "image-outline", type: "ion", size: "sm" })}
                                <span class="text-sm">Photo</span>
                            </button>
                            <button type="button" class="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors" onclick="openCreatePost('video')">
                                ${Icon({ name: "videocam-outline", type: "ion", size: "sm" })}
                                <span class="text-sm">Video</span>
                            </button>
                            <button type="button" class="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors" onclick="openCreatePost('feeling')">
                                ${Icon({ name: "happy-outline", type: "ion", size: "sm" })}
                                <span class="text-sm">Feeling</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

  // Right sidebar content
  const rightSidebar = `
        <div class="space-y-6">
            <!-- Online Friends -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Online Friends</h3>
                <div class="space-y-3">
                    ${defaultFriends
                      .filter((friend) => friend.isOnline)
                      .map(
                        (friend) => `
                        <div class="flex items-center space-x-3">
                            ${AvatarWithName({
                              src: friend.avatar,
                              name: friend.name,
                              isOnline: friend.isOnline,
                              size: "sm",
                              clickable: true,
                              onClick: `openChat('${friend.id}')`,
                            })}
                        </div>
                    `,
                      )
                      .join("")}
                </div>
            </div>

            <!-- Trending Topics -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Trending</h3>
                <div class="space-y-2">
                    <a href="/hashtag/sunset" class="block text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium">#Sunset</a>
                    <a href="/hashtag/teamwork" class="block text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium">#TeamWork</a>
                    <a href="/hashtag/foodie" class="block text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium">#Foodie</a>
                    <a href="/hashtag/nature" class="block text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium">#Nature</a>
                </div>
            </div>
        </div>
    `;

  const feedContent = `
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                <!-- Main Feed -->
                <div class="lg:col-span-2">
                    ${storiesHTML}
                    ${quickPostHTML}
                    
                    <!-- Posts Feed -->
                    <div id="posts-feed">
                        ${postsHTML}
                    </div>

                    <!-- Load More -->
                    <div class="text-center py-6">
                        ${Button({
                          variant: "outline",
                          label: "Load More Posts",
                          onClick: "loadMorePosts()",
                          className: "px-8",
                        })}
                    </div>
                </div>

                <!-- Right Sidebar -->
                <div class="hidden lg:block">
                    ${rightSidebar}
                </div>
            </div>
        </div>
    `;

  return (
    MainLayout({
      id: pageId,
      title: "Feed - Nexify",
      user: user,
      children: feedContent,
      className: className,
      ...props,
    }) +
    `
        <script>
        // Feed page functionality
        function openCreatePost(type = 'text') {
            console.log('Opening create post modal for type:', type);
            // TODO: Implement create post modal
        }

        function openChat(friendId) {
            console.log('Opening chat with friend:', friendId);
            // TODO: Implement chat functionality
        }

        function loadMorePosts() {
            console.log('Loading more posts...');
            // TODO: Implement pagination
        }

        function handlePostLike(postId) {
            console.log('Handling like for post:', postId);
            // TODO: Implement like functionality
        }

        function handlePostComment(postId) {
            console.log('Handling comment for post:', postId);
            // TODO: Implement comment functionality
        }

        function handlePostShare(postId) {
            console.log('Handling share for post:', postId);
            // TODO: Implement share functionality
        }

        // Initialize feed
        document.addEventListener('DOMContentLoaded', function() {
            console.log('Feed page initialized');
        });
        </script>
    `
  );
};

export default FeedPage;
