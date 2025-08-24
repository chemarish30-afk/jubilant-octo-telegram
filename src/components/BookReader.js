import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const BookReader = () => {
  const { bookId } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pageImage, setPageImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookTitle, setBookTitle] = useState('');

  useEffect(() => {
    // Get user's progress for this book
    fetchUserProgress();
  }, [bookId]);

  useEffect(() => {
    if (currentPage > 0) {
      fetchPage();
    }
  }, [bookId, currentPage]);

  const fetchUserProgress = async () => {
    try {
      const response = await axios.get('/api/user/progress');
      const bookProgress = response.data.find(p => p.book_id === parseInt(bookId));
      if (bookProgress) {
        setCurrentPage(bookProgress.current_page);
        setTotalPages(bookProgress.total_pages);
        setBookTitle(bookProgress.book_title);
      } else {
        // If no progress, start from page 1
        setCurrentPage(1);
        fetchPage();
      }
    } catch (err) {
      console.error('Error fetching user progress:', err);
      setCurrentPage(1);
      fetchPage();
    }
  };

  const fetchPage = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.get(`/api/books/${bookId}/pages/${currentPage}`);
      setPageImage(response.data.image_url);
      setTotalPages(response.data.total_pages);
      setLoading(false);
    } catch (err) {
      setError('Failed to load page');
      setLoading(false);
      console.error('Error fetching page:', err);
    }
  };

  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'ArrowLeft') {
      goToPreviousPage();
    } else if (e.key === 'ArrowRight') {
      goToNextPage();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [currentPage, totalPages]);

  if (loading) {
    return <div className="loading">Loading page...</div>;
  }

  if (error) {
    return (
      <div className="reader-container">
        <div className="error">{error}</div>
        <Link to="/bookshelf" className="btn btn-primary">Back to Bookshelf</Link>
      </div>
    );
  }

  return (
    <div className="reader-container">
      <div className="page-controls">
        <Link to="/bookshelf" className="btn btn-secondary">
          ← Back to Bookshelf
        </Link>
        
        <div className="page-info">
          {bookTitle && <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>{bookTitle}</div>}
          Page {currentPage} of {totalPages}
        </div>
        
        <div className="page-navigation">
          <button 
            onClick={goToPreviousPage} 
            disabled={currentPage <= 1}
            className="btn btn-secondary"
          >
            ← Previous
          </button>
          
          <input
            type="number"
            min="1"
            max={totalPages}
            value={currentPage}
            onChange={(e) => goToPage(parseInt(e.target.value) || 1)}
            style={{
              width: '80px',
              padding: '8px',
              textAlign: 'center',
              border: '1px solid #ddd',
              borderRadius: '5px'
            }}
          />
          
          <button 
            onClick={goToNextPage} 
            disabled={currentPage >= totalPages}
            className="btn btn-secondary"
          >
            Next →
          </button>
        </div>
      </div>

      <div style={{ textAlign: 'center' }}>
        {pageImage ? (
          <img
            src={pageImage}
            alt={`Page ${currentPage}`}
            className="page-image"
            onError={(e) => {
              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjEwMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2Y4ZjlmYSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5QYWdlIHtjdXJyZW50UGFnZX08L3RleHQ+PC9zdmc+';
            }}
          />
        ) : (
          <div style={{ 
            width: '100%', 
            height: '600px', 
            backgroundColor: '#f8f9fa', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            borderRadius: '10px',
            color: '#666'
          }}>
            Page not available
          </div>
        )}
      </div>

      <div style={{ 
        textAlign: 'center', 
        marginTop: '2rem', 
        padding: '1rem',
        backgroundColor: 'white',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <p style={{ color: '#666', marginBottom: '1rem' }}>
          Use arrow keys or click the navigation buttons to move between pages
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <button 
            onClick={() => goToPage(1)} 
            disabled={currentPage === 1}
            className="btn btn-secondary"
          >
            First Page
          </button>
          <button 
            onClick={() => goToPage(totalPages)} 
            disabled={currentPage === totalPages}
            className="btn btn-secondary"
          >
            Last Page
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookReader;
