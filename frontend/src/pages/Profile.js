
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './Profile.css';

const Profile = () => {
  const { currentUser } = useAuth();
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleImageUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('profile_image', selectedFile);

    setUploading(true);
    try {
      // Implementation for image upload would go here
      alert('Profile image upload functionality would be implemented here');
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image');
    } finally {
      setUploading(false);
      setSelectedFile(null);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <h1>My Profile</h1>
        
        <div className="profile-info">
          <div className="profile-image-section">
            {currentUser?.profile_image ? (
              <img 
                src={`/uploads/profiles/${currentUser.profile_image}`} 
                alt="Profile"
                className="profile-image"
              />
            ) : (
              <div className="default-avatar">
                {currentUser?.username?.charAt(0).toUpperCase()}
              </div>
            )}
            
            <div className="image-upload">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileSelect}
                id="profile-image-input"
              />
              <label htmlFor="profile-image-input" className="upload-label">
                Choose Image
              </label>
              
              {selectedFile && (
                <button 
                  onClick={handleImageUpload} 
                  disabled={uploading}
                  className="upload-btn"
                >
                  {uploading ? 'Uploading...' : 'Upload'}
                </button>
              )}
            </div>
          </div>
          
          <div className="user-details">
            <div className="detail-item">
              <label>Username:</label>
              <span>{currentUser?.username}</span>
            </div>
            
            <div className="detail-item">
              <label>Email:</label>
              <span>{currentUser?.email}</span>
            </div>
            
            <div className="detail-item">
              <label>Member since:</label>
              <span>
                {currentUser?.created_at ? 
                  new Date(currentUser.created_at).toLocaleDateString() : 
                  'N/A'
                }
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
