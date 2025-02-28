import axios from 'axios';
import { NewsItem, Location } from '../types';

const API_BASE_URL = 'http://localhost:3001/api';

// ✅ 1. Get user's current location using Geolocation API
export const getUserLocation = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
    } else {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      });
    }
  });
};

// ✅ 2. Get fallback IP-based location
export const getIPBasedLocation = async (): Promise<Location> => {
  try {
    const response = await axios.get('https://ipapi.co/json/');
    return {
      latitude: response.data.latitude,
      longitude: response.data.longitude,
      city: response.data.city,
      region: response.data.region,
      country: response.data.country_name,
    };
  } catch (error) {
    console.error('Error fetching IP-based location:', error);
    throw new Error('Failed to fetch IP-based location');
  }
};

// ✅ 3. Convert lat-long to city/state (Reverse Geocoding)
export const fetchLocationData = async (latitude: number, longitude: number): Promise<Location> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/location`, {
      params: { latitude, longitude },
    });

    return {
      latitude,
      longitude,
      city: response.data.city,
      region: response.data.region,
      country: response.data.country,
    };
  } catch (error) {
    console.error('Error fetching location data:', error);
    throw new Error('Failed to fetch location data');
  }
};

// ✅ 4. Fetch news by location
export const fetchNewsByLocation = async (location: Location): Promise<NewsItem[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/news`, {
      params: { query: location.city || location.region || location.country || 'global' },
    });
    return response.data.news;
  } catch (error) {
    console.error('Error fetching news by location:', error);
    return [];
  }
};

// ✅ 5. Fetch news by keyword
export const fetchNewsByKeyword = async (keyword: string): Promise<NewsItem[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/news`, {
      params: { query: keyword },
    });
    return response.data.news;
  } catch (error) {
    console.error('Error fetching news by keyword:', error);
    return [];
  }
};

// ✅ 6. Fetch news by category
export const fetchNewsByCategory = async (category: string): Promise<NewsItem[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/news`, {
      params: { category },
    });
    return response.data.news;
  } catch (error) {
    console.error('Error fetching news by category:', error);
    return [];
  }
};
