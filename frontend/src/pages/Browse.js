import React, { useState, useEffect } from 'react';
import { videoService, categoryService } from '../services/api';
import { toast } from 'react-toastify';
import VideoCard from '../components/VideoCard';
import './Browse.css';

const Browse = () => {
  const [videos, setVideos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [loading, setLoading] = useState(true);

  const genres = ['Action', 'Comedy', 'Drama', 'Horror', 'Romance', 'Sci-Fi', 'Thriller', 'Documentary'];

  useEffect(() => {
    fetchCategories();
    fetchVideos();
  }, []);

  useEffect(() => {
    fetchVideos();
  }, [selectedCategory, selectedGenre]);

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getAllCategories();
      setCategories(response.data.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchVideos = async () => {
    try {
      setLoading(true);
      let response;

      if (selectedCategory !== 'all') {
        response = await videoService.getVideosByCategory(selectedCategory);
      } else if (selectedGenre !== 'all') {
        response = await videoService.getVideosByGenre(selectedGenre);
      } else {
        response = await videoService.getAllVideos({ limit: 50 });
      }

      setVideos(response.data.videos || []);
    } catch (error) {
      toast.error('Failed to load videos');
      console.error('Error fetching videos:', error);
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

  return (
    <div className="browse-page">
      <div className="browse-header">
        <h1>Browse</h1>
        <div className="browse-filters">
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setSelectedGenre('all');
            }}
            className="filter-select"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>

          <select
            value={selectedGenre}
            onChange={(e) => {
              setSelectedGenre(e.target.value);
              setSelectedCategory('all');
            }}
            className="filter-select"
          >
            <option value="all">All Genres</option>
            {genres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </div>
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
              <h2>No videos found</h2>
              <p>Try adjusting your filters</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Browse;
