import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactPlayer from 'react-player';
import { FaArrowLeft, FaHeart, FaLock } from 'react-icons/fa';
import { videoService, watchHistoryService, ppvService, adService } from '../services/api';
import { toast } from 'react-toastify';
import VideoCard from '../components/VideoCard';
import './Watch.css';

const Watch = () => {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [hasPPVAccess, setHasPPVAccess] = useState(true);
  const [purchasingPPV, setPurchasingPPV] = useState(false);
  const [currentAd, setCurrentAd] = useState(null);
  const [adCountdown, setAdCountdown] = useState(0);
  const [adSkippable, setAdSkippable] = useState(false);
  const [showAd, setShowAd] = useState(false);
  const adTimerRef = useRef(null);

  useEffect(() => {
    if (id) {
      fetchVideoData();
    }
    return () => {
      if (adTimerRef.current) clearInterval(adTimerRef.current);
    };
  }, [id]);

  const fetchVideoData = async () => {
    try {
      setLoading(true);
      const [videoRes, relatedRes] = await Promise.all([
        videoService.getVideoById(id),
        videoService.getRelatedVideos(id)
      ]);

      const fetchedVideo = videoRes.data.video;
      setVideo(fetchedVideo);
      setRelatedVideos(relatedRes.data.videos || []);

      // Check PPV access if applicable
      if (fetchedVideo.isPPV) {
        try {
          const accessRes = await ppvService.checkAccess(id);
          setHasPPVAccess(accessRes.data.hasAccess);
        } catch {
          setHasPPVAccess(false);
        }
      }

      // Load pre-roll ad for ad-supported free content
      if (fetchedVideo.isAdSupported && !fetchedVideo.isPPV) {
        try {
          const adRes = await adService.getAdForVideo(id, 'pre-roll');
          if (adRes.data.ad) {
            setCurrentAd(adRes.data.ad);
            setShowAd(true);
            startAdCountdown(adRes.data.ad);
          }
        } catch {
          // Ads unavailable, proceed without
        }
      }
    } catch (error) {
      toast.error('Failed to load video');
      console.error('Error fetching video:', error);
    } finally {
      setLoading(false);
    }
  };

  const startAdCountdown = (ad) => {
    const skipAfter = ad.skipAfter || 5;
    setAdCountdown(skipAfter);
    setAdSkippable(false);
    adTimerRef.current = setInterval(() => {
      setAdCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(adTimerRef.current);
          setAdSkippable(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSkipAd = () => {
    if (adSkippable) {
      setShowAd(false);
      setCurrentAd(null);
    }
  };

  const handlePurchasePPV = async () => {
    setPurchasingPPV(true);
    try {
      await ppvService.purchase(id);
      toast.success('Purchase successful! Enjoy the event.');
      setHasPPVAccess(true);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Purchase failed');
    } finally {
      setPurchasingPPV(false);
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
        {video.isPPV && !hasPPVAccess ? (
          <div className="ppv-gate">
            <FaLock className="ppv-gate-icon" />
            <h2>Pay-Per-View Event</h2>
            <p>{video.title}</p>
            {video.ppvPrice > 0 ? (
              <p className="ppv-gate-price">Access for ${video.ppvPrice.toFixed(2)}</p>
            ) : (
              <p className="ppv-gate-price">Free with account</p>
            )}
            <button
              className="btn btn-primary ppv-purchase-btn"
              onClick={handlePurchasePPV}
              disabled={purchasingPPV}
            >
              {purchasingPPV
                ? 'Processing...'
                : video.ppvPrice > 0
                  ? `Purchase Access – $${video.ppvPrice.toFixed(2)}`
                  : 'Purchase Access'}
            </button>
          </div>
        ) : showAd && currentAd ? (
          <div className="ad-overlay">
            <ReactPlayer
              url={currentAd.videoUrl}
              width="100%"
              height="100%"
              playing
              onEnded={() => setShowAd(false)}
              config={{ file: { attributes: { controlsList: 'nodownload nofullscreen' } } }}
            />
            <div className="ad-controls">
              <span className="ad-label">Advertisement</span>
              {currentAd.clickThroughUrl && (
                <a
                  href={currentAd.clickThroughUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ad-learn-more"
                >
                  Learn More
                </a>
              )}
              <button
                className={`ad-skip-btn${adSkippable ? ' skippable' : ''}`}
                onClick={handleSkipAd}
                disabled={!adSkippable}
              >
                {adSkippable ? 'Skip Ad ›' : `Skip in ${adCountdown}s`}
              </button>
            </div>
          </div>
        ) : (
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
        )}
      </div>

      <div className="video-details">
        <div className="video-header">
          <div>
            <h1>
              {video.isPPV && <span className="ppv-tag"><FaLock /> PPV</span>}
              {video.title}
            </h1>
            <div className="video-meta">
              <span>{video.releaseYear}</span>
              <span>{video.rating}</span>
              <span>{Math.floor(video.duration / 60)} min</span>
              <span>{video.views} views</span>
              {video.isPPV && video.ppvPrice > 0 && (
                <span className="ppv-price-tag">${video.ppvPrice.toFixed(2)}</span>
              )}
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
