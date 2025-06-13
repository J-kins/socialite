# Nexify - Dynamic Social Media Platform

A modern, dynamic social media platform built with JavaScript frontend and PHP backend, based on the original Nexify template.

## 🚀 Features

- **Dynamic Content**: Real-time posts, comments, and interactions
- **User Authentication**: JWT-based authentication with session management
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Security**: CSRF protection, XSS prevention, and secure file uploads
- **Modern Architecture**: Modular frontend with PHP API backend

## 📁 Project Structure

```
socialite/
├── index.html                    # Main application entry point (stays in root)
├── src/
│   ├── .htaccess                # Apache routing and security rules
│   ├── .env.example             # Environment configuration template
│   ├── assets/
│   │   ├── css/styles.css       # Custom styles with Tailwind enhancements
│   │   ├── js/main.js           # Main application JavaScript
│   │   └── img/                 # Images and media files
│   └── packages/
│       ├── utils/               # JavaScript utilities and API clients
│       │   ├── src/
│       │   │   ├── PostApi.js   # Post-related API calls
│       │   │   ├── AuthApi.js   # Authentication API
│       │   │   ├── SessionUtils.js # Session management
│       │   │   ├── ValidationUtils.js # Input validation
│       │   │   └── ErrorHandler.js # Error handling
│       │   └── package.json
│       └── php/                 # PHP backend
│           ├── src/
│           │   ├── controllers/ # API controllers
│           │   ├── models/      # Database models
│           │   ├── services/    # Business logic services
│           │   ├── core/        # Core utilities (Database, Security)
│           │   └── routes/      # API routing
│           └── composer.json
```

## 🛠️ Installation

### Prerequisites

- PHP 8.0 or higher
- MySQL 5.7 or higher
- Apache/Nginx web server
- Node.js (optional, for development tools)

### Backend Setup

1. **Navigate to PHP backend directory:**

   ```bash
   cd src/packages/php
   ```

2. **Install PHP dependencies:**

   ```bash
   composer install
   ```

3. **Configure environment:**

   ```bash
   cp ../../.env.example ../../.env
   # Edit .env file with your database credentials
   ```

4. **Database setup:**
   - Create a MySQL database named `socialite`
   - The application will automatically create tables on first run
   - Sample data will be inserted for development

### Frontend Setup

1. **Install JavaScript dependencies (optional):**

   ```bash
   cd src/packages/utils
   npm install
   ```

2. **Configure web server:**
   - Point your web server document root to the project root directory
   - Ensure `.htaccess` rewrite rules are enabled
   - The `src/.htaccess` file handles API routing

### Quick Start with Live Server

For development, you can use the existing live-server configuration:

```bash
npm run dev
```

This will start the application at `http://localhost:3000` and serve `index.html`.

## 🔧 Configuration

### Environment Variables

Copy `src/.env.example` to `src/.env` and configure:

```env
# Database
DB_HOST=localhost
DB_NAME=socialite
DB_USER=root
DB_PASS=your_password

# Security
JWT_SECRET=your-secret-key-here
ENCRYPTION_KEY=your-32-character-encryption-key

# Application
APP_URL=http://localhost:3000
```

### Apache Configuration

Ensure your Apache virtual host or `.htaccess` supports:

- URL rewriting (mod_rewrite)
- PHP execution
- Following symlinks

Example virtual host:

```apache
<VirtualHost *:80>
    DocumentRoot /path/to/socialite
    ServerName localhost

    <Directory /path/to/socialite>
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

## 🏗️ Architecture

### Frontend (JavaScript ES6+)

- **Module-based architecture** with ES6 imports/exports
- **API clients** for backend communication
- **Session management** with JWT tokens
- **Error handling** with user-friendly messages
- **Form validation** on client and server side

### Backend (PHP 8+)

- **MVC architecture** with controllers, models, and services
- **RESTful API** design with JSON responses
- **JWT authentication** with refresh tokens
- **Database abstraction** with PDO
- **Security features** (CSRF, XSS protection, rate limiting)

### Database (MySQL)

- **Normalized schema** with foreign key constraints
- **Indexes** for performance optimization
- **Sample data** for development
- **Migration-ready** structure

## 📚 API Endpoints

### Authentication

```
POST /api/auth/login          # User login
POST /api/auth/register       # User registration
POST /api/auth/logout         # User logout
POST /api/auth/refresh        # Refresh JWT token
POST /api/auth/validate       # Validate current session
```

### Posts

```
GET    /api/posts             # Get paginated posts
POST   /api/posts             # Create new post
GET    /api/posts/{id}        # Get single post
PUT    /api/posts/{id}        # Update post
DELETE /api/posts/{id}        # Delete post
POST   /api/posts/{id}/like   # Like a post
DELETE /api/posts/{id}/like   # Unlike a post
GET    /api/posts/search      # Search posts
```

### Comments

```
GET  /api/posts/{id}/comments    # Get post comments
POST /api/posts/{id}/comments    # Create comment
```

### Utility

```
GET /api/csrf-token           # Get CSRF token
```

## 🔐 Security Features

- **JWT Authentication** with secure token storage
- **CSRF Protection** for state-changing operations
- **XSS Prevention** through input sanitization
- **SQL Injection Protection** using prepared statements
- **Rate Limiting** to prevent abuse
- **Secure Headers** (CSP, HSTS, etc.)
- **Input Validation** on both client and server
- **Password Hashing** with PHP's password_hash()

## 🎨 Styling

- **Tailwind CSS** via CDN for utility-first styling
- **Custom CSS** for component-specific styles
- **Dark mode** support with system preference detection
- **Responsive design** with mobile-first approach
- **Smooth animations** and transitions

## 🧪 Development

### Running Tests

JavaScript tests:

```bash
cd src/packages/utils
npm test
```

PHP tests:

```bash
cd src/packages/php
composer test
```

### Code Quality

JavaScript linting:

```bash
cd src/packages/utils
npm run lint
```

PHP code standards:

```bash
cd src/packages/php
composer cs-check
```

### Sample Users

The application creates sample users for development:

- **Email:** john@example.com, **Password:** password123
- **Email:** jane@example.com, **Password:** password123

## 🚀 Deployment

### Production Checklist

1. **Environment Configuration:**

   - Set `APP_ENV=production`
   - Use strong JWT and encryption keys
   - Configure proper database credentials

2. **Security:**

   - Enable HTTPS
   - Set secure session cookies
   - Configure proper CORS origins
   - Review CSP headers

3. **Performance:**

   - Enable PHP OPcache
   - Configure database connection pooling
   - Set up CDN for static assets
   - Enable gzip compression

4. **Monitoring:**
   - Set up error logging
   - Configure application monitoring
   - Database performance monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License. See LICENSE file for details.

## 🆘 Support

For support and questions:

- Create an issue on GitHub
- Email: team@socialite.dev
- Documentation: https://socialite.dev/docs

## 🔄 Migration from Static Version

This refactored version transforms the original static HTML Socialite template into a dynamic, full-featured social media platform:

### Key Changes:

- ✅ **Dynamic content** replacing static HTML
- ✅ **User authentication** and session management
- ✅ **Database integration** for persistent data
- ✅ **API-driven architecture** for scalability
- ✅ **Enhanced security** features
- ✅ **Modern development** practices

### Maintained Features:

- ✅ **Original styling** and visual design
- ✅ **Responsive layout** and mobile support
- ✅ **Component structure** and organization
- ✅ **User interface** patterns and interactions

The refactored version maintains the look and feel of the original while adding robust backend functionality and modern development practices.
