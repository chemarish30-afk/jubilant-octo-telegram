import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

const Upload = () => {
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;

    setUploading(true);
    setMessage('');
    setMessageType('');

    for (const file of acceptedFiles) {
      if (!file.name.toLowerCase().endsWith('.pdf')) {
        setMessage('Only PDF files are allowed');
        setMessageType('error');
        setUploading(false);
        return;
      }

      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await axios.post('/api/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        setMessage(`Successfully uploaded: ${file.name}`);
        setMessageType('success');
      } catch (error) {
        setMessage(`Failed to upload ${file.name}: ${error.response?.data?.error || 'Unknown error'}`);
        setMessageType('error');
        break;
      }
    }

    setUploading(false);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: true
  });

  return (
    <div className="upload-container">
      <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: '#2c3e50' }}>
        Upload PDF Books
      </h2>

      {message && (
        <div className={messageType === 'error' ? 'error' : 'success'}>
          {message}
        </div>
      )}

      <div
        {...getRootProps()}
        className={`dropzone ${isDragActive ? 'dragover' : ''}`}
        style={{ opacity: uploading ? 0.6 : 1, pointerEvents: uploading ? 'none' : 'auto' }}
      >
        <input {...getInputProps()} />
        
        <div className="upload-icon">📚</div>
        
        {uploading ? (
          <div className="upload-text">Uploading...</div>
        ) : isDragActive ? (
          <div className="upload-text">Drop the PDF files here...</div>
        ) : (
          <>
            <div className="upload-text">Drag & drop PDF files here, or click to select</div>
            <div className="upload-hint">You can upload multiple PDF files at once</div>
          </>
        )}
      </div>

      <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
        <h4 style={{ marginBottom: '1rem', color: '#495057' }}>Upload Guidelines:</h4>
        <ul style={{ color: '#6c757d', lineHeight: '1.6' }}>
          <li>Only PDF files are accepted</li>
          <li>Maximum file size: 16MB per file</li>
          <li>Each PDF will be converted to individual page images</li>
          <li>Original PDF files are not accessible to users</li>
          <li>Users can only view pages as images</li>
        </ul>
      </div>
    </div>
  );
};

export default Upload;
