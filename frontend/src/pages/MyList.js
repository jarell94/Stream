import React, { useState, useEffect } from 'react';
import { userService, videoService } from '../services/api';
import { toast } from 'react-toastify';
import VideoCard from '../components/VideoCard';
import './MyList.css';

const MyList = () => {
  const [myListVideos, setMyListVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyList();
  }, []);

  const fetchMyList = async () => {
    try {
      setLoading(true);
      const response = await userService.getMyList();
      setMyListVideos(response.data.videos || []);
    } catch (error) {
      toast.error('Failed to load your list');
      console.error('Error fetching my list:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromList = async (videoId) => {
    try {
      await videoService.removeFromMyList(videoId);
      toast.success('Removed from your list');
      // Update the list locally
      setMyListVideos(myListVideos.filter(video => video._id !== videoId));
    } catch (error) {
      toast.error('Failed to remove from list');
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="my-list-page">
      <div className="page-header">
        <h1>My List</h1>
        <p>{myListVideos.length} {myListVideos.length === 1 ? 'video' : 'videos'}</p>
      </div>

      {myListVideos.length > 0 ? (
        <div className="video-grid">
          {myListVideos.map((video) => (
            <div key={video._id} className="list-video-item">
              <VideoCard video={video} />
              <button
                className="remove-button"
                onClick={() => handleRemoveFromList(video._id)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-list">
          <h2>Your list is empty</h2>
          <p>Add videos to your list to watch them later</p>
        </div>
      )}
    </div>
  );
};

export default MyList;
