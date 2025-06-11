import React, { useState } from "react";
import { Avatar, Button, Badge, Icon } from "../atoms";
import { AvatarWithName } from "../molecules";

export interface SearchResult {
  id: string;
  type: "user" | "post" | "group" | "event" | "page";
  title: string;
  subtitle?: string;
  description?: string;
  image?: string;
  metadata?: {
    memberCount?: number;
    followerCount?: number;
    location?: string;
    date?: string;
    author?: {
      id: string;
      name: string;
      avatar?: string;
    };
    isVerified?: boolean;
    isOnline?: boolean;
    mutualFriendsCount?: number;
  };
  snippet?: string; // Highlighted text snippet for posts
}

export interface SearchResultsProps {
  query: string;
  results: SearchResult[];
  isLoading?: boolean;
  onResultClick?: (result: SearchResult) => void;
  onUserClick?: (userId: string) => void;
  onFollow?: (userId: string) => void;
  onJoinGroup?: (groupId: string) => void;
  onViewMore?: (type: SearchResult["type"]) => void;
  activeFilter?: SearchResult["type"] | "all";
  onFilterChange?: (filter: SearchResult["type"] | "all") => void;
  className?: string;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  query,
  results,
  isLoading = false,
  onResultClick,
  onUserClick,
  onFollow,
  onJoinGroup,
  onViewMore,
  activeFilter = "all",
  onFilterChange,
  className = "",
}) => {
  const [expandedResults, setExpandedResults] = useState<Set<string>>(
    new Set(),
  );

  const filters = [
    { id: "all", label: "All", count: results.length },
    {
      id: "user",
      label: "People",
      count: results.filter((r) => r.type === "user").length,
    },
    {
      id: "post",
      label: "Posts",
      count: results.filter((r) => r.type === "post").length,
    },
    {
      id: "group",
      label: "Groups",
      count: results.filter((r) => r.type === "group").length,
    },
    {
      id: "event",
      label: "Events",
      count: results.filter((r) => r.type === "event").length,
    },
    {
      id: "page",
      label: "Pages",
      count: results.filter((r) => r.type === "page").length,
    },
  ];

  const filteredResults =
    activeFilter === "all"
      ? results
      : results.filter((result) => result.type === activeFilter);

  const toggleExpanded = (resultId: string) => {
    setExpandedResults((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(resultId)) {
        newSet.delete(resultId);
      } else {
        newSet.add(resultId);
      }
      return newSet;
    });
  };

  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;

    const regex = new RegExp(
      `(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
      "gi",
    );
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark
          key={index}
          className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded"
        >
          {part}
        </mark>
      ) : (
        part
      ),
    );
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getResultIcon = (type: SearchResult["type"]) => {
    const iconMap = {
      user: "person",
      post: "document-text",
      group: "people",
      event: "calendar",
      page: "flag",
    };
    return iconMap[type] || "search";
  };

  const ResultItem: React.FC<{ result: SearchResult }> = ({ result }) => {
    const isExpanded = expandedResults.has(result.id);

    return (
      <div
        className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
        onClick={() => onResultClick?.(result)}
      >
        <div className="flex items-start space-x-4">
          {/* Image/Avatar */}
          <div className="flex-shrink-0">
            {result.type === "user" ? (
              <div className="relative">
                <Avatar
                  src={result.image}
                  alt={result.title}
                  size="md"
                  isOnline={result.metadata?.isOnline}
                />
                {result.metadata?.isVerified && (
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-900">
                    <Icon name="checkmark" className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
            ) : result.image ? (
              <img
                src={result.image}
                alt={result.title}
                className="w-12 h-12 rounded-lg object-cover"
              />
            ) : (
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                <Icon
                  name={getResultIcon(result.type)}
                  className="w-6 h-6 text-gray-400"
                />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 dark:text-white hover:underline">
                  {highlightText(result.title, query)}
                </h3>

                {result.subtitle && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {highlightText(result.subtitle, query)}
                  </p>
                )}

                {/* Metadata */}
                <div className="flex items-center space-x-3 text-sm text-gray-500 dark:text-gray-400 mt-2">
                  <div className="flex items-center space-x-1">
                    <Icon
                      name={getResultIcon(result.type)}
                      className="w-4 h-4"
                    />
                    <span className="capitalize">{result.type}</span>
                  </div>

                  {result.metadata?.memberCount && (
                    <>
                      <span>•</span>
                      <span>
                        {formatNumber(result.metadata.memberCount)} members
                      </span>
                    </>
                  )}

                  {result.metadata?.followerCount && (
                    <>
                      <span>•</span>
                      <span>
                        {formatNumber(result.metadata.followerCount)} followers
                      </span>
                    </>
                  )}

                  {result.metadata?.location && (
                    <>
                      <span>•</span>
                      <div className="flex items-center space-x-1">
                        <Icon name="location" className="w-3 h-3" />
                        <span>{result.metadata.location}</span>
                      </div>
                    </>
                  )}

                  {result.metadata?.date && (
                    <>
                      <span>•</span>
                      <span>{result.metadata.date}</span>
                    </>
                  )}
                </div>

                {/* Author (for posts) */}
                {result.metadata?.author && (
                  <div className="flex items-center space-x-2 mt-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onUserClick?.(result.metadata!.author!.id);
                      }}
                    >
                      <Avatar
                        src={result.metadata.author.avatar}
                        alt={result.metadata.author.name}
                        size="xs"
                      />
                    </button>
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      by {highlightText(result.metadata.author.name, query)}
                    </span>
                  </div>
                )}

                {/* Mutual friends */}
                {result.metadata?.mutualFriendsCount &&
                  result.metadata.mutualFriendsCount > 0 && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {result.metadata.mutualFriendsCount} mutual friends
                    </p>
                  )}

                {/* Description/Snippet */}
                {(result.description || result.snippet) && (
                  <div className="mt-2">
                    <p
                      className={`text-sm text-gray-600 dark:text-gray-300 ${
                        !isExpanded &&
                        (result.description || result.snippet)!.length > 150
                          ? "line-clamp-2"
                          : ""
                      }`}
                    >
                      {result.snippet
                        ? highlightText(result.snippet, query)
                        : highlightText(result.description!, query)}
                    </p>
                    {(result.description || result.snippet)!.length > 150 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleExpanded(result.id);
                        }}
                        className="text-sm text-blue-600 dark:text-blue-400 hover:underline mt-1"
                      >
                        {isExpanded ? "Show less" : "Show more"}
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2 ml-4">
                {result.type === "user" && (
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      onFollow?.(result.id);
                    }}
                  >
                    <Icon name="person-add" className="w-4 h-4 mr-1" />
                    Follow
                  </Button>
                )}

                {result.type === "group" && (
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      onJoinGroup?.(result.id);
                    }}
                  >
                    <Icon name="people" className="w-4 h-4 mr-1" />
                    Join
                  </Button>
                )}

                <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                  <Icon name="ellipsis-horizontal" className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div
        className={`bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg ${className}`}
      >
        <div className="p-8 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Searching...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg ${className}`}
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Search Results for "{query}"
        </h2>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => onFilterChange?.(filter.id as any)}
              className={`
                flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                ${
                  activeFilter === filter.id
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                }
              `}
            >
              <span>{filter.label}</span>
              {filter.count > 0 && (
                <Badge variant="secondary" size="sm">
                  {filter.count}
                </Badge>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="p-6">
        {filteredResults.length === 0 ? (
          <div className="text-center py-12">
            <Icon
              name="search"
              className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4"
            />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No results found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              We couldn't find anything matching "{query}". Try different
              keywords or check your spelling.
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {filteredResults.slice(0, 10).map((result) => (
                <ResultItem key={result.id} result={result} />
              ))}
            </div>

            {/* Load More */}
            {filteredResults.length > 10 && (
              <div className="mt-6 text-center">
                <Button
                  variant="outline"
                  onClick={() =>
                    onViewMore?.(activeFilter === "all" ? "user" : activeFilter)
                  }
                >
                  View more results
                </Button>
              </div>
            )}

            {/* Results Count */}
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Showing {Math.min(filteredResults.length, 10)} of{" "}
                {filteredResults.length} results
                {activeFilter !== "all" && ` in ${activeFilter}s`}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
