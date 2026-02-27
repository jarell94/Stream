import React from 'react';
import { useAuth } from '../context/AuthContext';
import './Profile.css';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="profile-page">
      <div className="profile-container">
        <h1>Profile</h1>
        
        <div className="profile-info">
          <div className="profile-section">
            <h2>Account Information</h2>
            <div className="info-grid">
              <div className="info-item">
                <label>Username</label>
                <p>{user?.username}</p>
              </div>
              <div className="info-item">
                <label>Email</label>
                <p>{user?.email}</p>
              </div>
              <div className="info-item">
                <label>Role</label>
                <p className="role-badge">{user?.role}</p>
              </div>
              <div className="info-item">
                <label>Member Since</label>
                <p>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p>
              </div>
            </div>
          </div>

          <div className="profile-section">
            <h2>Subscription</h2>
            <div className="subscription-info">
              <div className="plan-badge">{user?.subscription?.plan || 'Free'}</div>
              <p>Enjoy unlimited streaming with no ads</p>
            </div>
          </div>

          <div className="profile-section">
            <h2>Statistics</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-value">{user?.myList?.length || 0}</div>
                <div className="stat-label">Videos in My List</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
