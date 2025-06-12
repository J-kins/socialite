/**
 * PostFeed Component
 * Complete social media feed with posts, infinite scroll, and interactions
 */

import PostCard from "../molecules/PostCard.js";
import Button from "../atoms/Button.js";
import Spinner from "../atoms/Spinner.js";
import Text from "../atoms/Text.js";

const PostFeed = ({
  id = "",
  posts = [],
  loading = false,
  hasMore = true,
  className = "",
  onLoadMore = "",
  onPostLike = "",
  onPostComment = "",
  onPostShare = "",
  emptyMessage = "No posts to show",
  emptySubtitle = "Posts will appear here when available",
  ...props
} = {}) => {
  const feedId = id || `post-feed-${Math.random().toString(36).substr(2, 9)}`;

  const baseClasses = ["post-feed", "space-y-6", className]
    .filter(Boolean)
    .join(" ");

  // Default handlers
  const defaultLoadMore =
    onLoadMore ||
    `
        console.log('Loading more posts...');
        // Show loading state
        const loadMoreBtn = document.querySelector('#${feedId} .load-more-btn');
        const spinner = document.querySelector('#${feedId} .load-more-spinner');
        if (loadMoreBtn) loadMoreBtn.style.display = 'none';
        if (spinner) spinner.style.display = 'block';
        
        // Simulate API call
        setTimeout(() => {
            if (loadMoreBtn) loadMoreBtn.style.display = 'block';
            if (spinner) spinner.style.display = 'none';
            console.log('More posts loaded');
        }, 2000);
    `;

  const defaultPostLike =
    onPostLike ||
    `
        console.log('Post liked:', postId);
    `;

  const defaultPostComment =
    onPostComment ||
    `
        console.log('Post comment:', postId);
    `;

  const defaultPostShare =
    onPostShare ||
    `
        console.log('Post shared:', postId);
    `;

  // Create additional attributes string
  const attrs = Object.entries(props)
    .map(([key, value]) => `${key}="${value}"`)
    .join(" ");

  // Render posts
  const postsHTML = posts
    .map((post) =>
      PostCard({
        id: `post-${post.id}`,
        post: post,
        onLike: `(${defaultPostLike})('${post.id}')`,
        onComment: `(${defaultPostComment})('${post.id}')`,
        onShare: `(${defaultPostShare})('${post.id}')`,
      }),
    )
    .join("");

  // Empty state
  const emptyStateHTML = `
        <div class="text-center py-12">
            <div class="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
            </div>
            ${Text({
              content: emptyMessage,
              element: "h3",
              size: "lg",
              weight: "medium",
              color: "muted",
              align: "center",
            })}
            ${Text({
              content: emptySubtitle,
              size: "sm",
              color: "muted",
              align: "center",
              className: "mt-2",
            })}
        </div>
    `;

  // Load more section
  const loadMoreHTML = hasMore
    ? `
        <div class="text-center py-6">
            ${Button({
              variant: "outline",
              label: "Load More Posts",
              className: "load-more-btn px-8",
              onClick: defaultLoadMore,
            })}
            
            <div class="load-more-spinner hidden">
                ${Spinner({
                  size: "md",
                  variant: "primary",
                })}
                <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">Loading more posts...</p>
            </div>
        </div>
    `
    : "";

  // Loading skeleton
  const loadingSkeletonHTML = `
        <div class="space-y-6">
            ${Array(3)
              .fill()
              .map(
                () => `
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 animate-pulse">
                    <!-- Header skeleton -->
                    <div class="flex items-center space-x-3 mb-4">
                        <div class="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                        <div class="flex-1">
                            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-2"></div>
                            <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                        </div>
                    </div>
                    
                    <!-- Content skeleton -->
                    <div class="space-y-2 mb-4">
                        <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                        <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5"></div>
                        <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/5"></div>
                    </div>
                    
                    <!-- Image skeleton -->
                    <div class="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
                    
                    <!-- Actions skeleton -->
                    <div class="flex items-center space-x-6">
                        <div class="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                        <div class="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                        <div class="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                    </div>
                </div>
            `,
              )
              .join("")}
        </div>
    `;

  return `
        <div 
            ${id ? `id="${feedId}"` : ""}
            class="${baseClasses}"
            ${attrs}
        >
            ${loading ? loadingSkeletonHTML : ""}
            
            ${!loading && posts.length === 0 ? emptyStateHTML : ""}
            
            ${
              !loading && posts.length > 0
                ? `
                <!-- Posts -->
                <div class="posts-container">
                    ${postsHTML}
                </div>
                
                <!-- Load More -->
                ${loadMoreHTML}
            `
                : ""
            }
        </div>

        <script>
        // PostFeed functionality
        class PostFeedManager {
            constructor(feedId) {
                this.feedId = feedId;
                this.posts = ${JSON.stringify(posts)};
                this.loading = ${loading};
                this.hasMore = ${hasMore};
                this.page = 1;
                
                this.initInfiniteScroll();
            }

            initInfiniteScroll() {
                let ticking = false;
                
                const checkScroll = () => {
                    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                    const windowHeight = window.innerHeight;
                    const documentHeight = document.documentElement.scrollHeight;
                    
                    // Load more when 200px from bottom
                    if (scrollTop + windowHeight >= documentHeight - 200 && this.hasMore && !this.loading) {
                        this.loadMorePosts();
                    }
                    
                    ticking = false;
                };

                window.addEventListener('scroll', () => {
                    if (!ticking) {
                        requestAnimationFrame(checkScroll);
                        ticking = true;
                    }
                });
            }

            loadMorePosts() {
                if (this.loading || !this.hasMore) return;
                
                this.loading = true;
                this.page++;
                
                // Call the load more handler
                (${defaultLoadMore})();
            }

            addPost(post) {
                this.posts.unshift(post);
                this.renderNewPost(post);
            }

            renderNewPost(post) {
                const postsContainer = document.querySelector(\`#\${this.feedId} .posts-container\`);
                if (postsContainer) {
                    const postHTML = \`\${PostCard({
                        id: \`post-\${post.id}\`,
                        post: post,
                        onLike: \`(${defaultPostLike})('\${post.id}')\`,
                        onComment: \`(${defaultPostComment})('\${post.id}')\`,
                        onShare: \`(${defaultPostShare})('\${post.id}')\`
                    })}\`;
                    
                    postsContainer.insertAdjacentHTML('afterbegin', postHTML);
                }
            }

            updatePost(postId, updates) {
                const postIndex = this.posts.findIndex(p => p.id === postId);
                if (postIndex !== -1) {
                    this.posts[postIndex] = { ...this.posts[postIndex], ...updates };
                    // Update UI accordingly
                }
            }

            removePost(postId) {
                this.posts = this.posts.filter(p => p.id !== postId);
                const postElement = document.getElementById(\`post-\${postId}\`);
                if (postElement) {
                    postElement.remove();
                }
            }
        }

        // Initialize PostFeed
        const postFeedManager_${feedId.replace(/-/g, "_")} = new PostFeedManager('${feedId}');

        // Global functions for this feed
        window.addPostToFeed_${feedId.replace(/-/g, "_")} = function(post) {
            postFeedManager_${feedId.replace(/-/g, "_")}.addPost(post);
        };

        window.updatePostInFeed_${feedId.replace(/-/g, "_")} = function(postId, updates) {
            postFeedManager_${feedId.replace(/-/g, "_")}.updatePost(postId, updates);
        };

        window.removePostFromFeed_${feedId.replace(/-/g, "_")} = function(postId) {
            postFeedManager_${feedId.replace(/-/g, "_")}.removePost(postId);
        };
        </script>
    `;
};

export default PostFeed;
