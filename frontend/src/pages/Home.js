import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlay, FaInfoCircle } from 'react-icons/fa';
import { videoService, watchHistoryService } from '../services/api';
import { toast } from 'react-toastify';
import VideoCard from '../components/VideoCard';
import './Home.css';

const Home = () => {
  const [featuredVideo, setFeaturedVideo] = useState(null);
  const [trendingVideos, setTrendingVideos] = useState([]);
  const [continueWatching, setContinueWatching] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      setLoading(true);
      const [featuredRes, trendingRes] = await Promise.all([
        videoService.getFeaturedVideos(),
        videoService.getTrendingVideos()
      ]);

      if (featuredRes.data.videos && featuredRes.data.videos.length > 0) {
        setFeaturedVideo(featuredRes.data.videos[0]);
      }
      setTrendingVideos(trendingRes.data.videos || []);

      // Try to get continue watching (if user is authenticated)
      try {
        const continueRes = await watchHistoryService.getContinueWatching();
        setContinueWatching(continueRes.data.history || []);
      } catch (error) {
        // User might not be authenticated
        console.log('Continue watching not available');
      }
    } catch (error) {
      toast.error('Failed to load content');
      console.error('Error fetching home data:', error);
    } finally {
      setLoading(false);
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

  return (
    <div className="home">
      {/* Hero Section */}
      {featuredVideo && (
        <div className="hero">
          <div
            className="hero-background"
            style={{
              backgroundImage: `url(http://localhost:5000/${featuredVideo.thumbnail})`
            }}
          >
            <div className="hero-overlay"></div>
          </div>
          <div className="hero-content">
            <h1 className="hero-title">{featuredVideo.title}</h1>
            <p className="hero-description">
              {featuredVideo.description?.substring(0, 200)}
              {featuredVideo.description?.length > 200 ? '...' : ''}
            </p>
            <div className="hero-info">
              <span>{featuredVideo.releaseYear}</span>
              <span>{featuredVideo.rating}</span>
              <span>{Math.floor(featuredVideo.duration / 60)} min</span>
            </div>
            <div className="hero-buttons">
              <Link to={`/watch/${featuredVideo._id}`} className="btn btn-white">
                <FaPlay /> Play
              </Link>
              <Link to={`/watch/${featuredVideo._id}`} className="btn btn-secondary">
                <FaInfoCircle /> More Info
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Continue Watching */}
      {continueWatching.length > 0 && (
        <div className="section">
          <h2 className="section-title">Continue Watching</h2>
          <div className="video-row">
            {continueWatching.map((item) => (
              <VideoCard
                key={item._id}
                video={item.video}
                onAddToList={handleAddToList}
              />
            ))}
          </div>
        </div>
      )}

      {/* Trending Now */}
      {trendingVideos.length > 0 && (
        <div className="section">
          <h2 className="section-title">Trending Now</h2>
          <div className="video-row">
            {trendingVideos.slice(0, 6).map((video) => (
              <VideoCard
                key={video._id}
                video={video}
                onAddToList={handleAddToList}
              />
            ))}
          </div>
        </div>
      )}

      {/* Call to Action */}
      <div className="cta-section">
        <h2>Unlimited movies, TV shows, and more.</h2>
        <p>Watch anywhere. Cancel anytime.</p>
        <Link to="/browse" className="btn btn-primary">Browse All Content</Link>
      </div>
    </div>
  );
};

export default Home;
