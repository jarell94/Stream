import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactPlayer from 'react-player';
import { FaArrowLeft, FaHeart } from 'react-icons/fa';
import { videoService, watchHistoryService } from '../services/api';
import { toast } from 'react-toastify';
import VideoCard from '../components/VideoCard';
import './Watch.css';

const Watch = () => {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (id) {
      fetchVideoData();
    }
  }, [id]);

  const fetchVideoData = async () => {
    try {
      setLoading(true);
      const [videoRes, relatedRes] = await Promise.all([
        videoService.getVideoById(id),
        videoService.getRelatedVideos(id)
      ]);

      setVideo(videoRes.data.video);
      setRelatedVideos(relatedRes.data.videos || []);
    } catch (error) {
      toast.error('Failed to load video');
      console.error('Error fetching video:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProgress = async (state) => {
    const currentProgress = Math.floor(state.playedSeconds);
    
    if (currentProgress > 0 && currentProgress % 10 === 0 && currentProgress !== progress) {
      setProgress(currentProgress);
      
      try {
        await watchHistoryService.updateProgress(id, {
          progress: currentProgress,
          completed: state.played > 0.9
        });
      } catch (error) {
        console.error('Error updating progress:', error);
      }
    }
  };

  const handleLike = async () => {
    try {
      await videoService.likeVideo(id);
      toast.success('Liked!');
      fetchVideoData();
    } catch (error) {
      toast.error('Failed to like video');
    }
  };

  const handleAddToList = async (videoId) => {
    try {
      await videoService.addToMyList(videoId);
      toast.success('Added to your list!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add to list');
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="watch-page">
        <div className="error-message">
          <h2>Video not found</h2>
          <Link to="/" className="btn btn-primary">Go Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="watch-page">
      <Link to="/" className="back-button">
        <FaArrowLeft /> Back
      </Link>

      <div className="video-player-container">
        <ReactPlayer
          url={`http://localhost:5000/api/videos/${id}/stream`}
          width="100%"
          height="100%"
          controls
          playing
          onProgress={handleProgress}
          config={{
            file: {
              attributes: {
                controlsList: 'nodownload'
              }
            }
          }}
        />
      </div>

      <div className="video-details">
        <div className="video-header">
          <div>
            <h1>{video.title}</h1>
            <div className="video-meta">
              <span>{video.releaseYear}</span>
              <span>{video.rating}</span>
              <span>{Math.floor(video.duration / 60)} min</span>
              <span>{video.views} views</span>
            </div>
          </div>
          <button className="like-button" onClick={handleLike}>
            <FaHeart /> {video.likes}
          </button>
        </div>

        <div className="video-description">
          <p>{video.description}</p>
        </div>

        <div className="video-info-grid">
          <div className="info-item">
            <strong>Director:</strong> {video.director || 'N/A'}
          </div>
          <div className="info-item">
            <strong>Genre:</strong> {video.genre?.join(', ')}
          </div>
          {video.imdbRating && (
            <div className="info-item">
              <strong>IMDB Rating:</strong> {video.imdbRating}/10
            </div>
          )}
        </div>

        {video.cast && video.cast.length > 0 && (
          <div className="cast-section">
            <h3>Cast</h3>
            <div className="cast-list">
              {video.cast.map((member, index) => (
                <div key={index} className="cast-member">
                  <div className="cast-name">{member.name}</div>
                  {member.role && <div className="cast-role">{member.role}</div>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {relatedVideos.length > 0 && (
        <div className="related-videos">
          <h2>More Like This</h2>
          <div className="video-grid">
            {relatedVideos.slice(0, 6).map((relatedVideo) => (
              <VideoCard
                key={relatedVideo._id}
                video={relatedVideo}
                onAddToList={handleAddToList}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Watch;
