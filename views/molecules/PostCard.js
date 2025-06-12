/**
 * PostCard Component
 * Complete social media post card with all interactions
 */

import AvatarWithName from './AvatarWithName.js';
import PostText from '../atoms/PostText.js';
import PostImage from '../atoms/PostImage.js';
import PostVideo from '../atoms/PostVideo.js';
import LikeButton from '../atoms/LikeButton.js';
import CommentButton from '../atoms/CommentButton.js';
import ShareButton from '../atoms/ShareButton.js';
import Text from '../atoms/Text.js';
import Icon from '../atoms/Icon.js';

const PostCard = ({
    id = '',
    post = {},
    showActions = true,
    className = '',
    onLike = '',
    onComment = '',
    onShare = '',
    ...props
} = {}) => {
    
    const {
        author = {},
        content = '',
        images = [],
        videos = [],
        timestamp = '',
        likes = 0,
        comments = 0,
        shares = 0,
        liked = false,
        location = '',
        privacy = 'public'
    } = post;

    const baseClasses = [
        'bg-white',
        'dark:bg-gray-800',
        'rounded-lg',
        'shadow-sm',
        'border',
        'border-gray-200',
        'dark:border-gray-700',
        'overflow-hidden',
        className
    ].filter(Boolean).join(' `;

    const postId = id || `post-${Math.random().toString(36).substr(2, 9)}`;

    // Create additional attributes string
    const attrs = Object.entries(props)
        .map(([key, value]) => `${key}="${value}"`)
        .join(' ');

    // Privacy icon
    const privacyIcons = {
        public: 'globe-outline',
        friends: 'people-outline',
        private: 'lock-closed-outline'
    };

    // Format timestamp
    const formatTimestamp = (timestamp) => {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 60) return `${minutes}m`;
        if (hours < 24) return `${hours}h`;
        if (days < 7) return `${days}d`;
        return date.toLocaleDateString();
    };

    // Render media
    const renderMedia = () => {
        if (videos.length > 0) {
            return videos.map((video, index) => 
                PostVideo({
                    key: index,
                    src: video.url,
                    poster: video.thumbnail,
                    className: 'mb-3'
                })
            ).join('');
        }
        
        if (images.length > 0) {
            if (images.length === 1) {
                return PostImage({
                    src: images[0].url,
                    alt: images[0].caption || '',
                    lightbox: true,
                    className: 'mb-3'
                });
            } else {
                // Grid layout for multiple images
                const gridClass = images.length === 2 ? 'grid-cols-2' : 
                                images.length === 3 ? 'grid-cols-2' : 'grid-cols-2';
                
                return `
                    <div class="grid ${gridClass} gap-2 mb-3">
                        ${images.slice(0, 4).map((image, index) => {
                            if (index === 3 && images.length > 4) {
                                return `
                                    <div class="relative">
                                        ${PostImage({
                                            src: image.url,
                                            alt: image.caption || '',
                                            lightbox: true,
                                            className: 'aspect-square'
                                        })}
                                        <div class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white font-semibold text-lg">
                                            +${images.length - 4}
                                        </div>
                                    </div>
                                `;
                            }
                            return PostImage({
                                src: image.url,
                                alt: image.caption || '',
                                lightbox: true,
                                className: index === 2 && images.length === 3 ? 'col-span-2' : 'aspect-square'
                            });
                        }).join('')}
                    </div>
                `;
            }
        }
        
        return '';
    };

    return `
        <article 
            ${id ? `id="${postId}"` : ''}
            class="${baseClasses}"
            ${attrs}
        >
            <!-- Post Header -->
            <div class="p-4 pb-0">
                <div class="flex items-start justify-between">
                    <div class="flex-1">
                        ${AvatarWithName({
                            src: author.avatar,
                            name: author.name,
                            subtitle: `${formatTimestamp(timestamp)}${location ? ` • ${location}` : ''}`,
                            size: 'md',
                            clickable: true,
                            onClick: `window.location.href='/profile/${author.id}'`
                        })}
                    </div>
                    
                    <div class="flex items-center space-x-2 ml-3">
                        ${privacy ? `
                            ${Icon({
                                name: privacyIcons[privacy] || 'globe-outline',
                                type: 'ion',
                                size: 'sm',
                                className: 'text-gray-400'
                            })}
                        ` : ''}
                        
                        <button type="button" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                            ${Icon({
                                name: 'ellipsis-horizontal',
                                type: 'svg',
                                size: 'sm'
                            })}
                        </button>
                    </div>
                </div>
            </div>

            <!-- Post Content -->
            <div class="px-4 py-3">
                ${content ? `
                    ${PostText({
                        content: content,
                        maxLength: 280,
                        showReadMore: true,
                        linkify: true,
                        mentionify: true,
                        hashtagify: true
                    })}
                ` : ''}
            </div>

            <!-- Post Media -->
            <div class="px-4">
                ${renderMedia()}
            </div>

            <!-- Post Actions -->
            ${showActions ? `
                <div class="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-4">
                            ${LikeButton({
                                liked: liked,
                                count: likes,
                                onToggle: onLike || `console.log('Like toggled for post ${postId}')`
                            })}
                            
                            ${CommentButton({
                                count: comments,
                                onClick: onComment || `console.log('Comment clicked for post ${postId}')`
                            })}
                            
                            ${ShareButton({
                                count: shares,
                                shareUrl: `${window.location.origin}/post/${postId}`,
                                shareTitle: `${author.name} on Nexify`,
                                shareText: content.substring(0, 100),
                                onClick: onShare
                            })}
                        </div>
                        
                        <!-- Bookmark button -->
                        <button type="button" class="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200">
                            ${Icon({
                                name: 'bookmark-outline',
                                type: 'ion',
                                size: 'md'
                            })}
                        </button>
                    </div>
                </div>
            ` : ''}
        </article>
    `;
};

export default PostCard;