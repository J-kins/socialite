<?php

namespace Socialite\Models;

use Socialite\Core\Database;
use PDO;
use PDOException;

class PostModel
{
    private $db;

    public function __construct()
    {
        $this->db = Database::getInstance()->getConnection();
    }

    /**
     * Get all posts with pagination
     */
    public function getAllPosts($limit = 10, $offset = 0, $currentUserId = null)
    {
        try {
            $sql = "
                SELECT 
                    p.*,
                    u.username,
                    u.first_name,
                    u.last_name,
                    u.avatar_url as user_avatar,
                    (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id) as likes_count,
                    (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comments_count
                FROM posts p
                INNER JOIN users u ON p.user_id = u.id
                WHERE p.privacy = 'public' OR p.user_id = :current_user_id
                ORDER BY p.created_at DESC
                LIMIT :limit OFFSET :offset
            ";

            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':current_user_id', $currentUserId, PDO::PARAM_INT);
            $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
            $stmt->bindParam(':offset', $offset, PDO::PARAM_INT);
            $stmt->execute();

            return $stmt->fetchAll(PDO::FETCH_ASSOC);

        } catch (PDOException $e) {
            error_log('Get posts error: ' . $e->getMessage());
            return [];
        }
    }

    /**
     * Get posts by specific user
     */
    public function getPostsByUser($userId, $limit = 10, $offset = 0, $currentUserId = null)
    {
        try {
            $sql = "
                SELECT 
                    p.*,
                    u.username,
                    u.first_name,
                    u.last_name,
                    u.avatar_url as user_avatar,
                    (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id) as likes_count,
                    (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comments_count
                FROM posts p
                INNER JOIN users u ON p.user_id = u.id
                WHERE p.user_id = :user_id 
                AND (p.privacy = 'public' OR p.user_id = :current_user_id)
                ORDER BY p.created_at DESC
                LIMIT :limit OFFSET :offset
            ";

            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
            $stmt->bindParam(':current_user_id', $currentUserId, PDO::PARAM_INT);
            $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
            $stmt->bindParam(':offset', $offset, PDO::PARAM_INT);
            $stmt->execute();

            return $stmt->fetchAll(PDO::FETCH_ASSOC);

        } catch (PDOException $e) {
            error_log('Get user posts error: ' . $e->getMessage());
            return [];
        }
    }

    /**
     * Get single post by ID
     */
    public function getPostById($postId, $currentUserId = null)
    {
        try {
            $sql = "
                SELECT 
                    p.*,
                    u.username,
                    u.first_name,
                    u.last_name,
                    u.avatar_url as user_avatar
                FROM posts p
                INNER JOIN users u ON p.user_id = u.id
                WHERE p.id = :post_id
                AND (p.privacy = 'public' OR p.user_id = :current_user_id)
            ";

            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':post_id', $postId, PDO::PARAM_INT);
            $stmt->bindParam(':current_user_id', $currentUserId, PDO::PARAM_INT);
            $stmt->execute();

            return $stmt->fetch(PDO::FETCH_ASSOC);

        } catch (PDOException $e) {
            error_log('Get post error: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Create a new post
     */
    public function createPost($postData)
    {
        try {
            $sql = "
                INSERT INTO posts (user_id, content, image_url, post_type, privacy, created_at)
                VALUES (:user_id, :content, :image_url, :post_type, :privacy, :created_at)
            ";

            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':user_id', $postData['user_id'], PDO::PARAM_INT);
            $stmt->bindParam(':content', $postData['content'], PDO::PARAM_STR);
            $stmt->bindParam(':image_url', $postData['image_url'], PDO::PARAM_STR);
            $stmt->bindParam(':post_type', $postData['post_type'], PDO::PARAM_STR);
            $stmt->bindParam(':privacy', $postData['privacy'], PDO::PARAM_STR);
            $stmt->bindParam(':created_at', $postData['created_at'], PDO::PARAM_STR);
            
            $stmt->execute();
            return $this->db->lastInsertId();

        } catch (PDOException $e) {
            error_log('Create post error: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Update an existing post
     */
    public function updatePost($postId, $updateData)
    {
        try {
            $setParts = [];
            $params = [':post_id' => $postId];

            foreach ($updateData as $field => $value) {
                if ($field !== 'id') {
                    $setParts[] = "$field = :$field";
                    $params[":$field"] = $value;
                }
            }

            if (empty($setParts)) {
                return false;
            }

            $sql = "UPDATE posts SET " . implode(', ', $setParts) . " WHERE id = :post_id";
            
            $stmt = $this->db->prepare($sql);
            return $stmt->execute($params);

        } catch (PDOException $e) {
            error_log('Update post error: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Delete a post
     */
    public function deletePost($postId)
    {
        try {
            // Start transaction
            $this->db->beginTransaction();

            // Delete related data first
            $this->deleteLikes($postId);
            $this->deleteComments($postId);

            // Delete the post
            $sql = "DELETE FROM posts WHERE id = :post_id";
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':post_id', $postId, PDO::PARAM_INT);
            $result = $stmt->execute();

            $this->db->commit();
            return $result;

        } catch (PDOException $e) {
            $this->db->rollBack();
            error_log('Delete post error: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Add like to post
     */
    public function addLike($postId, $userId)
    {
        try {
            $sql = "
                INSERT INTO post_likes (post_id, user_id, created_at)
                VALUES (:post_id, :user_id, NOW())
                ON DUPLICATE KEY UPDATE created_at = NOW()
            ";

            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':post_id', $postId, PDO::PARAM_INT);
            $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
            
            return $stmt->execute();

        } catch (PDOException $e) {
            error_log('Add like error: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Remove like from post
     */
    public function removeLike($postId, $userId)
    {
        try {
            $sql = "DELETE FROM post_likes WHERE post_id = :post_id AND user_id = :user_id";

            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':post_id', $postId, PDO::PARAM_INT);
            $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
            
            return $stmt->execute();

        } catch (PDOException $e) {
            error_log('Remove like error: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Check if post is liked by user
     */
    public function isPostLikedByUser($postId, $userId)
    {
        try {
            $sql = "SELECT COUNT(*) FROM post_likes WHERE post_id = :post_id AND user_id = :user_id";

            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':post_id', $postId, PDO::PARAM_INT);
            $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
            $stmt->execute();

            return $stmt->fetchColumn() > 0;

        } catch (PDOException $e) {
            error_log('Check like error: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Get like count for post
     */
    public function getLikeCount($postId)
    {
        try {
            $sql = "SELECT COUNT(*) FROM post_likes WHERE post_id = :post_id";

            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':post_id', $postId, PDO::PARAM_INT);
            $stmt->execute();

            return (int) $stmt->fetchColumn();

        } catch (PDOException $e) {
            error_log('Get like count error: ' . $e->getMessage());
            return 0;
        }
    }

    /**
     * Get comment count for post
     */
    public function getCommentCount($postId)
    {
        try {
            $sql = "SELECT COUNT(*) FROM comments WHERE post_id = :post_id";

            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':post_id', $postId, PDO::PARAM_INT);
            $stmt->execute();

            return (int) $stmt->fetchColumn();

        } catch (PDOException $e) {
            error_log('Get comment count error: ' . $e->getMessage());
            return 0;
        }
    }

    /**
     * Search posts
     */
    public function searchPosts($query, $limit = 10, $offset = 0, $currentUserId = null)
    {
        try {
            $searchTerm = "%$query%";
            
            $sql = "
                SELECT 
                    p.*,
                    u.username,
                    u.first_name,
                    u.last_name,
                    u.avatar_url as user_avatar,
                    (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id) as likes_count,
                    (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comments_count
                FROM posts p
                INNER JOIN users u ON p.user_id = u.id
                WHERE (p.content LIKE :search_term OR u.username LIKE :search_term2)
                AND (p.privacy = 'public' OR p.user_id = :current_user_id)
                ORDER BY p.created_at DESC
                LIMIT :limit OFFSET :offset
            ";

            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':search_term', $searchTerm, PDO::PARAM_STR);
            $stmt->bindParam(':search_term2', $searchTerm, PDO::PARAM_STR);
            $stmt->bindParam(':current_user_id', $currentUserId, PDO::PARAM_INT);
            $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
            $stmt->bindParam(':offset', $offset, PDO::PARAM_INT);
            $stmt->execute();

            return $stmt->fetchAll(PDO::FETCH_ASSOC);

        } catch (PDOException $e) {
            error_log('Search posts error: ' . $e->getMessage());
            return [];
        }
    }

    /**
     * Get total post count
     */
    public function getTotalPostCount()
    {
        try {
            $sql = "SELECT COUNT(*) FROM posts WHERE privacy = 'public'";
            $stmt = $this->db->prepare($sql);
            $stmt->execute();

            return (int) $stmt->fetchColumn();

        } catch (PDOException $e) {
            error_log('Get total post count error: ' . $e->getMessage());
            return 0;
        }
    }

    /**
     * Get user post count
     */
    public function getUserPostCount($userId)
    {
        try {
            $sql = "SELECT COUNT(*) FROM posts WHERE user_id = :user_id";
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
            $stmt->execute();

            return (int) $stmt->fetchColumn();

        } catch (PDOException $e) {
            error_log('Get user post count error: ' . $e->getMessage());
            return 0;
        }
    }

    /**
     * Get search result count
     */
    public function getSearchResultCount($query)
    {
        try {
            $searchTerm = "%$query%";
            
            $sql = "
                SELECT COUNT(*)
                FROM posts p
                INNER JOIN users u ON p.user_id = u.id
                WHERE (p.content LIKE :search_term OR u.username LIKE :search_term2)
                AND p.privacy = 'public'
            ";

            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':search_term', $searchTerm, PDO::PARAM_STR);
            $stmt->bindParam(':search_term2', $searchTerm, PDO::PARAM_STR);
            $stmt->execute();

            return (int) $stmt->fetchColumn();

        } catch (PDOException $e) {
            error_log('Get search result count error: ' . $e->getMessage());
            return 0;
        }
    }

    /**
     * Get comments for a post
     */
    public function getComments($postId, $limit = 20, $offset = 0)
    {
        try {
            $sql = "
                SELECT 
                    c.*,
                    u.username,
                    u.first_name,
                    u.last_name,
                    u.avatar_url as user_avatar
                FROM comments c
                INNER JOIN users u ON c.user_id = u.id
                WHERE c.post_id = :post_id
                ORDER BY c.created_at ASC
                LIMIT :limit OFFSET :offset
            ";

            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':post_id', $postId, PDO::PARAM_INT);
            $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
            $stmt->bindParam(':offset', $offset, PDO::PARAM_INT);
            $stmt->execute();

            return $stmt->fetchAll(PDO::FETCH_ASSOC);

        } catch (PDOException $e) {
            error_log('Get comments error: ' . $e->getMessage());
            return [];
        }
    }

    /**
     * Create a comment
     */
    public function createComment($postId, $userId, $content)
    {
        try {
            $sql = "
                INSERT INTO comments (post_id, user_id, content, created_at)
                VALUES (:post_id, :user_id, :content, NOW())
            ";

            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':post_id', $postId, PDO::PARAM_INT);
            $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
            $stmt->bindParam(':content', $content, PDO::PARAM_STR);
            
            $stmt->execute();
            return $this->db->lastInsertId();

        } catch (PDOException $e) {
            error_log('Create comment error: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Delete all likes for a post
     */
    private function deleteLikes($postId)
    {
        try {
            $sql = "DELETE FROM post_likes WHERE post_id = :post_id";
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':post_id', $postId, PDO::PARAM_INT);
            return $stmt->execute();

        } catch (PDOException $e) {
            error_log('Delete likes error: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Delete all comments for a post
     */
    private function deleteComments($postId)
    {
        try {
            $sql = "DELETE FROM comments WHERE post_id = :post_id";
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':post_id', $postId, PDO::PARAM_INT);
            return $stmt->execute();

        } catch (PDOException $e) {
            error_log('Delete comments error: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Get trending posts (most liked in last 24 hours)
     */
    public function getTrendingPosts($limit = 10)
    {
        try {
            $sql = "
                SELECT 
                    p.*,
                    u.username,
                    u.first_name,
                    u.last_name,
                    u.avatar_url as user_avatar,
                    COUNT(pl.id) as likes_count,
                    (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comments_count
                FROM posts p
                INNER JOIN users u ON p.user_id = u.id
                LEFT JOIN post_likes pl ON p.id = pl.post_id
                WHERE p.privacy = 'public' 
                AND p.created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
                GROUP BY p.id
                ORDER BY likes_count DESC, p.created_at DESC
                LIMIT :limit
            ";

            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
            $stmt->execute();

            return $stmt->fetchAll(PDO::FETCH_ASSOC);

        } catch (PDOException $e) {
            error_log('Get trending posts error: ' . $e->getMessage());
            return [];
        }
    }
}
