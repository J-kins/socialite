import React, { useState } from 'react';
import { MainLayout } from './MainLayout';

interface MarketPageProps {
  className?: string;
}

export const MarketPage: React.FC<MarketPageProps> = ({ className = '' }) => {
  const [activeTab, setActiveTab] = useState('browse');
  const [viewMode, setViewMode] = useState('grid');

  const tabs = [
    { id: 'browse', label: 'Browse', count: 1247 },
    { id: 'selling', label: 'Selling', count: 8 },
    { id: 'buying', label: 'Buying', count: 12 },
    { id: 'saved', label: 'Saved', count: 23 },
  ];

  const products = [
    {
      id: '1',
      title: 'MacBook Pro 16" M3',
      description:
        'Like new MacBook Pro with M3 chip, 32GB RAM, 1TB SSD. Perfect for developers and creators.',
      price: 2499,
      originalPrice: 3199,
      condition: 'Like New',
      location: 'San Francisco, CA',
      seller: 'John Doe',
      sellerAvatar: '/assets/images/avatars/avatar-1.jpg',
      images: ['/assets/images/products/laptop-1.jpg'],
      category: 'Electronics',
      posted: '2 days ago',
      views: 234,
      saved: false,
    },
    {
      id: '2',
      title: 'Vintage Leather Sofa',
      description:
        'Beautiful vintage brown leather sofa in excellent condition. Perfect for living room or office.',
      price: 899,
      condition: 'Good',
      location: 'New York, NY',
      seller: 'Sarah Wilson',
      sellerAvatar: '/assets/images/avatars/avatar-2.jpg',
      images: ['/assets/images/products/sofa-1.jpg'],
      category: 'Furniture',
      posted: '1 week ago',
      views: 156,
      saved: true,
    },
    {
      id: '3',
      title: 'Canon EOS R5 Camera',
      description:
        'Professional camera in mint condition. Includes 24-70mm lens, battery grip, and accessories.',
      price: 3299,
      condition: 'Excellent',
      location: 'Los Angeles, CA',
      seller: 'Mike Johnson',
      sellerAvatar: '/assets/images/avatars/avatar-3.jpg',
      images: ['/assets/images/products/camera-1.jpg'],
      category: 'Photography',
      posted: '3 days ago',
      views: 89,
      saved: false,
    },
  ];

  const categories = [
    'All Categories',
    'Electronics',
    'Furniture',
    'Photography',
    'Clothing',
    'Books',
    'Sports',
    'Vehicles',
    'Home & Garden',
    'Other',
  ];

  return (
    <MainLayout className={className}>
      <div className="main-container max-w-[1200px] mx-auto p-6">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-black dark:text-white mb-2">Marketplace</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Buy and sell items in your local community
            </p>
          </div>
          <button className="button bg-primary text-white">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Sell Item
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
          <div className="flex flex-col lg:flex-row gap-4">
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
                  placeholder="Search marketplace..."
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
            <input
              type="number"
              placeholder="Min price"
              className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-dark3 text-black dark:text-white w-32"
            />
            <input
              type="number"
              placeholder="Max price"
              className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-dark3 text-black dark:text-white w-32"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300'}`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300'}`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
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

        {/* Products Grid/List */}
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
          }
        >
          {products.map((product) => (
            <div
              key={product.id}
              className={`bg-white dark:bg-dark3 rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow cursor-pointer ${
                viewMode === 'list' ? 'flex gap-4 p-4' : ''
              }`}
            >
              {/* Product Image */}
              <div
                className={`relative ${viewMode === 'list' ? 'w-48 h-32 flex-shrink-0' : 'h-48'} bg-gray-100 dark:bg-slate-700`}
              >
                <img
                  src={product.images[0]}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
                <button
                  className={`absolute top-3 right-3 p-2 rounded-full ${
                    product.saved
                      ? 'bg-red-600 text-white'
                      : 'bg-white/90 text-gray-600 hover:bg-white'
                  } transition-colors`}
                >
                  <svg
                    className="w-4 h-4"
                    fill={product.saved ? 'currentColor' : 'none'}
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
                <div className="absolute bottom-3 left-3">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      product.condition === 'Like New'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : product.condition === 'Excellent'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                    }`}
                  >
                    {product.condition}
                  </span>
                </div>
              </div>

              {/* Product Info */}
              <div className={`${viewMode === 'list' ? 'flex-1' : 'p-6'}`}>
                <div className="mb-3">
                  <h3 className="font-semibold text-black dark:text-white mb-1">{product.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {product.description}
                  </p>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl font-bold text-green-600 dark:text-green-400">
                    ${product.price.toLocaleString()}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                      ${product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Seller Info */}
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={product.sellerAvatar}
                    alt={product.seller}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-black dark:text-white truncate">
                      {product.seller}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {product.location} • {product.posted}
                    </p>
                  </div>
                </div>

                {/* Meta Info */}
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <span className="px-3 py-1 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 rounded-full text-xs">
                    {product.category}
                  </span>
                  <span>{product.views} views</span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button className="flex-1 px-4 py-2 text-sm border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                    Message
                  </button>
                  <button className="flex-1 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-8">
          <button className="button bg-secondery dark:bg-slate-700 text-black dark:text-white">
            Load More Items
          </button>
        </div>
      </div>
    </MainLayout>
  );
};

export default MarketPage;
