import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Bookshelf = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get('/api/books');
      setBooks(response.data);
    } catch (err) {
      setError('Failed to load books');
      console.error('Error fetching books:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading your bookshelf...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div style={{ padding: '2rem 0' }}>
      <h1 style={{ marginBottom: '2rem', color: '#2c3e50' }}>Your Bookshelf</h1>
      
      {books.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <h3 style={{ marginBottom: '1rem', color: '#666' }}>No books available</h3>
          <p style={{ color: '#999' }}>
            Books will appear here once an admin uploads them.
          </p>
        </div>
      ) : (
        <div className="grid">
          {books.map((book) => (
            <Link 
              key={book.id} 
              to={`/book/${book.id}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div className="book-card">
                <img
                  src={book.cover_image ? `/static/pages/${book.cover_image}` : '/placeholder-cover.jpg'}
                  alt={book.title}
                  className="book-cover"
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjhmOWZhIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkJvb2sgQ292ZXI8L3RleHQ+PC9zdmc+';
                  }}
                />
                <div className="book-info">
                  <div className="book-title">{book.title}</div>
                  <div className="book-meta">
                    {book.total_pages} pages • {new Date(book.uploaded_at).toLocaleDateString()}
                  </div>
                  
                  <div style={{ marginTop: '0.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#666' }}>
                      <span>Progress</span>
                      <span>{book.progress.percentage}%</span>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${book.progress.percentage}%` }}
                      ></div>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#999', marginTop: '0.25rem' }}>
                      Page {book.progress.current_page} of {book.total_pages}
                    </div>
                  </div>
                  
                  {book.progress.completed && (
                    <div style={{ 
                      marginTop: '0.5rem', 
                      padding: '0.25rem 0.5rem', 
                      backgroundColor: '#d4edda', 
                      color: '#155724', 
                      borderRadius: '3px',
                      fontSize: '0.8rem',
                      textAlign: 'center'
                    }}>
                      ✓ Completed
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookshelf;
