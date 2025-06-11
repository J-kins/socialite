import React, { useState } from "react";
import { Avatar, Button, Badge, Icon } from "../atoms";
import { SearchBox, AvatarWithName } from "../molecules";

export interface Friend {
  id: string;
  name: string;
  username?: string;
  avatar?: string;
  isOnline?: boolean;
  lastSeen?: string;
  mutualFriendsCount?: number;
  location?: string;
  status?: "friend" | "pending" | "suggested";
  isClose?: boolean;
}

export interface FriendsListProps {
  friends?: Friend[];
  suggestedFriends?: Friend[];
  pendingRequests?: Friend[];
  onFriendClick?: (friendId: string) => void;
  onAcceptRequest?: (friendId: string) => void;
  onDeclineRequest?: (friendId: string) => void;
  onAddFriend?: (friendId: string) => void;
  onRemoveFriend?: (friendId: string) => void;
  onMessage?: (friendId: string) => void;
  onSearch?: (query: string) => void;
  activeTab?: "all" | "online" | "suggestions" | "requests";
  onTabChange?: (tab: string) => void;
  className?: string;
}

export const FriendsList: React.FC<FriendsListProps> = ({
  friends = [],
  suggestedFriends = [],
  pendingRequests = [],
  onFriendClick,
  onAcceptRequest,
  onDeclineRequest,
  onAddFriend,
  onRemoveFriend,
  onMessage,
  onSearch,
  activeTab = "all",
  onTabChange,
  className = "",
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const formatLastSeen = (lastSeen?: string) => {
    if (!lastSeen) return "";
    const date = new Date(lastSeen);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60),
    );

    if (diffInMinutes < 5) return "Active now";
    if (diffInMinutes < 60) return `Active ${diffInMinutes}m ago`;
    if (diffInMinutes < 1440)
      return `Active ${Math.floor(diffInMinutes / 60)}h ago`;
    if (diffInMinutes < 10080)
      return `Active ${Math.floor(diffInMinutes / 1440)}d ago`;
    return "Not recently active";
  };

  const filterFriends = (friendsList: Friend[]) => {
    return friendsList.filter(
      (friend) =>
        friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (friend.username &&
          friend.username.toLowerCase().includes(searchQuery.toLowerCase())),
    );
  };

  const onlineFriends = friends.filter((friend) => friend.isOnline);
  const allFriends = filterFriends(friends);
  const filteredSuggestions = filterFriends(suggestedFriends);
  const filteredRequests = filterFriends(pendingRequests);

  const tabs = [
    { id: "all", label: "All Friends", count: friends.length },
    { id: "online", label: "Online", count: onlineFriends.length },
    { id: "suggestions", label: "Suggestions", count: suggestedFriends.length },
    { id: "requests", label: "Requests", count: pendingRequests.length },
  ];

  const FriendCard: React.FC<{
    friend: Friend;
    variant: "friend" | "suggestion" | "request";
  }> = ({ friend, variant }) => (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start space-x-3">
        <button onClick={() => onFriendClick?.(friend.id)}>
          <div className="relative">
            <Avatar
              src={friend.avatar}
              alt={friend.name}
              size="md"
              isOnline={friend.isOnline}
            />
            {friend.isClose && (
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-900">
                <Icon name="star" className="w-3 h-3 text-white" />
              </div>
            )}
          </div>
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <button
                onClick={() => onFriendClick?.(friend.id)}
                className="text-left"
              >
                <h3 className="font-medium text-gray-900 dark:text-white hover:underline">
                  {friend.name}
                </h3>
                {friend.username && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    @{friend.username}
                  </p>
                )}
              </button>

              {friend.mutualFriendsCount && friend.mutualFriendsCount > 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {friend.mutualFriendsCount} mutual friends
                </p>
              )}

              {friend.location && (
                <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400 mt-1">
                  <Icon name="location" className="w-3 h-3" />
                  <span>{friend.location}</span>
                </div>
              )}

              {variant === "friend" && (
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  {friend.isOnline
                    ? "Active now"
                    : formatLastSeen(friend.lastSeen)}
                </p>
              )}
            </div>

            <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
              <Icon name="ellipsis-horizontal" className="w-4 h-4" />
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2 mt-3">
            {variant === "friend" && (
              <>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => onMessage?.(friend.id)}
                  className="flex-1"
                >
                  <Icon name="chatbubble" className="w-4 h-4 mr-1" />
                  Message
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onRemoveFriend?.(friend.id)}
                >
                  <Icon name="person-remove" className="w-4 h-4" />
                </Button>
              </>
            )}

            {variant === "suggestion" && (
              <>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => onAddFriend?.(friend.id)}
                  className="flex-1"
                >
                  <Icon name="person-add" className="w-4 h-4 mr-1" />
                  Add Friend
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    /* Hide suggestion logic */
                  }}
                >
                  <Icon name="close" className="w-4 h-4" />
                </Button>
              </>
            )}

            {variant === "request" && (
              <>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => onAcceptRequest?.(friend.id)}
                  className="flex-1"
                >
                  Accept
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onDeclineRequest?.(friend.id)}
                  className="flex-1"
                >
                  Decline
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const getCurrentList = () => {
    switch (activeTab) {
      case "online":
        return onlineFriends;
      case "suggestions":
        return filteredSuggestions;
      case "requests":
        return filteredRequests;
      default:
        return allFriends;
    }
  };

  const getCurrentVariant = (): "friend" | "suggestion" | "request" => {
    switch (activeTab) {
      case "suggestions":
        return "suggestion";
      case "requests":
        return "request";
      default:
        return "friend";
    }
  };

  return (
    <div
      className={`bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg ${className}`}
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Friends
        </h2>

        {/* Search */}
        <SearchBox
          placeholder="Search friends..."
          onSearch={(query) => {
            setSearchQuery(query);
            onSearch?.(query);
          }}
          className="mb-4"
        />

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange?.(tab.id)}
              className={`
                flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors
                ${
                  activeTab === tab.id
                    ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }
              `}
            >
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <Badge variant="secondary" size="sm">
                  {tab.count}
                </Badge>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Friends List */}
      <div className="p-6">
        {getCurrentList().length === 0 ? (
          <div className="text-center py-12">
            <Icon
              name={
                activeTab === "suggestions"
                  ? "person-add"
                  : activeTab === "requests"
                    ? "notifications"
                    : "people"
              }
              className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4"
            />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {activeTab === "suggestions" && "No friend suggestions"}
              {activeTab === "requests" && "No friend requests"}
              {activeTab === "online" && "No friends online"}
              {activeTab === "all" && "No friends yet"}
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {activeTab === "suggestions" &&
                "Check back later for new suggestions"}
              {activeTab === "requests" &&
                "When people send you friend requests, they'll appear here"}
              {activeTab === "online" &&
                "None of your friends are currently online"}
              {activeTab === "all" &&
                "Start connecting with people to build your network"}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {getCurrentList().map((friend) => (
              <FriendCard
                key={friend.id}
                friend={friend}
                variant={getCurrentVariant()}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
