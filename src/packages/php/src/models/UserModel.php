<?php

namespace Socialite\Models;

use Socialite\Core\Database;
use PDO;
use PDOException;

class UserModel
{
    private $db;

    public function __construct()
    {
        $this->db = Database::getInstance()->getConnection();
    }

    /**
     * Create a new user
     */
    public function createUser($userData)
    {
        try {
            $sql = "
                INSERT INTO users (
                    email, username, password, first_name, last_name, 
                    status, created_at, email_verification_token
                ) VALUES (
                    :email, :username, :password, :first_name, :last_name,
                    :status, :created_at, :email_verification_token
                )
            ";

            $stmt = $this->db->prepare($sql);
            $stmt->execute([
                ':email' => $userData['email'],
                ':username' => $userData['username'],
                ':password' => $userData['password'],
                ':first_name' => $userData['first_name'] ?? '',
                ':last_name' => $userData['last_name'] ?? '',
                ':status' => $userData['status'] ?? 'pending',
                ':created_at' => $userData['created_at'],
                ':email_verification_token' => $userData['email_verification_token'] ?? null
            ]);

            return $this->db->lastInsertId();

        } catch (PDOException $e) {
            error_log('Create user error: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Get user by ID
     */
    public function getUserById($userId)
    {
        try {
            $sql = "SELECT * FROM users WHERE id = :user_id";
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
            $stmt->execute();

            return $stmt->fetch(PDO::FETCH_ASSOC);

        } catch (PDOException $e) {
            error_log('Get user by ID error: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Get user by email
     */
    public function getUserByEmail($email)
    {
        try {
            $sql = "SELECT * FROM users WHERE email = :email";
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':email', $email, PDO::PARAM_STR);
            $stmt->execute();

            return $stmt->fetch(PDO::FETCH_ASSOC);

        } catch (PDOException $e) {
            error_log('Get user by email error: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Get user by username
     */
    public function getUserByUsername($username)
    {
        try {
            $sql = "SELECT * FROM users WHERE username = :username";
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':username', $username, PDO::PARAM_STR);
            $stmt->execute();

            return $stmt->fetch(PDO::FETCH_ASSOC);

        } catch (PDOException $e) {
            error_log('Get user by username error: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Update user status
     */
    public function updateUserStatus($userId, $status)
    {
        try {
            $sql = "UPDATE users SET status = :status WHERE id = :user_id";
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':status', $status, PDO::PARAM_STR);
            $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);

            return $stmt->execute();

        } catch (PDOException $e) {
            error_log('Update user status error: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Update last login timestamp
     */
    public function updateLastLogin($userId)
    {
        try {
            $sql = "UPDATE users SET last_login = NOW() WHERE id = :user_id";
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);

            return $stmt->execute();

        } catch (PDOException $e) {
            error_log('Update last login error: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Store refresh token
     */
    public function storeRefreshToken($userId, $token, $expiresAt)
    {
        try {
            $sql = "
                INSERT INTO refresh_tokens (user_id, token, expires_at, created_at)
                VALUES (:user_id, :token, :expires_at, NOW())
                ON DUPLICATE KEY UPDATE
                token = :token2, expires_at = :expires_at2, created_at = NOW()
            ";

            $stmt = $this->db->prepare($sql);
            $stmt->execute([
                ':user_id' => $userId,
                ':token' => $token,
                ':expires_at' => $expiresAt,
                ':token2' => $token,
                ':expires_at2' => $expiresAt
            ]);

            return true;

        } catch (PDOException $e) {
            error_log('Store refresh token error: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Validate refresh token
     */
    public function validateRefreshToken($token)
    {
        try {
            $sql = "
                SELECT user_id, expires_at
                FROM refresh_tokens
                WHERE token = :token AND expires_at > NOW()
            ";

            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':token', $token, PDO::PARAM_STR);
            $stmt->execute();

            return $stmt->fetch(PDO::FETCH_ASSOC);

        } catch (PDOException $e) {
            error_log('Validate refresh token error: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Invalidate refresh token
     */
    public function invalidateRefreshToken($token)
    {
        try {
            $sql = "DELETE FROM refresh_tokens WHERE token = :token";
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':token', $token, PDO::PARAM_STR);

            return $stmt->execute();

        } catch (PDOException $e) {
            error_log('Invalidate refresh token error: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Store login token for 2FA
     */
    public function storeLoginToken($userId, $token, $expiresAt)
    {
        try {
            $sql = "
                INSERT INTO login_tokens (user_id, token, expires_at, created_at)
                VALUES (:user_id, :token, :expires_at, NOW())
                ON DUPLICATE KEY UPDATE
                token = :token2, expires_at = :expires_at2, created_at = NOW()
            ";

            $stmt = $this->db->prepare($sql);
            $stmt->execute([
                ':user_id' => $userId,
                ':token' => $token,
                ':expires_at' => $expiresAt,
                ':token2' => $token,
                ':expires_at2' => $expiresAt
            ]);

            return true;

        } catch (PDOException $e) {
            error_log('Store login token error: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Record failed login attempt
     */
    public function recordFailedAttempt($userId)
    {
        try {
            $sql = "
                INSERT INTO failed_login_attempts (user_id, attempted_at)
                VALUES (:user_id, NOW())
            ";

            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);

            return $stmt->execute();

        } catch (PDOException $e) {
            error_log('Record failed attempt error: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Get failed login attempts count
     */
    public function getFailedAttempts($userId)
    {
        try {
            $sql = "
                SELECT COUNT(*)
                FROM failed_login_attempts
                WHERE user_id = :user_id
                AND attempted_at > DATE_SUB(NOW(), INTERVAL 15 MINUTE)
            ";

            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
            $stmt->execute();

            return (int) $stmt->fetchColumn();

        } catch (PDOException $e) {
            error_log('Get failed attempts error: ' . $e->getMessage());
            return 0;
        }
    }

    /**
     * Clear failed login attempts
     */
    public function clearFailedAttempts($userId)
    {
        try {
            $sql = "DELETE FROM failed_login_attempts WHERE user_id = :user_id";
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);

            return $stmt->execute();

        } catch (PDOException $e) {
            error_log('Clear failed attempts error: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Get user by verification token
     */
    public function getUserByVerificationToken($token)
    {
        try {
            $sql = "SELECT * FROM users WHERE email_verification_token = :token";
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':token', $token, PDO::PARAM_STR);
            $stmt->execute();

            return $stmt->fetch(PDO::FETCH_ASSOC);

        } catch (PDOException $e) {
            error_log('Get user by verification token error: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Clear verification token
     */
    public function clearVerificationToken($userId)
    {
        try {
            $sql = "UPDATE users SET email_verification_token = NULL WHERE id = :user_id";
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);

            return $stmt->execute();

        } catch (PDOException $e) {
            error_log('Clear verification token error: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Store password reset token
     */
    public function storePasswordResetToken($userId, $token, $expiresAt)
    {
        try {
            $sql = "
                UPDATE users
                SET password_reset_token = :token, password_reset_expires = :expires_at
                WHERE id = :user_id
            ";

            $stmt = $this->db->prepare($sql);
            $stmt->execute([
                ':token' => $token,
                ':expires_at' => $expiresAt,
                ':user_id' => $userId
            ]);

            return true;

        } catch (PDOException $e) {
            error_log('Store password reset token error: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Get user by password reset token
     */
    public function getUserByPasswordResetToken($token)
    {
        try {
            $sql = "
                SELECT *
                FROM users
                WHERE password_reset_token = :token
                AND password_reset_expires > NOW()
            ";

            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':token', $token, PDO::PARAM_STR);
            $stmt->execute();

            return $stmt->fetch(PDO::FETCH_ASSOC);

        } catch (PDOException $e) {
            error_log('Get user by reset token error: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Update user password
     */
    public function updatePassword($userId, $hashedPassword)
    {
        try {
            $sql = "UPDATE users SET password = :password WHERE id = :user_id";
            $stmt = $this->db->prepare($sql);
            $stmt->execute([
                ':password' => $hashedPassword,
                ':user_id' => $userId
            ]);

            return true;

        } catch (PDOException $e) {
            error_log('Update password error: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Clear password reset token
     */
    public function clearPasswordResetToken($userId)
    {
        try {
            $sql = "
                UPDATE users
                SET password_reset_token = NULL, password_reset_expires = NULL
                WHERE id = :user_id
            ";

            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);

            return $stmt->execute();

        } catch (PDOException $e) {
            error_log('Clear password reset token error: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Update user profile
     */
    public function updateProfile($userId, $profileData)
    {
        try {
            $setParts = [];
            $params = [':user_id' => $userId];

            foreach ($profileData as $field => $value) {
                if (in_array($field, ['first_name', 'last_name', 'bio', 'location', 'website', 'avatar_url'])) {
                    $setParts[] = "$field = :$field";
                    $params[":$field"] = $value;
                }
            }

            if (empty($setParts)) {
                return false;
            }

            $setParts[] = "updated_at = NOW()";
            $sql = "UPDATE users SET " . implode(', ', $setParts) . " WHERE id = :user_id";

            $stmt = $this->db->prepare($sql);
            return $stmt->execute($params);

        } catch (PDOException $e) {
            error_log('Update profile error: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Search users
     */
    public function searchUsers($query, $limit = 20, $offset = 0)
    {
        try {
            $searchTerm = "%$query%";

            $sql = "
                SELECT id, username, first_name, last_name, avatar_url, bio
                FROM users
                WHERE (username LIKE :search_term OR first_name LIKE :search_term2 OR last_name LIKE :search_term3)
                AND status = 'active'
                ORDER BY username ASC
                LIMIT :limit OFFSET :offset
            ";

            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':search_term', $searchTerm, PDO::PARAM_STR);
            $stmt->bindParam(':search_term2', $searchTerm, PDO::PARAM_STR);
            $stmt->bindParam(':search_term3', $searchTerm, PDO::PARAM_STR);
            $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
            $stmt->bindParam(':offset', $offset, PDO::PARAM_INT);
            $stmt->execute();

            return $stmt->fetchAll(PDO::FETCH_ASSOC);

        } catch (PDOException $e) {
            error_log('Search users error: ' . $e->getMessage());
            return [];
        }
    }

    /**
     * Check if username is available
     */
    public function isUsernameAvailable($username, $excludeUserId = null)
    {
        try {
            $sql = "SELECT COUNT(*) FROM users WHERE username = :username";
            $params = [':username' => $username];

            if ($excludeUserId) {
                $sql .= " AND id != :exclude_id";
                $params[':exclude_id'] = $excludeUserId;
            }

            $stmt = $this->db->prepare($sql);
            $stmt->execute($params);

            return $stmt->fetchColumn() == 0;

        } catch (PDOException $e) {
            error_log('Check username availability error: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Check if email is available
     */
    public function isEmailAvailable($email, $excludeUserId = null)
    {
        try {
            $sql = "SELECT COUNT(*) FROM users WHERE email = :email";
            $params = [':email' => $email];

            if ($excludeUserId) {
                $sql .= " AND id != :exclude_id";
                $params[':exclude_id'] = $excludeUserId;
            }

            $stmt = $this->db->prepare($sql);
            $stmt->execute($params);

            return $stmt->fetchColumn() == 0;

        } catch (PDOException $e) {
            error_log('Check email availability error: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Get user profile (public information)
     */
    public function getUserProfile($userId)
    {
        try {
            $sql = "
                SELECT 
                    id, username, first_name, last_name, bio, location,
                    website, avatar_url, created_at,
                    (SELECT COUNT(*) FROM posts WHERE user_id = :user_id) as posts_count,
                    (SELECT COUNT(*) FROM user_followers WHERE following_id = :user_id2) as followers_count,
                    (SELECT COUNT(*) FROM user_followers WHERE follower_id = :user_id3) as following_count
                FROM users
                WHERE id = :user_id4 AND status = 'active'
            ";

            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
            $stmt->bindParam(':user_id2', $userId, PDO::PARAM_INT);
            $stmt->bindParam(':user_id3', $userId, PDO::PARAM_INT);
            $stmt->bindParam(':user_id4', $userId, PDO::PARAM_INT);
            $stmt->execute();

            return $stmt->fetch(PDO::FETCH_ASSOC);

        } catch (PDOException $e) {
            error_log('Get user profile error: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Delete user account
     */
    public function deleteUser($userId)
    {
        try {
            // Start transaction
            $this->db->beginTransaction();

            // Delete related data
            $this->deleteUserPosts($userId);
            $this->deleteUserLikes($userId);
            $this->deleteUserComments($userId);
            $this->deleteUserTokens($userId);

            // Delete user
            $sql = "DELETE FROM users WHERE id = :user_id";
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
            $result = $stmt->execute();

            $this->db->commit();
            return $result;

        } catch (PDOException $e) {
            $this->db->rollBack();
            error_log('Delete user error: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Delete user posts
     */
    private function deleteUserPosts($userId)
    {
        $sql = "DELETE FROM posts WHERE user_id = :user_id";
        $stmt = $this->db->prepare($sql);
        $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
        return $stmt->execute();
    }

    /**
     * Delete user likes
     */
    private function deleteUserLikes($userId)
    {
        $sql = "DELETE FROM post_likes WHERE user_id = :user_id";
        $stmt = $this->db->prepare($sql);
        $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
        return $stmt->execute();
    }

    /**
     * Delete user comments
     */
    private function deleteUserComments($userId)
    {
        $sql = "DELETE FROM comments WHERE user_id = :user_id";
        $stmt = $this->db->prepare($sql);
        $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
        return $stmt->execute();
    }

    /**
     * Delete user tokens
     */
    private function deleteUserTokens($userId)
    {
        // Delete refresh tokens
        $sql = "DELETE FROM refresh_tokens WHERE user_id = :user_id";
        $stmt = $this->db->prepare($sql);
        $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
        $stmt->execute();

        // Delete login tokens
        $sql = "DELETE FROM login_tokens WHERE user_id = :user_id";
        $stmt = $this->db->prepare($sql);
        $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
        $stmt->execute();

        // Delete failed attempts
        $sql = "DELETE FROM failed_login_attempts WHERE user_id = :user_id";
        $stmt = $this->db->prepare($sql);
        $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
        return $stmt->execute();
    }
}
