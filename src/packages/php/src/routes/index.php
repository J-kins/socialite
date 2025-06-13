<?php

// API Router - Main entry point for all API requests
require_once __DIR__ . '/../../../vendor/autoload.php';

use Socialite\Controllers\PostController;
use Socialite\Controllers\UserController;
use Socialite\Controllers\AuthController;
use Socialite\Core\Security;
use Socialite\Services\SessionService;

// Set headers for CORS and content type
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, X-CSRF-Token');

// Handle preflight OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Initialize security and session
$security = new Security();
$sessionService = new SessionService();

// Get the requested URL path
$requestUri = $_SERVER['REQUEST_URI'];
$scriptName = $_SERVER['SCRIPT_NAME'];
$basePath = dirname($scriptName);
$url = $_GET['url'] ?? '';

// Remove base path and clean the URL
$url = trim($url, '/');
$urlParts = explode('/', $url);

// Get HTTP method
$method = $_SERVER['REQUEST_METHOD'];

try {
    // Route the request based on the first URL segment
    $controller = $urlParts[0] ?? '';
    $action = $urlParts[1] ?? '';
    $id = $urlParts[2] ?? null;

    switch ($controller) {
        case 'auth':
            handleAuthRoutes($action, $method);
            break;
            
        case 'posts':
            handlePostRoutes($action, $id, $method);
            break;
            
        case 'users':
            handleUserRoutes($action, $id, $method);
            break;
            
        case 'csrf-token':
            handleCsrfToken();
            break;
            
        default:
            sendError('Route not found', 404);
            break;
    }

} catch (Exception $e) {
    error_log('API Error: ' . $e->getMessage());
    sendError('Internal server error', 500);
}

/**
 * Handle authentication routes
 */
function handleAuthRoutes($action, $method)
{
    $authController = new AuthController();
    
    switch ($action) {
        case 'login':
            if ($method === 'POST') {
                $authController->login();
            } else {
                sendError('Method not allowed', 405);
            }
            break;
            
        case 'register':
            if ($method === 'POST') {
                $authController->register();
            } else {
                sendError('Method not allowed', 405);
            }
            break;
            
        case 'logout':
            if ($method === 'POST') {
                $authController->logout();
            } else {
                sendError('Method not allowed', 405);
            }
            break;
            
        case 'refresh':
            if ($method === 'POST') {
                $authController->refresh();
            } else {
                sendError('Method not allowed', 405);
            }
            break;
            
        case 'validate':
            if ($method === 'POST') {
                $authController->validate();
            } else {
                sendError('Method not allowed', 405);
            }
            break;
            
        case 'me':
            if ($method === 'GET') {
                $authController->getCurrentUser();
            } elseif ($method === 'PUT') {
                $authController->updateProfile();
            } else {
                sendError('Method not allowed', 405);
            }
            break;
            
        case 'verify-email':
            if ($method === 'POST') {
                $authController->verifyEmail();
            } else {
                sendError('Method not allowed', 405);
            }
            break;
            
        case 'forgot-password':
            if ($method === 'POST') {
                $authController->forgotPassword();
            } else {
                sendError('Method not allowed', 405);
            }
            break;
            
        case 'reset-password':
            if ($method === 'POST') {
                $authController->resetPassword();
            } else {
                sendError('Method not allowed', 405);
            }
            break;
            
        case 'change-password':
            if ($method === 'POST') {
                $authController->changePassword();
            } else {
                sendError('Method not allowed', 405);
            }
            break;
            
        default:
            sendError('Auth route not found', 404);
            break;
    }
}

/**
 * Handle post routes
 */
function handlePostRoutes($action, $id, $method)
{
    $postController = new PostController();
    
    // Handle routes with post ID
    if (is_numeric($action)) {
        $postId = $action;
        $subAction = $id;
        
        switch ($subAction) {
            case 'like':
                if ($method === 'POST') {
                    $postController->likePost($postId);
                } elseif ($method === 'DELETE') {
                    $postController->unlikePost($postId);
                } else {
                    sendError('Method not allowed', 405);
                }
                break;
                
            case 'comments':
                if ($method === 'GET') {
                    $postController->getComments($postId);
                } elseif ($method === 'POST') {
                    $postController->createComment($postId);
                } else {
                    sendError('Method not allowed', 405);
                }
                break;
                
            case null:
                // Single post operations
                if ($method === 'GET') {
                    $postController->getPost($postId);
                } elseif ($method === 'PUT') {
                    $postController->updatePost($postId);
                } elseif ($method === 'DELETE') {
                    $postController->deletePost($postId);
                } else {
                    sendError('Method not allowed', 405);
                }
                break;
                
            default:
                sendError('Post route not found', 404);
                break;
        }
        return;
    }
    
    // Handle general post routes
    switch ($action) {
        case '':
        case null:
            if ($method === 'GET') {
                $postController->getPosts();
            } elseif ($method === 'POST') {
                $postController->createPost();
            } else {
                sendError('Method not allowed', 405);
            }
            break;
            
        case 'search':
            if ($method === 'GET') {
                $postController->searchPosts();
            } else {
                sendError('Method not allowed', 405);
            }
            break;
            
        case 'trending':
            if ($method === 'GET') {
                $postController->getTrendingPosts();
            } else {
                sendError('Method not allowed', 405);
            }
            break;
            
        default:
            sendError('Post route not found', 404);
            break;
    }
}

/**
 * Handle user routes
 */
function handleUserRoutes($action, $id, $method)
{
    $userController = new UserController();
    
    // Handle routes with user ID
    if (is_numeric($action)) {
        $userId = $action;
        $subAction = $id;
        
        switch ($subAction) {
            case 'posts':
                if ($method === 'GET') {
                    $_GET['user_id'] = $userId;
                    $postController = new PostController();
                    $postController->getPosts();
                } else {
                    sendError('Method not allowed', 405);
                }
                break;
                
            case 'profile':
                if ($method === 'GET') {
                    $userController->getProfile($userId);
                } else {
                    sendError('Method not allowed', 405);
                }
                break;
                
            case null:
                if ($method === 'GET') {
                    $userController->getUser($userId);
                } else {
                    sendError('Method not allowed', 405);
                }
                break;
                
            default:
                sendError('User route not found', 404);
                break;
        }
        return;
    }
    
    // Handle general user routes
    switch ($action) {
        case 'search':
            if ($method === 'GET') {
                $userController->searchUsers();
            } else {
                sendError('Method not allowed', 405);
            }
            break;
            
        case 'check-username':
            if ($method === 'GET') {
                $userController->checkUsername();
            } else {
                sendError('Method not allowed', 405);
            }
            break;
            
        case 'check-email':
            if ($method === 'GET') {
                $userController->checkEmail();
            } else {
                sendError('Method not allowed', 405);
            }
            break;
            
        default:
            sendError('User route not found', 404);
            break;
    }
}

/**
 * Handle CSRF token requests
 */
function handleCsrfToken()
{
    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        sendError('Method not allowed', 405);
        return;
    }
    
    $sessionService = new SessionService();
    $token = $sessionService->generateCsrfToken();
    
    sendResponse([
        'csrfToken' => $token
    ]);
}

/**
 * Send JSON response
 */
function sendResponse($data, $statusCode = 200)
{
    http_response_code($statusCode);
    echo json_encode([
        'success' => true,
        ...$data
    ]);
    exit;
}

/**
 * Send error response
 */
function sendError($message, $statusCode = 400, $details = null)
{
    http_response_code($statusCode);
    
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
