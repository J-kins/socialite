import React, { useState } from 'react';
import { MainLayout } from './MainLayout';

interface BlogPageProps {
  className?: string;
}

export const BlogPage: React.FC<BlogPageProps> = ({ className = '' }) => {
  const [activeTab, setActiveTab] = useState('latest');

  const tabs = [
    { id: 'latest', label: 'Latest', count: 156 },
    { id: 'trending', label: 'Trending', count: 24 },
    { id: 'following', label: 'Following', count: 18 },
    { id: 'saved', label: 'Saved', count: 12 },
  ];

  const posts = [
    {
      id: '1',
      title: 'The Future of Web Development: Trends to Watch in 2024',
      excerpt:
        'Explore the cutting-edge technologies and methodologies that are shaping the future of web development...',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      author: 'Sarah Johnson',
      authorAvatar: '/assets/images/avatars/avatar-1.jpg',
      authorBio: 'Senior Frontend Developer at TechCorp',
      publishedAt: '2024-03-10',
      readTime: '5 min read',
      category: 'Technology',
      tags: ['Web Development', 'JavaScript', 'React', 'Frontend'],
      image: '/assets/images/blog/tech-trends.jpg',
      likes: 234,
      comments: 18,
      views: 1547,
      isLiked: false,
      isSaved: true,
      isFollowing: true,
    },
    {
      id: '2',
      title: 'Building Sustainable Communities: A Guide for Social Platforms',
      excerpt:
        'Learn how to create and maintain healthy online communities that foster meaningful connections...',
      content:
        'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      author: 'Michael Chen',
      authorAvatar: '/assets/images/avatars/avatar-2.jpg',
      authorBio: 'Community Manager & Digital Strategist',
      publishedAt: '2024-03-08',
      readTime: '7 min read',
      category: 'Community',
      tags: ['Community Building', 'Social Media', 'Engagement'],
      image: '/assets/images/blog/community.jpg',
      likes: 189,
      comments: 32,
      views: 892,
      isLiked: true,
      isSaved: false,
      isFollowing: false,
    },
    {
      id: '3',
      title: 'Design Systems That Scale: Lessons from Big Tech',
      excerpt:
        'Discover how major technology companies build and maintain design systems that work across multiple products...',
      content:
        'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
      author: 'Emily Rodriguez',
      authorAvatar: '/assets/images/avatars/avatar-3.jpg',
      authorBio: 'UX Design Lead at DesignStudio',
      publishedAt: '2024-03-05',
      readTime: '10 min read',
      category: 'Design',
      tags: ['Design Systems', 'UX', 'Scalability', 'UI Components'],
      image: '/assets/images/blog/design-systems.jpg',
      likes: 456,
      comments: 67,
      views: 2341,
      isLiked: false,
      isSaved: true,
      isFollowing: true,
    },
  ];

  const categories = [
    'All Categories',
    'Technology',
    'Design',
    'Community',
    'Business',
    'Lifestyle',
    'Education',
    'Health',
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <MainLayout className={className}>
      <div className="main-container max-w-[1200px] mx-auto p-6">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-black dark:text-white mb-2">Blog</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Discover stories, insights, and ideas from the community
            </p>
          </div>
          <button className="button bg-primary text-white">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
            Write Article
          </button>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white dark:bg-dark3 rounded-xl shadow-sm mb-6">
          <div className="flex border-b border-slate-200 dark:border-slate-700">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
              >
                {tab.label}
                <span className="ml-2 px-2 py-1 text-xs bg-gray-100 dark:bg-slate-700 rounded-full">
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-dark3 rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search articles..."
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-transparent focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <select className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-dark3 text-black dark:text-white">
              {categories.map((category) => (
                <option key={category} value={category.toLowerCase().replace(' ', '')}>
                  {category}
                </option>
              ))}
            </select>
            <select className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-dark3 text-black dark:text-white">
              <option value="">Sort by</option>
              <option value="latest">Latest</option>
              <option value="popular">Most Popular</option>
              <option value="comments">Most Commented</option>
              <option value="views">Most Viewed</option>
            </select>
          </div>
        </div>

        {/* Blog Posts */}
        <div className="space-y-6">
          {posts.map((post) => (
            <article
              key={post.id}
              className="bg-white dark:bg-dark3 rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="md:flex">
                {/* Post Image */}
                <div className="md:w-80 h-48 md:h-auto bg-gray-100 dark:bg-slate-700 flex-shrink-0">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                </div>

                {/* Post Content */}
                <div className="p-6 flex-1">
                  {/* Category and Date */}
                  <div className="flex items-center gap-4 mb-3">
                    <span className="px-3 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 rounded-full">
                      {post.category}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(post.publishedAt)}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {post.readTime}
                    </span>
                  </div>

                  {/* Title and Excerpt */}
                  <h2 className="text-xl font-bold text-black dark:text-white mb-3 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-slate-600 cursor-pointer transition-colors"
                      >
                        #{tag.replace(' ', '')}
                      </span>
                    ))}
                  </div>

                  {/* Author and Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={post.authorAvatar}
                        alt={post.author}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium text-black dark:text-white flex items-center gap-2">
                          {post.author}
                          {post.isFollowing && (
                            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 rounded">
                              Following
                            </span>
                          )}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{post.authorBio}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {/* Stats */}
                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <span>{post.views.toLocaleString()} views</span>
                        <span>{post.comments} comments</span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2">
                        <button
                          className={`p-2 rounded-full transition-colors ${
                            post.isLiked
                              ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                              : 'hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-500 dark:text-gray-400'
                          }`}
                        >
                          <svg
                            className="w-5 h-5"
                            fill={post.isLiked ? 'currentColor' : 'none'}
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            />
                          </svg>
                        </button>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {post.likes}
                        </span>

                        <button
                          className={`p-2 rounded-full transition-colors ${
                            post.isSaved
                              ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                              : 'hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-500 dark:text-gray-400'
                          }`}
                        >
                          <svg
                            className="w-5 h-5"
                            fill={post.isSaved ? 'currentColor' : 'none'}
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                            />
                          </svg>
                        </button>

                        <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-500 dark:text-gray-400 transition-colors">
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-8">
          <button className="button bg-secondery dark:bg-slate-700 text-black dark:text-white">
            Load More Articles
          </button>
        </div>
      </div>
    </MainLayout>
  );
};

export default BlogPage;
