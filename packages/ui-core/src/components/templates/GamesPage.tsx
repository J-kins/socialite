import React, { useState } from 'react';
import { MainLayout } from './MainLayout';

interface GamesPageProps {
  className?: string;
}

export const GamesPage: React.FC<GamesPageProps> = ({ className = '' }) => {
  const [activeTab, setActiveTab] = useState('discover');

  const tabs = [
    { id: 'discover', label: 'Discover', count: 245 },
    { id: 'playing', label: 'Playing', count: 12 },
    { id: 'favorites', label: 'Favorites', count: 8 },
    { id: 'achievements', label: 'Achievements', count: 24 },
  ];

  const games = [
    {
      id: '1',
      title: 'Word Master',
      description: 'Challenge your vocabulary in this exciting word puzzle game',
      category: 'Puzzle',
      players: 15420,
      rating: 4.8,
      image: '/assets/images/games/word-game.jpg',
      isPlaying: false,
      isFavorite: true,
      developer: 'PuzzleWorks',
      lastPlayed: null,
    },
    {
      id: '2',
      title: 'Social Trivia',
      description: 'Test your knowledge with friends in this multiplayer quiz game',
      category: 'Trivia',
      players: 8932,
      rating: 4.6,
      image: '/assets/images/games/trivia-game.jpg',
      isPlaying: true,
      isFavorite: false,
      developer: 'QuizMaster Inc',
      lastPlayed: '2 hours ago',
    },
    {
      id: '3',
      title: 'City Builder',
      description: 'Build and manage your dream city in this strategy game',
      category: 'Strategy',
      players: 23567,
      rating: 4.9,
      image: '/assets/images/games/city-builder.jpg',
      isPlaying: false,
      isFavorite: true,
      developer: 'Urban Games',
      lastPlayed: '1 day ago',
    },
    {
      id: '4',
      title: 'Memory Match',
      description: 'Train your brain with this classic memory matching game',
      category: 'Brain Training',
      players: 12034,
      rating: 4.5,
      image: '/assets/images/games/memory-game.jpg',
      isPlaying: false,
      isFavorite: false,
      developer: 'BrainWorks',
      lastPlayed: null,
    },
  ];

  const achievements = [
    {
      id: '1',
      title: 'Word Wizard',
      description: 'Complete 100 word puzzles',
      game: 'Word Master',
      icon: '🏆',
      progress: 87,
      total: 100,
      unlocked: false,
    },
    {
      id: '2',
      title: 'Trivia Champion',
      description: 'Win 10 trivia games in a row',
      game: 'Social Trivia',
      icon: '🎯',
      progress: 10,
      total: 10,
      unlocked: true,
    },
    {
      id: '3',
      title: 'Master Builder',
      description: 'Build a city with 1M population',
      game: 'City Builder',
      icon: '🏙️',
      progress: 750000,
      total: 1000000,
      unlocked: false,
    },
  ];

  const categories = [
    'All Games',
    'Puzzle',
    'Trivia',
    'Strategy',
    'Brain Training',
    'Action',
    'Adventure',
    'Simulation',
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <MainLayout className={className}>
      <div className="main-container max-w-[1200px] mx-auto p-6">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-black dark:text-white mb-2">Games</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Play games, compete with friends, and unlock achievements
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
            Submit Game
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
                  placeholder="Search games..."
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
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="new">Newest</option>
              <option value="name">Name A-Z</option>
            </select>
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'achievements' ? (
          /* Achievements View */
          <div className="space-y-4">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className="bg-white dark:bg-dark3 rounded-xl shadow-sm p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <div className={`text-4xl ${achievement.unlocked ? '' : 'grayscale opacity-50'}`}>
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-black dark:text-white">
                        {achievement.title}
                      </h3>
                      {achievement.unlocked && (
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-full">
                          Unlocked
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {achievement.description}
                    </p>
                    <p className="text-xs text-blue-600 dark:text-blue-400">{achievement.game}</p>
                  </div>
                  <div className="text-right">
                    <div
                      className={`text-lg font-bold ${achievement.unlocked ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`}
                    >
                      {achievement.progress.toLocaleString()}/{achievement.total.toLocaleString()}
                    </div>
                    <div className="w-32 bg-gray-200 dark:bg-slate-700 rounded-full h-2 mt-2">
                      <div
                        className={`h-2 rounded-full ${achievement.unlocked ? 'bg-green-600' : 'bg-blue-600'}`}
                        style={{ width: `${(achievement.progress / achievement.total) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Games Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {games
              .filter((game) => {
                if (activeTab === 'playing') return game.isPlaying;
                if (activeTab === 'favorites') return game.isFavorite;
                return true;
              })
              .map((game) => (
                <div
                  key={game.id}
                  className="bg-white dark:bg-dark3 rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                >
                  {/* Game Image */}
                  <div className="relative h-40 bg-gradient-to-r from-blue-400 to-purple-500">
                    <img src={game.image} alt={game.title} className="w-full h-full object-cover" />
                    <button
                      className={`absolute top-3 right-3 p-2 rounded-full ${
                        game.isFavorite
                          ? 'bg-red-600 text-white'
                          : 'bg-white/90 text-gray-600 hover:bg-white'
                      } transition-colors`}
                    >
                      <svg
                        className="w-4 h-4"
                        fill={game.isFavorite ? 'currentColor' : 'none'}
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
                    {game.isPlaying && (
                      <div className="absolute top-3 left-3">
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-full">
                          Playing
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Game Info */}
                  <div className="p-4">
                    <div className="mb-3">
                      <h3 className="font-semibold text-black dark:text-white mb-1">
                        {game.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {game.description}
                      </p>
                    </div>

                    {/* Rating and Players */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1">
                        {renderStars(game.rating)}
                        <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
                          {game.rating}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {game.players.toLocaleString()} players
                      </span>
                    </div>

                    {/* Category and Developer */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-3 py-1 text-xs bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 rounded-full">
                        {game.category}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {game.developer}
                      </span>
                    </div>

                    {/* Last Played */}
                    {game.lastPlayed && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                        Last played {game.lastPlayed}
                      </p>
                    )}

                    {/* Action Button */}
                    <button
                      className={`w-full py-2 text-sm rounded-lg transition-colors ${
                        game.isPlaying
                          ? 'bg-green-600 text-white hover:bg-green-700'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {game.isPlaying ? 'Continue Playing' : 'Play Now'}
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* Load More */}
        {activeTab !== 'achievements' && (
          <div className="text-center mt-8">
            <button className="button bg-secondery dark:bg-slate-700 text-black dark:text-white">
              Load More Games
            </button>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default GamesPage;
