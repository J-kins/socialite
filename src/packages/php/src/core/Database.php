<?php

namespace Socialite\Core;

use PDO;
use PDOException;

class Database
{
    private static $instance = null;
    private $connection;

    // Database configuration
    private $host;
    private $dbname;
    private $username;
    private $password;
    private $charset = 'utf8mb4';
    private $options = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
        PDO::ATTR_PERSISTENT => true,
        PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4"
    ];

    private function __construct()
    {
        $this->loadConfig();
        $this->connect();
    }

    /**
     * Get singleton instance
     */
    public static function getInstance()
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    /**
     * Load database configuration
     */
    private function loadConfig()
    {
        // Load from environment variables or use defaults
        $this->host = $_ENV['DB_HOST'] ?? 'localhost';
        $this->dbname = $_ENV['DB_NAME'] ?? 'socialite';
        $this->username = $_ENV['DB_USER'] ?? 'root';
        $this->password = $_ENV['DB_PASS'] ?? '';

        // Validate required configuration
        if (empty($this->dbname)) {
            throw new \Exception('Database name is required');
        }
    }

    /**
     * Create database connection
     */
    private function connect()
    {
        try {
            $dsn = sprintf(
                "mysql:host=%s;dbname=%s;charset=%s",
                $this->host,
                $this->dbname,
                $this->charset
            );

            $this->connection = new PDO($dsn, $this->username, $this->password, $this->options);

            // Set timezone
            $this->connection->exec("SET time_zone = '+00:00'");

        } catch (PDOException $e) {
            error_log('Database connection failed: ' . $e->getMessage());
            
            // Try to create database if it doesn't exist
            if (strpos($e->getMessage(), 'Unknown database') !== false) {
                $this->createDatabase();
            } else {
                throw new \Exception('Database connection failed: ' . $e->getMessage());
            }
        }
    }

    /**
     * Create database if it doesn't exist
     */
    private function createDatabase()
    {
        try {
            $dsn = sprintf("mysql:host=%s;charset=%s", $this->host, $this->charset);
            $tempConnection = new PDO($dsn, $this->username, $this->password, $this->options);
            
            $sql = "CREATE DATABASE IF NOT EXISTS `{$this->dbname}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci";
            $tempConnection->exec($sql);
            
            // Now try to connect again
            $this->connect();
            
            // Run initial migrations
            $this->runInitialMigrations();
            
        } catch (PDOException $e) {
            throw new \Exception('Failed to create database: ' . $e->getMessage());
        }
    }

    /**
     * Get database connection
     */
    public function getConnection()
    {
        // Check if connection is still alive
        if ($this->connection === null) {
            $this->connect();
        }

        try {
            $this->connection->query('SELECT 1');
        } catch (PDOException $e) {
            // Reconnect if connection is lost
            $this->connect();
        }

        return $this->connection;
    }

    /**
     * Begin transaction
     */
    public function beginTransaction()
    {
        return $this->connection->beginTransaction();
    }

    /**
     * Commit transaction
     */
    public function commit()
    {
        return $this->connection->commit();
    }

    /**
     * Rollback transaction
     */
    public function rollback()
    {
        return $this->connection->rollBack();
    }

    /**
     * Get last insert ID
     */
    public function lastInsertId()
    {
        return $this->connection->lastInsertId();
    }

    /**
     * Execute query
     */
    public function query($sql, $params = [])
    {
        try {
            $stmt = $this->connection->prepare($sql);
            $stmt->execute($params);
            return $stmt;
        } catch (PDOException $e) {
            error_log('Query error: ' . $e->getMessage() . ' SQL: ' . $sql);
            throw $e;
        }
    }

    /**
     * Fetch single row
     */
    public function fetch($sql, $params = [])
    {
        $stmt = $this->query($sql, $params);
        return $stmt->fetch();
    }

    /**
     * Fetch all rows
     */
    public function fetchAll($sql, $params = [])
    {
        $stmt = $this->query($sql, $params);
        return $stmt->fetchAll();
    }

    /**
     * Execute statement and return affected rows
     */
    public function execute($sql, $params = [])
    {
        $stmt = $this->query($sql, $params);
        return $stmt->rowCount();
    }

    /**
     * Run initial database migrations
     */
    private function runInitialMigrations()
    {
        $migrations = [
            $this->getUsersTableSQL(),
            $this->getPostsTableSQL(),
            $this->getCommentsTableSQL(),
            $this->getPostLikesTableSQL(),
            $this->getRefreshTokensTableSQL(),
            $this->getLoginTokensTableSQL(),
            $this->getFailedLoginAttemptsTableSQL(),
            $this->getUserFollowersTableSQL()
        ];

        foreach ($migrations as $sql) {
            try {
                $this->connection->exec($sql);
            } catch (PDOException $e) {
                error_log('Migration error: ' . $e->getMessage());
                // Continue with other migrations
            }
        }

        // Insert sample data for development
        $this->insertSampleData();
    }

    /**
     * Users table SQL
     */
    private function getUsersTableSQL()
    {
        return "
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(255) NOT NULL UNIQUE,
                username VARCHAR(50) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                first_name VARCHAR(100) DEFAULT '',
                last_name VARCHAR(100) DEFAULT '',
                bio TEXT DEFAULT '',
                location VARCHAR(100) DEFAULT '',
                website VARCHAR(255) DEFAULT '',
                avatar_url VARCHAR(500) DEFAULT '',
                status ENUM('pending', 'active', 'suspended', 'deleted') DEFAULT 'pending',
                role ENUM('user', 'moderator', 'admin') DEFAULT 'user',
                email_verification_token VARCHAR(64) NULL,
                password_reset_token VARCHAR(64) NULL,
                password_reset_expires DATETIME NULL,
                two_factor_enabled BOOLEAN DEFAULT FALSE,
                two_factor_secret VARCHAR(32) NULL,
                last_login DATETIME NULL,
                created_at DATETIME NOT NULL,
                updated_at DATETIME NULL,
                INDEX idx_email (email),
                INDEX idx_username (username),
                INDEX idx_status (status),
                INDEX idx_created_at (created_at)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        ";
    }

    /**
     * Posts table SQL
     */
    private function getPostsTableSQL()
    {
        return "
            CREATE TABLE IF NOT EXISTS posts (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                content TEXT NOT NULL,
                image_url VARCHAR(500) DEFAULT '',
                post_type ENUM('text', 'image', 'video', 'link') DEFAULT 'text',
                privacy ENUM('public', 'friends', 'private') DEFAULT 'public',
                created_at DATETIME NOT NULL,
                updated_at DATETIME NULL,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                INDEX idx_user_id (user_id),
                INDEX idx_created_at (created_at),
                INDEX idx_privacy (privacy),
                FULLTEXT idx_content (content)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        ";
    }

    /**
     * Comments table SQL
     */
    private function getCommentsTableSQL()
    {
        return "
            CREATE TABLE IF NOT EXISTS comments (
                id INT AUTO_INCREMENT PRIMARY KEY,
                post_id INT NOT NULL,
                user_id INT NOT NULL,
                content TEXT NOT NULL,
                created_at DATETIME NOT NULL,
                updated_at DATETIME NULL,
                FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                INDEX idx_post_id (post_id),
                INDEX idx_user_id (user_id),
                INDEX idx_created_at (created_at)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        ";
    }

    /**
     * Post likes table SQL
     */
    private function getPostLikesTableSQL()
    {
        return "
            CREATE TABLE IF NOT EXISTS post_likes (
                id INT AUTO_INCREMENT PRIMARY KEY,
                post_id INT NOT NULL,
                user_id INT NOT NULL,
                created_at DATETIME NOT NULL,
                FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                UNIQUE KEY unique_like (post_id, user_id),
                INDEX idx_post_id (post_id),
                INDEX idx_user_id (user_id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        ";
    }

    /**
     * Refresh tokens table SQL
     */
    private function getRefreshTokensTableSQL()
    {
        return "
            CREATE TABLE IF NOT EXISTS refresh_tokens (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                token VARCHAR(64) NOT NULL UNIQUE,
                expires_at DATETIME NOT NULL,
                created_at DATETIME NOT NULL,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                INDEX idx_user_id (user_id),
                INDEX idx_token (token),
                INDEX idx_expires_at (expires_at)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        ";
    }

    /**
     * Login tokens table SQL (for 2FA)
     */
    private function getLoginTokensTableSQL()
    {
        return "
            CREATE TABLE IF NOT EXISTS login_tokens (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                token VARCHAR(32) NOT NULL UNIQUE,
                expires_at DATETIME NOT NULL,
                created_at DATETIME NOT NULL,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                INDEX idx_user_id (user_id),
                INDEX idx_token (token),
                INDEX idx_expires_at (expires_at)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        ";
    }

    /**
     * Failed login attempts table SQL
     */
    private function getFailedLoginAttemptsTableSQL()
    {
        return "
            CREATE TABLE IF NOT EXISTS failed_login_attempts (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                attempted_at DATETIME NOT NULL,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                INDEX idx_user_id (user_id),
                INDEX idx_attempted_at (attempted_at)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        ";
    }

    /**
     * User followers table SQL
     */
    private function getUserFollowersTableSQL()
    {
        return "
            CREATE TABLE IF NOT EXISTS user_followers (
                id INT AUTO_INCREMENT PRIMARY KEY,
                follower_id INT NOT NULL,
                following_id INT NOT NULL,
                created_at DATETIME NOT NULL,
                FOREIGN KEY (follower_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (following_id) REFERENCES users(id) ON DELETE CASCADE,
                UNIQUE KEY unique_follow (follower_id, following_id),
                INDEX idx_follower_id (follower_id),
                INDEX idx_following_id (following_id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        ";
    }

    /**
     * Insert sample data for development
     */
    private function insertSampleData()
    {
        try {
            // Check if sample data already exists
            $userCount = $this->fetch("SELECT COUNT(*) as count FROM users")['count'];
            
            if ($userCount > 0) {
                return; // Sample data already exists
            }

            // Create sample users
            $sampleUsers = [
                [
                    'email' => 'john@example.com',
                    'username' => 'john_doe',
                    'password' => password_hash('password123', PASSWORD_DEFAULT),
                    'first_name' => 'John',
                    'last_name' => 'Doe',
                    'bio' => 'Software developer and tech enthusiast',
                    'status' => 'active',
                    'created_at' => date('Y-m-d H:i:s')
                ],
                [
                    'email' => 'jane@example.com',
                    'username' => 'jane_smith',
                    'password' => password_hash('password123', PASSWORD_DEFAULT),
                    'first_name' => 'Jane',
                    'last_name' => 'Smith',
                    'bio' => 'Designer and creative thinker',
                    'status' => 'active',
                    'created_at' => date('Y-m-d H:i:s')
                ]
            ];

            foreach ($sampleUsers as $user) {
                $this->query("
                    INSERT INTO users (email, username, password, first_name, last_name, bio, status, created_at)
                    VALUES (:email, :username, :password, :first_name, :last_name, :bio, :status, :created_at)
                ", $user);
            }

            // Create sample posts
            $samplePosts = [
                [
                    'user_id' => 1,
                    'content' => 'Welcome to Socialite! This is my first post on this amazing platform. Excited to connect with everyone!',
                    'post_type' => 'text',
                    'privacy' => 'public',
                    'created_at' => date('Y-m-d H:i:s', time() - 3600) // 1 hour ago
                ],
                [
                    'user_id' => 2,
                    'content' => 'Just finished working on a new design project. Really happy with how it turned out! #design #creativity',
                    'post_type' => 'text',
                    'privacy' => 'public',
                    'created_at' => date('Y-m-d H:i:s', time() - 1800) // 30 minutes ago
                ],
                [
                    'user_id' => 1,
                    'content' => 'Beautiful sunset today! Sometimes you need to take a break from coding and appreciate nature. 🌅',
                    'post_type' => 'text',
                    'privacy' => 'public',
                    'created_at' => date('Y-m-d H:i:s', time() - 600) // 10 minutes ago
                ]
            ];

            foreach ($samplePosts as $post) {
                $this->query("
                    INSERT INTO posts (user_id, content, post_type, privacy, created_at)
                    VALUES (:user_id, :content, :post_type, :privacy, :created_at)
                ", $post);
            }

        } catch (PDOException $e) {
            error_log('Sample data insertion error: ' . $e->getMessage());
            // Don't throw exception for sample data errors
        }
    }

    /**
     * Close database connection
     */
    public function close()
    {
        $this->connection = null;
    }

    /**
     * Prevent cloning
     */
    private function __clone() {}

    /**
     * Prevent unserialization
     */
    public function __wakeup()
    {
        throw new \Exception("Cannot unserialize singleton");
    }
}
