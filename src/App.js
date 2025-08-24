import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Login from './components/Login';
import Register from './components/Register';
import Bookshelf from './components/Bookshelf';
import BookReader from './components/BookReader';
import Upload from './components/Upload';
import Navbar from './components/Navbar';
import './App.css';

// Set up axios defaults
axios.defaults.withCredentials = true;

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // You could verify the token here if needed
      setUser(JSON.parse(localStorage.getItem('user')));
    }
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <Router>
      <div className="App">
        {user && <Navbar user={user} onLogout={logout} />}
        <div className="container">
          <Routes>
            <Route 
              path="/login" 
              element={user ? <Navigate to="/bookshelf" /> : <Login onLogin={login} />} 
            />
            <Route 
              path="/register" 
              element={user ? <Navigate to="/bookshelf" /> : <Register />} 
            />
            <Route 
              path="/bookshelf" 
              element={user ? <Bookshelf /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/book/:bookId" 
              element={user ? <BookReader /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/upload" 
              element={user && user.is_admin ? <Upload /> : <Navigate to="/bookshelf" />} 
            />
            <Route 
              path="/" 
              element={<Navigate to={user ? "/bookshelf" : "/login"} />} 
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
