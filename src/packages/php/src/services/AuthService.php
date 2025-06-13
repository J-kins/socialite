<?php

namespace Socialite\Services;

use Socialite\Models\UserModel;
use Socialite\Core\Security;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class AuthService
{
    private $userModel;
    private $security;
    private $jwtSecret;
    private $jwtAlgorithm = 'HS256';
    private $tokenExpiry = 3600; // 1 hour
    private $refreshTokenExpiry = 604800; // 7 days

    public function __construct()
    {
        $this->userModel = new UserModel();
        $this->security = new Security();
        $this->jwtSecret = $_ENV['JWT_SECRET'] ?? 'your-jwt-secret-key-change-this';
    }

    /**
     * Authenticate user with email and password
     */
    public function login($email, $password)
    {
        try {
            // Validate input
            if (empty($email) || empty($password)) {
                return [
                    'success' => false,
                    'message' => 'Email and password are required'
                ];
            }

            // Find user by email
            $user = $this->userModel->getUserByEmail($email);
            
            if (!$user) {
                return [
                    'success' => false,
                    'message' => 'Invalid credentials'
                ];
            }

            // Check if account is locked
            if ($this->isAccountLocked($user['id'])) {
                return [
                    'success' => false,
                    'message' => 'Account is temporarily locked due to too many failed attempts'
                ];
            }

            // Verify password
            if (!password_verify($password, $user['password'])) {
                $this->recordFailedAttempt($user['id']);
                return [
                    'success' => false,
                    'message' => 'Invalid credentials'
                ];
            }

            // Check if account is active
            if ($user['status'] !== 'active') {
                return [
                    'success' => false,
                    'message' => 'Account is not active. Please verify your email.'
                ];
            }

            // Clear failed attempts
            $this->clearFailedAttempts($user['id']);

            // Check if 2FA is enabled
            if ($user['two_factor_enabled']) {
                $loginToken = $this->generateLoginToken($user['id']);
                return [
                    'success' => true,
                    'requires_2fa' => true,
                    'login_token' => $loginToken,
                    'message' => 'Please enter your 2FA code'
                ];
            }

            // Generate tokens
            $token = $this->generateJwtToken($user);
            $refreshToken = $this->generateRefreshToken($user['id']);

            // Update last login
            $this->userModel->updateLastLogin($user['id']);

            // Clean user data for response
            $userData = $this->cleanUserData($user);

            return [
                'success' => true,
                'token' => $token,
                'refresh_token' => $refreshToken,
                'user' => $userData,
                'expires_in' => $this->tokenExpiry
            ];

        } catch (Exception $e) {
            error_log('Login error: ' . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Login failed. Please try again.'
            ];
        }
    }

    /**
     * Register a new user
     */
    public function register($userData)
    {
        try {
            // Validate input
            $validation = $this->validateRegistrationData($userData);
            if (!$validation['valid']) {
                return [
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validation['errors']
                ];
            }

            // Check if email already exists
            if ($this->userModel->getUserByEmail($userData['email'])) {
                return [
                    'success' => false,
                    'message' => 'Email already registered'
                ];
            }

            // Check if username already exists
            if ($this->userModel->getUserByUsername($userData['username'])) {
                return [
                    'success' => false,
                    'message' => 'Username already taken'
                ];
            }

            // Hash password
            $hashedPassword = password_hash($userData['password'], PASSWORD_DEFAULT);

            // Prepare user data
            $newUserData = [
                'email' => strtolower(trim($userData['email'])),
                'username' => strtolower(trim($userData['username'])),
                'password' => $hashedPassword,
                'first_name' => $userData['first_name'] ?? '',
                'last_name' => $userData['last_name'] ?? '',
                'status' => 'pending', // Requires email verification
                'created_at' => date('Y-m-d H:i:s'),
                'email_verification_token' => bin2hex(random_bytes(32))
            ];

            // Create user
            $userId = $this->userModel->createUser($newUserData);

            if (!$userId) {
                return [
                    'success' => false,
                    'message' => 'Failed to create account'
                ];
            }

            // Send verification email
            $this->sendVerificationEmail($newUserData['email'], $newUserData['email_verification_token']);

            // For demo purposes, auto-activate the account
            // In production, require email verification
            $this->userModel->updateUserStatus($userId, 'active');

            // Get the created user
            $user = $this->userModel->getUserById($userId);

            // Generate tokens for auto-login
            $token = $this->generateJwtToken($user);
            $refreshToken = $this->generateRefreshToken($userId);

            $userData = $this->cleanUserData($user);

            return [
                'success' => true,
                'token' => $token,
                'refresh_token' => $refreshToken,
                'user' => $userData,
                'message' => 'Account created successfully'
            ];

        } catch (Exception $e) {
            error_log('Registration error: ' . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Registration failed. Please try again.'
            ];
        }
    }

    /**
     * Logout user
     */
    public function logout($token = null)
    {
        try {
            if ($token) {
                // Add token to blacklist
                $this->blacklistToken($token);
            }

            // Clear session if exists
            if (session_status() == PHP_SESSION_ACTIVE) {
                session_destroy();
            }

            return [
                'success' => true,
                'message' => 'Logged out successfully'
            ];

        } catch (Exception $e) {
            error_log('Logout error: ' . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Logout failed'
            ];
        }
    }

    /**
     * Refresh JWT token
     */
    public function refreshToken($refreshToken)
    {
        try {
            // Validate refresh token
            $tokenData = $this->validateRefreshToken($refreshToken);
            
            if (!$tokenData) {
                return [
                    'success' => false,
                    'message' => 'Invalid refresh token'
                ];
            }

            // Get user
            $user = $this->userModel->getUserById($tokenData['user_id']);
            
            if (!$user || $user['status'] !== 'active') {
                return [
                    'success' => false,
                    'message' => 'User not found or inactive'
                ];
            }

            // Generate new tokens
            $newToken = $this->generateJwtToken($user);
            $newRefreshToken = $this->generateRefreshToken($user['id']);

            // Invalidate old refresh token
            $this->invalidateRefreshToken($refreshToken);

            return [
                'success' => true,
                'token' => $newToken,
                'refresh_token' => $newRefreshToken,
                'expires_in' => $this->tokenExpiry
            ];

        } catch (Exception $e) {
            error_log('Token refresh error: ' . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Token refresh failed'
            ];
        }
    }

    /**
     * Validate JWT token
     */
    public function validateToken($token)
    {
        try {
            // Check if token is blacklisted
            if ($this->isTokenBlacklisted($token)) {
                return false;
            }

            // Decode JWT
            $decoded = JWT::decode($token, new Key($this->jwtSecret, $this->jwtAlgorithm));
            
            // Get user
            $user = $this->userModel->getUserById($decoded->user_id);
            
            if (!$user || $user['status'] !== 'active') {
                return false;
            }

            return [
                'valid' => true,
                'user' => $this->cleanUserData($user),
                'token_data' => (array) $decoded
            ];

        } catch (Exception $e) {
            return false;
        }
    }

    /**
     * Get current authenticated user
     */
    public function getCurrentUser()
    {
        $token = $this->getBearerToken();
        
        if (!$token) {
            return null;
        }

        $validation = $this->validateToken($token);
        
        return $validation ? $validation['user'] : null;
    }

    /**
     * Generate JWT token
     */
    private function generateJwtToken($user)
    {
        $payload = [
            'iss' => $_ENV['APP_URL'] ?? 'http://localhost',
            'aud' => $_ENV['APP_URL'] ?? 'http://localhost',
            'iat' => time(),
            'exp' => time() + $this->tokenExpiry,
            'user_id' => $user['id'],
            'username' => $user['username'],
            'email' => $user['email'],
            'role' => $user['role'] ?? 'user'
        ];

        return JWT::encode($payload, $this->jwtSecret, $this->jwtAlgorithm);
    }

    /**
     * Generate refresh token
     */
    private function generateRefreshToken($userId)
    {
        $token = bin2hex(random_bytes(32));
        $expiresAt = date('Y-m-d H:i:s', time() + $this->refreshTokenExpiry);

        // Store refresh token
        $this->userModel->storeRefreshToken($userId, $token, $expiresAt);

        return $token;
    }

    /**
     * Generate temporary login token for 2FA
     */
    private function generateLoginToken($userId)
    {
        $token = bin2hex(random_bytes(16));
        $expiresAt = date('Y-m-d H:i:s', time() + 300); // 5 minutes

        // Store login token
        $this->userModel->storeLoginToken($userId, $token, $expiresAt);

        return $token;
    }

    /**
     * Validate refresh token
     */
    private function validateRefreshToken($token)
    {
        return $this->userModel->validateRefreshToken($token);
    }

    /**
     * Get bearer token from request headers
     */
    private function getBearerToken()
    {
        $headers = apache_request_headers();
        $authHeader = $headers['Authorization'] ?? '';

        if (preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
            return $matches[1];
        }

        return null;
    }

    /**
     * Clean user data for response (remove sensitive info)
     */
    private function cleanUserData($user)
    {
        unset($user['password']);
        unset($user['email_verification_token']);
        unset($user['password_reset_token']);
        unset($user['two_factor_secret']);
        
        return $user;
    }

    /**
     * Validate registration data
     */
    private function validateRegistrationData($data)
    {
        $errors = [];

        // Email validation
        if (empty($data['email'])) {
            $errors['email'] = 'Email is required';
        } elseif (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            $errors['email'] = 'Invalid email format';
        }

        // Username validation
        if (empty($data['username'])) {
            $errors['username'] = 'Username is required';
        } elseif (strlen($data['username']) < 3) {
            $errors['username'] = 'Username must be at least 3 characters';
        } elseif (!preg_match('/^[a-zA-Z0-9_-]+$/', $data['username'])) {
            $errors['username'] = 'Username can only contain letters, numbers, underscores and hyphens';
        }

        // Password validation
        if (empty($data['password'])) {
            $errors['password'] = 'Password is required';
        } elseif (strlen($data['password']) < 8) {
            $errors['password'] = 'Password must be at least 8 characters';
        } elseif (!preg_match('/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/', $data['password'])) {
            $errors['password'] = 'Password must contain uppercase, lowercase, number and special character';
        }

        return [
            'valid' => empty($errors),
            'errors' => $errors
        ];
    }

    /**
     * Record failed login attempt
     */
    private function recordFailedAttempt($userId)
    {
        $this->userModel->recordFailedAttempt($userId);
    }

    /**
     * Clear failed login attempts
     */
    private function clearFailedAttempts($userId)
    {
        $this->userModel->clearFailedAttempts($userId);
    }

    /**
     * Check if account is locked
     */
    private function isAccountLocked($userId)
    {
        $attempts = $this->userModel->getFailedAttempts($userId);
        return $attempts >= 5; // Lock after 5 failed attempts
    }

    /**
     * Blacklist token
     */
    private function blacklistToken($token)
    {
        // In production, store blacklisted tokens in cache/database
        // For now, we'll skip this implementation
    }

    /**
     * Check if token is blacklisted
     */
    private function isTokenBlacklisted($token)
    {
        // In production, check against blacklist
        return false;
    }

    /**
     * Invalidate refresh token
     */
    private function invalidateRefreshToken($token)
    {
        $this->userModel->invalidateRefreshToken($token);
    }

    /**
     * Send verification email
     */
    private function sendVerificationEmail($email, $token)
    {
        // In production, implement email sending
        // For now, we'll just log the verification link
        $verificationLink = $_ENV['APP_URL'] . "/verify-email?token=" . $token;
        error_log("Verification email for {$email}: {$verificationLink}");
    }

    /**
     * Verify email with token
     */
    public function verifyEmail($token)
    {
        try {
            $user = $this->userModel->getUserByVerificationToken($token);
            
            if (!$user) {
                return [
                    'success' => false,
                    'message' => 'Invalid verification token'
                ];
            }

            // Update user status
            $this->userModel->updateUserStatus($user['id'], 'active');
            $this->userModel->clearVerificationToken($user['id']);

            return [
                'success' => true,
                'message' => 'Email verified successfully'
            ];

        } catch (Exception $e) {
            error_log('Email verification error: ' . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Email verification failed'
            ];
        }
    }

    /**
     * Request password reset
     */
    public function requestPasswordReset($email)
    {
        try {
            $user = $this->userModel->getUserByEmail($email);
            
            if (!$user) {
                // Don't reveal if email exists
                return [
                    'success' => true,
                    'message' => 'If the email exists, a reset link has been sent'
                ];
            }

            $resetToken = bin2hex(random_bytes(32));
            $expiresAt = date('Y-m-d H:i:s', time() + 3600); // 1 hour

            $this->userModel->storePasswordResetToken($user['id'], $resetToken, $expiresAt);
            
            // Send reset email
            $this->sendPasswordResetEmail($email, $resetToken);

            return [
                'success' => true,
                'message' => 'If the email exists, a reset link has been sent'
            ];

        } catch (Exception $e) {
            error_log('Password reset request error: ' . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Password reset request failed'
            ];
        }
    }

    /**
     * Reset password with token
     */
    public function resetPassword($token, $newPassword)
    {
        try {
            $user = $this->userModel->getUserByPasswordResetToken($token);
            
            if (!$user) {
                return [
                    'success' => false,
                    'message' => 'Invalid or expired reset token'
                ];
            }

            // Validate new password
            if (strlen($newPassword) < 8) {
                return [
                    'success' => false,
                    'message' => 'Password must be at least 8 characters'
                ];
            }

            // Hash new password
            $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);

            // Update password and clear reset token
            $this->userModel->updatePassword($user['id'], $hashedPassword);
            $this->userModel->clearPasswordResetToken($user['id']);

            return [
                'success' => true,
                'message' => 'Password reset successfully'
            ];

        } catch (Exception $e) {
            error_log('Password reset error: ' . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Password reset failed'
            ];
        }
    }

    /**
     * Send password reset email
     */
    private function sendPasswordResetEmail($email, $token)
    {
        // In production, implement email sending
        $resetLink = $_ENV['APP_URL'] . "/reset-password?token=" . $token;
        error_log("Password reset email for {$email}: {$resetLink}");
    }
}
