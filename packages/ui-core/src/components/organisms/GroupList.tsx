import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '../atoms/Button';
import { Icon } from '../atoms/Icon';
import { Badge } from '../atoms/Badge';
import { Avatar } from '../atoms/Avatar';
import { LoadingSpinner } from '../atoms/LoadingSpinner';

export interface GroupMember {
  id: string;
  name: string;
  avatar?: string;
  role?: string;
  isOnline?: boolean;
  lastSeen?: Date;
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  avatar?: string;
  coverImage?: string;
  memberCount: number;
  members?: GroupMember[];
  category?: string;
  tags?: string[];
  isPrivate?: boolean;
  isJoined?: boolean;
  createdAt?: Date;
  lastActivity?: Date;
  unreadCount?: number;
  metadata?: Record<string, any>;
}

export interface GroupListProps {
  /**
   * Groups to display
   */
  groups: Group[];
  /**
   * Loading state
   */
  isLoading?: boolean;
  /**
   * Layout and appearance
   */
  variant?: 'default' | 'card' | 'compact' | 'detailed';
  layout?: 'list' | 'grid' | 'masonry';
  size?: 'sm' | 'md' | 'lg';
  showImages?: boolean;
  showDescriptions?: boolean;
  showMemberCount?: boolean;
  showTags?: boolean;
  showLastActivity?: boolean;
  /**
   * Filtering and sorting
   */
  enableSearch?: boolean;
  searchPlaceholder?: string;
  enableFiltering?: boolean;
  availableCategories?: string[];
  enableSorting?: boolean;
  sortOptions?: Array<{
    value: string;
    label: string;
  }>;
  /**
   * Pagination
   */
  enablePagination?: boolean;
  itemsPerPage?: number;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  /**
   * Actions
   */
  onGroupClick?: (group: Group) => void;
  onGroupJoin?: (group: Group) => void;
  onGroupLeave?: (group: Group) => void;
  onGroupShare?: (group: Group) => void;
  onGroupReport?: (group: Group) => void;
  /**
   * Event handlers
   */
  onSearch?: (query: string) => void;
  onFilter?: (filters: Record<string, any>) => void;
  onSort?: (sortBy: string) => void;
  /**
   * Empty state
   */
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: React.ReactNode;
  /**
   * Custom rendering
   */
  renderGroup?: (group: Group) => React.ReactNode;
  renderGroupActions?: (group: Group) => React.ReactNode;
  renderEmptyState?: () => React.ReactNode;
  /**
   * Accessibility
   */
  ariaLabel?: string;
  /**
   * Customization
   */
  className?: string;
}

export const GroupList: React.FC<GroupListProps> = ({
  groups = [],
  isLoading = false,
  variant = 'default',
  layout = 'list',
  size = 'md',
  showImages = true,
  showDescriptions = true,
  showMemberCount = true,
  showTags = true,
  showLastActivity = false,
  enableSearch = true,
  searchPlaceholder = 'Search groups...',
  enableFiltering = false,
  availableCategories = [],
  enableSorting = true,
  sortOptions = [
    { value: 'name', label: 'Name' },
    { value: 'memberCount', label: 'Members' },
    { value: 'lastActivity', label: 'Activity' },
    { value: 'createdAt', label: 'Date Created' },
  ],
  enablePagination = false,
  itemsPerPage = 12,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  onGroupClick,
  onGroupJoin,
  onGroupLeave,
  onGroupShare,
  onGroupReport,
  onSearch,
  onFilter,
  onSort,
  emptyTitle = 'No groups found',
  emptyDescription = 'Try adjusting your search or filters to find groups.',
  emptyAction,
  renderGroup,
  renderGroupActions,
  renderEmptyState,
  ariaLabel = 'Groups list',
  className = '',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [filters, setFilters] = useState<Record<string, any>>({});

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onSearch?.(query);
  };

  // Handle category filter
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    const newFilters = { ...filters, category: category === 'all' ? undefined : category };
    setFilters(newFilters);
    onFilter?.(newFilters);
  };

  // Handle sort change
  const handleSortChange = (sortValue: string) => {
    setSortBy(sortValue);
    onSort?.(sortValue);
  };

  // Filter and sort groups
  const filteredAndSortedGroups = useMemo(() => {
    let result = [...groups];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (group) =>
          group.name.toLowerCase().includes(query) ||
          group.description?.toLowerCase().includes(query) ||
          group.category?.toLowerCase().includes(query) ||
          group.tags?.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      result = result.filter((group) => group.category === selectedCategory);
    }

    // Apply other filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== 'all') {
        if (key === 'isPrivate') {
          result = result.filter((group) => group.isPrivate === value);
        } else if (key === 'isJoined') {
          result = result.filter((group) => group.isJoined === value);
        }
      }
    });

    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'memberCount':
          return b.memberCount - a.memberCount;
        case 'lastActivity':
          return (b.lastActivity?.getTime() || 0) - (a.lastActivity?.getTime() || 0);
        case 'createdAt':
          return (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0);
        default:
          return 0;
      }
    });

    return result;
  }, [groups, searchQuery, selectedCategory, filters, sortBy]);

  // Paginate groups
  const paginatedGroups = useMemo(() => {
    if (!enablePagination) return filteredAndSortedGroups;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAndSortedGroups.slice(startIndex, endIndex);
  }, [filteredAndSortedGroups, enablePagination, currentPage, itemsPerPage]);

  // Handle group actions
  const handleGroupJoin = (group: Group, event: React.MouseEvent) => {
    event.stopPropagation();
    onGroupJoin?.(group);
  };

  const handleGroupLeave = (group: Group, event: React.MouseEvent) => {
    event.stopPropagation();
    onGroupLeave?.(group);
  };

  const handleGroupShare = (group: Group, event: React.MouseEvent) => {
    event.stopPropagation();
    onGroupShare?.(group);
  };

  const handleGroupReport = (group: Group, event: React.MouseEvent) => {
    event.stopPropagation();
    onGroupReport?.(group);
  };

  // Format member count
  const formatMemberCount = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  // Format relative time
  const formatRelativeTime = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  // Render individual group
  const renderGroupItem = (group: Group) => {
    if (renderGroup) {
      return renderGroup(group);
    }

    const groupClasses = [
      'group-list__item',
      `group-list__item--${variant}`,
      `group-list__item--${size}`,
      group.isJoined && 'group-list__item--joined',
      group.isPrivate && 'group-list__item--private',
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div
        key={group.id}
        className={groupClasses}
        onClick={() => onGroupClick?.(group)}
        role="button"
        tabIndex={0}
        aria-label={`${group.name} group`}
      >
        {/* Group Image */}
        {showImages && (group.avatar || group.coverImage) && (
          <div className="group-list__image">
            <img src={group.coverImage || group.avatar} alt={group.name} loading="lazy" />
            {group.isPrivate && (
              <div className="group-list__privacy-badge">
                <Icon name="lock" size="xs" />
              </div>
            )}
          </div>
        )}

        {/* Group Content */}
        <div className="group-list__content">
          <div className="group-list__header">
            <h3 className="group-list__name">{group.name}</h3>

            {group.unreadCount && group.unreadCount > 0 && (
              <Badge
                variant="notification"
                size="sm"
                count={group.unreadCount}
                className="group-list__unread-badge"
              />
            )}
          </div>

          {showDescriptions && group.description && (
            <p className="group-list__description">{group.description}</p>
          )}

          {/* Group Meta */}
          <div className="group-list__meta">
            {showMemberCount && (
              <div className="group-list__member-count">
                <Icon name="users" size="xs" />
                <span>{formatMemberCount(group.memberCount)} members</span>
              </div>
            )}

            {group.category && (
              <div className="group-list__category">
                <Icon name="tag" size="xs" />
                <span>{group.category}</span>
              </div>
            )}

            {showLastActivity && group.lastActivity && (
              <div className="group-list__last-activity">
                <Icon name="clock" size="xs" />
                <span>{formatRelativeTime(group.lastActivity)}</span>
              </div>
            )}
          </div>

          {/* Tags */}
          {showTags && group.tags && group.tags.length > 0 && (
            <div className="group-list__tags">
              {group.tags.slice(0, 3).map((tag, index) => (
                <span key={index} className="group-list__tag">
                  #{tag}
                </span>
              ))}
              {group.tags.length > 3 && (
                <span className="group-list__tag-more">+{group.tags.length - 3}</span>
              )}
            </div>
          )}

          {/* Members Preview */}
          {group.members && group.members.length > 0 && (
            <div className="group-list__members">
              <div className="group-list__member-avatars">
                {group.members.slice(0, 3).map((member) => (
                  <Avatar
                    key={member.id}
                    src={member.avatar}
                    alt={member.name}
                    name={member.name}
                    size="xs"
                    showOnlineStatus={member.isOnline}
                    className="group-list__member-avatar"
                  />
                ))}
                {group.members.length > 3 && (
                  <div className="group-list__member-more">+{group.members.length - 3}</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Group Actions */}
        <div className="group-list__actions">
          {renderGroupActions ? (
            renderGroupActions(group)
          ) : (
            <>
              {group.isJoined ? (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={(e) => handleGroupLeave(group, e)}
                  className="group-list__action"
                >
                  <Icon name="check" size="sm" />
                  Joined
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={(e) => handleGroupJoin(group, e)}
                  className="group-list__action"
                >
                  <Icon name="plus" size="sm" />
                  Join
                </Button>
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => handleGroupShare(group, e)}
                className="group-list__action"
                aria-label="Share group"
              >
                <Icon name="share" size="sm" />
              </Button>
            </>
          )}
        </div>
      </div>
    );
  };

  const containerClasses = [
    'group-list',
    `group-list--${variant}`,
    `group-list--${layout}`,
    `group-list--${size}`,
    isLoading && 'group-list--loading',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={containerClasses} role="region" aria-label={ariaLabel}>
      {/* Header with Search and Filters */}
      {(enableSearch || enableFiltering || enableSorting) && (
        <div className="group-list__header">
          {/* Search */}
          {enableSearch && (
            <div className="group-list__search">
              <Icon name="search" size="sm" className="group-list__search-icon" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="group-list__search-input"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSearch('')}
                  className="group-list__search-clear"
                  aria-label="Clear search"
                >
                  <Icon name="close" size="sm" />
                </Button>
              )}
            </div>
          )}

          {/* Filters and Sort */}
          <div className="group-list__controls">
            {/* Category Filter */}
            {enableFiltering && availableCategories.length > 0 && (
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="group-list__filter"
                aria-label="Filter by category"
              >
                <option value="all">All Categories</option>
                {availableCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            )}

            {/* Sort */}
            {enableSorting && (
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="group-list__sort"
                aria-label="Sort groups"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    Sort by {option.label}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
      )}

      {/* Results Count */}
      {!isLoading && filteredAndSortedGroups.length > 0 && (
        <div className="group-list__results">
          <span className="group-list__count">{filteredAndSortedGroups.length} groups found</span>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="group-list__loading">
          <LoadingSpinner size="lg" />
          <p>Loading groups...</p>
        </div>
      )}

      {/* Groups Grid/List */}
      {!isLoading && (
        <>
          {paginatedGroups.length > 0 ? (
            <div className="group-list__grid">{paginatedGroups.map(renderGroupItem)}</div>
          ) : (
            <div className="group-list__empty">
              {renderEmptyState ? (
                renderEmptyState()
              ) : (
                <>
                  <Icon name="users" size="xl" className="group-list__empty-icon" />
                  <h3 className="group-list__empty-title">{emptyTitle}</h3>
                  <p className="group-list__empty-description">{emptyDescription}</p>
                  {emptyAction && <div className="group-list__empty-action">{emptyAction}</div>}
                </>
              )}
            </div>
          )}
        </>
      )}

      {/* Pagination */}
      {enablePagination && !isLoading && paginatedGroups.length > 0 && (
        <div className="group-list__pagination">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onPageChange?.(currentPage - 1)}
            disabled={currentPage <= 1}
            aria-label="Previous page"
          >
            <Icon name="chevron-left" size="sm" />
            Previous
          </Button>

          <span className="group-list__page-info">
            Page {currentPage} of {totalPages}
          </span>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onPageChange?.(currentPage + 1)}
            disabled={currentPage >= totalPages}
            aria-label="Next page"
          >
            Next
            <Icon name="chevron-right" size="sm" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default GroupList;
