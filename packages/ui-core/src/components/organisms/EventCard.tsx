import React from "react";
import { Avatar, Button, Badge, Icon } from "../atoms";

export interface EventCardProps {
  event: {
    id: string;
    title: string;
    description?: string;
    coverImage?: string;
    startDate: string;
    endDate?: string;
    location?: {
      name: string;
      address?: string;
      isOnline?: boolean;
    };
    organizer: {
      id: string;
      name: string;
      avatar?: string;
    };
    attendeeCount: number;
    interestedCount: number;
    price?: {
      amount: number;
      currency: string;
      isFree?: boolean;
    };
    category?: string;
    status: "upcoming" | "ongoing" | "ended" | "cancelled";
    userStatus?: "going" | "interested" | "not_going" | null;
    recentAttendees?: Array<{
      id: string;
      name: string;
      avatar?: string;
    }>;
    isPrivate?: boolean;
  };
  onInterested?: (eventId: string) => void;
  onGoing?: (eventId: string) => void;
  onNotGoing?: (eventId: string) => void;
  onViewEvent?: (eventId: string) => void;
  onUserClick?: (userId: string) => void;
  onShare?: (eventId: string) => void;
  variant?: "card" | "list" | "minimal";
  className?: string;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  onInterested,
  onGoing,
  onNotGoing,
  onViewEvent,
  onUserClick,
  onShare,
  variant = "card",
  className = "",
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const isTomorrow =
      date.toDateString() ===
      new Date(now.getTime() + 24 * 60 * 60 * 1000).toDateString();

    const timeStr = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    if (isToday) return `Today at ${timeStr}`;
    if (isTomorrow) return `Tomorrow at ${timeStr}`;

    return date.toLocaleDateString([], {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatAttendeeCount = (count: number) => {
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  const getStatusColor = (status: string) => {
    const colorMap = {
      upcoming: "text-green-600 dark:text-green-400",
      ongoing: "text-blue-600 dark:text-blue-400",
      ended: "text-gray-500 dark:text-gray-400",
      cancelled: "text-red-600 dark:text-red-400",
    };
    return colorMap[status as keyof typeof colorMap] || "text-gray-500";
  };

  const getStatusIcon = (status: string) => {
    const iconMap = {
      upcoming: "calendar",
      ongoing: "radio",
      ended: "checkmark-circle",
      cancelled: "close-circle",
    };
    return iconMap[status as keyof typeof iconMap] || "calendar";
  };

  if (variant === "minimal") {
    return (
      <button
        onClick={() => onViewEvent?.(event.id)}
        className={`
          w-full flex items-center space-x-3 p-3 rounded-lg
          hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left
          ${className}
        `}
      >
        <div className="relative">
          {event.coverImage ? (
            <img
              src={event.coverImage}
              alt={event.title}
              className="w-12 h-12 rounded-lg object-cover"
            />
          ) : (
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
              <Icon name="calendar" className="w-6 h-6 text-white" />
            </div>
          )}
          <Badge
            variant={event.status === "ongoing" ? "primary" : "secondary"}
            size="sm"
            className="absolute -bottom-1 -right-1"
          >
            <Icon name={getStatusIcon(event.status)} className="w-3 h-3" />
          </Badge>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 dark:text-white truncate">
            {event.title}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {formatDate(event.startDate)}
          </p>
        </div>

        {event.userStatus && (
          <Badge
            variant={event.userStatus === "going" ? "primary" : "secondary"}
            size="sm"
          >
            {event.userStatus === "going" ? "Going" : "Interested"}
          </Badge>
        )}
      </button>
    );
  }

  if (variant === "list") {
    return (
      <div
        className={`
        bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700
        rounded-lg p-4 hover:shadow-md transition-shadow
        ${className}
      `}
      >
        <div className="flex items-start space-x-4">
          <button onClick={() => onViewEvent?.(event.id)}>
            {event.coverImage ? (
              <img
                src={event.coverImage}
                alt={event.title}
                className="w-16 h-16 rounded-lg object-cover"
              />
            ) : (
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                <Icon name="calendar" className="w-8 h-8 text-white" />
              </div>
            )}
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <button
                  onClick={() => onViewEvent?.(event.id)}
                  className="text-lg font-semibold text-gray-900 dark:text-white hover:underline"
                >
                  {event.title}
                </button>
                <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
                  <Icon name="time" className="w-4 h-4" />
                  <span>{formatDate(event.startDate)}</span>
                  {event.location && (
                    <>
                      <span>•</span>
                      <Icon
                        name={event.location.isOnline ? "videocam" : "location"}
                        className="w-4 h-4"
                      />
                      <span>{event.location.name}</span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Badge
                  variant={event.status === "ongoing" ? "primary" : "secondary"}
                  size="sm"
                  className={getStatusColor(event.status)}
                >
                  <Icon
                    name={getStatusIcon(event.status)}
                    className="w-3 h-3 mr-1"
                  />
                  {event.status}
                </Badge>
              </div>
            </div>

            {event.description && (
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
                {event.description}
              </p>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                  <Icon name="people" className="w-4 h-4" />
                  <span>{formatAttendeeCount(event.attendeeCount)} going</span>
                </div>

                {event.price && !event.price.isFree && (
                  <Badge variant="primary" size="sm">
                    {event.price.currency}
                    {event.price.amount}
                  </Badge>
                )}

                {event.price?.isFree && (
                  <Badge variant="secondary" size="sm">
                    Free
                  </Badge>
                )}
              </div>

              <div className="flex space-x-2">
                {event.userStatus !== "going" && (
                  <Button
                    size="sm"
                    variant={
                      event.userStatus === "interested"
                        ? "secondary"
                        : "outline"
                    }
                    onClick={() => onInterested?.(event.id)}
                  >
                    {event.userStatus === "interested"
                      ? "Interested"
                      : "Interested"}
                  </Button>
                )}

                {event.userStatus !== "going" && (
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => onGoing?.(event.id)}
                  >
                    Going
                  </Button>
                )}

                {event.userStatus === "going" && (
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => onNotGoing?.(event.id)}
                  >
                    Going ✓
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Card variant (default)
  return (
    <div
      className={`
      bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700
      rounded-lg overflow-hidden hover:shadow-md transition-shadow
      ${className}
    `}
    >
      {/* Cover Image */}
      <button
        onClick={() => onViewEvent?.(event.id)}
        className="w-full relative"
      >
        {event.coverImage ? (
          <img
            src={event.coverImage}
            alt={event.title}
            className="w-full h-40 object-cover"
          />
        ) : (
          <div className="w-full h-40 bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
            <Icon name="calendar" className="w-16 h-16 text-white" />
          </div>
        )}

        {/* Date Badge */}
        <div className="absolute top-3 left-3 bg-white dark:bg-gray-800 rounded-lg p-2 text-center shadow-md">
          <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
            {new Date(event.startDate).toLocaleDateString([], {
              month: "short",
            })}
          </div>
          <div className="text-lg font-bold text-gray-900 dark:text-white">
            {new Date(event.startDate).getDate()}
          </div>
        </div>

        {/* Status Badge */}
        <Badge
          variant={event.status === "ongoing" ? "primary" : "secondary"}
          className={`absolute top-3 right-3 ${getStatusColor(event.status)}`}
        >
          <Icon name={getStatusIcon(event.status)} className="w-3 h-3 mr-1" />
          {event.status}
        </Badge>
      </button>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <button
              onClick={() => onViewEvent?.(event.id)}
              className="text-lg font-semibold text-gray-900 dark:text-white hover:underline text-left"
            >
              {event.title}
            </button>
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
              <Icon name="time" className="w-4 h-4" />
              <span>{formatDate(event.startDate)}</span>
            </div>
          </div>

          <button
            onClick={() => onShare?.(event.id)}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <Icon name="share-outline" className="w-5 h-5" />
          </button>
        </div>

        {/* Location */}
        {event.location && (
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300 mb-3">
            <Icon
              name={event.location.isOnline ? "videocam" : "location"}
              className="w-4 h-4"
            />
            <span>{event.location.name}</span>
          </div>
        )}

        {event.description && (
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
            {event.description}
          </p>
        )}

        {/* Organizer & Attendees */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => onUserClick?.(event.organizer.id)}
            className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >
            <Avatar
              src={event.organizer.avatar}
              alt={event.organizer.name}
              size="xs"
            />
            <span>by {event.organizer.name}</span>
          </button>

          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-1">
              <Icon name="people" className="w-4 h-4" />
              <span>{formatAttendeeCount(event.attendeeCount)} going</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="star" className="w-4 h-4" />
              <span>
                {formatAttendeeCount(event.interestedCount)} interested
              </span>
            </div>
          </div>
        </div>

        {/* Recent Attendees */}
        {event.recentAttendees && event.recentAttendees.length > 0 && (
          <div className="flex items-center space-x-2 mb-4">
            <div className="flex -space-x-2">
              {event.recentAttendees.slice(0, 5).map((attendee) => (
                <button
                  key={attendee.id}
                  onClick={() => onUserClick?.(attendee.id)}
                  title={attendee.name}
                >
                  <Avatar
                    src={attendee.avatar}
                    alt={attendee.name}
                    size="sm"
                    className="ring-2 ring-white dark:ring-gray-900"
                  />
                </button>
              ))}
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              and others are going
            </span>
          </div>
        )}

        {/* Price */}
        {event.price && (
          <div className="mb-4">
            {event.price.isFree ? (
              <Badge variant="secondary">Free Event</Badge>
            ) : (
              <Badge variant="primary">
                {event.price.currency}
                {event.price.amount}
              </Badge>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-2">
          {event.userStatus === "going" ? (
            <Button
              variant="primary"
              className="flex-1"
              onClick={() => onNotGoing?.(event.id)}
            >
              <Icon name="checkmark" className="w-4 h-4 mr-2" />
              Going
            </Button>
          ) : (
            <Button
              variant="primary"
              className="flex-1"
              onClick={() => onGoing?.(event.id)}
            >
              Going
            </Button>
          )}

          <Button
            variant={
              event.userStatus === "interested" ? "secondary" : "outline"
            }
            onClick={() => onInterested?.(event.id)}
          >
            <Icon name="star" className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
