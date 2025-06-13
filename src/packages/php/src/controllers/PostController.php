<?php

namespace Socialite\Controllers;

use Socialite\Models\PostModel;
use Socialite\Core\Security;
use Socialite\Core\Validator;
use Socialite\Services\AuthService;

class PostController
{
    private $postModel;
    private $authService;
    private $security;
    private $validator;

    public function __construct()
    {
        $this->postModel = new PostModel();
        $this->authService = new AuthService();
        $this->security = new Security();
        $this->validator = new Validator();
    }

    /**
     * Get paginated posts
     */
    public function getPosts()
    {
        try {
            // Get query parameters
            $page = (int) ($_GET['page'] ?? 1);
            $limit = min((int) ($_GET['limit'] ?? 10), 50); // Max 50 posts per page
            $userId = $_GET['user_id'] ?? null;
            
            // Validate pagination parameters
            if ($page < 1) $page = 1;
            if ($limit < 1) $limit = 10;
            
            $offset = ($page - 1) * $limit;
            
            // Get current user for personalized content
            $currentUser = $this->authService->getCurrentUser();
            $currentUserId = $currentUser['id'] ?? null;
            
            // Get posts
            if ($userId) {
                // Get posts by specific user
                $posts = $this->postModel->getPostsByUser($userId, $limit, $offset, $currentUserId);
                $totalPosts = $this->postModel->getUserPostCount($userId);
            } else {
                // Get all posts (feed)
                $posts = $this->postModel->getAllPosts($limit, $offset, $currentUserId);
                $totalPosts = $this->postModel->getTotalPostCount();
            }
            
            // Calculate pagination info
            $totalPages = ceil($totalPosts / $limit);
            $hasMore = $page < $totalPages;
            
            // Process posts (add user likes, etc.)
            $processedPosts = $this->processPosts($posts, $currentUserId);
            
            return $this->sendResponse([
                'data' => $processedPosts,
                'pagination' => [
                    'currentPage' => $page,
                    'totalPages' => $totalPages,
                    'totalPosts' => $totalPosts,
                    'hasMore' => $hasMore,
                    'limit' => $limit
                ]
            ]);
            
        } catch (Exception $e) {
            return $this->sendError('Failed to fetch posts', 500, $e->getMessage());
        }
    }

    /**
     * Get a single post by ID
     */
    public function getPost($postId)
    {
        try {
            // Validate post ID
            if (!$this->validator->isValidId($postId)) {
                return $this->sendError('Invalid post ID', 400);
            }
            
            $currentUser = $this->authService->getCurrentUser();
            $currentUserId = $currentUser['id'] ?? null;
            
            $post = $this->postModel->getPostById($postId, $currentUserId);
            
            if (!$post) {
                return $this->sendError('Post not found', 404);
            }
            
            // Process post
            $processedPost = $this->processPost($post, $currentUserId);
            
            return $this->sendResponse(['data' => $processedPost]);
            
        } catch (Exception $e) {
            return $this->sendError('Failed to fetch post', 500, $e->getMessage());
        }
    }

    /**
     * Create a new post
     */
    public function createPost()
    {
        try {
            // Check authentication
            $currentUser = $this->authService->getCurrentUser();
            if (!$currentUser) {
                return $this->sendError('Authentication required', 401);
            }
            
            // Verify CSRF token
            if (!$this->security->verifyCsrfToken()) {
                return $this->sendError('Invalid CSRF token', 403);
            }
            
            // Get and validate input
            $input = $this->getJsonInput();
            
            $validation = $this->validatePostData($input);
            if (!$validation['valid']) {
                return $this->sendError('Validation failed', 422, $validation['errors']);
            }
            
            // Sanitize content
            $content = $this->security->sanitizeInput($input['content']);
            
            // Create post data
            $postData = [
                'user_id' => $currentUser['id'],
                'content' => $content,
                'image_url' => $input['image_url'] ?? null,
                'post_type' => $input['post_type'] ?? 'text',
                'privacy' => $input['privacy'] ?? 'public',
                'created_at' => date('Y-m-d H:i:s')
            ];
            
            // Create post
            $postId = $this->postModel->createPost($postData);
            
            if (!$postId) {
                return $this->sendError('Failed to create post', 500);
            }
            
            // Get the created post
            $post = $this->postModel->getPostById($postId, $currentUser['id']);
            $processedPost = $this->processPost($post, $currentUser['id']);
            
            return $this->sendResponse([
                'data' => $processedPost,
                'message' => 'Post created successfully'
            ], 201);
            
        } catch (Exception $e) {
            return $this->sendError('Failed to create post', 500, $e->getMessage());
        }
    }

    /**
     * Update an existing post
     */
    public function updatePost($postId)
    {
        try {
            // Check authentication
            $currentUser = $this->authService->getCurrentUser();
            if (!$currentUser) {
                return $this->sendError('Authentication required', 401);
            }
            
            // Verify CSRF token
            if (!$this->security->verifyCsrfToken()) {
                return $this->sendError('Invalid CSRF token', 403);
            }
            
            // Validate post ID
            if (!$this->validator->isValidId($postId)) {
                return $this->sendError('Invalid post ID', 400);
            }
            
            // Check if post exists and user owns it
            $existingPost = $this->postModel->getPostById($postId);
            if (!$existingPost) {
                return $this->sendError('Post not found', 404);
            }
            
            if ($existingPost['user_id'] != $currentUser['id']) {
                return $this->sendError('You can only edit your own posts', 403);
            }
            
            // Get and validate input
            $input = $this->getJsonInput();
            
            $validation = $this->validatePostData($input, true); // true for update
            if (!$validation['valid']) {
                return $this->sendError('Validation failed', 422, $validation['errors']);
            }
            
            // Prepare update data
            $updateData = [];
            
            if (isset($input['content'])) {
                $updateData['content'] = $this->security->sanitizeInput($input['content']);
            }
            
            if (isset($input['image_url'])) {
                $updateData['image_url'] = $input['image_url'];
            }
            
            if (isset($input['privacy'])) {
                $updateData['privacy'] = $input['privacy'];
            }
            
            $updateData['updated_at'] = date('Y-m-d H:i:s');
            
            // Update post
            $success = $this->postModel->updatePost($postId, $updateData);
            
            if (!$success) {
                return $this->sendError('Failed to update post', 500);
            }
            
            // Get updated post
            $post = $this->postModel->getPostById($postId, $currentUser['id']);
            $processedPost = $this->processPost($post, $currentUser['id']);
            
            return $this->sendResponse([
                'data' => $processedPost,
                'message' => 'Post updated successfully'
            ]);
            
        } catch (Exception $e) {
            return $this->sendError('Failed to update post', 500, $e->getMessage());
        }
    }

    /**
     * Delete a post
     */
    public function deletePost($postId)
    {
        try {
            // Check authentication
            $currentUser = $this->authService->getCurrentUser();
            if (!$currentUser) {
                return $this->sendError('Authentication required', 401);
            }
            
            // Verify CSRF token
            if (!$this->security->verifyCsrfToken()) {
                return $this->sendError('Invalid CSRF token', 403);
            }
            
            // Validate post ID
            if (!$this->validator->isValidId($postId)) {
                return $this->sendError('Invalid post ID', 400);
            }
            
            // Check if post exists and user owns it
            $existingPost = $this->postModel->getPostById($postId);
            if (!$existingPost) {
                return $this->sendError('Post not found', 404);
            }
            
            if ($existingPost['user_id'] != $currentUser['id']) {
                return $this->sendError('You can only delete your own posts', 403);
            }
            
            // Delete post
            $success = $this->postModel->deletePost($postId);
            
            if (!$success) {
                return $this->sendError('Failed to delete post', 500);
            }
            
            return $this->sendResponse([
                'message' => 'Post deleted successfully'
            ]);
            
        } catch (Exception $e) {
            return $this->sendError('Failed to delete post', 500, $e->getMessage());
        }
    }

    /**
     * Like a post
     */
    public function likePost($postId)
    {
        try {
            // Check authentication
            $currentUser = $this->authService->getCurrentUser();
            if (!$currentUser) {
                return $this->sendError('Authentication required', 401);
            }
            
            // Verify CSRF token
            if (!$this->security->verifyCsrfToken()) {
                return $this->sendError('Invalid CSRF token', 403);
            }
            
            // Validate post ID
            if (!$this->validator->isValidId($postId)) {
                return $this->sendError('Invalid post ID', 400);
            }
            
            // Check if post exists
            $post = $this->postModel->getPostById($postId);
            if (!$post) {
                return $this->sendError('Post not found', 404);
            }
            
            // Check if already liked
            $alreadyLiked = $this->postModel->isPostLikedByUser($postId, $currentUser['id']);
            if ($alreadyLiked) {
                return $this->sendError('Post already liked', 409);
            }
            
            // Add like
            $success = $this->postModel->addLike($postId, $currentUser['id']);
            
            if (!$success) {
                return $this->sendError('Failed to like post', 500);
            }
            
            // Get updated like count
            $likeCount = $this->postModel->getLikeCount($postId);
            
            return $this->sendResponse([
                'data' => [
                    'liked' => true,
                    'like_count' => $likeCount
                ],
                'message' => 'Post liked successfully'
            ]);
            
        } catch (Exception $e) {
            return $this->sendError('Failed to like post', 500, $e->getMessage());
        }
    }

    /**
     * Unlike a post
     */
    public function unlikePost($postId)
    {
        try {
            // Check authentication
            $currentUser = $this->authService->getCurrentUser();
            if (!$currentUser) {
                return $this->sendError('Authentication required', 401);
            }
            
            // Verify CSRF token
            if (!$this->security->verifyCsrfToken()) {
                return $this->sendError('Invalid CSRF token', 403);
            }
            
            // Validate post ID
            if (!$this->validator->isValidId($postId)) {
                return $this->sendError('Invalid post ID', 400);
            }
            
            // Check if post exists
            $post = $this->postModel->getPostById($postId);
            if (!$post) {
                return $this->sendError('Post not found', 404);
            }
            
            // Check if actually liked
            $isLiked = $this->postModel->isPostLikedByUser($postId, $currentUser['id']);
            if (!$isLiked) {
                return $this->sendError('Post not liked', 409);
            }
            
            // Remove like
            $success = $this->postModel->removeLike($postId, $currentUser['id']);
            
            if (!$success) {
                return $this->sendError('Failed to unlike post', 500);
            }
            
            // Get updated like count
            $likeCount = $this->postModel->getLikeCount($postId);
            
            return $this->sendResponse([
                'data' => [
                    'liked' => false,
                    'like_count' => $likeCount
                ],
                'message' => 'Post unliked successfully'
            ]);
            
        } catch (Exception $e) {
            return $this->sendError('Failed to unlike post', 500, $e->getMessage());
        }
    }

    /**
     * Search posts
     */
    public function searchPosts()
    {
        try {
            $query = $_GET['q'] ?? '';
            $page = (int) ($_GET['page'] ?? 1);
            $limit = min((int) ($_GET['limit'] ?? 10), 50);
            
            if (strlen($query) < 2) {
                return $this->sendError('Search query must be at least 2 characters', 400);
            }
            
            // Sanitize search query
            $query = $this->security->sanitizeInput($query);
            
            $offset = ($page - 1) * $limit;
            
            $currentUser = $this->authService->getCurrentUser();
            $currentUserId = $currentUser['id'] ?? null;
            
            $posts = $this->postModel->searchPosts($query, $limit, $offset, $currentUserId);
            $totalPosts = $this->postModel->getSearchResultCount($query);
            
            $totalPages = ceil($totalPosts / $limit);
            $hasMore = $page < $totalPages;
            
            $processedPosts = $this->processPosts($posts, $currentUserId);
            
            return $this->sendResponse([
                'data' => $processedPosts,
                'pagination' => [
                    'currentPage' => $page,
                    'totalPages' => $totalPages,
                    'totalPosts' => $totalPosts,
                    'hasMore' => $hasMore,
                    'query' => $query
                ]
            ]);
            
        } catch (Exception $e) {
            return $this->sendError('Search failed', 500, $e->getMessage());
        }
    }

    /**
     * Process posts array (add user-specific data)
     */
    private function processPosts($posts, $currentUserId = null)
    {
        $processedPosts = [];
        
        foreach ($posts as $post) {
            $processedPosts[] = $this->processPost($post, $currentUserId);
        }
        
        return $processedPosts;
    }

    /**
     * Process single post (add user-specific data)
     */
    private function processPost($post, $currentUserId = null)
    {
        // Add like status for current user
        $post['is_liked'] = false;
        if ($currentUserId) {
            $post['is_liked'] = $this->postModel->isPostLikedByUser($post['id'], $currentUserId);
        }
        
        // Get like count
        $post['likes_count'] = $this->postModel->getLikeCount($post['id']);
        
        // Get comment count
        $post['comments_count'] = $this->postModel->getCommentCount($post['id']);
        
        // Format timestamps
        $post['created_at_formatted'] = $this->formatTimestamp($post['created_at']);
        if ($post['updated_at']) {
            $post['updated_at_formatted'] = $this->formatTimestamp($post['updated_at']);
        }
        
        // Clean up sensitive data
        unset($post['user_email']);
        
        return $post;
    }

    /**
     * Validate post data
     */
    private function validatePostData($data, $isUpdate = false)
    {
        $errors = [];
        
        // Content validation
        if (!$isUpdate || isset($data['content'])) {
            $content = $data['content'] ?? '';
            
            if (empty(trim($content))) {
                $errors['content'] = 'Content is required';
            } elseif (strlen($content) > 5000) {
                $errors['content'] = 'Content must be less than 5000 characters';
            }
        }
        
        // Privacy validation
        if (isset($data['privacy'])) {
            $validPrivacyLevels = ['public', 'friends', 'private'];
            if (!in_array($data['privacy'], $validPrivacyLevels)) {
                $errors['privacy'] = 'Invalid privacy level';
            }
        }
        
        // Post type validation
        if (isset($data['post_type'])) {
            $validTypes = ['text', 'image', 'video', 'link'];
            if (!in_array($data['post_type'], $validTypes)) {
                $errors['post_type'] = 'Invalid post type';
            }
        }
        
        // Image URL validation
        if (isset($data['image_url']) && !empty($data['image_url'])) {
            if (!filter_var($data['image_url'], FILTER_VALIDATE_URL)) {
                $errors['image_url'] = 'Invalid image URL';
            }
        }
        
        return [
            'valid' => empty($errors),
            'errors' => $errors
        ];
    }

    /**
     * Get JSON input from request body
     */
    private function getJsonInput()
    {
        $input = file_get_contents('php://input');
        return json_decode($input, true) ?? [];
    }

    /**
     * Send success response
     */
    private function sendResponse($data, $statusCode = 200)
    {
        http_response_code($statusCode);
        header('Content-Type: application/json');
        echo json_encode([
            'success' => true,
            ...$data
        ]);
        exit;
    }

    /**
     * Send error response
     */
    private function sendError($message, $statusCode = 400, $details = null)
    {
        http_response_code($statusCode);
        header('Content-Type: application/json');
        
        $response = [
            'success' => false,
            'message' => $message
        ];
        
        if ($details) {
            $response['details'] = $details;
        }
        
        echo json_encode($response);
        exit;
    }

    /**
     * Format timestamp for display
     */
    private function formatTimestamp($timestamp)
    {
        $date = new DateTime($timestamp);
        $now = new DateTime();
        $diff = $now->diff($date);
        
        if ($diff->days == 0) {
            if ($diff->h == 0) {
                if ($diff->i == 0) {
                    return 'Just now';
                }
                return $diff->i . 'm ago';
            }
            return $diff->h . 'h ago';
        } elseif ($diff->days < 7) {
            return $diff->days . 'd ago';
        } else {
            return $date->format('M j, Y');
        }
    }
}
