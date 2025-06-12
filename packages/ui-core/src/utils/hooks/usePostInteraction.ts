import { useState, useCallback, useEffect, useRef } from 'react';
import {
  trackInteraction,
  PostStats,
  InteractionType,
  ReactionType,
  Comment,
  formatRelativeTime,
} from '../post-utils';

export interface UsePostInteractionOptions {
  postId: string;
  userId?: string;
  initialStats?: PostStats;
  initialUserInteractions?: {
    liked?: boolean;
    saved?: boolean;
    shared?: boolean;
    reaction?: ReactionType | null;
  };
  onInteraction?: (
    type: InteractionType,
    postId: string,
    userId: string,
  ) => void;
  onError?: (error: string) => void;
  optimisticUpdates?: boolean;
  apiEndpoint?: string;
}

export interface UsePostInteractionReturn {
  // Stats
  stats: PostStats;

  // User interactions
  isLiked: boolean;
  isSaved: boolean;
  isShared: boolean;
  userReaction: ReactionType | null;

  // Actions
  toggleLike: () => Promise<void>;
  toggleSave: () => Promise<void>;
  sharePost: (platform?: string) => Promise<void>;
  addReaction: (reaction: ReactionType) => Promise<void>;
  removeReaction: () => Promise<void>;

  // Comments
  comments: Comment[];
  addComment: (content: string, parentId?: string) => Promise<Comment | null>;
  updateComment: (commentId: string, content: string) => Promise<void>;
  deleteComment: (commentId: string) => Promise<void>;
  toggleCommentLike: (commentId: string) => Promise<void>;

  // State
  isLoading: boolean;
  error: string | null;

  // Utility functions
  getEngagementRate: (followerCount: number) => number;
  getTotalInteractions: () => number;
  getMostPopularReaction: () => ReactionType | null;
  formatStats: () => Record<string, string>;
}

/**
 * Comprehensive hook for managing post interactions including likes, shares, saves, reactions, and comments
 */
export const usePostInteraction = (
  options: UsePostInteractionOptions,
): UsePostInteractionReturn => {
  const {
    postId,
    userId,
    initialStats = {
      likes: 0,
      comments: 0,
      shares: 0,
      views: 0,
      saves: 0,
      reactions: {
        like: 0,
        love: 0,
        laugh: 0,
        wow: 0,
        sad: 0,
        angry: 0,
      },
    },
    initialUserInteractions = {},
    onInteraction,
    onError,
    optimisticUpdates = true,
    apiEndpoint,
  } = options;

  // State
  const [stats, setStats] = useState<PostStats>(initialStats);
  const [isLiked, setIsLiked] = useState(
    initialUserInteractions.liked || false,
  );
  const [isSaved, setIsSaved] = useState(
    initialUserInteractions.saved || false,
  );
  const [isShared, setIsShared] = useState(
    initialUserInteractions.shared || false,
  );
  const [userReaction, setUserReaction] = useState<ReactionType | null>(
    initialUserInteractions.reaction || null,
  );
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Refs for tracking pending operations
  const pendingOperationsRef = useRef<Set<string>>(new Set());

  /**
   * Makes API call for interactions
   */
  const makeApiCall = useCallback(
    async (
      endpoint: string,
      method: 'POST' | 'DELETE' | 'PUT' = 'POST',
      data?: any,
    ) => {
      if (!apiEndpoint) return null;

      try {
        const response = await fetch(`${apiEndpoint}${endpoint}`, {
          method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: data ? JSON.stringify(data) : undefined,
        });

        if (!response.ok) {
          throw new Error(`API call failed: ${response.statusText}`);
        }

        return await response.json();
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'API call failed';
        setError(errorMessage);
        onError?.(errorMessage);
        throw error;
      }
    },
    [apiEndpoint, onError],
  );

  /**
   * Toggles like status for the post
   */
  const toggleLike = useCallback(async () => {
    if (!userId || pendingOperationsRef.current.has('like')) return;

    const operationId = 'like';
    pendingOperationsRef.current.add(operationId);

    const previousIsLiked = isLiked;
    const previousStats = stats;

    try {
      // Optimistic update
      if (optimisticUpdates) {
        setIsLiked(!isLiked);
        setStats(prev => ({
          ...prev,
          likes: isLiked ? prev.likes - 1 : prev.likes + 1,
        }));

        // Remove reaction if switching to like
        if (!isLiked && userReaction) {
          setUserReaction(null);
          setStats(prev => ({
            ...prev,
            reactions: {
              ...prev.reactions,
              [userReaction]: prev.reactions[userReaction] - 1,
            },
          }));
        }
      }

      // Track interaction
      trackInteraction(postId, userId, 'like');
      onInteraction?.('like', postId, userId);

      // API call
      if (apiEndpoint) {
        await makeApiCall(`/posts/${postId}/like`, isLiked ? 'DELETE' : 'POST');
      }
    } catch (error) {
      // Revert optimistic update on error
      if (optimisticUpdates) {
        setIsLiked(previousIsLiked);
        setStats(previousStats);
      }
    } finally {
      pendingOperationsRef.current.delete(operationId);
    }
  }, [
    userId,
    isLiked,
    stats,
    userReaction,
    optimisticUpdates,
    postId,
    onInteraction,
    makeApiCall,
  ]);

  /**
   * Toggles save status for the post
   */
  const toggleSave = useCallback(async () => {
    if (!userId || pendingOperationsRef.current.has('save')) return;

    const operationId = 'save';
    pendingOperationsRef.current.add(operationId);

    const previousIsSaved = isSaved;
    const previousStats = stats;

    try {
      // Optimistic update
      if (optimisticUpdates) {
        setIsSaved(!isSaved);
        setStats(prev => ({
          ...prev,
          saves: isSaved ? prev.saves - 1 : prev.saves + 1,
        }));
      }

      // Track interaction
      trackInteraction(postId, userId, 'save');
      onInteraction?.('save', postId, userId);

      // API call
      if (apiEndpoint) {
        await makeApiCall(`/posts/${postId}/save`, isSaved ? 'DELETE' : 'POST');
      }
    } catch (error) {
      // Revert optimistic update on error
      if (optimisticUpdates) {
        setIsSaved(previousIsSaved);
        setStats(previousStats);
      }
    } finally {
      pendingOperationsRef.current.delete(operationId);
    }
  }, [
    userId,
    isSaved,
    stats,
    optimisticUpdates,
    postId,
    onInteraction,
    makeApiCall,
  ]);

  /**
   * Shares the post
   */
  const sharePost = useCallback(
    async (platform?: string) => {
      if (!userId || pendingOperationsRef.current.has('share')) return;

      const operationId = 'share';
      pendingOperationsRef.current.add(operationId);

      const previousStats = stats;

      try {
        // Optimistic update
        if (optimisticUpdates) {
          setIsShared(true);
          setStats(prev => ({
            ...prev,
            shares: prev.shares + 1,
          }));
        }

        // Track interaction
        trackInteraction(postId, userId, 'share', { platform });
        onInteraction?.('share', postId, userId);

        // API call
        if (apiEndpoint) {
          await makeApiCall(`/posts/${postId}/share`, 'POST', { platform });
        }
      } catch (error) {
        // Revert optimistic update on error
        if (optimisticUpdates) {
          setStats(previousStats);
        }
      } finally {
        pendingOperationsRef.current.delete(operationId);
      }
    },
    [userId, stats, optimisticUpdates, postId, onInteraction, makeApiCall],
  );

  /**
   * Adds a reaction to the post
   */
  const addReaction = useCallback(
    async (reaction: ReactionType) => {
      if (!userId || pendingOperationsRef.current.has('reaction')) return;

      const operationId = 'reaction';
      pendingOperationsRef.current.add(operationId);

      const previousReaction = userReaction;
      const previousStats = stats;

      try {
        // Optimistic update
        if (optimisticUpdates) {
          // Remove previous reaction if exists
          if (userReaction) {
            setStats(prev => ({
              ...prev,
              reactions: {
                ...prev.reactions,
                [userReaction]: prev.reactions[userReaction] - 1,
              },
            }));
          }

          // Add new reaction
          setUserReaction(reaction);
          setStats(prev => ({
            ...prev,
            reactions: {
              ...prev.reactions,
              [reaction]: prev.reactions[reaction] + 1,
            },
          }));

          // Remove like if adding reaction
          if (isLiked) {
            setIsLiked(false);
            setStats(prev => ({
              ...prev,
              likes: prev.likes - 1,
            }));
          }
        }

        // Track interaction
        trackInteraction(postId, userId, 'reaction', { reaction });
        onInteraction?.('reaction', postId, userId);

        // API call
        if (apiEndpoint) {
          await makeApiCall(`/posts/${postId}/reaction`, 'POST', { reaction });
        }
      } catch (error) {
        // Revert optimistic update on error
        if (optimisticUpdates) {
          setUserReaction(previousReaction);
          setStats(previousStats);
        }
      } finally {
        pendingOperationsRef.current.delete(operationId);
      }
    },
    [
      userId,
      userReaction,
      stats,
      isLiked,
      optimisticUpdates,
      postId,
      onInteraction,
      makeApiCall,
    ],
  );

  /**
   * Removes current reaction from the post
   */
  const removeReaction = useCallback(async () => {
    if (
      !userId ||
      !userReaction ||
      pendingOperationsRef.current.has('reaction')
    )
      return;

    const operationId = 'reaction';
    pendingOperationsRef.current.add(operationId);

    const previousReaction = userReaction;
    const previousStats = stats;

    try {
      // Optimistic update
      if (optimisticUpdates) {
        setStats(prev => ({
          ...prev,
          reactions: {
            ...prev.reactions,
            [userReaction]: prev.reactions[userReaction] - 1,
          },
        }));
        setUserReaction(null);
      }

      // Track interaction
      trackInteraction(postId, userId, 'reaction', { reaction: null });
      onInteraction?.('reaction', postId, userId);

      // API call
      if (apiEndpoint) {
        await makeApiCall(`/posts/${postId}/reaction`, 'DELETE');
      }
    } catch (error) {
      // Revert optimistic update on error
      if (optimisticUpdates) {
        setUserReaction(previousReaction);
        setStats(previousStats);
      }
    } finally {
      pendingOperationsRef.current.delete(operationId);
    }
  }, [
    userId,
    userReaction,
    stats,
    optimisticUpdates,
    postId,
    onInteraction,
    makeApiCall,
  ]);

  /**
   * Adds a comment to the post
   */
  const addComment = useCallback(
    async (content: string, parentId?: string): Promise<Comment | null> => {
      if (
        !userId ||
        !content.trim() ||
        pendingOperationsRef.current.has('addComment')
      )
        return null;

      const operationId = 'addComment';
      pendingOperationsRef.current.add(operationId);

      const tempId = `temp-${Date.now()}`;
      const newComment: Comment = {
        id: tempId,
        postId,
        authorId: userId,
        content: content.trim(),
        parentId,
        createdAt: new Date(),
        likes: 0,
        isEdited: false,
      };

      try {
        // Optimistic update
        if (optimisticUpdates) {
          setComments(prev => [newComment, ...prev]);
          setStats(prev => ({
            ...prev,
            comments: prev.comments + 1,
          }));
        }

        // Track interaction
        trackInteraction(postId, userId, 'comment');
        onInteraction?.('comment', postId, userId);

        // API call
        let savedComment = newComment;
        if (apiEndpoint) {
          const response = await makeApiCall(
            `/posts/${postId}/comments`,
            'POST',
            {
              content: content.trim(),
              parentId,
            },
          );
          savedComment = response.comment;
        }

        // Update with real comment data
        setComments(prev =>
          prev.map(comment => (comment.id === tempId ? savedComment : comment)),
        );

        return savedComment;
      } catch (error) {
        // Remove optimistic comment on error
        if (optimisticUpdates) {
          setComments(prev => prev.filter(comment => comment.id !== tempId));
          setStats(prev => ({
            ...prev,
            comments: prev.comments - 1,
          }));
        }
        return null;
      } finally {
        pendingOperationsRef.current.delete(operationId);
      }
    },
    [userId, postId, optimisticUpdates, onInteraction, makeApiCall],
  );

  /**
   * Updates an existing comment
   */
  const updateComment = useCallback(
    async (commentId: string, content: string) => {
      if (
        !userId ||
        !content.trim() ||
        pendingOperationsRef.current.has(`updateComment-${commentId}`)
      )
        return;

      const operationId = `updateComment-${commentId}`;
      pendingOperationsRef.current.add(operationId);

      const previousComments = comments;

      try {
        // Optimistic update
        if (optimisticUpdates) {
          setComments(prev =>
            prev.map(comment =>
              comment.id === commentId
                ? {
                    ...comment,
                    content: content.trim(),
                    isEdited: true,
                    updatedAt: new Date(),
                  }
                : comment,
            ),
          );
        }

        // API call
        if (apiEndpoint) {
          await makeApiCall(`/posts/${postId}/comments/${commentId}`, 'PUT', {
            content: content.trim(),
          });
        }
      } catch (error) {
        // Revert optimistic update on error
        if (optimisticUpdates) {
          setComments(previousComments);
        }
      } finally {
        pendingOperationsRef.current.delete(operationId);
      }
    },
    [userId, comments, optimisticUpdates, makeApiCall, postId],
  );

  /**
   * Deletes a comment
   */
  const deleteComment = useCallback(
    async (commentId: string) => {
      if (
        !userId ||
        pendingOperationsRef.current.has(`deleteComment-${commentId}`)
      )
        return;

      const operationId = `deleteComment-${commentId}`;
      pendingOperationsRef.current.add(operationId);

      const previousComments = comments;

      try {
        // Optimistic update
        if (optimisticUpdates) {
          setComments(prev => prev.filter(comment => comment.id !== commentId));
          setStats(prev => ({
            ...prev,
            comments: prev.comments - 1,
          }));
        }

        // API call
        if (apiEndpoint) {
          await makeApiCall(`/posts/${postId}/comments/${commentId}`, 'DELETE');
        }
      } catch (error) {
        // Revert optimistic update on error
        if (optimisticUpdates) {
          setComments(previousComments);
          setStats(prev => ({
            ...prev,
            comments: prev.comments + 1,
          }));
        }
      } finally {
        pendingOperationsRef.current.delete(operationId);
      }
    },
    [userId, comments, optimisticUpdates, makeApiCall, postId],
  );

  /**
   * Toggles like on a comment
   */
  const toggleCommentLike = useCallback(
    async (commentId: string) => {
      if (
        !userId ||
        pendingOperationsRef.current.has(`likeComment-${commentId}`)
      )
        return;

      const operationId = `likeComment-${commentId}`;
      pendingOperationsRef.current.add(operationId);

      const previousComments = comments;

      try {
        // Find comment and determine if currently liked (simplified - in real app, track user's likes)
        const comment = comments.find(c => c.id === commentId);
        if (!comment) return;

        // Optimistic update
        if (optimisticUpdates) {
          setComments(prev =>
            prev.map(c =>
              c.id === commentId
                ? { ...c, likes: c.likes + 1 } // Simplified - toggle logic needed
                : c,
            ),
          );
        }

        // API call
        if (apiEndpoint) {
          await makeApiCall(
            `/posts/${postId}/comments/${commentId}/like`,
            'POST',
          );
        }
      } catch (error) {
        // Revert optimistic update on error
        if (optimisticUpdates) {
          setComments(previousComments);
        }
      } finally {
        pendingOperationsRef.current.delete(operationId);
      }
    },
    [userId, comments, optimisticUpdates, makeApiCall, postId],
  );

  /**
   * Utility functions
   */
  const getEngagementRate = useCallback(
    (followerCount: number) => {
      const totalEngagement = stats.likes + stats.comments + stats.shares;
      return followerCount > 0 ? (totalEngagement / followerCount) * 100 : 0;
    },
    [stats],
  );

  const getTotalInteractions = useCallback(() => {
    return stats.likes + stats.comments + stats.shares + stats.saves;
  }, [stats]);

  const getMostPopularReaction = useCallback((): ReactionType | null => {
    const reactions = stats.reactions;
    let maxReaction: ReactionType | null = null;
    let maxCount = 0;

    Object.entries(reactions).forEach(([reaction, count]) => {
      if (count > maxCount) {
        maxCount = count;
        maxReaction = reaction as ReactionType;
      }
    });

    return maxCount > 0 ? maxReaction : null;
  }, [stats.reactions]);

  const formatStats = useCallback(() => {
    const formatNumber = (num: number) => {
      if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
      if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
      return num.toString();
    };

    return {
      likes: formatNumber(stats.likes),
      comments: formatNumber(stats.comments),
      shares: formatNumber(stats.shares),
      views: formatNumber(stats.views),
      saves: formatNumber(stats.saves),
    };
  }, [stats]);

  // Load comments on mount
  useEffect(() => {
    const loadComments = async () => {
      if (!apiEndpoint) return;

      try {
        setIsLoading(true);
        const response = await makeApiCall(`/posts/${postId}/comments`);
        setComments(response.comments || []);
      } catch (error) {
        console.error('Failed to load comments:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadComments();
  }, [postId, apiEndpoint, makeApiCall]);

  // Cleanup pending operations on unmount
  useEffect(() => {
    return () => {
      pendingOperationsRef.current.clear();
    };
  }, []);

  return {
    // Stats
    stats,

    // User interactions
    isLiked,
    isSaved,
    isShared,
    userReaction,

    // Actions
    toggleLike,
    toggleSave,
    sharePost,
    addReaction,
    removeReaction,

    // Comments
    comments,
    addComment,
    updateComment,
    deleteComment,
    toggleCommentLike,

    // State
    isLoading,
    error,

    // Utility functions
    getEngagementRate,
    getTotalInteractions,
    getMostPopularReaction,
    formatStats,
  };
};

export default usePostInteraction;
