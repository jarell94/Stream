import React from 'react';
import { Link } from 'react-router-dom';
import { FaPlay, FaPlus, FaLock } from 'react-icons/fa';
import './VideoCard.css';

const VideoCard = ({ video, onAddToList }) => {
  const getStreamUrl = () => {
    return `http://localhost:5000/${video.thumbnail}`;
  };

  return (
    <div className="video-card">
      <Link to={`/watch/${video._id}`}>
        <div className="video-card-image">
          <img src={getStreamUrl()} alt={video.title} onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x450?text=No+Image';
          }} />
          <div className="video-card-overlay">
            <button className="play-button">
              <FaPlay />
            </button>
          </div>
          {video.isPPV && (
            <div className="ppv-badge">
              <FaLock /> PPV
            </div>
          )}
        </div>
      </Link>
      <div className="video-card-info">
        <h3>{video.title}</h3>
        <div className="video-card-meta">
          <span className="year">{video.releaseYear}</span>
          <span className="rating">{video.rating}</span>
          <span className="duration">{Math.floor(video.duration / 60)}min</span>
          {video.isPPV && video.ppvPrice > 0 && (
            <span className="ppv-price">${video.ppvPrice.toFixed(2)}</span>
          )}
        </div>
        <div className="video-card-genres">
          {video.genre?.slice(0, 2).map((genre, index) => (
            <span key={index} className="genre-tag">{genre}</span>
          ))}
        </div>
        {onAddToList && (
          <button className="add-to-list" onClick={() => onAddToList(video._id)}>
            <FaPlus /> My List
          </button>
        )}
      </div>
    </div>
  );
};

export default VideoCard;
