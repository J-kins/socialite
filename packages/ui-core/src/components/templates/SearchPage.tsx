import React, { useState, useEffect } from "react";
import { MainLayout } from "./MainLayout";
import { SearchResults } from "../organisms";
import { Input, Icon, Button, Badge } from "../atoms";
import type { MainLayoutProps } from "./MainLayout";
import type { SearchResultsProps } from "../organisms";

export interface SearchPageProps extends Omit<MainLayoutProps, "children"> {
  initialQuery?: string;
  searchResults: SearchResultsProps["results"];
  recentSearches?: string[];
  trendingTopics?: Array<{
    id: string;
    topic: string;
    postCount: number;
    trend: "up" | "down" | "stable";
  }>;
  suggestedPeople?: Array<{
    id: string;
    name: string;
    username?: string;
    avatar?: string;
    mutualFriendsCount?: number;
    isVerified?: boolean;
  }>;
  onSearch?: (query: string) => void;
  onFilterChange?: SearchResultsProps["onFilterChange"];
  onResultClick?: SearchResultsProps["onResultClick"];
  onUserClick?: SearchResultsProps["onUserClick"];
  onFollow?: SearchResultsProps["onFollow"];
  onJoinGroup?: SearchResultsProps["onJoinGroup"];
  onClearSearchHistory?: () => void;
  onTrendingTopicClick?: (topic: string) => void;
  isLoading?: boolean;
  activeFilter?: SearchResultsProps["activeFilter"];
  className?: string;
}

export const SearchPage: React.FC<SearchPageProps> = ({
  initialQuery = "",
  searchResults = [],
  recentSearches = [],
  trendingTopics = [],
  suggestedPeople = [],
  onSearch,
  onFilterChange,
  onResultClick,
  onUserClick,
  onFollow,
  onJoinGroup,
  onClearSearchHistory,
  onTrendingTopicClick,
  isLoading = false,
  activeFilter = "all",
  className = "",
  ...layoutProps
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
    }
  }, [initialQuery]);

  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      onSearch?.(searchQuery.trim());
      setShowSuggestions(false);
    }
  };

  const handleInputChange = (value: string) => {
    setQuery(value);
    setShowSuggestions(value.length > 0);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    handleSearch(suggestion);
  };

  const EmptySearch = () => (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
      {/* Trending Topics */}
      {trendingTopics.length > 0 && (
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Trending topics
          </h3>
          <div className="space-y-3">
            {trendingTopics.slice(0, 10).map((topic, index) => (
              <button
                key={topic.id}
                onClick={() => onTrendingTopicClick?.(topic.topic)}
                className="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors text-left"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400 w-6">
                    {index + 1}
                  </span>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      #{topic.topic}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {topic.postCount.toLocaleString()} posts
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon
                    name={
                      topic.trend === "up"
                        ? "trending-up"
                        : topic.trend === "down"
                          ? "trending-down"
                          : "remove"
                    }
                    className={`w-4 h-4 ${
                      topic.trend === "up"
                        ? "text-green-500"
                        : topic.trend === "down"
                          ? "text-red-500"
                          : "text-gray-400"
                    }`}
                  />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Suggested People */}
      {suggestedPeople.length > 0 && (
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Suggested for you
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {suggestedPeople.slice(0, 6).map((person) => (
              <div
                key={person.id}
                className="flex items-center space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <button onClick={() => onUserClick?.(person.id)}>
                  <div className="relative">
                    <img
                      src={person.avatar}
                      alt={person.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    {person.isVerified && (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-900">
                        <Icon name="checkmark" className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                </button>

                <div className="flex-1 min-w-0">
                  <button
                    onClick={() => onUserClick?.(person.id)}
                    className="text-left"
                  >
                    <h4 className="font-medium text-gray-900 dark:text-white hover:underline">
                      {person.name}
                    </h4>
                    {person.username && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        @{person.username}
                      </p>
                    )}
                    {person.mutualFriendsCount &&
                      person.mutualFriendsCount > 0 && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {person.mutualFriendsCount} mutual friends
                        </p>
                      )}
                  </button>
                </div>

                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => onFollow?.(person.id)}
                >
                  Follow
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <MainLayout {...layoutProps} className={className}>
      <div className="max-w-4xl mx-auto py-6 px-4">
        {/* Search Header */}
        <div className="mb-6">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Search
            </h1>

            {/* Search Input */}
            <div className="relative">
              <Icon
                name="search"
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
              />
              <Input
                value={query}
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch(query)}
                placeholder="Search for people, posts, groups, events..."
                className="pl-12 pr-12 py-3 text-lg"
                autoFocus
              />
              {query && (
                <button
                  onClick={() => {
                    setQuery("");
                    setShowSuggestions(false);
                  }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <Icon name="close" className="w-5 h-5" />
                </button>
              )}

              {/* Search Suggestions Dropdown */}
              {showSuggestions &&
                (recentSearches.length > 0 || trendingTopics.length > 0) && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 max-h-80 overflow-y-auto">
                    {/* Recent Searches */}
                    {recentSearches.length > 0 && (
                      <div className="p-2">
                        <div className="flex items-center justify-between px-3 py-2">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                            Recent searches
                          </h4>
                          <button
                            onClick={onClearSearchHistory}
                            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            Clear all
                          </button>
                        </div>
                        {recentSearches.slice(0, 5).map((search, index) => (
                          <button
                            key={index}
                            onClick={() => handleSuggestionClick(search)}
                            className="w-full flex items-center space-x-3 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-left"
                          >
                            <Icon
                              name="time"
                              className="w-4 h-4 text-gray-400"
                            />
                            <span className="text-gray-900 dark:text-white">
                              {search}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Trending Suggestions */}
                    {trendingTopics.length > 0 && (
                      <div className="p-2 border-t border-gray-200 dark:border-gray-700">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white px-3 py-2">
                          Trending
                        </h4>
                        {trendingTopics.slice(0, 5).map((topic) => (
                          <button
                            key={topic.id}
                            onClick={() => handleSuggestionClick(topic.topic)}
                            className="w-full flex items-center space-x-3 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-left"
                          >
                            <Icon
                              name="trending-up"
                              className="w-4 h-4 text-blue-500"
                            />
                            <div>
                              <span className="text-gray-900 dark:text-white">
                                #{topic.topic}
                              </span>
                              <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                                {topic.postCount} posts
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
            </div>

            {/* Quick Search Buttons */}
            <div className="flex flex-wrap gap-2 mt-4">
              {["People", "Posts", "Groups", "Events", "Photos"].map(
                (filter) => (
                  <Button
                    key={filter}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      onFilterChange?.(filter.toLowerCase() as any);
                      if (query) handleSearch(query);
                    }}
                  >
                    {filter}
                  </Button>
                ),
              )}
            </div>
          </div>
        </div>

        {/* Search Results or Empty State */}
        {query && searchResults.length === 0 && !isLoading ? (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-12 text-center">
            <Icon
              name="search"
              className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4"
            />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No results found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              We couldn't find anything for "{query}". Try different keywords or
              check your spelling.
            </p>
            <div className="space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Suggestions:
              </p>
              <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                <li>• Make sure all words are spelled correctly</li>
                <li>• Try different keywords</li>
                <li>• Try more general keywords</li>
                <li>• Try fewer keywords</li>
              </ul>
            </div>
          </div>
        ) : query && searchResults.length > 0 ? (
          <SearchResults
            query={query}
            results={searchResults}
            isLoading={isLoading}
            activeFilter={activeFilter}
            onFilterChange={onFilterChange}
            onResultClick={onResultClick}
            onUserClick={onUserClick}
            onFollow={onFollow}
            onJoinGroup={onJoinGroup}
          />
        ) : (
          <EmptySearch />
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-12 text-center">
            <Icon
              name="refresh"
              className="w-8 h-8 text-blue-600 mx-auto mb-4 animate-spin"
            />
            <p className="text-gray-500 dark:text-gray-400">
              Searching for "{query}"...
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};
