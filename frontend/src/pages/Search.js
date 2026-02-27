import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchService } from '../services/api';
import { toast } from 'react-toastify';
import VideoCard from '../components/VideoCard';
import '../pages/Browse.css';

const Search = () => {
  const [searchParams] = useSearchParams();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const query = searchParams.get('q');

  useEffect(() => {
    if (query) {
      performSearch();
    }
  }, [query]);

  const performSearch = async () => {
    try {
      setLoading(true);
      const response = await searchService.search(query);
      setVideos(response.data.videos || []);
    } catch (error) {
      toast.error('Search failed');
      console.error('Error searching:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToList = async (videoId) => {
    try {
      const { videoService } = require('../services/api');
      await videoService.addToMyList(videoId);
      toast.success('Added to your list!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add to list');
    }
  };

  return (
    <div className="browse-page">
      <div className="browse-header">
        <h1>Search Results for "{query}"</h1>
      </div>

      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
        </div>
      ) : (
        <div className="browse-content">
          {videos.length > 0 ? (
            <div className="video-grid">
              {videos.map((video) => (
                <VideoCard
                  key={video._id}
                  video={video}
                  onAddToList={handleAddToList}
                />
              ))}
            </div>
          ) : (
            <div className="no-results">
              <h2>No results found</h2>
              <p>Try searching for something else</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
