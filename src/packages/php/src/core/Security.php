<?php

namespace Socialite\Core;

class Security
{
    private $csrfTokenName = 'csrf_token';
    private $csrfTokenLifetime = 3600; // 1 hour

    /**
     * Generate CSRF token
     */
    public function generateCsrfToken()
    {
        if (session_status() == PHP_SESSION_NONE) {
            session_start();
        }

        $token = bin2hex(random_bytes(32));
        $_SESSION[$this->csrfTokenName] = $token;
        $_SESSION[$this->csrfTokenName . '_time'] = time();

        return $token;
    }

    /**
     * Verify CSRF token
     */
    public function verifyCsrfToken($token = null)
    {
        if (session_status() == PHP_SESSION_NONE) {
            session_start();
        }

        // Get token from parameter or header
        if ($token === null) {
            $token = $_POST['csrf_token'] ?? $_GET['csrf_token'] ?? $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
        }

        // Check if token exists in session
        if (!isset($_SESSION[$this->csrfTokenName])) {
            return false;
        }

        // Check if token has expired
        $tokenTime = $_SESSION[$this->csrfTokenName . '_time'] ?? 0;
        if (time() - $tokenTime > $this->csrfTokenLifetime) {
            unset($_SESSION[$this->csrfTokenName]);
            unset($_SESSION[$this->csrfTokenName . '_time']);
            return false;
        }

        // Verify token
        $isValid = hash_equals($_SESSION[$this->csrfTokenName], $token);

        // Remove token after verification (one-time use)
        if ($isValid) {
            unset($_SESSION[$this->csrfTokenName]);
            unset($_SESSION[$this->csrfTokenName . '_time']);
        }

        return $isValid;
    }

    /**
     * Sanitize input data
     */
    public function sanitizeInput($input, $type = 'string')
    {
        if (is_array($input)) {
            return array_map(function($item) use ($type) {
                return $this->sanitizeInput($item, $type);
            }, $input);
        }

        switch ($type) {
            case 'email':
                return filter_var(trim($input), FILTER_SANITIZE_EMAIL);
                
            case 'url':
                return filter_var(trim($input), FILTER_SANITIZE_URL);
                
            case 'int':
                return filter_var($input, FILTER_SANITIZE_NUMBER_INT);
                
            case 'float':
                return filter_var($input, FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION);
                
            case 'html':
                return htmlspecialchars(trim($input), ENT_QUOTES | ENT_HTML5, 'UTF-8');
                
            case 'string':
            default:
                // Remove HTML tags and encode special characters
                $input = strip_tags(trim($input));
                return htmlspecialchars($input, ENT_QUOTES | ENT_HTML5, 'UTF-8');
        }
    }

    /**
     * Validate input data
     */
    public function validateInput($input, $rules)
    {
        $errors = [];

        foreach ($rules as $field => $rule) {
            $value = $input[$field] ?? null;
            $fieldErrors = [];

            // Required validation
            if (isset($rule['required']) && $rule['required'] && empty($value)) {
                $fieldErrors[] = ucfirst($field) . ' is required';
            }

            // Skip other validations if value is empty and not required
            if (empty($value) && !isset($rule['required'])) {
                continue;
            }

            // Type validation
            if (isset($rule['type'])) {
                switch ($rule['type']) {
                    case 'email':
                        if (!filter_var($value, FILTER_VALIDATE_EMAIL)) {
                            $fieldErrors[] = ucfirst($field) . ' must be a valid email address';
                        }
                        break;
                        
                    case 'url':
                        if (!filter_var($value, FILTER_VALIDATE_URL)) {
                            $fieldErrors[] = ucfirst($field) . ' must be a valid URL';
                        }
                        break;
                        
                    case 'int':
                        if (!filter_var($value, FILTER_VALIDATE_INT)) {
                            $fieldErrors[] = ucfirst($field) . ' must be a valid integer';
                        }
                        break;
                        
                    case 'float':
                        if (!filter_var($value, FILTER_VALIDATE_FLOAT)) {
                            $fieldErrors[] = ucfirst($field) . ' must be a valid number';
                        }
                        break;
                }
            }

            // Length validation
            if (isset($rule['min_length']) && strlen($value) < $rule['min_length']) {
                $fieldErrors[] = ucfirst($field) . ' must be at least ' . $rule['min_length'] . ' characters';
            }

            if (isset($rule['max_length']) && strlen($value) > $rule['max_length']) {
                $fieldErrors[] = ucfirst($field) . ' must be no more than ' . $rule['max_length'] . ' characters';
            }

            // Pattern validation
            if (isset($rule['pattern']) && !preg_match($rule['pattern'], $value)) {
                $message = $rule['pattern_message'] ?? ucfirst($field) . ' format is invalid';
                $fieldErrors[] = $message;
            }

            // Custom validation
            if (isset($rule['custom']) && is_callable($rule['custom'])) {
                $customResult = $rule['custom']($value);
                if ($customResult !== true) {
                    $fieldErrors[] = $customResult;
                }
            }

            if (!empty($fieldErrors)) {
                $errors[$field] = $fieldErrors;
            }
        }

        return [
            'valid' => empty($errors),
            'errors' => $errors
        ];
    }

    /**
     * Hash password securely
     */
    public function hashPassword($password)
    {
        return password_hash($password, PASSWORD_DEFAULT);
    }

    /**
     * Verify password against hash
     */
    public function verifyPassword($password, $hash)
    {
        return password_verify($password, $hash);
    }

    /**
     * Generate secure random token
     */
    public function generateSecureToken($length = 32)
    {
        return bin2hex(random_bytes($length));
    }

    /**
     * Rate limiting check
     */
    public function checkRateLimit($identifier, $maxAttempts = 5, $timeWindow = 300)
    {
        if (session_status() == PHP_SESSION_NONE) {
            session_start();
        }

        $key = 'rate_limit_' . md5($identifier);
        $currentTime = time();

        if (!isset($_SESSION[$key])) {
            $_SESSION[$key] = [
                'attempts' => 1,
                'first_attempt' => $currentTime,
                'last_attempt' => $currentTime
            ];
            return true;
        }

        $data = $_SESSION[$key];

        // Reset if time window has passed
        if ($currentTime - $data['first_attempt'] > $timeWindow) {
            $_SESSION[$key] = [
                'attempts' => 1,
                'first_attempt' => $currentTime,
                'last_attempt' => $currentTime
            ];
            return true;
        }

        // Increment attempts
        $_SESSION[$key]['attempts']++;
        $_SESSION[$key]['last_attempt'] = $currentTime;

        return $_SESSION[$key]['attempts'] <= $maxAttempts;
    }

    /**
     * Get remaining rate limit time
     */
    public function getRateLimitRemainingTime($identifier, $timeWindow = 300)
    {
        if (session_status() == PHP_SESSION_NONE) {
            session_start();
        }

        $key = 'rate_limit_' . md5($identifier);
        
        if (!isset($_SESSION[$key])) {
            return 0;
        }

        $data = $_SESSION[$key];
        $remaining = $timeWindow - (time() - $data['first_attempt']);

        return max(0, $remaining);
    }

    /**
     * Encrypt data
     */
    public function encrypt($data, $key = null)
    {
        if ($key === null) {
            $key = $_ENV['ENCRYPTION_KEY'] ?? 'default-encryption-key';
        }

        $iv = random_bytes(16);
        $encrypted = openssl_encrypt($data, 'AES-256-CBC', $key, 0, $iv);
        
        return base64_encode($iv . $encrypted);
    }

    /**
     * Decrypt data
     */
    public function decrypt($encryptedData, $key = null)
    {
        if ($key === null) {
            $key = $_ENV['ENCRYPTION_KEY'] ?? 'default-encryption-key';
        }

        $data = base64_decode($encryptedData);
        $iv = substr($data, 0, 16);
        $encrypted = substr($data, 16);
        
        return openssl_decrypt($encrypted, 'AES-256-CBC', $key, 0, $iv);
    }

    /**
     * Check if request is from allowed origin
     */
    public function validateOrigin($allowedOrigins = [])
    {
        $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
        
        if (empty($allowedOrigins)) {
            $allowedOrigins = [
                $_ENV['APP_URL'] ?? 'http://localhost',
                'http://localhost:3000',
                'http://127.0.0.1:3000'
            ];
        }

        return in_array($origin, $allowedOrigins);
    }

    /**
     * Prevent XSS attacks
     */
    public function preventXSS($input)
    {
        return htmlspecialchars($input, ENT_QUOTES | ENT_HTML5, 'UTF-8');
    }

    /**
     * Prevent SQL injection (for dynamic queries)
     */
    public function preventSQLInjection($input)
    {
        // Remove dangerous SQL keywords
        $dangerous = [
            'DROP', 'DELETE', 'INSERT', 'UPDATE', 'UNION', 'SELECT',
            'CREATE', 'ALTER', 'EXEC', 'EXECUTE', 'SCRIPT'
        ];

        foreach ($dangerous as $keyword) {
            $input = preg_replace('/\b' . $keyword . '\b/i', '', $input);
        }

        return trim($input);
    }

    /**
     * Validate file upload
     */
    public function validateFileUpload($file, $options = [])
    {
        $maxSize = $options['max_size'] ?? 5 * 1024 * 1024; // 5MB default
        $allowedTypes = $options['allowed_types'] ?? ['image/jpeg', 'image/png', 'image/gif'];
        $allowedExtensions = $options['allowed_extensions'] ?? ['jpg', 'jpeg', 'png', 'gif'];

        $errors = [];

        // Check if file was uploaded
        if (!isset($file['tmp_name']) || !is_uploaded_file($file['tmp_name'])) {
            $errors[] = 'No file uploaded or upload failed';
            return ['valid' => false, 'errors' => $errors];
        }

        // Check file size
        if ($file['size'] > $maxSize) {
            $errors[] = 'File size exceeds maximum allowed size';
        }

        // Check MIME type
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mimeType = finfo_file($finfo, $file['tmp_name']);
        finfo_close($finfo);

        if (!in_array($mimeType, $allowedTypes)) {
            $errors[] = 'File type not allowed';
        }

        // Check file extension
        $extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        if (!in_array($extension, $allowedExtensions)) {
            $errors[] = 'File extension not allowed';
        }

        // Check for malicious content (basic check)
        $fileContent = file_get_contents($file['tmp_name']);
        if (strpos($fileContent, '<?php') !== false || strpos($fileContent, '<script') !== false) {
            $errors[] = 'File contains potentially malicious content';
        }

        return [
            'valid' => empty($errors),
            'errors' => $errors,
            'mime_type' => $mimeType,
            'extension' => $extension,
            'size' => $file['size']
        ];
    }

    /**
     * Generate secure filename
     */
    public function generateSecureFilename($originalName, $preserveExtension = true)
    {
        $secureBasename = bin2hex(random_bytes(16));
        
        if ($preserveExtension) {
            $extension = pathinfo($originalName, PATHINFO_EXTENSION);
            return $secureBasename . '.' . strtolower($extension);
        }
        
        return $secureBasename;
    }

    /**
     * Set security headers
     */
    public function setSecurityHeaders()
    {
        // Prevent clickjacking
        header('X-Frame-Options: DENY');
        
        // Prevent MIME type sniffing
        header('X-Content-Type-Options: nosniff');
        
        // Enable XSS protection
        header('X-XSS-Protection: 1; mode=block');
        
        // Referrer policy
        header('Referrer-Policy: strict-origin-when-cross-origin');
        
        // Content Security Policy
        $csp = "default-src 'self'; " .
               "script-src 'self' 'unsafe-inline' cdn.tailwindcss.com unpkg.com; " .
               "style-src 'self' 'unsafe-inline' cdn.tailwindcss.com fonts.googleapis.com; " .
               "font-src 'self' fonts.googleapis.com fonts.gstatic.com; " .
               "img-src 'self' data: blob:; " .
               "connect-src 'self'; " .
               "object-src 'none';";
        header('Content-Security-Policy: ' . $csp);
        
        // HSTS (if using HTTPS)
        if (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on') {
            header('Strict-Transport-Security: max-age=31536000; includeSubDomains');
        }
    }
}
