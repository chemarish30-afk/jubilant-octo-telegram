import os
import jwt
import bcrypt
from datetime import datetime, timedelta
from flask import Flask, request, jsonify, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
from flask_cors import CORS
from werkzeug.utils import secure_filename
from werkzeug.security import generate_password_hash, check_password_hash
import PyPDF2
from PIL import Image
import io
import base64
from functools import wraps

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'your-secret-key-change-in-production')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///books.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Ensure upload directory exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
os.makedirs('static/pages', exist_ok=True)

db = SQLAlchemy(app)
login_manager = LoginManager()
login_manager.init_app(app)
CORS(app, supports_credentials=True)

# Database Models
class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(120), nullable=False)
    is_admin = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Book(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    filename = db.Column(db.String(200), nullable=False)
    cover_image = db.Column(db.String(200))
    total_pages = db.Column(db.Integer, default=0)
    uploaded_by = db.Column(db.Integer, db.ForeignKey('user.id'))
    uploaded_at = db.Column(db.DateTime, default=datetime.utcnow)

class UserProgress(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    book_id = db.Column(db.Integer, db.ForeignKey('book.id'))
    current_page = db.Column(db.Integer, default=1)
    completed = db.Column(db.Boolean, default=False)
    last_read = db.Column(db.DateTime, default=datetime.utcnow)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not current_user.is_authenticated or not current_user.is_admin:
            return jsonify({'error': 'Admin access required'}), 403
        return f(*args, **kwargs)
    return decorated_function

def generate_token(user_id):
    payload = {
        'user_id': user_id,
        'exp': datetime.utcnow() + timedelta(days=1)
    }
    return jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256')

@app.route('/')
def health_check():
    return jsonify({'status': 'ok', 'message': 'Backend is running'})

@app.route('/api/health')
def api_health():
    return jsonify({'status': 'ok', 'message': 'API is working'})

@app.route('/api/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Validate required fields
        required_fields = ['username', 'email', 'password']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        # Validate email format
        import re
        email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(email_pattern, data['email']):
            return jsonify({'error': 'Invalid email format'}), 400
        
        # Check if username already exists
        if User.query.filter_by(username=data['username']).first():
            return jsonify({'error': 'Username already exists'}), 400
        
        # Check if email already exists
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'Email already exists'}), 400
        
        # Create user
        password_hash = generate_password_hash(data['password'])
        user = User(
            username=data['username'],
            email=data['email'],
            password_hash=password_hash
        )
        
        db.session.add(user)
        db.session.commit()
        
        return jsonify({'message': 'User registered successfully'}), 201
        
    except Exception as e:
        db.session.rollback()
        print(f"Registration error: {str(e)}")
        return jsonify({'error': 'Registration failed. Please try again.'}), 500

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data['username']).first()
    
    if user and check_password_hash(user.password_hash, data['password']):
        login_user(user)
        token = generate_token(user.id)
        return jsonify({
            'message': 'Login successful',
            'token': token,
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'is_admin': user.is_admin
            }
        })
    
    return jsonify({'error': 'Invalid credentials'}), 401

@app.route('/api/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({'message': 'Logout successful'})

@app.route('/api/books', methods=['GET'])
@login_required
def get_books():
    books = Book.query.all()
    books_data = []
    
    for book in books:
        progress = UserProgress.query.filter_by(
            user_id=current_user.id, 
            book_id=book.id
        ).first()
        
        progress_data = {
            'current_page': progress.current_page if progress else 1,
            'completed': progress.completed if progress else False,
            'percentage': round((progress.current_page / book.total_pages * 100) if progress and book.total_pages > 0 else 0, 1)
        }
        
        books_data.append({
            'id': book.id,
            'title': book.title,
            'cover_image': book.cover_image,
            'total_pages': book.total_pages,
            'uploaded_at': book.uploaded_at.isoformat(),
            'progress': progress_data
        })
    
    return jsonify(books_data)

@app.route('/api/books/<int:book_id>/pages/<int:page_number>', methods=['GET'])
@login_required
def get_page(book_id, page_number):
    book = Book.query.get_or_404(book_id)
    
    if page_number < 1 or page_number > book.total_pages:
        return jsonify({'error': 'Page not found'}), 404
    
    page_filename = f"book_{book_id}_page_{page_number}.png"
    page_path = os.path.join('static', 'pages', page_filename)
    
    if not os.path.exists(page_path):
        return jsonify({'error': 'Page not found'}), 404
    
    # Update user progress
    progress = UserProgress.query.filter_by(
        user_id=current_user.id, 
        book_id=book_id
    ).first()
    
    if not progress:
        progress = UserProgress(
            user_id=current_user.id,
            book_id=book_id,
            current_page=page_number
        )
        db.session.add(progress)
    else:
        progress.current_page = page_number
        progress.last_read = datetime.utcnow()
        if page_number == book.total_pages:
            progress.completed = True
    
    db.session.commit()
    
    return jsonify({
        'page_number': page_number,
        'total_pages': book.total_pages,
        'image_url': f'/static/pages/{page_filename}'
    })

@app.route('/api/upload', methods=['POST'])
@login_required
@admin_required
def upload_book():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    if not file.filename.lower().endswith('.pdf'):
        return jsonify({'error': 'Only PDF files are allowed'}), 400
    
    filename = secure_filename(file.filename)
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(filepath)
    
    try:
        # Process PDF
        with open(filepath, 'rb') as pdf_file:
            pdf_reader = PyPDF2.PdfReader(pdf_file)
            total_pages = len(pdf_reader.pages)
            
            # Create book record
            book = Book(
                title=filename.replace('.pdf', ''),
                filename=filename,
                total_pages=total_pages,
                uploaded_by=current_user.id
            )
            db.session.add(book)
            db.session.flush()  # Get the book ID
            
            # Convert pages to images
            for page_num in range(total_pages):
                page = pdf_reader.pages[page_num]
                
                # Convert page to image (simplified - in production, use pdf2image)
                # For now, we'll create a placeholder image
                img = Image.new('RGB', (800, 1000), color='white')
                page_filename = f"book_{book.id}_page_{page_num + 1}.png"
                page_path = os.path.join('static', 'pages', page_filename)
                img.save(page_path)
            
            # Set cover image
            book.cover_image = f"book_{book.id}_page_1.png"
            db.session.commit()
            
            return jsonify({
                'message': 'Book uploaded successfully',
                'book': {
                    'id': book.id,
                    'title': book.title,
                    'total_pages': total_pages
                }
            })
            
    except Exception as e:
        db.session.rollback()
        if os.path.exists(filepath):
            os.remove(filepath)
        return jsonify({'error': f'Error processing PDF: {str(e)}'}), 500

@app.route('/api/user/progress', methods=['GET'])
@login_required
def get_user_progress():
    progress = UserProgress.query.filter_by(user_id=current_user.id).all()
    progress_data = []
    
    for p in progress:
        book = Book.query.get(p.book_id)
        progress_data.append({
            'book_id': p.book_id,
            'book_title': book.title,
            'current_page': p.current_page,
            'total_pages': book.total_pages,
            'percentage': round((p.current_page / book.total_pages * 100) if book.total_pages > 0 else 0, 1),
            'completed': p.completed,
            'last_read': p.last_read.isoformat()
        })
    
    return jsonify(progress_data)

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        
        # Create admin user if none exists
        admin = User.query.filter_by(is_admin=True).first()
        if not admin:
            admin = User(
                username='admin',
                email='admin@example.com',
                password_hash=generate_password_hash('admin123'),
                is_admin=True
            )
            db.session.add(admin)
            db.session.commit()
            print("Admin user created: username='admin', password='admin123'")
    
    app.run(debug=True, host='0.0.0.0', port=5000)
