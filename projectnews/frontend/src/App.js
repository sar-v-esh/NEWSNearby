import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './App.css';
import Header from './components/Header';
import CategoryFilters from './components/CategoryFilters';
import NewsList from './components/NewsList';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api'; 

function App() {
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State to hold all parameters for the next API call
  const [currentFetchParams, setCurrentFetchParams] = useState(null);

  // States for controlled inputs
  const [keywordSearchInput, setKeywordSearchInput] = useState(''); 
  const [locationSearchInput, setLocationSearchInput] = useState(''); 

  const fetchNews = useCallback(async (params) => {
    if (!params || Object.keys(params).length === 0) {
      console.log("FetchNews called with no params, skipping.");
      setLoading(false); 
      return;
    }
    setLoading(true);
    setError(null);
    setNewsItems([]);

    const queryParams = new URLSearchParams();
    if (params.lat) queryParams.append('lat', params.lat);
    if (params.lon) queryParams.append('lon', params.lon);
    if (params.ip_fallback) queryParams.append('ip_fallback', 'true');
    if (params.category) queryParams.append('category', params.category);
    if (params.search_query) queryParams.append('search_query', params.search_query);
    if (params.searched_location) queryParams.append('searched_location', params.searched_location);

    console.log("Fetching news with params:", params);

    try {
      const response = await axios.get(`${API_BASE_URL}/news?${queryParams.toString()}`);
      setNewsItems(response.data);
    } catch (err) {
      console.error("Error fetching news:", err);
      setError(err.response?.data?.message || "Failed to fetch news. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Effect 1: Initial load - determine geo/IP location
  useEffect(() => {
    console.log("Attempting initial location fetch.");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log("Geolocation success:", position.coords);
        setCurrentFetchParams({
          lat: position.coords.latitude,
          lon: position.coords.longitude
        });
      },
      (geoError) => {
        console.warn("Geolocation denied or unavailable:", geoError.message, "Falling back to IP.");
        setCurrentFetchParams({ ip_fallback: true });
      },
      { timeout: 7000, maximumAge: 60000 } 
    );
  }, []); // Empty dependency array: run once on mount

  // Effect 2: Fetch news whenever currentFetchParams change
  useEffect(() => {
    if (currentFetchParams) {
      fetchNews(currentFetchParams);
    }
  }, [currentFetchParams, fetchNews]);


  const handleCategorySelect = (category) => {
    setCurrentFetchParams(prevParams => {
      const newParams = { ...prevParams };
      
      delete newParams.search_query;

      if (category && category.toLowerCase() !== 'all') {
        newParams.category = category;
      } else {
        delete newParams.category; 
      }
      return newParams;
    });
  };

  // Handler for keyword search (from Header)
  const handleKeywordSearch = (query) => {
    setKeywordSearchInput(query); 
    setCurrentFetchParams(prevParams => {
      const newParams = { ...prevParams };
      delete newParams.category; 
      
      newParams.search_query = query.trim();
      if (!newParams.search_query) delete newParams.search_query; 

      return newParams;
    });
  };

  // Handler for location search (user types a location)
  const handleLocationSearchSubmit = () => {
    if (locationSearchInput.trim()) {
      setCurrentFetchParams({
        searched_location: locationSearchInput.trim()
      });
    }

  };

  return (
    <div className="container">
      {}
      <Header onSearch={handleKeywordSearch} />

      <section className="latest-news-section">
        <h1>Latest News</h1>
        <p>Browse the latest headlines from around the world</p>
        {}
        <CategoryFilters 
            activeCategory={currentFetchParams?.category || 'All'} 
            onSelectCategory={handleCategorySelect} 
        />

        <div className="location-search-container">
          <input
            type="text"
            className="location-search-input"
            placeholder="Search news by location (e.g., London, Tokyo)"
            value={locationSearchInput}
            onChange={(e) => setLocationSearchInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleLocationSearchSubmit()}
          />
          <button className="location-search-button" onClick={handleLocationSearchSubmit}>
            Search Location
          </button>
        </div>
      </section>

      {loading && <p className="message-center loading-message">Loading news...</p>}
      {error && <p className="message-center error-message">{error}</p>}
      {!loading && !error && <NewsList newsItems={newsItems} />}
      
      <footer className="app-footer">
        © {new Date().getFullYear()} NEWSNearby - Location & Keyword-Based News Aggregator
      </footer>
    </div>
  );
}

export default App;