# Secure Book Reader

A secure web application for reading PDF books with authentication, progress tracking, and admin-only upload capabilities.

## Features

### 🔐 Authentication
- User registration and login system
- Secure password hashing with bcrypt
- JWT token-based authentication
- Admin and regular user roles

### 📚 Book Management
- **Admin-only PDF upload**: Only administrators can upload PDF books
- **Secure PDF processing**: PDFs are converted to images, preventing direct downloads
- **Page-by-page viewing**: Users view books as individual page images
- **No raw PDF access**: Original PDF files are not accessible to users

### 📖 Reading Experience
- **Bookshelf view**: Grid layout showing all available books with covers
- **Progress tracking**: Per-user reading progress with percentage completion
- **Resume functionality**: Users can continue reading from where they left off
- **Navigation controls**: Keyboard (arrow keys) and button navigation
- **Page jumping**: Direct navigation to any page number

### 📊 Progress Tracking
- **Real-time updates**: Progress is saved automatically as users read
- **Completion status**: Books are marked as completed when finished
- **Progress visualization**: Progress bars and percentage indicators
- **Reading history**: Track last read timestamps

## Technology Stack

### Backend
- **Python Flask**: Web framework
- **SQLAlchemy**: Database ORM
- **Flask-Login**: User session management
- **PyPDF2**: PDF processing
- **Pillow**: Image processing
- **bcrypt**: Password hashing
- **PyJWT**: JWT token handling

### Frontend
- **React**: User interface framework
- **React Router**: Client-side routing
- **Axios**: HTTP client
- **React Dropzone**: File upload interface
- **CSS3**: Modern styling with responsive design

### Database
- **SQLite**: Lightweight database (can be easily migrated to PostgreSQL/MySQL)

### DevOps
- **GitHub Actions**: CI/CD pipeline
- **Netlify**: Frontend hosting and deployment
- **Render/Railway/Heroku**: Backend hosting options

## Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd secure-book-reader
   ```

2. **Install dependencies**
   ```bash
   # Backend
   pip install -r requirements.txt
   
   # Frontend
   npm install
   ```

3. **Start the application**
   ```bash
   # Windows
   start.bat
   
   # Unix/Linux/Mac
   ./start.sh
   
   # Manual
   python app.py  # Backend on http://localhost:5000
   npm start      # Frontend on http://localhost:3000
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000
   - Default admin: username=`admin`, password=`admin123`

## Deployment

### 🚀 Quick Deployment

This project includes GitHub Actions for automated CI/CD and deployment to Netlify.

1. **Fork or clone this repository**
2. **Set up backend hosting** (Render, Railway, or Heroku)
3. **Configure GitHub Secrets** (see [DEPLOYMENT.md](DEPLOYMENT.md))
4. **Push to main branch** - automatic deployment will begin

### 📋 Manual Deployment Steps

For detailed deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md).

## CI/CD Pipeline

The project includes GitHub Actions workflows:

- **CI/CD Pipeline** (`.github/workflows/ci-cd.yml`): Tests and deploys frontend to Netlify
- **Backend Deployment** (`.github/workflows/deploy-backend.yml`): Deploys backend to chosen platform

### Workflow Features:
- ✅ Automated testing (frontend and backend)
- ✅ Build verification
- ✅ Security checks
- ✅ Automatic deployment to Netlify
- ✅ Environment-specific configurations

## Project Structure

```
secure-book-reader/
├── .github/workflows/     # GitHub Actions workflows
├── public/               # React public files
├── src/                  # React source code
│   ├── components/       # React components
│   ├── App.js           # Main React app
│   └── setupProxy.js    # Development proxy
├── app.py               # Main Flask application
├── config.py            # Configuration settings
├── requirements.txt     # Python dependencies
├── package.json         # React dependencies
├── netlify.toml         # Netlify configuration
├── render.yaml          # Render deployment config
├── railway.json         # Railway deployment config
├── Procfile             # Heroku deployment config
├── DEPLOYMENT.md        # Detailed deployment guide
└── README.md           # This file
```

## Configuration

### Environment Variables

#### Frontend (.env)
```env
REACT_APP_API_URL=https://your-backend-url.com
```

#### Backend
```env
SECRET_KEY=your-secret-key
DATABASE_URL=your-database-url
FLASK_ENV=production
```

### Platform-Specific Configs

- **Netlify**: `netlify.toml`, `public/_redirects`
- **Render**: `render.yaml`
- **Railway**: `railway.json`
- **Heroku**: `Procfile`, `runtime.txt`

## Security Features

### Authentication & Authorization
- **Password hashing**: All passwords are hashed using bcrypt
- **JWT tokens**: Secure session management
- **Role-based access**: Admin-only upload functionality
- **Session protection**: CSRF protection and secure cookies

### File Security
- **PDF conversion**: All PDFs are converted to images
- **No direct access**: Original PDF files are not served
- **File validation**: Only PDF files are accepted
- **Size limits**: 16MB maximum file size per upload

### Data Protection
- **SQL injection prevention**: Parameterized queries via SQLAlchemy
- **XSS protection**: Input sanitization and output encoding
- **CSRF protection**: Built-in Flask-WTF protection

## API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `POST /api/logout` - User logout

### Books
- `GET /api/books` - Get all books with user progress
- `GET /api/books/{id}/pages/{page}` - Get specific book page
- `POST /api/upload` - Upload PDF (admin only)

### User Progress
- `GET /api/user/progress` - Get user's reading progress

## Database Schema

### Users
- `id`: Primary key
- `username`: Unique username
- `email`: Unique email address
- `password_hash`: Hashed password
- `is_admin`: Admin flag
- `created_at`: Account creation timestamp

### Books
- `id`: Primary key
- `title`: Book title
- `filename`: Original PDF filename
- `cover_image`: First page image filename
- `total_pages`: Number of pages
- `uploaded_by`: Admin user ID
- `uploaded_at`: Upload timestamp

### UserProgress
- `id`: Primary key
- `user_id`: User reference
- `book_id`: Book reference
- `current_page`: Last read page
- `completed`: Completion status
- `last_read`: Last reading timestamp

## Development

### Running Tests
```bash
# Frontend tests
npm test

# Backend tests (manual)
python -c "from app import app, db; app.app_context().push(); db.create_all()"
```

### Building for Production
```bash
# Frontend build
npm run build

# Backend (uses gunicorn in production)
gunicorn app:app
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Troubleshooting

### Common Issues

1. **CORS Errors**: Update CORS configuration in `app.py`
2. **Build Failures**: Check dependency versions and Node.js version
3. **Deployment Issues**: Verify GitHub Secrets and environment variables
4. **Database Issues**: Ensure proper database URL and credentials

### Getting Help

- Check [DEPLOYMENT.md](DEPLOYMENT.md) for deployment issues
- Review GitHub Actions logs for CI/CD problems
- Open an issue in the GitHub repository

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
1. Check the documentation in this README and [DEPLOYMENT.md](DEPLOYMENT.md)
2. Review the GitHub Actions logs
3. Open an issue on the GitHub repository

---

**Happy Reading! 📚**
